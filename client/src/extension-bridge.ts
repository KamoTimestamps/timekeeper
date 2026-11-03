// Isolated-world content script of the browser-extension builds (see extension-assets.ts).
import { EXTENSION_BASE_ATTRIBUTE } from "./extension-assets";

type RuntimeApi = { runtime?: { getURL(path: string): string } };
const scope = globalThis as unknown as { browser?: RuntimeApi; chrome?: RuntimeApi };
const getURL = (scope.browser ?? scope.chrome)?.runtime?.getURL;

function publishBaseUrl() {
  if (getURL) document.documentElement.setAttribute(EXTENSION_BASE_ATTRIBUTE, getURL("/"));
}

// <html> may not exist yet at document_start.
if (document.documentElement) publishBaseUrl();
else document.addEventListener("DOMContentLoaded", publishBaseUrl, { once: true });
