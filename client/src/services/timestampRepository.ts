/**
 * Timestamp Repository
 * Data access layer using the Repository pattern.
 * Abstracts all IndexedDB operations.
 */

import {
  TimestampRecord,
  TimestampRow,
  TimestampRecordArraySchema,
  TimestampRecordSchema,
  VideoEntrySchema,
} from '../schema';
import { log, getTimestampSuffix } from '../util';

// === Database Constants ===
export const DB_NAME = 'ytls-timestamps-db';
export const DB_VERSION = 5;
export const STORE_NAME = 'timestamps';
export const STORE_NAME_V2 = 'timestamps_v2';
export const SETTINGS_STORE_NAME = 'settings';

// === Database Connection Management ===
let dbConnection: IDBDatabase | null = null;
let dbConnectionPromise: Promise<IDBDatabase> | null = null;



/**
 * Get or create a persistent database connection
 */
function getDB(): Promise<IDBDatabase> {
  // If we have a valid connection, return it
  if (dbConnection) {
    try {
      // Accessing objectStoreNames throws if the connection has been closed
      dbConnection.objectStoreNames;
      return Promise.resolve(dbConnection);
    } catch (err) {
      // Connection is closed/invalid, clear it
      log('IndexedDB connection is no longer usable:', err, 'warn');
      dbConnection = null;
    }
  }

  // If a connection is already being established, return that promise
  if (dbConnectionPromise) {
    return dbConnectionPromise;
  }

  // Create a new connection
  dbConnectionPromise = openIndexedDB().then(db => {
    dbConnection = db;
    dbConnectionPromise = null;

    // Handle unexpected closes
    db.onclose = () => {
      log('IndexedDB connection closed unexpectedly', 'warn');
      dbConnection = null;
    };

    // Another tab (running a newer script) wants to upgrade the database. Release our
    // connection so the upgrade isn't blocked; the next operation reopens it, and fails
    // loudly (VersionError) if this tab's script is older than the stored schema.
    db.onversionchange = () => {
      log('IndexedDB upgrade requested by another tab; closing this connection', null, 'warn');
      db.close();
      if (dbConnection === db) dbConnection = null;
    };

    db.onerror = (event) => {
      log('IndexedDB connection error:', event, 'error');
    };

    return db;
  }).catch(err => {
    dbConnectionPromise = null;
    throw err;
  });

  return dbConnectionPromise;
}

/**
 * Backfill write_counter and device_id on every record in STORE_NAME_V2,
 * and write the resulting counter + a fresh device_id to SETTINGS_STORE_NAME.
 *
 * Both stores must belong to the same upgrade transaction so all mutations
 * land atomically before request.onsuccess resolves.
 *
 * Called from two places inside onupgradeneeded:
 *  • oldVersion === 3  → outer v4 block (cursor sees all existing records)
 *  • oldVersion < 3   → inside v3 getAllRequest.onsuccess, AFTER v3 puts are
 *                       queued, so the cursor sees them too
 */
function runV4LamportMigration(v2Store: IDBObjectStore, settingsStore: IDBObjectStore): void {
  const deviceId = crypto.randomUUID();
  let counter = 0;

  const cursorReq = v2Store.openCursor();
  cursorReq.onsuccess = (evt: Event) => {
    const cursor = (evt.target as IDBRequest<IDBCursorWithValue | null>).result;
    if (cursor) {
      counter++;
      cursor.update({ ...cursor.value, write_counter: counter, device_id: deviceId });
      cursor.continue();
    } else {
      settingsStore.put({ key: 'write_counter', value: counter });
      settingsStore.put({ key: 'device_id', value: deviceId });
      log(`Lamport migration: backfilled ${counter} records, device_id=${deviceId}`);
    }
  };
  cursorReq.onerror = () => {
    log('Lamport migration: cursor error during backfill', cursorReq.error, 'error');
  };
}

/**
 * Open IndexedDB and handle migrations
 */
