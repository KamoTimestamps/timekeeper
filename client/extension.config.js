// Build-time constants for the browser-extension builds, like the userscript build's define in
// build-tools/build.js. TK_CHANNEL picks the sync backend from build-tools/channels.js; the default
// (main) ships with sync unconfigured. Example: TK_CHANNEL=devel pnpm run build:firefox
const channels = require('./build-tools/channels.js');

const name = process.env.TK_CHANNEL || 'main';
const channel = channels[name];
if (!channel) throw new Error(`Unknown TK_CHANNEL "${name}" (expected one of: ${Object.keys(channels).join(', ')})`);

module.exports = {
  config: (config) => {
    config.plugins = config.plugins || [];
    config.plugins.push({
      apply(compiler) {
        new compiler.rspack.DefinePlugin({
          __SYNC_API_URL__: JSON.stringify(channel.syncApiUrl),
          __SYNC_GOOGLE_CLIENT_ID__: JSON.stringify(channel.syncGoogleClientId),
        }).apply(compiler);
      },
    });
    return config;
  },
};
