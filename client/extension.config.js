// Build-time constants for the browser-extension builds, like the userscript build's define in
// build-tools/build.js. TK_CHANNEL picks the sync backend (and whether the version shows the commit
// hash) from build-tools/channels.js; the default (main) ships with sync unconfigured and a plain
// version. Example: TK_CHANNEL=devel pnpm run build:firefox
const { execSync } = require('node:child_process');
const channels = require('./build-tools/channels.js');

const name = process.env.TK_CHANNEL || 'main';
const channel = channels[name];
if (!channel) throw new Error(`Unknown TK_CHANNEL "${name}" (expected one of: ${Object.keys(channels).join(', ')})`);

// Short hash of the commit the build was made from, as the userscript build shows it (see
// displaySuffix in build-tools/build.js), for channels that tag their builds.
const buildSuffix = channel.displayCommitHash
  ? `+${execSync('git rev-parse --short HEAD', { cwd: __dirname }).toString().trim()}`
  : '';

module.exports = {
  config: (config) => {
    config.plugins = config.plugins || [];
    config.plugins.push({
      apply(compiler) {
        new compiler.rspack.DefinePlugin({
          __BUILD_SUFFIX__: JSON.stringify(buildSuffix),
          __SYNC_API_URL__: JSON.stringify(channel.syncApiUrl),
          __SYNC_GOOGLE_CLIENT_ID__: JSON.stringify(channel.syncGoogleClientId),
        }).apply(compiler);
      },
    });
    return config;
  },
};
