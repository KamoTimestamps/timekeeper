import * as IDB from './idb-wrapper';

// Helpers for fetching and parsing videos.csv and updating the video_metadata IndexedDB store.

export interface VMOptions {
  loadGlobalSettings: (key: string) => Promise<unknown>;
  saveGlobalSettings: (key: string, value: unknown) => Promise<void>;
  executeTransaction: <T>(storeName: string, mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T> | void) => Promise<T | undefined>;
  VIDEO_METADATA_STORE: string;
  VIDEOS_CSV_ETAG_KEY: string;
  log: (...args: unknown[]) => void;
}

// Parse a single CSV line into fields, handling quoted fields with doubled quotes
function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  const regex = /("(?:[^"]|"")*"|[^,]*)(,|$)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(line)) !== null) {
    let field = match[1] ?? '';
    if (field.startsWith('"') && field.endsWith('"')) {
      // Remove surrounding quotes and unescape doubled quotes
      field = field.slice(1, -1).replace(/""/g, '"');
    }
    fields.push(field);
    // Prevent infinite loops on malformed input
    if (match[0].length === 0) break;
  }
  return fields;
}

// Parse CSV text into an array of records with keys from header
export function parseCsvToRecords(csvText: string): Array<Record<string, string>> {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) return [];
  const headerFields = parseCsvLine(lines[0]).map(h => h.trim());
  const records: Array<Record<string, string>> = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const fields = parseCsvLine(line);
    const obj: Record<string, string> = {};
    for (let j = 0; j < headerFields.length; j++) {
      obj[headerFields[j]] = fields[j] ?? '';
    }
    records.push(obj);
  }
  return records;
}


export async function updateVideoMetadataStore(parsed: Array<Record<string, string>>, options: VMOptions): Promise<void> {
  const normalized = parsed.map(r => ({
    video_id: (r['video_id'] ?? r['videoId'] ?? '').trim(),
    title: (r['title'] ?? '').trim(),
    published_at: (r['published_at'] ?? r['publishedAt'] ?? '').trim(),
    thumbnail_url: (r['thumbnail_url'] ?? r['thumbnailUrl'] ?? '').trim(),
    members: String((r['members'] ?? '').trim()).toLowerCase() === 'true'
  }));

  // Use idb wrapper to clear and put records
  await IDB.clearStore(options.VIDEO_METADATA_STORE);
  if (normalized.length > 0) {
    // batch in a single transaction
    await IDB.transaction(options.VIDEO_METADATA_STORE, 'readwrite', async (_tx, stores) => {
      const store: any = stores[options.VIDEO_METADATA_STORE];
      for (const row of normalized) {
        if (row.video_id) await store.put(row as any);
      }
    });
  }

  options.log(`IndexedDB: updated ${normalized.length} video metadata records`);
  try {
    window.dispatchEvent(new CustomEvent('video_metadata_updated', { detail: { count: normalized.length } }));
  } catch (err) {
    // ignore
  }
}

// Fetch the videos CSV with conditional If-None-Match and update store when necessary
export async function fetchAndUpdateVideosCsv(options: VMOptions): Promise<void> {
  const csvUrl = 'https://raw.githubusercontent.com/KamoTimestamps/timekeeper/refs/heads/main/metadata/videos.csv';
  let storedEtag = undefined as string | undefined;
  try {
    const maybe = await options.loadGlobalSettings(options.VIDEOS_CSV_ETAG_KEY);
    if (typeof maybe === 'string') storedEtag = maybe;
  } catch (err) {
    options.log('Failed to load stored videos CSV etag:', err, 'warn');
  }

  // Build headers. Use If-None-Match for conditional GETs when we have an ETag
  const buildHeaders = (etag?: string) => {
    const headers: Record<string, string> = {};
    if (etag) headers['If-None-Match'] = etag;
    headers['Accept'] = 'text/plain';
    return headers;
  };

  let resp: Response;
  try {
    resp = await fetch(csvUrl, { headers: buildHeaders(storedEtag), cache: 'no-store' });
  } catch (err) {
    options.log('Failed to fetch videos.csv:', err, 'warn');
    return;
  }

  if (resp.status === 304) {
    options.log('videos.csv not modified (304)');
    return;
  }

  if (resp.status === 200) {
    const etagHeader = resp.headers.get('etag');
    const text = await resp.text();

    // Parse and store in a non-blocking way to avoid delaying the UI.
    const doParseAndStore = async () => {
      try {
        const parsed = parseCsvToRecords(text);
        await updateVideoMetadataStore(parsed, options);
        if (etagHeader) {
          try {
            await options.saveGlobalSettings(options.VIDEOS_CSV_ETAG_KEY, etagHeader);
            options.log('Saved videos.csv ETag to IndexedDB');
          } catch (err) {
            options.log('Failed to save videos CSV etag:', err, 'warn');
          }
        }
      } catch (err) {
        options.log('Failed to parse or store videos.csv contents:', err, 'error');
      }
    };

    if (typeof (window as any).requestIdleCallback === 'function') {
      try {
        (window as any).requestIdleCallback(() => { void doParseAndStore(); }, { timeout: 2000 });
      } catch (err) {
        // Fallback to setTimeout if requestIdleCallback throws
        setTimeout(() => { void doParseAndStore(); }, 0);
      }
    } else {
      // Best-effort yield to the event loop
      setTimeout(() => { void doParseAndStore(); }, 0);
    }

  } else if (resp.status === 404) {
    options.log('videos.csv not found at remote URL (404)', 'warn');
  } else {
    options.log(`Unexpected response fetching videos.csv: ${resp.status} ${resp.statusText}`, 'warn');
  }
}

export async function initVideoMetadata(options: VMOptions): Promise<void> {
  try {
    await fetchAndUpdateVideosCsv(options);
  } catch (err) {
    options.log('Failed to initialize video metadata:', err, 'warn');
  }
}
