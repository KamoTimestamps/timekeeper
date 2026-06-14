/**
 * Timestamp Repository
 * Data access layer using the Repository pattern.
 * Abstracts all IndexedDB operations.
 */

import {
  TimestampRecord,
  TimestampRecordArraySchema,
  TimestampRecordSchema,
  TimestampRowSchema,
  LegacyVideoEntrySchema,
  LegacyExportDataSchema,
} from '../schema';
import { log, getTimestampSuffix } from '../util';

// === Database Constants ===
export const DB_NAME = 'ytls-timestamps-db';
export const DB_VERSION = 4;
export const STORE_NAME = 'timestamps';
export const STORE_NAME_V2 = 'timestamps_v2';
export const SETTINGS_STORE_NAME = 'settings';

// === Database Connection Management ===
let dbConnection: IDBDatabase | null = null;
let dbConnectionPromise: Promise<IDBDatabase> | null = null;

// === Lamport Counter & Device ID ===
let deviceCache: string | null = null;
let counterCache: number | null = null;

/**
 * Get (or create) a stable device identifier for this install.
 * Stored in the settings store so it survives page reloads.
 */
export function getDeviceId(): Promise<string> {
  if (deviceCache) return Promise.resolve(deviceCache);
  return getDB().then(db => new Promise<string>(resolve => {
    const tx = db.transaction([SETTINGS_STORE_NAME], 'readonly');
    const req = tx.objectStore(SETTINGS_STORE_NAME).get('device_id');
    req.onsuccess = () => {
      const val = req.result as { value?: unknown } | undefined;
      const id = typeof val?.value === 'string' ? val.value : crypto.randomUUID();
      deviceCache = id;
      // If this was a newly generated id, persist it
      if (typeof val?.value !== 'string') {
        const writeTx = db.transaction([SETTINGS_STORE_NAME], 'readwrite');
        writeTx.objectStore(SETTINGS_STORE_NAME).put({ key: 'device_id', value: id });
      }
      resolve(id);
    };
    req.onerror = () => {
      const fallback = crypto.randomUUID();
      deviceCache = fallback;
      resolve(fallback);
    };
  }));
}

/**
 * Get the current Lamport write counter from settings.
 */
export function getWriteCounter(): Promise<number> {
  if (counterCache !== null) return Promise.resolve(counterCache);
  return loadSetting('write_counter').then(val => {
    const counter = typeof val === 'number' ? val : 0;
    counterCache = counter;
    return counter;
  });
}

/**
 * Increment the Lamport write counter in settings.
 * Returns the new counter value.
 */
