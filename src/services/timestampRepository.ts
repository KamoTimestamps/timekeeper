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
} from '../schema';
import { log } from '../util';

// === Database Constants ===
export const DB_NAME = 'ytls-timestamps-db';
export const DB_VERSION = 3;
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

      if (oldVersion < 2 && !db.objectStoreNames.contains(SETTINGS_STORE_NAME)) {
        db.createObjectStore(SETTINGS_STORE_NAME, { keyPath: 'key' });
      }

      if (oldVersion < 3) {
        const v2Store = db.createObjectStore(STORE_NAME_V2, { keyPath: 'guid' });
        v2Store.createIndex('video_id', 'video_id', { unique: false });
        v2Store.createIndex('video_start', ['video_id', 'start'], { unique: false });
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
    try {
      op(tx.objectStore(STORE_NAME_V2));
    } catch (err) {
      reject(new Error(`Operation threw synchronously: ${err}`));
      try { tx.abort(); } catch (_) { /* already completing */ }
    }
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

        // Add/update timestamps
        timestamps.forEach(ts => {
          store.put({
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
      log('Failed to fetch existing timestamps before save:', getRequest.error, 'error');
    };
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
  return withV2Transaction('readwrite', store => {
    store.put({
      guid: ts.guid,
      video_id: videoId,
      start: ts.start,
      comment: ts.comment
    });
  });
}

/**
 * Additive batch insert: puts all supplied records in one transaction.
 * Does not soft-delete anything — use saveTimestamps for replace semantics.
 */
export function saveTimestampsBatch(records: Array<{ guid: string; video_id: string; start: number; comment: string }>): Promise<void> {
  if (records.length === 0) return Promise.resolve();
  return withV2Transaction('readwrite', store => {
    records.forEach(record => store.put(record));
  });
}

/**
 * Soft-delete a single timestamp by GUID (marks deleted_at, does not remove the record)
 */
export function deleteTimestamp(guid: string): Promise<void> {
  log(`Soft-deleting timestamp ${guid}`);
  return withV2Transaction('readwrite', store => {
    const getRequest = store.get(guid);
    getRequest.onsuccess = () => {
      const record = getRequest.result as TimestampRow | undefined;
      if (record) {
        store.put({ ...record, deleted_at: Date.now() });
      }
    };
    getRequest.onerror = () => {
      log('Failed to fetch timestamp for deletion:', getRequest.error, 'error');
    };
  });
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

    tx.onerror = () => {
      log('Transaction error during load:', tx.error, 'warn');
      resolve(null);
    };
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
 * Delete all timestamps for a video
 */
export function deleteTimestampsForVideo(videoId: string): Promise<void> {
  return withV2Transaction('readwrite', store => {
    const v2Index = store.index('video_id');
    const getRequest = v2Index.getAll(IDBKeyRange.only(videoId));

    getRequest.onsuccess = () => {
      try {
        const records = getRequest.result as TimestampRow[];
        const now = Date.now();
        records.forEach(record => {
          if (!record.deleted_at) {
            store.put({ ...record, deleted_at: now });
          }
        });
      } catch (err) {
        log('Error during remove operation:', err, 'error');
      }
    };
    getRequest.onerror = () => {
      log('Failed to fetch timestamps for removal:', getRequest.error, 'error');
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
