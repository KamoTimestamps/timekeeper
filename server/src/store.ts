import { DatabaseSync } from 'node:sqlite';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import type { ClientInfo } from './client-info.ts';
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

/** What the YouTube Data API says about a video. */
export interface VideoInfo {
  title: string;
  channelTitle: string;
  thumbnailUrl: string | null;
  publishedAt: string | null;
  /** Null when unknown, including live and upcoming videos, which have no length yet. */
  durationSeconds: number | null;
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
  expires_at INTEGER NOT NULL,
  family_id TEXT NOT NULL,
  family_started_at INTEGER NOT NULL,
  used_at INTEGER
);
CREATE INDEX IF NOT EXISTS refresh_tokens_user ON refresh_tokens(user_id);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  last_used_at INTEGER NOT NULL,
  user_agent TEXT,
  created_ip TEXT,
  created_country TEXT,
  last_ip TEXT,
  last_country TEXT,
  web_token_hash TEXT UNIQUE,
  expires_at INTEGER
);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
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
  updated_at INTEGER,
  PRIMARY KEY (user_id, guid)
) WITHOUT ROWID;
CREATE INDEX IF NOT EXISTS timestamps_user_seq ON timestamps(user_id, seq);
CREATE TABLE IF NOT EXISTS video_info (
  video_id TEXT PRIMARY KEY,
  title TEXT,
  channel_title TEXT,
  thumbnail_url TEXT,
  published_at TEXT,
  duration_seconds INTEGER,
  fetched_at INTEGER NOT NULL
) WITHOUT ROWID;
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
    this.migrate();
    this.db.exec(SCHEMA);
    this.db.exec('CREATE INDEX IF NOT EXISTS refresh_tokens_family ON refresh_tokens(family_id)');
    this.addMissingColumns();
    this.backfillSessions();
  }

  private addMissingColumns(): void {
    const columns = this.db.prepare("SELECT name FROM pragma_table_info('timestamps')").all() as { name: string }[];
    if (!columns.some((c) => c.name === 'updated_at')) {
      this.db.exec('ALTER TABLE timestamps ADD COLUMN updated_at INTEGER');
    }

    const videoColumns = this.db.prepare("SELECT name FROM pragma_table_info('video_info')").all() as { name: string }[];
    if (!videoColumns.some((c) => c.name === 'duration_seconds')) {
      this.db.exec('ALTER TABLE video_info ADD COLUMN duration_seconds INTEGER');
      // Rows cached before the column existed have no length; fetched_at = 0 makes them all stale,
      // so they are looked up again (at startup, and whenever a page shows them).
      this.db.exec('UPDATE video_info SET fetched_at = 0');
    }

    const sessionColumns = this.db.prepare("SELECT name FROM pragma_table_info('sessions')").all() as { name: string }[];
    for (const column of ['created_ip', 'created_country', 'last_ip', 'last_country']) {
      if (!sessionColumns.some((c) => c.name === column)) {
        this.db.exec(`ALTER TABLE sessions ADD COLUMN ${column} TEXT`);
      }
    }
  }

  /** Sessions that predate the sessions table: one row per existing refresh-token family. */
  private backfillSessions(): void {
    this.db.exec(`
      INSERT OR IGNORE INTO sessions (id, user_id, kind, created_at, last_used_at)
      SELECT family_id, user_id, 'userscript', MIN(family_started_at), COALESCE(MAX(used_at), MIN(family_started_at))
      FROM refresh_tokens GROUP BY family_id
    `);
  }

  /** Brings a database created before refresh-token rotation up to date. */
  private migrate(): void {
    const columns = this.db.prepare("SELECT name FROM pragma_table_info('refresh_tokens')").all() as { name: string }[];
    if (columns.length === 0 || columns.some((c) => c.name === 'family_id')) return;
    this.db.exec(`
      ALTER TABLE refresh_tokens ADD COLUMN family_id TEXT NOT NULL DEFAULT '';
      ALTER TABLE refresh_tokens ADD COLUMN family_started_at INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE refresh_tokens ADD COLUMN used_at INTEGER;
      UPDATE refresh_tokens SET family_id = token_hash, family_started_at = ${Date.now()};
    `);
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
   * Refresh tokens are opaque and stored hashed. Each belongs to a family (one sign-in) and is
   * single-use: refreshing rotates it for a new one in the same family (see rotateRefreshToken).
   */
  createRefreshToken(
    userId: string,
    ttlSeconds: number,
    opts: { userAgent?: string | null; client?: ClientInfo; now?: number } = {},
  ): { token: string; sessionId: string } {
    const now = opts.now ?? Date.now();
    this.db.prepare('DELETE FROM refresh_tokens WHERE expires_at < ?').run(now);
    // Sessions whose tokens have all expired are gone too.
    this.db
      .prepare(
        `DELETE FROM sessions WHERE kind = 'userscript'
         AND NOT EXISTS (SELECT 1 FROM refresh_tokens WHERE family_id = sessions.id)`,
      )
      .run();

    const sessionId = randomUUID();
    this.db
      .prepare(
        `INSERT INTO sessions (id, user_id, kind, created_at, last_used_at, user_agent,
                               created_ip, created_country, last_ip, last_country)
         VALUES (?, ?, 'userscript', ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        sessionId,
        userId,
        now,
        now,
        opts.userAgent ?? null,
        opts.client?.ip ?? null,
        opts.client?.country ?? null,
        opts.client?.ip ?? null,
        opts.client?.country ?? null,
      );
    return { token: this.insertRefreshToken(userId, sessionId, now, now + ttlSeconds * 1000), sessionId };
  }

  private insertRefreshToken(userId: string, familyId: string, familyStartedAt: number, expiresAt: number): string {
    const token = randomBytes(32).toString('base64url');
    this.db
      .prepare(
        `INSERT INTO refresh_tokens (token_hash, user_id, expires_at, family_id, family_started_at)
         VALUES (?, ?, ?, ?, ?)`,
      )
      .run(sha256(token), userId, expiresAt, familyId, familyStartedAt);
    return token;
  }

  /**
   * Exchanges a refresh token for a new one in the same family.
   * - A token that is unknown, expired, or past its family's lifetime cap is rejected.
   * - Presenting an already-used token after the grace window means two parties hold the same
   *   token, so the whole family is revoked ('reuse'). Within the grace window it is assumed to be
   *   a retry after a lost response and just gets another fresh token.
   */
  rotateRefreshToken(
    token: string,
    opts: { ttlSeconds: number; familyMaxSeconds: number; graceSeconds: number; client?: ClientInfo },
    now = Date.now(),
  ):
    | { status: 'ok'; user: User; refreshToken: string; sessionId: string }
    | { status: 'invalid' }
    | { status: 'reuse'; userId: string; sessionId: string } {
    this.db.exec('BEGIN IMMEDIATE');
    try {
      const row = this.db
        .prepare(
          `SELECT t.user_id, t.expires_at, t.family_id, t.family_started_at, t.used_at, u.email, u.name
           FROM refresh_tokens t JOIN users u ON u.id = t.user_id
           WHERE t.token_hash = ?`,
        )
        .get(sha256(token)) as
        | {
            user_id: string;
            expires_at: number;
            family_id: string;
            family_started_at: number;
            used_at: number | null;
            email: string;
            name: string | null;
          }
        | undefined;

      const familyEnd = row ? row.family_started_at + opts.familyMaxSeconds * 1000 : 0;
      if (!row || row.expires_at <= now || familyEnd <= now) {
        this.db.exec('COMMIT');
        return { status: 'invalid' };
      }

      if (row.used_at !== null && now - row.used_at > opts.graceSeconds * 1000) {
        this.db.prepare('DELETE FROM refresh_tokens WHERE family_id = ?').run(row.family_id);
        this.db.prepare('DELETE FROM sessions WHERE id = ?').run(row.family_id);
        this.db.exec('COMMIT');
        return { status: 'reuse', userId: row.user_id, sessionId: row.family_id };
      }

      if (row.used_at === null) {
        this.db.prepare('UPDATE refresh_tokens SET used_at = ? WHERE token_hash = ?').run(now, sha256(token));
      }
      const refreshToken = this.insertRefreshToken(
        row.user_id,
        row.family_id,
        row.family_started_at,
        Math.min(now + opts.ttlSeconds * 1000, familyEnd),
      );
      this.touchSession(row.family_id, now, opts.client);
      this.db.exec('COMMIT');
      return {
        status: 'ok',
        user: { id: row.user_id, email: row.email, name: row.name },
        refreshToken,
        sessionId: row.family_id,
      };
    } catch (err) {
      this.db.exec('ROLLBACK');
      throw err;
    }
  }

  /** Ends the session (token family) the token belongs to. Returns it, or null if the token was unknown. */
  revokeRefreshToken(token: string): { userId: string; sessionId: string } | null {
    const row = this.db
      .prepare('SELECT user_id, family_id FROM refresh_tokens WHERE token_hash = ?')
      .get(sha256(token)) as { user_id: string; family_id: string } | undefined;
    if (!row) return null;
    this.db.prepare('DELETE FROM refresh_tokens WHERE family_id = ?').run(row.family_id);
    this.db.prepare('DELETE FROM sessions WHERE id = ?').run(row.family_id);
    return { userId: row.user_id, sessionId: row.family_id };
  }

  // --- sessions (shown on the landing page; the landing page itself signs in with a cookie session) ---

  /** True while the session has not been revoked or expired. Access tokens are only good for live sessions. */
  sessionExists(userId: string, sessionId: string): boolean {
    return this.db.prepare('SELECT 1 FROM sessions WHERE id = ? AND user_id = ?').get(sessionId, userId) !== undefined;
  }

  /** Bumps last activity, and where it came from when the origin is known. */
  private touchSession(sessionId: string, now: number, client?: ClientInfo): void {
    this.db
      .prepare(
        `UPDATE sessions SET last_used_at = ?, last_ip = COALESCE(?, last_ip), last_country = COALESCE(?, last_country)
         WHERE id = ?`,
      )
      .run(now, client?.ip ?? null, client?.country ?? null, sessionId);
  }

  createWebSession(
    userId: string,
    ttlSeconds: number,
    opts: { userAgent?: string | null; client?: ClientInfo; now?: number } = {},
  ): string {
    const now = opts.now ?? Date.now();
    this.db.prepare("DELETE FROM sessions WHERE kind = 'web' AND expires_at < ?").run(now);
    const token = randomBytes(32).toString('base64url');
    this.db
      .prepare(
        `INSERT INTO sessions (id, user_id, kind, created_at, last_used_at, user_agent,
                               created_ip, created_country, last_ip, last_country, web_token_hash, expires_at)
         VALUES (?, ?, 'web', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        randomUUID(),
        userId,
        now,
        now,
        opts.userAgent ?? null,
        opts.client?.ip ?? null,
        opts.client?.country ?? null,
        opts.client?.ip ?? null,
        opts.client?.country ?? null,
        sha256(token),
        now + ttlSeconds * 1000,
      );
    return token;
  }

  findWebSession(
    token: string,
    opts: { client?: ClientInfo; now?: number } = {},
  ): { sessionId: string; userId: string } | null {
    const now = opts.now ?? Date.now();
    const row = this.db
      .prepare('SELECT id, user_id FROM sessions WHERE web_token_hash = ? AND expires_at > ?')
      .get(sha256(token), now) as { id: string; user_id: string } | undefined;
    if (!row) return null;
    this.touchSession(row.id, now, opts.client);
    return { sessionId: row.id, userId: row.user_id };
  }

  listSessions(userId: string): Array<{
    id: string;
    kind: string;
    createdAt: number;
    lastUsedAt: number;
    userAgent: string | null;
    ip: string | null;
    country: string | null;
    createdIp: string | null;
    createdCountry: string | null;
  }> {
    const rows = this.db
      .prepare(
        `SELECT id, kind, created_at, last_used_at, user_agent, last_ip, last_country, created_ip, created_country
         FROM sessions WHERE user_id = ? ORDER BY last_used_at DESC`,
      )
      .all(userId) as Array<{
      id: string;
      kind: string;
      created_at: number;
      last_used_at: number;
      user_agent: string | null;
      last_ip: string | null;
      last_country: string | null;
      created_ip: string | null;
      created_country: string | null;
    }>;
    return rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      createdAt: r.created_at,
      lastUsedAt: r.last_used_at,
      userAgent: r.user_agent,
      ip: r.last_ip,
      country: r.last_country,
      createdIp: r.created_ip,
      createdCountry: r.created_country,
    }));
  }

  /** Ends one session (any kind). */
  revokeSession(userId: string, sessionId: string): void {
    this.db.prepare('DELETE FROM refresh_tokens WHERE family_id = ? AND user_id = ?').run(sessionId, userId);
    this.db.prepare('DELETE FROM sessions WHERE id = ? AND user_id = ?').run(sessionId, userId);
  }

  /** Ends every session of the user, userscripts and browsers alike. Returns how many there were. */
  revokeAllSessions(userId: string): number {
    this.db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(userId);
    return Number(this.db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId).changes);
  }

  getAccount(userId: string): { email: string; name: string | null; createdAt: number } | null {
    const row = this.db.prepare('SELECT email, name, created_at FROM users WHERE id = ?').get(userId) as
      | { email: string; name: string | null; created_at: number }
      | undefined;
    return row ? { email: row.email, name: row.name, createdAt: row.created_at } : null;
  }

  getStats(userId: string): {
    active: number;
    deleted: number;
    videos: number;
    devices: number;
    lastSyncAt: number | null;
    topVideos: Array<{ videoId: string; count: number }>;
  } {
    const totals = this.db
      .prepare(
        `SELECT
           COUNT(*) FILTER (WHERE deleted_at IS NULL) AS active,
           COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) AS deleted,
           COUNT(DISTINCT CASE WHEN deleted_at IS NULL THEN video_id END) AS videos,
           COUNT(DISTINCT device_id) AS devices,
           MAX(updated_at) AS last_sync_at
         FROM timestamps WHERE user_id = ?`,
      )
      .get(userId) as { active: number; deleted: number; videos: number; devices: number; last_sync_at: number | null };
    const top = this.db
      .prepare(
        `SELECT video_id, COUNT(*) AS n FROM timestamps
         WHERE user_id = ? AND deleted_at IS NULL
         GROUP BY video_id ORDER BY n DESC, video_id LIMIT 5`,
      )
      .all(userId) as Array<{ video_id: string; n: number }>;
    return {
      active: totals.active,
      deleted: totals.deleted,
      videos: totals.videos,
      devices: totals.devices,
      lastSyncAt: totals.last_sync_at,
      topVideos: top.map((t) => ({ videoId: t.video_id, count: t.n })),
    };
  }

  // --- video info cache ---

  /** Cached YouTube lookups; `info` is null for a video YouTube didn't return (private, deleted). */
  getCachedVideoInfo(videoIds: string[]): Array<{ videoId: string; fetchedAt: number; info: VideoInfo | null }> {
    if (videoIds.length === 0) return [];
    const rows = this.db
      .prepare(
        `SELECT video_id, title, channel_title, thumbnail_url, published_at, duration_seconds, fetched_at
         FROM video_info WHERE video_id IN (${videoIds.map(() => '?').join(',')})`,
      )
      .all(...videoIds) as Array<{
      video_id: string;
      title: string | null;
      channel_title: string | null;
      thumbnail_url: string | null;
      published_at: string | null;
      duration_seconds: number | null;
      fetched_at: number;
    }>;
    return rows.map((row) => ({
      videoId: row.video_id,
      fetchedAt: row.fetched_at,
      info:
        row.title === null
          ? null
          : {
              title: row.title,
              channelTitle: row.channel_title ?? '',
              thumbnailUrl: row.thumbnail_url,
              publishedAt: row.published_at,
              durationSeconds: row.duration_seconds,
            },
    }));
  }

  /** Video IDs with live timestamps (any user) whose cached details were fetched before `olderThan`. */
  staleVideoIds(olderThan: number): string[] {
    const rows = this.db
      .prepare(
        `SELECT DISTINCT t.video_id FROM timestamps t
         JOIN video_info v ON v.video_id = t.video_id
         WHERE t.deleted_at IS NULL AND v.fetched_at < ?`,
      )
      .all(olderThan) as Array<{ video_id: string }>;
    return rows.map((r) => r.video_id);
  }

  /** Video IDs with live timestamps (any user) that have never been looked up. */
  uncachedVideoIds(): string[] {
    const rows = this.db
      .prepare(
        `SELECT DISTINCT t.video_id FROM timestamps t
         LEFT JOIN video_info v ON v.video_id = t.video_id
         WHERE t.deleted_at IS NULL AND v.video_id IS NULL`,
      )
      .all() as Array<{ video_id: string }>;
    return rows.map((r) => r.video_id);
  }

  saveVideoInfo(entries: Array<{ videoId: string; info: VideoInfo | null }>, now: number): void {
    const upsert = this.db.prepare(
      `INSERT INTO video_info (video_id, title, channel_title, thumbnail_url, published_at, duration_seconds, fetched_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(video_id) DO UPDATE SET title = excluded.title, channel_title = excluded.channel_title,
         thumbnail_url = excluded.thumbnail_url, published_at = excluded.published_at,
         duration_seconds = excluded.duration_seconds, fetched_at = excluded.fetched_at`,
    );
    this.db.exec('BEGIN IMMEDIATE');
    try {
      for (const { videoId, info } of entries) {
        upsert.run(
          videoId,
          info?.title ?? null,
          info?.channelTitle ?? null,
          info?.thumbnailUrl ?? null,
          info?.publishedAt ?? null,
          info?.durationSeconds ?? null,
          now,
        );
      }
      this.db.exec('COMMIT');
    } catch (err) {
      this.db.exec('ROLLBACK');
      throw err;
    }
  }

  // --- timestamps ---

  /**
   * A user's live timestamps for the landing page. Every word of `query` must match the comment, the
   * video ID, or the title/channel of the video when its YouTube details are cached. Rows come back
   * grouped by video, newest air date first (videos without cached details last), each video's hits
   * in playback order; a page can end mid-video, and the next page then continues it.
   */
  searchTimestamps(
    userId: string,
    { query, videoId, channel, offset, limit }: { query: string; videoId?: string; channel?: string; offset: number; limit: number },
  ): { total: number; items: Array<{ guid: string; videoId: string; start: number; comment: string; updatedAt: number | null }> } {
    const where = ['t.user_id = ?', 't.deleted_at IS NULL'];
    const params: Array<string | number> = [userId];
    if (videoId) {
      where.push('t.video_id = ?');
      params.push(videoId);
    }
    if (channel) {
      where.push('v.channel_title = ?');
      params.push(channel);
    }
    for (const word of query.split(/\s+/).filter(Boolean).slice(0, 8)) {
      const like = `%${word.replace(/[\\%_]/g, '\\$&')}%`;
      where.push(
        `(t.comment LIKE ? ESCAPE '\\' OR t.video_id = ? OR v.title LIKE ? ESCAPE '\\' OR v.channel_title LIKE ? ESCAPE '\\')`,
      );
      params.push(like, word, like, like);
    }
    const from = `FROM timestamps t LEFT JOIN video_info v ON v.video_id = t.video_id WHERE ${where.join(' AND ')}`;

    const { total } = this.db.prepare(`SELECT COUNT(*) AS total ${from}`).get(...params) as { total: number };
    // published_at is ISO 8601, so it sorts as text; NULLs (no cached YouTube details) sort last in DESC.
    const order = 'v.published_at DESC, t.video_id, t.start, t.guid';
    const rows = this.db
      .prepare(`SELECT t.guid, t.video_id, t.start, t.comment, t.updated_at ${from} ORDER BY ${order} LIMIT ? OFFSET ?`)
      .all(...params, limit, offset) as Array<{ guid: string; video_id: string; start: number; comment: string; updated_at: number | null }>;
    return {
      total,
      items: rows.map((r) => ({ guid: r.guid, videoId: r.video_id, start: r.start, comment: r.comment, updatedAt: r.updated_at })),
    };
  }

  /**
   * Last-writer-wins by Lamport write_counter, the same rule the userscript uses when merging
   * backups. Equal counters with different content are decided by `winsOver`, so every device
   * and the server converge on the same version. Each accepted record gets the next per-user seq; the whole push is one transaction,
   * so the accepted seqs are contiguous.
   */
  applyPush(userId: string, deviceId: string, records: TimestampRecord[]): PushResult {
    const getExisting = this.db.prepare(
      `SELECT guid, video_id, start, comment, write_counter, deleted_at, seq
       FROM timestamps WHERE user_id = ? AND guid = ?`,
    );
    const nextSeq = this.db.prepare('UPDATE users SET seq = seq + 1 WHERE id = ? RETURNING seq');
    const upsert = this.db.prepare(
      `INSERT INTO timestamps (user_id, guid, video_id, start, comment, write_counter, deleted_at, device_id, seq, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (user_id, guid) DO UPDATE SET
         video_id = excluded.video_id, start = excluded.start, comment = excluded.comment,
         write_counter = excluded.write_counter, deleted_at = excluded.deleted_at,
         device_id = excluded.device_id, seq = excluded.seq, updated_at = excluded.updated_at`,
    );

    this.db.exec('BEGIN IMMEDIATE');
    try {
      const accepted: TimestampRecord[] = [];
      const rejected: TimestampRecord[] = [];
      let fromSeq: number | null = null;
      let seq = 0;

      for (const record of records) {
        const existing = getExisting.get(userId, record.guid) as TimestampRow | undefined;
        if (existing) {
          const server = toRecord(existing);
          if (!winsOver(record, server)) {
            if (!sameContent(server, record)) rejected.push(server);
            continue;
          }
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
          Date.now(),
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

/**
 * Whether `candidate` replaces `current`: a higher write_counter wins; on equal counters the
 * greater content key does. The userscript applies the identical rule (timestampService.ts),
 * so devices that edited the same row at the same counter agree on one winner.
 */
function winsOver(candidate: TimestampRecord, current: TimestampRecord): boolean {
  if (candidate.write_counter !== current.write_counter) return candidate.write_counter > current.write_counter;
  return contentKey(candidate) > contentKey(current);
}

const contentKey = (r: TimestampRecord) => JSON.stringify([r.video_id, r.start, r.comment, r.deleted_at ?? null]);

function sameContent(a: TimestampRecord, b: TimestampRecord): boolean {
  return (
    a.video_id === b.video_id &&
    a.start === b.start &&
    a.comment === b.comment &&
    (a.deleted_at ?? null) === (b.deleted_at ?? null)
  );
}
