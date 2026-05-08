/**
 * Google Drive Upload Utilities
 * Low-level HTTP, zip, and Drive/backend API helpers extracted from google-drive.ts.
 * These functions have no dependency on the OAuth flow or display state.
 */

import { log } from './util';
import { TIMEKEEPER_VERSION } from './version';
import { zipSync, unzipSync } from 'fflate';
import * as AppState from './services/state';

// ── Constants ────────────────────────────────────────────────────────────────

/**
 * Fixed mtime for deterministic ZIP generation (used for diff-stable backups).
 */
export const DETERMINISTIC_ZIP_MTIME = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));
/**
 * Default host for the Timekeeper backend server.
 */
export const DEFAULT_TIMEKEEPER_BACKEND_HOST = 'localhost';
/**
 * Default port for the Timekeeper backend server.
 */
export const DEFAULT_TIMEKEEPER_BACKEND_PORT = 8443;

// ── Backend configuration helpers ────────────────────────────────────────────

/**
 * Get the normalized backend host (trimmed, protocol-stripped, or default).
 * @returns The backend host string
 */
export function getTimekeeperBackendHostNormalized(): string {
  return (AppState.getState().auth.timekeeperBackendHost ?? '').trim() || DEFAULT_TIMEKEEPER_BACKEND_HOST;
}

/**
 * Get the normalized backend bearer token, or null if missing.
 * @returns The bearer token string, or null
 */
export function getTimekeeperBackendBearerTokenNormalized(): string | null {
  const token = AppState.getState().auth.timekeeperBackendBearerToken;
  if (typeof token !== 'string') return null;
  const trimmed = token.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Construct the backend base URL with secure scheme.
 * @returns The backend base URL
 */
export function getTimekeeperBackendBaseUrl(): string {
  const rawHost = getTimekeeperBackendHostNormalized();
  const host = rawHost.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
  return `https://${host}:${AppState.getState().auth.timekeeperBackendPort}`;
}

// ── Destination predicate helpers ────────────────────────────────────────────

/**
 * Check if Google Drive is configured as a backup destination.
 * @returns True if signed in with an access token
 */
export function hasGoogleDriveBackupDestination(): boolean {
  const authState = AppState.getGoogleAuthState();
  return authState.isSignedIn && !!authState.accessToken;
}

/**
 * Check if the Timekeeper backend is fully configured.
 * @returns True if host, port, and bearer token are set
 */
export function hasTimekeeperBackendBackupConfiguration(): boolean {
  const auth = AppState.getState().auth;
  const port = auth.timekeeperBackendPort;
  return !!getTimekeeperBackendHostNormalized() && Number.isInteger(port) && port >= 1 && port <= 65535 && !!getTimekeeperBackendBearerTokenNormalized();
}

/**
 * Check if the Timekeeper backend is enabled and configured.
 * @returns True if backup is enabled and backend is configured
 */
export function hasTimekeeperBackendBackupDestination(): boolean {
  return AppState.getState().auth.timekeeperBackendBackupEnabled && hasTimekeeperBackendBackupConfiguration();
}

/**
 * Check if any backup destination is available.
 * @returns True if Google Drive or Timekeeper Backend is available
 */
export function hasAnyBackupDestination(): boolean {
  return hasGoogleDriveBackupDestination() || hasTimekeeperBackendBackupDestination();
}

/**
 * Get human-readable labels for configured backup destinations.
 * @returns Array of destination label strings
 */
export function getConfiguredDestinationLabels(): string[] {
  const labels: string[] = [];
  if (hasGoogleDriveBackupDestination()) {
    labels.push('Google Drive');
  }
  if (hasTimekeeperBackendBackupDestination()) {
    labels.push(`Timekeeper Backend (${getTimekeeperBackendHostNormalized()}:${AppState.getState().auth.timekeeperBackendPort})`);
  }
  return labels;
}

// ── HTTP utilities ────────────────────────────────────────────────────────────

/**
 * Fetch with an abort timeout.
 * @param url - The URL to fetch
 * @param init - Fetch options
 * @param timeoutMs - Timeout in milliseconds
 * @returns The fetch Response
 */
export async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 30000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') throw new Error('request timed out');
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Send a request via the userscript $fetch API.
 * @param details - The request details
 * @returns The response with status and text
 */
export async function sendUserscriptRequest(details: {
  method: string;
  url: string;
  headers?: Record<string, string>;
  data?: string | ArrayBuffer | Blob | FormData;
  timeout?: number;
}): Promise<{ status: number; responseText: string }> {
  try {
    const response = await fetchWithTimeout(details.url, {
      method: details.method,
      headers: {
        'User-Agent': `Timekeeper/${TIMEKEEPER_VERSION}`,
        ...(details.headers || {}),
      },
      body: details.data as BodyInit | null | undefined,
    }, details.timeout);
    const responseText = await response.text();
    return { status: response.status, responseText };
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : 'request failed');
  }
}

