// Usage: node build-tools/e2e/build-profile-bundle.js <outfile>
// Unminified bundle (readable function names) for use with bench.js profiling.
const path = require('path');
const esbuild = require('esbuild');
esbuild.build({
  entryPoints: [path.join(__dirname, '..', '..', 'src', 'timekeeper.ts')],
  bundle: true, outfile: process.argv[2], format: 'iife', platform: 'browser', target: 'ES2020',
  external: ['GM', 'GM_info'], minify: false, keepNames: true, loader: { '.svg': 'text' }, logLevel: 'error',
}).then(() => console.log('built', process.argv[2]));
