// Packaged files of the browser-extension builds. The main script runs in the page's world, where
// runtime.getURL does not exist, so extension-bridge.ts (isolated world) publishes the extension's
// base URL on <html>. Userscript builds have no bridge and no packaged files: callers fall back
// to inlined data URIs there.
export const EXTENSION_BASE_ATTRIBUTE = "data-tk-extension-base";

/** URL of a file packaged with the extension (path relative to the extension root), or null outside extension builds. */
export function extensionAssetUrl(path: string): string | null {
  const base = document.documentElement?.getAttribute(EXTENSION_BASE_ATTRIBUTE);
  return base ? base + path : null;
}