function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;
      const oldVersion = event.oldVersion;
      const transaction = (event.target as IDBOpenDBRequest).transaction!;

      // Version 1: Create initial timestamps store
      if (oldVersion < 1) {
        db.createObjectStore(STORE_NAME, { keyPath: 'video_id' });
      }

      // Version 2: Create settings store
      if (oldVersion < 2 && !db.objectStoreNames.contains(SETTINGS_STORE_NAME)) {
        db.createObjectStore(SETTINGS_STORE_NAME, { keyPath: 'key' });
      }

      // Version 3: Migrate from timestamps to timestamps_v2 and delete old store
      if (oldVersion < 3) {
        // Export backup before migration
        if (db.objectStoreNames.contains(STORE_NAME)) {
          log('Exporting backup before v2 migration...');
          const v1Store = transaction.objectStore(STORE_NAME);
          const exportRequest = v1Store.getAll();

          exportRequest.onsuccess = () => {
            const parsedRecords = VideoEntrySchema.array().safeParse(exportRequest.result);

            if (parsedRecords.success && parsedRecords.data.length > 0) {
              try {
                const exportData = {} as Record<string, unknown>;
                let totalTimestamps = 0;

                parsedRecords.data.forEach(record => {
                  if (record.timestamps.length > 0) {
                    const timestampsWithGuids = TimestampRecordArraySchema.parse(record.timestamps);

                    exportData[`ytls-${record.video_id}`] = {
                      video_id: record.video_id,
                      timestamps: [...timestampsWithGuids].sort((a, b) => a.start - b.start)
                    };
                    totalTimestamps += timestampsWithGuids.length;
                  }
                });

                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `timekeeper-data-${getTimestampSuffix()}.json`;
                a.click();
                URL.revokeObjectURL(url);

                log(`Pre-migration backup exported: ${parsedRecords.data.length} videos, ${totalTimestamps} timestamps`);
              } catch (err) {
                log('Failed to export pre-migration backup:', err, 'error');
              }
            } else if (!parsedRecords.success) {
              log('Skipping pre-migration backup: legacy data failed validation', parsedRecords.error.message, 'warn');
            }
          };
        }

        // Create v2 store with new structure: guid -> {guid, video_id, start, comment}
        const v2Store = db.createObjectStore(STORE_NAME_V2, { keyPath: 'guid' });
        v2Store.createIndex('video_id', 'video_id', { unique: false });
        v2Store.createIndex('video_start', ['video_id', 'start'], { unique: false });

        // Migrate data from v1 to v2 if v1 exists
        if (db.objectStoreNames.contains(STORE_NAME)) {
          const v1Store = transaction.objectStore(STORE_NAME);
          const getAllRequest = v1Store.getAll();

          getAllRequest.onsuccess = () => {
            const parsedRecords = VideoEntrySchema.array().safeParse(getAllRequest.result);

            if (parsedRecords.success && parsedRecords.data.length > 0) {
              let totalMigrated = 0;
              parsedRecords.data.forEach(record => {
                if (record.timestamps.length > 0) {
                  record.timestamps.forEach(ts => {
                    v2Store.put({
                      guid: ts.guid,
                      video_id: record.video_id,
                      start: ts.start,
                      comment: ts.comment
                    });
                    totalMigrated++;
                  });
                }
              });
              log(`Migrated ${totalMigrated} timestamps from ${parsedRecords.data.length} videos to v2 store`);
            } else if (!parsedRecords.success) {
              log('Skipping v1 → v2 migration: legacy data failed validation', parsedRecords.error.message, 'warn');
            }

            // When upgrading from v1/v2 directly to v4, the v4 cursor MUST run here,
            // after the v3 puts above are queued, not in the outer v4 block below.
            // If it ran in the outer block its openCursor() request would be queued
            // before these puts, so the cursor would see an empty store.
            if (oldVersion < 4) {
              runV4LamportMigration(
                transaction.objectStore(STORE_NAME_V2),
                transaction.objectStore(SETTINGS_STORE_NAME)
              );
            }
          };

          // Delete the old store after migration
          db.deleteObjectStore(STORE_NAME);
          log('Deleted old timestamps store after migration to v2');
        }
      }

      // Version 4: Backfill write_counter and device_id on every existing record.
      // Only runs when upgrading from v3 (not v1/v2): those cases are handled inside
      // the v3 getAllRequest.onsuccess callback above so the cursor sees the v3 puts.
      if (oldVersion === 3) {
        runV4LamportMigration(
          transaction.objectStore(STORE_NAME_V2),
          transaction.objectStore(SETTINGS_STORE_NAME)
        );
      }

      // Version 5: index on write_counter so live sync can read "rows changed since N" without
      // scanning the whole store. The v2 store always exists by now (created above for any
      // older version), and rows backfilled by the v4 cursor are indexed as they are updated.
      const v2ForIndex = transaction.objectStore(STORE_NAME_V2);
      if (!v2ForIndex.indexNames.contains('write_counter')) {
        v2ForIndex.createIndex('write_counter', 'write_counter', { unique: false });
      }
    };
    request.onsuccess = event => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    request.onerror = event => {
      const error = (event.target as IDBOpenDBRequest).error;
      reject(error ?? new Error('Failed to open IndexedDB'));
    };
    // Open requests wait for other tabs' connections to close. Without a log line a
    // blocked upgrade looks like an endless "Loading timestamps...".
    request.onblocked = () => {
      log('IndexedDB open is blocked by another tab holding an older connection; waiting', null, 'warn');
    };
  });
}

