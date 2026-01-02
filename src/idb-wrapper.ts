import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'ytls-timestamps-db';
const DB_VERSION = 7;

let dbPromise: Promise<IDBPDatabase<any>> | null = null;

export function getDb(): Promise<IDBPDatabase<any>> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // Version 1: Create initial timestamps store
        if (oldVersion < 1) {
          db.createObjectStore('timestamps', { keyPath: 'video_id' });
        }

        // Version 2: Create settings store
        if (oldVersion < 2 && !db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }

        // Version 3: Migrate from timestamps to timestamps_v2 and delete old store
        if (oldVersion < 3) {
          if (!db.objectStoreNames.contains('timestamps_v2')) {
            const v2 = db.createObjectStore('timestamps_v2', { keyPath: 'guid' });
            v2.createIndex('video_id', 'video_id', { unique: false });
            v2.createIndex('video_start', ['video_id', 'start'], { unique: false });
          }

          // If the old store exists, migrate data into the new v2 store
          if (db.objectStoreNames.contains('timestamps')) {
            try {
              const oldStore = transaction.objectStore('timestamps');
              const getAllReq = oldStore.getAll();
              getAllReq.onsuccess = () => {
                const v1Records = getAllReq.result as Array<{ video_id: string; timestamps: Array<{ guid?: string; start: number; comment: string }> }>;
                if (v1Records.length > 0) {
                  const v2Store = transaction.objectStore('timestamps_v2');
                  v1Records.forEach(rec => {
                    if (Array.isArray(rec.timestamps) && rec.timestamps.length > 0) {
                      rec.timestamps.forEach(ts => {
                        try {
                          v2Store.put({ guid: ts.guid || crypto.randomUUID(), video_id: rec.video_id, start: ts.start, comment: ts.comment });
                        } catch (e) {
                          // ignore put errors here
                        }
                      });
                    }
                  });
                }
              };
            } catch (e) {
              // ignore migration errors
            }

            try { db.deleteObjectStore('timestamps'); } catch (err) { /* ignore */ }
          }
        }

        // Version 4: add video_metadata store
        if (oldVersion < 4 && !db.objectStoreNames.contains('video_metadata')) {
          const ms = db.createObjectStore('video_metadata', { keyPath: 'video_id' });
          try { ms.createIndex('published_at', 'published_at', { unique: false }); } catch {}
          try { ms.createIndex('members', 'members', { unique: false }); } catch {}
        }
      }
    });
  }
  return dbPromise;
}

export async function getAll(storeName: string): Promise<unknown[]> {
  const db = await getDb();
  return db.getAll(storeName as any) as Promise<unknown[]>;
}

export async function get(storeName: string, key: IDBValidKey): Promise<unknown> {
  const db = await getDb();
  return db.get(storeName as any, key);
}

export async function put(storeName: string, value: any): Promise<void> {
  const db = await getDb();
  await db.put(storeName as any, value);
}

export async function clearStore(storeName: string): Promise<void> {
  const db = await getDb();
  await db.clear(storeName as any);
}

export async function transaction<T>(storeNames: string | string[], mode: 'readonly' | 'readwrite', fn: (tx: IDBTransaction, stores: Record<string, any>) => Promise<T> | T): Promise<T> {
  const db = await getDb();
  const tx = db.transaction(storeNames as any, mode as any);
  const stores: Record<string, any> = {};
  if (Array.isArray(storeNames)) {
    storeNames.forEach(s => { stores[s] = tx.objectStore(s); });
  } else {
    stores[storeNames] = tx.objectStore(storeNames);
  }
  const res = await Promise.resolve(fn(tx as unknown as IDBTransaction, stores));
  await (tx as any).done;
  return res;
}

export async function ensureObjectStoreExists(storeName: string): Promise<void> {
  const db = await getDb();
  // If exists, done
  if (db.objectStoreNames.contains(storeName)) return;
  // Close and reopen with a higher version to create the store
  const currentVersion = db.version;
  db.close();
  // reopen with higher version and create store in upgrade
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, currentVersion + 1);
    req.onupgradeneeded = () => {
      const nd = req.result;
      if (!nd.objectStoreNames.contains(storeName)) {
        const store = nd.createObjectStore(storeName, { keyPath: 'video_id' });
        if (storeName === 'video_metadata') {
          try { store.createIndex('published_at', 'published_at', { unique: false }); } catch {}
          try { store.createIndex('members', 'members', { unique: false }); } catch {}
        }
      }
    };
    req.onsuccess = () => { try { req.result.close(); } catch {} ; resolve(); };
    req.onerror = () => reject(req.error ?? new Error('Failed to ensure object store'));
  });
  // Reset our cached promise so subsequent getDb picks up new version
  dbPromise = null;
}