// ── ZIP utilities ─────────────────────────────────────────────────────────────

/**
 * Decode the first entry from a ZIP buffer as text.
 * @param buffer - The ZIP buffer
 * @returns The decoded text, or null if empty
 */
export function decodeFirstZipEntry(buffer: ArrayBuffer): string | null {
  const unzipped = unzipSync(new Uint8Array(buffer));
  const firstFile = Object.values(unzipped)[0];
  return firstFile ? new TextDecoder().decode(firstFile) : null;
}

/**
 * Create a ZIP archive containing a single JSON file.
 * @param json - The JSON string to archive
 * @param filename - The filename inside the ZIP
 * @returns The ZIP data as a Uint8Array
 */
export function createZipFromJson(json: string, filename: string): Uint8Array {
  const jsonBytes = new TextEncoder().encode(json);
  let normalizedFilename = filename.replace(/\\/g, '/').replace(/^\/+/, '');
  if (!normalizedFilename.endsWith('.json')) {
    normalizedFilename += '.json';
  }
  const zipData = zipSync({
    [normalizedFilename]: [jsonBytes, {
      level: 6,
      mtime: DETERMINISTIC_ZIP_MTIME,
      os: 0,
    }]
  });
  return zipData;
}

// ── Google Drive API calls ────────────────────────────────────────────────────

/**
 * Ensure a 'Timekeeper' folder exists on Drive, returning its ID.
 * @param accessToken - The OAuth access token
 * @returns The folder ID
 */
export async function ensureDriveFolder(accessToken: string): Promise<string> {
  const headers = { Authorization: `Bearer ${accessToken}` };
  const q = encodeURIComponent("name = 'Timekeeper' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=10`;
  const searchResp = await fetch(searchUrl, { headers });
  if (searchResp.status === 401) throw new Error('unauthorized');
  if (!searchResp.ok) throw new Error('drive search failed');
  const searchJson = await searchResp.json();
  if (Array.isArray(searchJson.files) && searchJson.files.length > 0) {
    return searchJson.files[0].id;
  }
  const createResp = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Timekeeper', mimeType: 'application/vnd.google-apps.folder' })
  });
  if (createResp.status === 401) throw new Error('unauthorized');
  if (!createResp.ok) throw new Error('drive folder create failed');
  const createJson = await createResp.json();
  return createJson.id;
}

/**
 * Find a file by name within a Drive folder.
 * @param filename - The file name to find
 * @param folderId - The parent folder ID
 * @param accessToken - The OAuth access token
 * @returns The file ID, or null if not found
 */