/**
 * Execute a transaction with error handling
 */
function executeTransaction<T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T> | void
): Promise<T | undefined> {
  return getDB().then(db => {
    return new Promise<T | undefined>((resolve, reject) => {
      let tx: IDBTransaction;
      try {
        tx = db.transaction(storeName, mode);
      } catch (err) {
        reject(new Error(`Failed to create transaction for ${storeName}: ${err}`));
        return;
      }

      const store = tx.objectStore(storeName);
      let request: IDBRequest<T> | undefined;

      try {
        request = operation(store) as IDBRequest<T> | undefined;
      } catch (err) {
        reject(new Error(`Failed to execute operation on ${storeName}: ${err}`));
        return;
      }

      if (request) {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error(`IndexedDB ${mode} operation failed`));
      }

      tx.oncomplete = () => {
        if (!request) resolve(undefined);
      };
      tx.onerror = () => reject(tx.error ?? new Error(`IndexedDB transaction failed`));
      tx.onabort = () => reject(tx.error ?? new Error(`IndexedDB transaction aborted`));
    });
  });
}

const writeListeners = new Set<() => void>();

/**
 * Be told after every committed timestamp write (local edits and merged-in remote rows alike).
 * Returns an unsubscribe function.
 */
export function onTimestampsWritten(listener: () => void): () => void {
  writeListeners.add(listener);
  return () => writeListeners.delete(listener);
}

function notifyTimestampsWritten(): void {
  for (const listener of writeListeners) {
    try {
      listener();
    } catch (err) {
      log('Timestamp write listener failed:', err, 'error');
    }
  }
}

/**
 * Run `body` inside one readwrite transaction over the timestamp and settings stores.
 * Resolves when the transaction commits and rejects if it aborts. An exception thrown by
 * `body` (or by a request callback it registers) aborts the transaction, so a partial
 * write is never committed. `silent` skips the write notification, for writes that
 * live sync itself applied and must not push straight back.
 */
