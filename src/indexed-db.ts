import { log, getTimestampSuffix } from './util';
import { openDB, IDBPDatabase, DBSchema } from 'idb';

export const DB_NAME = 'ytls-timestamps-db';
export const DB_VERSION = 3;
export const STORE_NAME = 'timestamps';
export const STORE_NAME_V2 = 'timestamps_v2';
export const SETTINGS_STORE_NAME = 'settings';

export type TimestampRecord = { guid: string; start: number; comment: string };

// Define the database schema for type safety
interface TimestampDB extends DBSchema {
  timestamps_v2: {
    key: string;
    value: {
      guid: string;
      video_id: string;
      start: number;
      comment: string;
    };
    indexes: {
      'video_id': string;
      'video_start': [string, number];
    };
  };
  settings: {
    key: string;
    value: {
      key: string;
      value: unknown;
    };
  };
}

type DB = IDBPDatabase<TimestampDB>;
let dbPromise: Promise<DB> | null = null;

export function getDB(): Promise<DB> {
  if (dbPromise) return dbPromise;

  dbPromise = openDB<TimestampDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, _newVersion, tx) {
        // Migration from v0 to v1: create old timestamps store
        if (oldVersion < 1) {
          // Creating legacy store - not in our schema but needed for migration
          (db as any).createObjectStore(STORE_NAME, { keyPath: 'video_id' });
        }

        // Migration from v1 to v2: create settings store
        if (oldVersion < 2 && !db.objectStoreNames.contains(SETTINGS_STORE_NAME)) {
          db.createObjectStore(SETTINGS_STORE_NAME, { keyPath: 'key' });
        }

        // Migration from v2 to v3: create v2 store and migrate data
        if (oldVersion < 3) {
          // Try best-effort export of v1 store before migration
          if ((db.objectStoreNames as DOMStringList).contains(STORE_NAME)) {
            try {
              // Access legacy store using raw API since it's not in our typed schema
              const v1 = (tx as any).objectStore(STORE_NAME);
              const req = v1.getAll();
              req.onsuccess = () => {
                try {
                  const v1Records = req.result as Array<{ video_id: string; timestamps: TimestampRecord[] }>;
                  if (v1Records.length > 0) {
                    const exportData: Record<string, unknown> = {};
                    let totalTimestamps = 0;
                    v1Records.forEach(record => {
                      if (Array.isArray(record.timestamps) && record.timestamps.length > 0) {
                        const timestampsWithGuids = record.timestamps.map(ts => ({
                          guid: ts.guid || crypto.randomUUID(),
                          start: ts.start,
                          comment: ts.comment
                        }));
                        exportData[`ytls-${record.video_id}`] = {
                          video_id: record.video_id,
                          timestamps: timestampsWithGuids.sort((a, b) => a.start - b.start)
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

                    log(`Pre-migration backup exported: ${v1Records.length} videos, ${totalTimestamps} timestamps`);
                  }
                } catch (err) {
                  log('Failed to export pre-migration backup:', err, 'error');
                }
              };
            } catch (err) {
              log('Failed to inspect v1 store during migration:', err, 'warn');
            }
          }

          // Create new v2 store with proper indexes
          const v2 = db.createObjectStore(STORE_NAME_V2, { keyPath: 'guid' });
          v2.createIndex('video_id', 'video_id', { unique: false });
          v2.createIndex('video_start', ['video_id', 'start'], { unique: false });

          // Migrate data from v1 to v2 store
          if ((db.objectStoreNames as DOMStringList).contains(STORE_NAME)) {
            try {
              const v1Store = (tx as any).objectStore(STORE_NAME);
              const getAllRequest = v1Store.getAll();
              getAllRequest.onsuccess = () => {
                const v1Records = getAllRequest.result as Array<{ video_id: string; timestamps: TimestampRecord[] }>;
                if (v1Records.length > 0) {
                  let totalMigrated = 0;
                  v1Records.forEach(record => {
                    if (Array.isArray(record.timestamps) && record.timestamps.length > 0) {
                      record.timestamps.forEach(ts => {
                        v2.put({
                          guid: ts.guid || crypto.randomUUID(),
                          video_id: record.video_id,
                          start: ts.start,
                          comment: ts.comment
                        });
                        totalMigrated++;
                      });
                    }
                  });
                  log(`Migrated ${totalMigrated} timestamps from ${v1Records.length} videos to v2 store`);
                }
              };
              (db as any).deleteObjectStore(STORE_NAME);
              log('Deleted old timestamps store after migration to v2');
            } catch (err) {
              log('Failed during migration:', err, 'error');
            }
          }
        }
      }
    }).catch(err => {
      // Reset dbPromise on error so next call will retry
      log('Failed to open database, will retry on next access:', err, 'error');
      dbPromise = null;
      throw err;
    });

  return dbPromise;
}

export async function getAllFromIndexedDB(storeName: string): Promise<unknown[]> {
  try {
    const db = await getDB();
    // Dynamic store name requires casting since it's not in our static schema
    const items = await (db as any).getAll(storeName);
    return Array.isArray(items) ? items : [];
  } catch (err) {
    log('Failed to getAll from IndexedDB:', err, 'error');
    return [];
  }
}

export async function saveToIndexedDB(videoId: string, data: TimestampRecord[]): Promise<void> {
  try {
    const db = await getDB();
    const existing = await db.getAllFromIndex(STORE_NAME_V2, 'video_id', videoId);
    const newGuids = new Set(data.map(ts => ts.guid));

    for (const rec of existing) {
      if (!newGuids.has(rec.guid)) {
        await db.delete(STORE_NAME_V2, rec.guid);
      }
    }

    for (const ts of data) {
      await db.put(STORE_NAME_V2, { guid: ts.guid, video_id: videoId, start: ts.start, comment: ts.comment });
    }
  } catch (err) {
    log('Failed to save to IndexedDB:', err, 'error');
    throw err;
  }
}

export async function saveSingleTimestampToIndexedDB(videoId: string, timestamp: TimestampRecord): Promise<void> {
  try {
    const db = await getDB();
    await db.put(STORE_NAME_V2, { guid: timestamp.guid, video_id: videoId, start: timestamp.start, comment: timestamp.comment });
  } catch (err) {
    log('Failed to save single timestamp to IndexedDB:', err, 'error');
    throw err;
  }
}

export async function deleteSingleTimestampFromIndexedDB(videoId: string, guid: string): Promise<void> {
  log(`Deleting timestamp ${guid} for video ${videoId}`);
  try {
    const db = await getDB();
    await db.delete(STORE_NAME_V2, guid);
  } catch (err) {
    log('Failed to delete timestamp from IndexedDB:', err, 'error');
    throw err;
  }
}

export async function loadFromIndexedDB(videoId: string): Promise<TimestampRecord[] | null> {
  try {
    const db = await getDB();
    const recs = await db.getAllFromIndex(STORE_NAME_V2, 'video_id', videoId);
    if (!recs || recs.length === 0) return null;
    const timestamps = recs.map(r => ({ guid: r.guid, start: r.start, comment: r.comment })).sort((a, b) => a.start - b.start);
    return timestamps;
  } catch (err) {
    log('Failed to load timestamps from IndexedDB:', err, 'warn');
    return null;
  }
}

export async function removeFromIndexedDB(videoId: string): Promise<void> {
  try {
    const db = await getDB();
    const recs = await db.getAllFromIndex(STORE_NAME_V2, 'video_id', videoId);
    for (const r of recs) {
      await db.delete(STORE_NAME_V2, r.guid);
    }
  } catch (err) {
    log('Failed to remove timestamps from IndexedDB:', err, 'error');
    throw err;
  }
}

export async function saveGlobalSettings(key: string, value: unknown): Promise<void> {
  try {
    const db = await getDB();
    await db.put(SETTINGS_STORE_NAME, { key, value });
  } catch (err) {
    log(`Failed to save setting '${key}' to IndexedDB:`, err, 'error');
    throw err;
  }
}

export async function loadGlobalSettings(key: string): Promise<unknown> {
  try {
    const db = await getDB();
    const res = await db.get(SETTINGS_STORE_NAME, key);
    return res?.value;
  } catch (err) {
    log(`Failed to load setting '${key}' from IndexedDB:`, err, 'error');
    return undefined;
  }
}