export async function findFileInFolder(filename: string, folderId: string, accessToken: string): Promise<string | null> {
  const query = `name='${filename}' and '${folderId}' in parents and trashed=false`;
  const encodedQuery = encodeURIComponent(query);
  const resp = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodedQuery}&fields=files(id,name)`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (resp.status === 401) throw new Error('unauthorized');
  if (!resp.ok) return null;
  const data = await resp.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }
  return null;
}

/**
 * Fetch the latest backup from Google Drive.
 * @param accessToken - The OAuth access token
 * @returns The backup JSON string, or null
 */
export async function fetchLatestDriveBackup(accessToken: string): Promise<string | null> {
  try {
    const folderId = await ensureDriveFolder(accessToken);
    const fileId = await findFileInFolder('timekeeper-data.zip', folderId, accessToken);
    if (!fileId) return null;
    const resp = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (resp.status === 401) throw new Error('unauthorized');
    if (!resp.ok) return null;
    return decodeFirstZipEntry(await resp.arrayBuffer());
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'unauthorized') throw err;
    log('Failed to fetch latest Drive backup for merge:', err, 'warn');
    return null;
  }
}

/**
 * Fetch the latest backup from the Timekeeper backend.
 * @returns The backup JSON string, or null
 */
export async function fetchLatestBackendBackup(): Promise<string | null> {
  const bearerToken = getTimekeeperBackendBearerTokenNormalized();
  if (!bearerToken) return null;
  try {
    const response = await fetchWithTimeout(`${getTimekeeperBackendBaseUrl()}/api/v1/backups/latest`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'User-Agent': `Timekeeper/${TIMEKEEPER_VERSION}`,
      },
    });
    if (response.status === 401 || response.status === 403) throw new Error('unauthorized');
    if (!response.ok) return null;
    return decodeFirstZipEntry(await response.arrayBuffer());
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'request timed out') return null;
    if (err instanceof Error && err.message === 'unauthorized') throw err;
    log('Failed to fetch latest backend backup for merge:', err, 'warn');
    return null;
  }
}

/**
 * Upload JSON data to Google Drive as a ZIP.
 * @param filename - The filename for the backup
 * @param json - The JSON data to upload
 * @param folderId - The Drive folder ID
 * @param accessToken - The OAuth access token
 */
export async function uploadJsonToDrive(filename: string, json: string, folderId: string, accessToken: string): Promise<void> {
  const zipFilename = filename.replace(/\.json$/, '.zip');
  const existingFileId = await findFileInFolder(zipFilename, folderId, accessToken);
  const originalSize = new TextEncoder().encode(json).length;
  const zipData = createZipFromJson(json, filename);
  const compressedSize = zipData.length;
  log(`Compressing data: ${originalSize} bytes -> ${compressedSize} bytes (${Math.round(100 - (compressedSize / originalSize * 100))}% reduction)`);

  const boundary = '-------314159265358979';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  const metadata = existingFileId
    ? { name: zipFilename, mimeType: 'application/zip' }
    : { name: zipFilename, mimeType: 'application/zip', parents: [folderId] };

  const chunkSize = 8192;
  let binaryString = '';
  for (let i = 0; i < zipData.length; i += chunkSize) {
    const chunk = zipData.subarray(i, Math.min(i + chunkSize, zipData.length));
    binaryString += String.fromCharCode.apply(null, Array.from(chunk));
  }
  const base64Data = btoa(binaryString);

  const multipartBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/zip\r\n' +
    'Content-Transfer-Encoding: base64\r\n\r\n' +
    base64Data +
    closeDelim;

  const url = existingFileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart&fields=id,name`
    : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name';
  const method = existingFileId ? 'PATCH' : 'POST';

  const resp = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: multipartBody
  });
  if (resp.status === 401) throw new Error('unauthorized');
  if (!resp.ok) throw new Error('drive upload failed');
}

/**
 * Upload JSON data to the Timekeeper backend.
 * @param filename - The backup filename
 * @param json - The JSON data to upload
 */
export async function uploadJsonToTimekeeperBackend(filename: string, json: string): Promise<void> {
  const bearerToken = getTimekeeperBackendBearerTokenNormalized();
  if (!bearerToken) throw new Error('unauthorized');

  const zipFilename = filename.replace(/\.json$/, '.zip');
  const zipData = createZipFromJson(json, filename);
  const zipBytes = Uint8Array.from(zipData);
  const formData = new FormData();
  formData.append('file', new Blob([zipBytes], { type: 'application/zip' }), zipFilename);

  const response = await sendUserscriptRequest({
    method: 'POST',
    url: `${getTimekeeperBackendBaseUrl()}/api/v1/backups`,
    headers: { Authorization: `Bearer ${bearerToken}` },
    data: formData,
  });

  if (response.status === 401 || response.status === 403) throw new Error('unauthorized');
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`timekeeper backend upload failed: ${response.status} ${response.responseText}`.trim());
  }
}
