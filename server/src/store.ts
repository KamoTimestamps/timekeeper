import { DatabaseSync } from 'node:sqlite';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export interface User {
  id: string;
  email: string;
  name: string | null;
}

/** Wire format shared with the userscript's export format (device_id is never synced). */
export interface TimestampRecord {
  guid: string;
  video_id: string;
  start: number;
  comment: string;
  write_counter: number;
  deleted_at?: number;
}

export type StoredRecord = TimestampRecord & { seq: number };

export interface PushResult {
  /** Records the server took, in seq order. */
  accepted: TimestampRecord[];
  /** Server versions that beat (or tied with) the pushed record; the client should adopt them. */
  rejected: TimestampRecord[];
  /** The accepted records occupy seqs fromSeq+1..seq. Equal when nothing was accepted. */
  fromSeq: number;
  seq: number;
}

export interface PullResult {
  records: StoredRecord[];
  /** Cursor for the next pull: the last returned seq, or the user's current seq if nothing is newer. */
  seq: number;
  hasMore: boolean;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  google_sub TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  name TEXT,
  created_at INTEGER NOT NULL,
  seq INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS refresh_tokens (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS refresh_tokens_user ON refresh_tokens(user_id);
CREATE TABLE IF NOT EXISTS timestamps (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  guid TEXT NOT NULL,
  video_id TEXT NOT NULL,
  start REAL NOT NULL,
  comment TEXT NOT NULL,
  write_counter INTEGER NOT NULL,
  deleted_at INTEGER,
  device_id TEXT,
  seq INTEGER NOT NULL,
  PRIMARY KEY (user_id, guid)
) WITHOUT ROWID;
CREATE INDEX IF NOT EXISTS timestamps_user_seq ON timestamps(user_id, seq);
`;

interface TimestampRow {
  guid: string;
  video_id: string;
  start: number;
  comment: string;
  write_counter: number;
  deleted_at: number | null;
  seq: number;
}

const toRecord = (row: TimestampRow): TimestampRecord => ({
  guid: row.guid,
  video_id: row.video_id,
  start: row.start,
  comment: row.comment,
  write_counter: row.write_counter,
  ...(row.deleted_at !== null ? { deleted_at: row.deleted_at } : {}),
});

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

export class Store {
  readonly db: DatabaseSync;

  constructor(path: string) {
    if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
    this.db.exec(SCHEMA);
  }

  close(): void {
    this.db.close();
  }

  // --- users & sessions ---

  /** Creates the account on first sight of this Google subject; refreshes email/name otherwise. */
  upsertGoogleUser(identity: { sub: string; email: string; name?: string }): { user: User; isNewUser: boolean } {
    const existing = this.db
      .prepare('SELECT id FROM users WHERE google_sub = ?')
      .get(identity.sub) as { id: string } | undefined;

    if (existing) {
      this.db
        .prepare('UPDATE users SET email = ?, name = ? WHERE id = ?')
        .run(identity.email, identity.name ?? null, existing.id);
      return {
        user: { id: existing.id, email: identity.email, name: identity.name ?? null },
        isNewUser: false,
      };
    }

    const id = randomUUID();
    this.db
      .prepare('INSERT INTO users (id, google_sub, email, name, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(id, identity.sub, identity.email, identity.name ?? null, Date.now());
    return { user: { id, email: identity.email, name: identity.name ?? null }, isNewUser: true };
  }

  getUser(id: string): User | null {
    const row = this.db.prepare('SELECT id, email, name FROM users WHERE id = ?').get(id) as
      | { id: string; email: string; name: string | null }
      | undefined;
    return row ?? null;
  }

  /**
   * Refresh tokens are opaque, stored hashed, and deliberately not rotated: the userscript runs
   * in several YouTube tabs at once that share one stored token, and rotation would sign out
   * whichever tab refreshed second.
   */
  createRefreshToken(userId: string, ttlSeconds: number): string {
    const now = Date.now();
    this.db.prepare('DELETE FROM refresh_tokens WHERE expires_at < ?').run(now);
    const token = randomBytes(32).toString('base64url');
    this.db
      .prepare('INSERT INTO refresh_tokens (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
      .run(sha256(token), userId, now + ttlSeconds * 1000);
    return token;
  }

  findRefreshTokenUser(token: string): User | null {
    const row = this.db
      .prepare(
        `SELECT u.id, u.email, u.name FROM refresh_tokens t
         JOIN users u ON u.id = t.user_id
         WHERE t.token_hash = ? AND t.expires_at > ?`,
      )
      .get(sha256(token), Date.now()) as { id: string; email: string; name: string | null } | undefined;
    return row ?? null;
  }

  revokeRefreshToken(token: string): void {
    this.db.prepare('DELETE FROM refresh_tokens WHERE token_hash = ?').run(sha256(token));
  }

  // --- timestamps ---

  /**
   * Last-writer-wins by Lamport write_counter, the same rule the userscript uses when merging
   * backups. Each accepted record gets the next per-user seq; the whole push is one transaction,
   * so the accepted seqs are contiguous.
   */
  applyPush(userId: string, deviceId: string, records: TimestampRecord[]): PushResult {
    const getExisting = this.db.prepare(
      `SELECT guid, video_id, start, comment, write_counter, deleted_at, seq
       FROM timestamps WHERE user_id = ? AND guid = ?`,
    );
    const nextSeq = this.db.prepare('UPDATE users SET seq = seq + 1 WHERE id = ? RETURNING seq');
    const upsert = this.db.prepare(
      `INSERT INTO timestamps (user_id, guid, video_id, start, comment, write_counter, deleted_at, device_id, seq)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (user_id, guid) DO UPDATE SET
         video_id = excluded.video_id, start = excluded.start, comment = excluded.comment,
         write_counter = excluded.write_counter, deleted_at = excluded.deleted_at,
         device_id = excluded.device_id, seq = excluded.seq`,
    );

    this.db.exec('BEGIN IMMEDIATE');
    try {
      const accepted: TimestampRecord[] = [];
      const rejected: TimestampRecord[] = [];
      let fromSeq: number | null = null;
      let seq = 0;

      for (const record of records) {
        const existing = getExisting.get(userId, record.guid) as TimestampRow | undefined;
        if (existing && record.write_counter <= existing.write_counter) {
          const server = toRecord(existing);
          if (!sameContent(server, record)) rejected.push(server);
          continue;
        }

        seq = (nextSeq.get(userId) as { seq: number }).seq;
        fromSeq ??= seq - 1;
        upsert.run(
          userId,
          record.guid,
          record.video_id,
          record.start,
          record.comment,
          record.write_counter,
          record.deleted_at ?? null,
          deviceId,
          seq,
        );
        accepted.push(record);
      }

      if (fromSeq === null) {
        seq = this.currentSeq(userId);
        fromSeq = seq;
      }
      this.db.exec('COMMIT');
      return { accepted, rejected, fromSeq, seq };
    } catch (err) {
      this.db.exec('ROLLBACK');
      throw err;
    }
  }

  pullSince(userId: string, since: number, limit: number): PullResult {
    const current = this.currentSeq(userId);
    // A cursor ahead of the server means the server lost state; start over (merges are idempotent).
    const from = since > current ? 0 : since;

    const rows = this.db
      .prepare(
        `SELECT guid, video_id, start, comment, write_counter, deleted_at, seq
         FROM timestamps WHERE user_id = ? AND seq > ? ORDER BY seq LIMIT ?`,
      )
      .all(userId, from, limit + 1) as unknown as TimestampRow[];

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    return {
      records: page.map((row) => ({ ...toRecord(row), seq: row.seq })),
      seq: hasMore ? page[page.length - 1].seq : current,
      hasMore,
    };
  }

  currentSeq(userId: string): number {
    const row = this.db.prepare('SELECT seq FROM users WHERE id = ?').get(userId) as { seq: number } | undefined;
    return row?.seq ?? 0;
  }
}

function sameContent(a: TimestampRecord, b: TimestampRecord): boolean {
  return (
    a.video_id === b.video_id &&
    a.start === b.start &&
    a.comment === b.comment &&
    (a.deleted_at ?? null) === (b.deleted_at ?? null)
  );
}
