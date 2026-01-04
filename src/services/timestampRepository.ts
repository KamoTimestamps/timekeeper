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
export const DB_VERSION = 3;
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
      // Verify the connection is actually usable
      const isValid = dbConnection.objectStoreNames.length >= 0;
      if (isValid) {
        return Promise.resolve(dbConnection);
      }
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
}

// === Public Repository API ===

/**
 * Save all timestamps for a video
 */
export function saveTimestamps(videoId: string, data: TimestampRecord[]): Promise<void> {
  const parsed = TimestampRecordArraySchema.safeParse(data);
  if (!parsed.success) {
    return Promise.reject(new Error(`Invalid timestamp payload for ${videoId}`));
  }

  const timestamps = parsed.data;
  return getDB().then(db => {
    return new Promise<void>((resolve, reject) => {
      let tx: IDBTransaction;
      try {
        tx = db.transaction([STORE_NAME_V2], 'readwrite');
      } catch (err) {
        reject(new Error(`Failed to create transaction: ${err}`));
        return;
      }

      const v2Store = tx.objectStore(STORE_NAME_V2);
      const v2Index = v2Store.index('video_id');

      // Get existing records for this video
      const getRequest = v2Index.getAll(IDBKeyRange.only(videoId));

      getRequest.onsuccess = () => {
        try {
          const existingRecords = getRequest.result as Array<{ guid: string }>;
          const newGuids = new Set(timestamps.map(ts => ts.guid));

          // Delete removed timestamps
          existingRecords.forEach(record => {
            if (!newGuids.has(record.guid)) {
              v2Store.delete(record.guid);
            }
          });

          // Add/update timestamps
          timestamps.forEach(ts => {
            v2Store.put({
              guid: ts.guid,
              video_id: videoId,
              start: ts.start,
              comment: ts.comment
            });
          });
        } catch (err) {
          log('Error during save operation:', err, 'error');
        }
      };

      getRequest.onerror = () => {
        reject(getRequest.error ?? new Error('Failed to get existing records'));
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('Failed to save to IndexedDB'));
      tx.onabort = () => reject(tx.error ?? new Error('Transaction aborted during save'));
    });
  });
}

/**
 * Save a single timestamp
 */
export function saveTimestamp(videoId: string, timestamp: TimestampRecord): Promise<void> {
  const parsed = TimestampRecordSchema.safeParse(timestamp);
  if (!parsed.success) {
    return Promise.reject(new Error(`Invalid timestamp: ${parsed.error.message}`));
  }
  const ts = parsed.data;
  return getDB().then(db => {
    return new Promise<void>((resolve, reject) => {
      let tx: IDBTransaction;
      try {
        tx = db.transaction([STORE_NAME_V2], 'readwrite');
      } catch (err) {
        reject(new Error(`Failed to create transaction: ${err}`));
        return;
      }

      const v2Store = tx.objectStore(STORE_NAME_V2);
      const putRequest = v2Store.put({
        guid: ts.guid,
        video_id: videoId,
        start: ts.start,
        comment: ts.comment
      });

      putRequest.onerror = () => {
        reject(putRequest.error ?? new Error('Failed to put timestamp'));
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('Failed to save single timestamp to IndexedDB'));
      tx.onabort = () => reject(tx.error ?? new Error('Transaction aborted during single timestamp save'));
    });
  });
}

/**
 * Delete a single timestamp by GUID
 */
export function deleteTimestamp(guid: string): Promise<void> {
  log(`Deleting timestamp ${guid}`);
  return getDB().then(db => {
    return new Promise<void>((resolve, reject) => {
      let tx: IDBTransaction;
      try {
        tx = db.transaction([STORE_NAME_V2], 'readwrite');
      } catch (err) {
        reject(new Error(`Failed to create transaction: ${err}`));
        return;
      }

      const v2Store = tx.objectStore(STORE_NAME_V2);
      const deleteRequest = v2Store.delete(guid);

      deleteRequest.onerror = () => {
        reject(deleteRequest.error ?? new Error('Failed to delete timestamp'));
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('Failed to delete single timestamp from IndexedDB'));
      tx.onabort = () => reject(tx.error ?? new Error('Transaction aborted during timestamp deletion'));
    });
  });
}

/**
 * Load all timestamps for a video
 */
export function loadTimestamps(videoId: string): Promise<TimestampRecord[] | null> {
  return getDB().then(db => {
    return new Promise<TimestampRecord[] | null>((resolve) => {
      let tx: IDBTransaction;
      try {
        tx = db.transaction([STORE_NAME_V2], 'readonly');
      } catch (err) {
        log('Failed to create read transaction:', err, 'warn');
        resolve(null);
        return;
      }

      const v2Store = tx.objectStore(STORE_NAME_V2);
      const v2Index = v2Store.index('video_id');

      const v2Request = v2Index.getAll(IDBKeyRange.only(videoId));

      v2Request.onsuccess = () => {
        const v2Records = v2Request.result as TimestampRow[];

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

        const timestamps = [...parsed.data].sort((a, b) => a.start - b.start);
        resolve(timestamps);
      };

      v2Request.onerror = () => {
        log('Failed to load timestamps:', v2Request.error, 'warn');
        resolve(null);
      };

      tx.onabort = () => {
        log('Transaction aborted during load:', tx.error, 'warn');
        resolve(null);
      };
    });
  });
}

/**
 * Delete all timestamps for a video
 */
export function deleteTimestampsForVideo(videoId: string): Promise<void> {
  return getDB().then(db => {
    return new Promise<void>((resolve, reject) => {
      let tx: IDBTransaction;
      try {
        tx = db.transaction([STORE_NAME_V2], 'readwrite');
      } catch (err) {
        reject(new Error(`Failed to create transaction: ${err}`));
        return;
      }

      const v2Store = tx.objectStore(STORE_NAME_V2);
      const v2Index = v2Store.index('video_id');
      const getRequest = v2Index.getAll(IDBKeyRange.only(videoId));

      getRequest.onsuccess = () => {
        try {
          const records = getRequest.result as TimestampRow[];
          records.forEach(record => {
            v2Store.delete(record.guid);
          });
        } catch (err) {
          log('Error during remove operation:', err, 'error');
        }
      };

      getRequest.onerror = () => {
        reject(getRequest.error ?? new Error('Failed to get records for removal'));
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('Failed to remove timestamps'));
      tx.onabort = () => reject(tx.error ?? new Error('Transaction aborted during timestamp removal'));
    });
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
