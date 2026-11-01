import { TIMEKEEPER_VERSION } from './version';

// Injected by build-tools/build.js for channels that tag their builds (e.g. "+a1b2c3d").
declare const __BUILD_SUFFIX__: string | undefined;
// ISO timestamp injected for build-stamped channels (the local dev channel); empty otherwise.
declare const __BUILD_TIME__: string | undefined;

/** Version shown in the UI and logs. The userscript @version header stays plain TIMEKEEPER_VERSION-based. */
export const DISPLAY_VERSION = TIMEKEEPER_VERSION + (typeof __BUILD_SUFFIX__ === 'string' ? __BUILD_SUFFIX__ : '');

/** When this bundle was built, or null for channels that don't stamp builds. */
export const BUILD_TIME: Date | null =
  typeof __BUILD_TIME__ === 'string' && __BUILD_TIME__ ? new Date(__BUILD_TIME__) : null;
