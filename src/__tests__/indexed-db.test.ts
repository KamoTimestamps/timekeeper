import 'fake-indexeddb/auto';
import { describe, it, expect, beforeAll } from 'vitest';

// Mock GM_info before importing indexed-db
beforeAll(() => {
  (globalThis as any).GM_info = {
    script: {
      version: '1.0.0'
    }
  };
});

import {
  getDB,
  saveGlobalSettings,
  loadGlobalSettings,
  saveToIndexedDB,
  loadFromIndexedDB,
  saveSingleTimestampToIndexedDB,
  deleteSingleTimestampFromIndexedDB,
  removeFromIndexedDB,
  getAllFromIndexedDB,
  STORE_NAME_V2,
  SETTINGS_STORE_NAME
} from '../indexed-db';

function delay(ms = 20) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('IndexedDB helpers (integration)', () => {
  it('saves and loads global settings', async () => {
    const key = 'test_setting_key';
    const val = { foo: 'bar' };
    // saveGlobalSettings now returns a promise we can await
    await saveGlobalSettings(key, val);
    const loaded = await loadGlobalSettings(key);
    expect(loaded).toEqual(val);
  });

  it('saves and loads timestamp arrays', async () => {
    const vid = 'video-123';
    const ts = [
      { guid: 'g1', start: 10, comment: 'a' },
      { guid: 'g2', start: 20, comment: 'b' }
    ];

    await saveToIndexedDB(vid, ts);
    const loaded = await loadFromIndexedDB(vid);
    expect(loaded).toBeTruthy();
    expect(loaded!.length).toBe(2);
    expect(loaded!.map(x => x.guid).sort()).toEqual(['g1', 'g2']);

    const all = await getAllFromIndexedDB(STORE_NAME_V2);
    expect(Array.isArray(all)).toBe(true);
  });

  it('saves and deletes single timestamps', async () => {
    const vid = 'video-abc';
    const t = { guid: 'single-g', start: 5, comment: 'x' };
    await saveSingleTimestampToIndexedDB(vid, t as any);
    let loaded = await loadFromIndexedDB(vid);
    expect(loaded && loaded[0].guid).toBe('single-g');

    await deleteSingleTimestampFromIndexedDB(vid, 'single-g');
    loaded = await loadFromIndexedDB(vid);
    expect(loaded).toBeNull();
  });

  it('removes all timestamps for a video', async () => {
    const vid = 'video-remove';
    const items = [
      { guid: 'r1', start: 1, comment: '1' },
      { guid: 'r2', start: 2, comment: '2' }
    ];
    await saveToIndexedDB(vid, items as any);
    let loaded = await loadFromIndexedDB(vid);
    expect(loaded && loaded.length).toBe(2);

    await removeFromIndexedDB(vid);
    loaded = await loadFromIndexedDB(vid);
    expect(loaded).toBeNull();
  });
});