function runWrite(
  body: (v2Store: IDBObjectStore, settingsStore: IDBObjectStore) => void,
  { silent = false }: { silent?: boolean } = {}
): Promise<void> {
  return getDB().then(db => new Promise<void>((resolve, reject) => {
    let tx: IDBTransaction;
    try {
      tx = db.transaction([STORE_NAME_V2, SETTINGS_STORE_NAME], 'readwrite');
    } catch (err) {
      reject(new Error(`Failed to create transaction: ${err}`));
      return;
    }

    tx.oncomplete = () => {
      resolve();
      if (!silent) notifyTimestampsWritten();
    };
    tx.onerror = () => reject(new Error(`IndexedDB write failed: ${tx.error?.message ?? 'unknown'}`));
    tx.onabort = () => reject(new Error(`IndexedDB transaction aborted: ${tx.error?.message ?? 'unknown'}`));

    try {
      body(tx.objectStore(STORE_NAME_V2), tx.objectStore(SETTINGS_STORE_NAME));
    } catch (err) {
      try { tx.abort(); } catch { /* transaction already finished */ }
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  }));
}

/**
 * Read the Lamport write_counter and store whatever `use` returns as the new value.
 * A failed read aborts the transaction instead of falling back to 0: resetting the
 * counter would make later local writes lose merges to older remote versions.
 */
function withWriteCounter(
  settingsStore: IDBObjectStore,
  use: (current: number) => number
): void {
  const counterReq = settingsStore.get('write_counter');
  counterReq.onsuccess = () => {
    const current = typeof counterReq.result?.value === 'number' ? counterReq.result.value : 0;
    settingsStore.put({ key: 'write_counter', value: use(current) });
  };
}

// === Public Repository API ===

/**
 * Replace all timestamps for a video: rows missing from `data` are soft-deleted.
 * Only for callers that hold the authoritative list (e.g. a file import). UI edits
 * must use upsertTimestamps / deleteTimestamp so a stale view can't tombstone rows.
 * Throws on IndexedDB errors.
 */
export function saveTimestamps(videoId: string, data: TimestampRecord[]): Promise<void> {
  const parsed = TimestampRecordArraySchema.safeParse(data);
  if (!parsed.success) {
    return Promise.reject(new Error(`Invalid timestamp payload for ${videoId}`));
  }

  const timestamps = parsed.data;
  return runWrite((v2Store, settingsStore) => {
    const getRequest = v2Store.index('video_id').getAll(IDBKeyRange.only(videoId));

    getRequest.onsuccess = () => {
      const existingRecords = (getRequest.result as TimestampRow[]) ?? [];
      const existingByGuid = new Map(existingRecords.map(r => [r.guid, r]));
      const newGuids = new Set(timestamps.map(ts => ts.guid));
      const now = Date.now();

      withWriteCounter(settingsStore, current => {
        let counter = current;

        // Soft-delete removed timestamps
        existingRecords.forEach(record => {
          if (!newGuids.has(record.guid) && !record.deleted_at) {
            counter++;
            v2Store.put({ ...record, deleted_at: now, write_counter: counter });
          }
        });

        // Upsert changed or new timestamps; unchanged rows are left untouched
        timestamps.forEach(ts => {
          const existing = existingByGuid.get(ts.guid);
          const unchanged = existing &&
            !existing.deleted_at &&
            !ts.deleted_at &&
            existing.start === ts.start &&
            existing.comment === ts.comment;
          if (unchanged) return;

          counter++;
          v2Store.put({
            guid: ts.guid,
            video_id: videoId,
            start: ts.start,
            comment: ts.comment,
            write_counter: counter,
            deleted_at: ts.deleted_at ?? (existing?.deleted_at ?? undefined),
          });
        });

        return counter;
      });
    };
  });
}

/**
 * Row-level save: puts exactly the supplied timestamps, stamping each with a fresh
 * write_counter. Never touches other rows of the video. Throws on IndexedDB errors.
 */
export function upsertTimestamps(videoId: string, data: TimestampRecord[]): Promise<void> {
  const parsed = TimestampRecordArraySchema.safeParse(data);
  if (!parsed.success) {
    return Promise.reject(new Error(`Invalid timestamp payload for ${videoId}`));
  }

  const timestamps = parsed.data;
  if (timestamps.length === 0) return Promise.resolve();

  return runWrite((v2Store, settingsStore) => {
    withWriteCounter(settingsStore, current => {
      let counter = current;
      timestamps.forEach(ts => {
        counter++;
        v2Store.put({
          guid: ts.guid,
          video_id: videoId,
          start: ts.start,
          comment: ts.comment,
          write_counter: counter,
          deleted_at: ts.deleted_at,
        });
      });
      return counter;
    });
  });
}

/**
 * Save a single timestamp. Throws on IndexedDB errors.
 */
export function saveTimestamp(videoId: string, timestamp: TimestampRecord): Promise<void> {
  return upsertTimestamps(videoId, [timestamp]);
}

/**
 * Additive batch insert: puts all supplied records in one transaction.
 * Does not soft-delete anything — use saveTimestamps for replace semantics.
 * Records with write_counter preserve it; records without get a counter above both the
 * local counter and every incoming one. Always advances the local counter to at least
 * max(local, imported counters)+1.
 * Throws on IndexedDB errors.
 */
export function saveTimestampsBatch(
  records: Array<{ guid: string; video_id: string; start: number; comment: string; write_counter?: number; deleted_at?: number }>,
  options: { silent?: boolean } = {}
): Promise<void> {
  if (records.length === 0) return Promise.resolve();
  return runWrite((v2Store, settingsStore) => {
    withWriteCounter(settingsStore, current => {
      let counter = current;
      records.forEach(record => {
        if (record.write_counter !== undefined && record.write_counter > counter) {
          counter = record.write_counter;
        }
      });

      records.forEach(record => {
        const row: TimestampRow = {
          guid: record.guid,
          video_id: record.video_id,
          start: record.start,
          comment: record.comment,
          deleted_at: record.deleted_at,
          write_counter: record.write_counter ?? ++counter,
        };
        v2Store.put(row);
      });

      return counter + 1;
    });
  }, options);
}

/**
 * Soft-delete a single timestamp by GUID (marks deleted_at, updates write_counter).
 * Throws on IndexedDB errors.
 */
export function deleteTimestamp(guid: string): Promise<void> {
  log(`Soft-deleting timestamp ${guid}`);
  return runWrite((v2Store, settingsStore) => {
    const getRequest = v2Store.get(guid);
    getRequest.onsuccess = () => {
      const record = getRequest.result as TimestampRow | undefined;
      if (!record) return;
      withWriteCounter(settingsStore, current => {
        v2Store.put({ ...record, deleted_at: Date.now(), write_counter: current + 1 });
        return current + 1;
      });
    };
  });
}

/**
 * Load all timestamps for a video.
 * Returns null only when no timestamps are found; throws on actual IndexedDB errors.
 * Rows that fail validation are skipped (and logged) so one bad row can't hide the rest;
 * if every stored row is invalid it throws rather than reporting an empty video.
 */
export function loadTimestamps(videoId: string): Promise<TimestampRecord[] | null> {
  return getDB().then(db => new Promise<TimestampRecord[] | null>((resolve, reject) => {
    let tx: IDBTransaction;
    try {
      tx = db.transaction([STORE_NAME_V2], 'readonly');
    } catch (err) {
      const msg = `Failed to create read transaction: ${err}`;
      log(msg, err, 'error');
      reject(new Error(msg));
      return;
    }

    tx.onabort = () => {
      const msg = `Transaction aborted during load: ${tx.error?.message ?? 'unknown'}`;
      log(msg, tx.error, 'error');
      reject(new Error(msg));
    };

    const v2Request = tx.objectStore(STORE_NAME_V2).index('video_id').getAll(IDBKeyRange.only(videoId));

    v2Request.onsuccess = () => {
      try {
        const liveRows = (v2Request.result as TimestampRow[]).filter(r => !r.deleted_at);

        const records: TimestampRecord[] = [];
        let invalid = 0;
        for (const row of liveRows) {
          const parsed = TimestampRecordSchema.safeParse({ guid: row.guid, start: row.start, comment: row.comment });
          if (parsed.success) {
            records.push(parsed.data);
          } else {
            invalid++;
          }
        }

        if (invalid > 0) {
          log(`Skipped ${invalid} stored timestamps for ${videoId} that failed validation`, null, 'warn');
        }
        if (records.length === 0) {
          if (invalid > 0) {
            reject(new Error(`Stored timestamps for this video failed validation (${invalid} rows)`));
          } else {
            resolve(null);
          }
          return;
        }

        resolve(records.sort((a, b) => a.start - b.start));
      } catch (err) {
        reject(err);
      }
    };

    v2Request.onerror = () => {
      const msg = `Failed to load timestamps from IndexedDB: ${v2Request.error?.message ?? 'unknown error'}`;
      log(msg, v2Request.error, 'error');
      reject(new Error(msg));
    };
  }));
}

/**
 * Delete all timestamps for a video. Updates write_counter on each soft-delete.
 * Throws on IndexedDB errors.
 */
export function deleteTimestampsForVideo(videoId: string): Promise<void> {
  return runWrite((v2Store, settingsStore) => {
    const getRequest = v2Store.index('video_id').getAll(IDBKeyRange.only(videoId));

    getRequest.onsuccess = () => {
      const records = (getRequest.result as TimestampRow[]) ?? [];
      const now = Date.now();

      withWriteCounter(settingsStore, current => {
        let counter = current;
        records.forEach(record => {
          if (!record.deleted_at) {
            counter++;
            v2Store.put({ ...record, deleted_at: now, write_counter: counter });
          }
        });
        return counter;
      });
    };
  });
}

/**
 * Get all timestamps from store
 */
export function getAllTimestamps(): Promise<TimestampRow[]> {
  return executeTransaction(STORE_NAME_V2, 'readonly', (store) => {
    return store.getAll();
  }).then(result => {
    return Array.isArray(result) ? result as TimestampRow[] : [];
  });
}

/**
 * Rows (including soft-deleted ones) with a write_counter above `counter`, in counter order.
 * Served by the write_counter index, so the cost follows the number of changes, not the store size.
 */
export function getTimestampsChangedSince(counter: number): Promise<TimestampRow[]> {
  return executeTransaction(STORE_NAME_V2, 'readonly', (store) => {
    return store.index('write_counter').getAll(IDBKeyRange.lowerBound(counter, true));
  }).then(result => (Array.isArray(result) ? result as TimestampRow[] : []));
}

/**
 * The stored rows for the given GUIDs (missing GUIDs are omitted), read in one transaction.
 */
export function getTimestampsByGuids(guids: string[]): Promise<TimestampRow[]> {
  if (guids.length === 0) return Promise.resolve([]);
  return getDB().then(db => new Promise<TimestampRow[]>((resolve, reject) => {
    const rows: TimestampRow[] = [];
    const tx = db.transaction(STORE_NAME_V2, 'readonly');
    const store = tx.objectStore(STORE_NAME_V2);
    for (const guid of guids) {
      store.get(guid).onsuccess = (evt) => {
        const row = (evt.target as IDBRequest<TimestampRow | undefined>).result;
        if (row) rows.push(row);
      };
    }
    tx.oncomplete = () => resolve(rows);
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB read failed'));
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB read aborted'));
  }));
}

// === Settings Repository ===

/**
 * Save a global setting. Returns a Promise so callers can detect failures;
 * the promise resolves even on error (logged) so callers need not handle it.
 */
export function saveSetting(key: string, value: unknown): Promise<void> {
  return executeTransaction(SETTINGS_STORE_NAME, 'readwrite', (store) => {
    store.put({ key, value });
  }).then(() => undefined).catch(err => {
    log(`Failed to save setting '${key}' to IndexedDB:`, err, 'error');
  });
}

/**
 * Load a global setting
 */
export function loadSetting(key: string): Promise<unknown> {
  return executeTransaction(SETTINGS_STORE_NAME, 'readonly', (store) => {
    return store.get(key);
  }).then(result => {
    return (result as { value?: unknown } | undefined)?.value;
  }).catch(err => {
    log(`Failed to load setting '${key}' from IndexedDB:`, err, 'error');
    return undefined;
  });
}