export async function incrementWriteCounter(): Promise<number> {
  const current = await getWriteCounter();
  const next = current + 1;
  await saveSetting('write_counter', next);
  counterCache = next;
  return next;
}

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
            const parsedRecords = LegacyVideoEntrySchema.array().safeParse(exportRequest.result);

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
              log('Skipping pre-migration backup: legacy data failed validation', parsedRecords.error.format(), 'warn');
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
            const parsedRecords = LegacyVideoEntrySchema.array().safeParse(getAllRequest.result);

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
              log('Skipping v1 → v2 migration: legacy data failed validation', parsedRecords.error.format(), 'warn');
            }
          };

          // Delete the old store after migration
          db.deleteObjectStore(STORE_NAME);
          log('Deleted old timestamps store after migration to v2');
        }
      }

      // Version 4: Add Lamport write_counter and device_id for conflict resolution
      if (oldVersion < 4) {
        const v2Tx = db.transaction([STORE_NAME_V2, SETTINGS_STORE_NAME], 'readwrite');
        const v2Store = v2Tx.objectStore(STORE_NAME_V2);
        const settingsStore = v2Tx.objectStore(SETTINGS_STORE_NAME);

        // Generate a stable device_id for this install
        const deviceId = crypto.randomUUID();

        const getAllRequest = v2Store.getAll();
        getAllRequest.onsuccess = () => {
          const records = getAllRequest.result as Array<{
            guid: string;
            video_id: string;
            start: number;
            comment: string;
            deleted_at?: number;
            write_counter?: number;
            device_id?: string;
          }>;

          // Backfill existing records with sequential write_counter
          const now = Date.now();
          records.forEach((record, index) => {
            v2Store.put({
              ...record,
              write_counter: index + 1,
              device_id: deviceId,
            });
          });

          log(`Lamport migration: backfilled ${records.length} records with write_counter, device_id=${deviceId}`);

          // Store the final counter value in settings so new writes start after it
          const counterReq = settingsStore.put({ key: 'write_counter', value: records.length });
          counterReq.onsuccess = () => {
            const deviceReq = settingsStore.put({ key: 'device_id', value: deviceId });
            deviceReq.onsuccess = () => {
              log('Lamport migration: stored counter and device_id in settings');
            };
          };
        };
        getAllRequest.onerror = () => {
          log('Lamport migration: failed to enumerate records for backfill', getAllRequest.error, 'error');
        };
      }
    };
    request.onsuccess = event => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    request.onerror = event => {
      const error = (event.target as IDBOpenDBRequest).error;
      reject(error ?? new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Run an operation inside a readwrite or readonly transaction on STORE_NAME_V2.
 * Resolves when the transaction completes, rejects on error or abort.
 */
function withV2Transaction(mode: IDBTransactionMode, op: (store: IDBObjectStore) => void): Promise<void> {
  return getDB().then(db => new Promise<void>((resolve, reject) => {
    let tx: IDBTransaction;
    try {
      tx = db.transaction([STORE_NAME_V2], mode);
    } catch (err) {
      reject(new Error(`Failed to open transaction: ${err}`));
      return;
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Transaction failed'));
    tx.onabort = () => reject(tx.error ?? new Error('Transaction aborted'));
    op(tx.objectStore(STORE_NAME_V2));
  }));
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

// === Repository Interface ===

interface TimestampRow {
  guid: string;
  video_id: string;
  start: number;
  comment: string;
  deleted_at?: number;
  write_counter?: number;
  device_id?: string;
}

// === Public Repository API ===

/**
 * Save all timestamps for a video.
 * Sets Lamport write_counter and device_id on every upsert.
 */
export function saveTimestamps(videoId: string, data: TimestampRecord[]): Promise<void> {
  const parsed = TimestampRecordArraySchema.safeParse(data);
  if (!parsed.success) {
    return Promise.reject(new Error(`Invalid timestamp payload for ${videoId}`));
  }

  const timestamps = parsed.data;
  return getDeviceId().then(deviceId => getWriteCounter().then(baseCounter => {
    let counter = baseCounter;
    return withV2Transaction('readwrite', store => {
      const v2Index = store.index('video_id');

      // Get existing records for this video
      const getRequest = v2Index.getAll(IDBKeyRange.only(videoId));

      getRequest.onsuccess = () => {
        try {
          const existingRecords = getRequest.result as TimestampRow[];
          const newGuids = new Set(timestamps.map(ts => ts.guid));
          const now = Date.now();

          // Soft-delete removed timestamps
          existingRecords.forEach(record => {
            if (!newGuids.has(record.guid) && !record.deleted_at) {
              store.put({ ...record, deleted_at: now });
            }
          });

          // Add/update timestamps with Lamport tracking
          timestamps.forEach(ts => {
            counter++;
            store.put({
              guid: ts.guid,
              video_id: videoId,
              start: ts.start,
              comment: ts.comment,
              write_counter: counter,
              device_id: deviceId,
            });
          });

          // Persist final counter
          saveSetting('write_counter', counter);
          counterCache = counter;
        } catch (err) {
          log('Error during save operation:', err, 'error');
        }
      };
    });
  }));
}

/**
 * Save a single timestamp. Sets Lamport write_counter and device_id.
 */
export function saveTimestamp(videoId: string, timestamp: TimestampRecord): Promise<void> {
  const parsed = TimestampRecordSchema.safeParse(timestamp);
  if (!parsed.success) {
    return Promise.reject(new Error(`Invalid timestamp: ${parsed.error.message}`));
  }
  const ts = parsed.data;
  return getDeviceId().then(deviceId => getWriteCounter().then(baseCounter => {
    const nextCounter = baseCounter + 1;
    return withV2Transaction('readwrite', store => {
      store.put({
        guid: ts.guid,
        video_id: videoId,
        start: ts.start,
        comment: ts.comment,
        write_counter: nextCounter,
        device_id: deviceId,
      });
      saveSetting('write_counter', nextCounter);
      counterCache = nextCounter;
    });
  }));
}

/**
 * Additive batch insert: puts all supplied records in one transaction.
 * Does not soft-delete anything — use saveTimestamps for replace semantics.
 * Records with write_counter/device_id preserve those values (used by merge).
 * Records without them get auto-assigned from the local counter.
 */
export function saveTimestampsBatch(
  records: Array<{ guid: string; video_id: string; start: number; comment: string; write_counter?: number; device_id?: string }>
): Promise<void> {
  if (records.length === 0) return Promise.resolve();
  return getDeviceId().then(deviceId => {
    // For records without a write_counter, assign from local counter
    return getWriteCounter().then(baseCounter => {
      const needLocalCounter = records.some(r => r.write_counter === undefined);
      if (!needLocalCounter) {
        // All records have their own counter (from remote import) — use as-is
        return withV2Transaction('readwrite', store => {
          records.forEach(record => store.put({
            guid: record.guid,
            video_id: record.video_id,
            start: record.start,
            comment: record.comment,
            write_counter: record.write_counter,
            device_id: record.device_id ?? deviceId,
          }));
        });
      }
      // Mix of local and remote records — assign local counter to records without one
      let counter = baseCounter;
      const assigned = records.map(record => {
        if (record.write_counter !== undefined) {
          return { ...record, device_id: record.device_id ?? deviceId };
        }
        counter++;
        return { ...record, write_counter: counter, device_id: deviceId };
      });
      return withV2Transaction('readwrite', store => {
        assigned.forEach(record => store.put({
          guid: record.guid,
          video_id: record.video_id,
          start: record.start,
          comment: record.comment,
          write_counter: record.write_counter,
          device_id: record.device_id,
        }));
      }).then(() => {
        saveSetting('write_counter', counter);
        counterCache = counter;
      });
    });
  });
}

/**
 * Soft-delete a single timestamp by GUID (marks deleted_at, updates write_counter).
 */
export function deleteTimestamp(guid: string): Promise<void> {
  log(`Soft-deleting timestamp ${guid}`);
  return getDeviceId().then(deviceId => getWriteCounter().then(baseCounter => {
    const nextCounter = baseCounter + 1;
    return withV2Transaction('readwrite', store => {
      const getRequest = store.get(guid);
      getRequest.onsuccess = () => {
        const record = getRequest.result as TimestampRow | undefined;
        if (record) {
          store.put({
            ...record,
            deleted_at: Date.now(),
            write_counter: nextCounter,
            device_id: deviceId,
          });
          saveSetting('write_counter', nextCounter);
          counterCache = nextCounter;
        }
      };
    });
  }));
}

/**
 * Load all timestamps for a video
 */
export function loadTimestamps(videoId: string): Promise<TimestampRecord[] | null> {
  return getDB().then(db => new Promise<TimestampRecord[] | null>(resolve => {
    let tx: IDBTransaction;
    try {
      tx = db.transaction([STORE_NAME_V2], 'readonly');
    } catch (err) {
      log('Failed to create read transaction:', err, 'warn');
      resolve(null);
      return;
    }

    tx.onabort = () => {
      log('Transaction aborted during load:', tx.error, 'warn');
      resolve(null);
    };

    const v2Request = tx.objectStore(STORE_NAME_V2).index('video_id').getAll(IDBKeyRange.only(videoId));

    v2Request.onsuccess = () => {
      const v2Records = (v2Request.result as TimestampRow[]).filter(r => !r.deleted_at);

      if (v2Records.length === 0) {
        resolve(null);
        return;
      }

      const mapped = v2Records.map(r => ({
        guid: r.guid,
        start: r.start,
        comment: r.comment
      }));

      const parsed = TimestampRecordArraySchema.safeParse(mapped);
      if (!parsed.success) {
        log('Failed to parse timestamps from IndexedDB:', parsed.error.format(), 'warn');
        resolve(null);
        return;
      }

      resolve([...parsed.data].sort((a, b) => a.start - b.start));
    };

    v2Request.onerror = () => {
      log('Failed to load timestamps:', v2Request.error, 'warn');
      resolve(null);
    };
  }));
}

/**
 * Delete all timestamps for a video. Updates write_counter on each soft-delete.
 */
export function deleteTimestampsForVideo(videoId: string): Promise<void> {
  return getDeviceId().then(deviceId => getWriteCounter().then(baseCounter => {
    let counter = baseCounter;
    return withV2Transaction('readwrite', store => {
      const v2Index = store.index('video_id');
      const getRequest = v2Index.getAll(IDBKeyRange.only(videoId));

      getRequest.onsuccess = () => {
        try {
          const records = getRequest.result as TimestampRow[];
          const now = Date.now();
          records.forEach(record => {
            if (!record.deleted_at) {
              counter++;
              store.put({
                ...record,
                deleted_at: now,
                write_counter: counter,
                device_id: deviceId,
              });
            }
          });
          saveSetting('write_counter', counter);
          counterCache = counter;
        } catch (err) {
          log('Error during remove operation:', err, 'error');
        }
      };
    });
  }));
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

// === Settings Repository ===

/**
 * Save a global setting
 */
export function saveSetting(key: string, value: unknown): void {
  executeTransaction(SETTINGS_STORE_NAME, 'readwrite', (store) => {
    store.put({ key, value });
  }).catch(err => {
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
