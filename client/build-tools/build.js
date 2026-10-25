const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');
const esbuild = require('esbuild');
const { syncVersion } = require('./sync-version');
const { syncGenerated } = require('./sync-generated');
const channels = require('./channels');

const repoRoot = path.join(__dirname, '..');
const headerTemplateFile = path.join(repoRoot, 'src', 'userscript-header.txt');
const packageJsonFile = path.join(repoRoot, 'package.json');
const distDir = path.join(repoRoot, 'dist');
const publishRoot = path.join(repoRoot, '..');

// `node build-tools/build.js [--channel=<name>]`; see channels.js
const channelName = (process.argv.find((a) => a.startsWith('--channel=')) || '--channel=main').split('=')[1];
const channel = channels[channelName];
if (!channel) {
  console.error(`Unknown channel "${channelName}". Known: ${Object.keys(channels).join(', ')}`);
  process.exit(1);
}
const isMainChannel = channelName === 'main';
const userscriptFile = path.join(publishRoot, channel.outputFile);
const legacyUserscriptFile = path.join(publishRoot, 'ts.user.js');

function readHeaderTemplate() {
  if (!fs.existsSync(headerTemplateFile)) {
    throw new Error('Header template src/userscript-header.txt was not found.');
  }
  return fs.readFileSync(headerTemplateFile, 'utf8').trim();
}

function readVersion() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, 'utf8'));
  return packageJson.version;
}

function channelVersion(baseVersion) {
  if (!channel.versionFromCommitCount) return baseVersion;
  const commits = execSync('git rev-list --count HEAD', { cwd: repoRoot }).toString().trim();
  return `${baseVersion}.${commits}`;
}

// Point the self-update URLs at the channel's branch and output file.
function applyChannelUrls(header) {
  if (isMainChannel) return header;
  return header.replace(
    /(@(?:downloadURL|updateURL)\s+https:\/\/raw\.githubusercontent\.com\/KamoTimestamps\/timekeeper\/)main\/timekeeper\.user\.js/g,
    `$1${channel.branch}/${channel.outputFile}`,
  );
}

function removeExistingHeader(content) {
  const headerPattern = /^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\s*/;
  return content.replace(headerPattern, '').trimStart();
}

async function buildUserscript() {
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Sync version from package.json to src/version.ts and manifest.json
  syncVersion();

  // Regenerate src/styles.ts and src/header-icons.ts from their sources so the bundle
  // can never ship stale CSS or icons
  syncGenerated();

  // Bundle with esbuild
  await esbuild.build({
    entryPoints: [path.join(repoRoot, 'src', 'timekeeper.ts')],
    bundle: true,
    outfile: path.join(distDir, 'timekeeper.js'),
    format: 'iife',
    platform: 'browser',
    target: 'ES2020',
    external: ['GM', 'GM_info'],
    minify: true,
    loader: {
      '.svg': 'text',
    },
    define: {
      __SYNC_API_URL__: JSON.stringify(channel.syncApiUrl),
      __SYNC_GOOGLE_CLIENT_ID__: JSON.stringify(channel.syncGoogleClientId),
    },
  });

  const headerTemplate = readHeaderTemplate();
  const version = channelVersion(readVersion());
  const renderedHeader = applyChannelUrls(headerTemplate.replace(/\$\{TIMEKEEPER_VERSION\}/g, version));

  const distContent = fs.readFileSync(path.join(distDir, 'timekeeper.js'), 'utf8');
  const bodyWithoutHeader = removeExistingHeader(distContent);
  const finalContent = `${renderedHeader}\n\n${bodyWithoutHeader}`.replace(/\r\n/g, '\n');

  fs.writeFileSync(path.join(distDir, 'timekeeper.js'), `${finalContent}\n`, 'utf8');
  fs.writeFileSync(userscriptFile, `${finalContent}\n`, 'utf8');
  if (isMainChannel) fs.writeFileSync(legacyUserscriptFile, `${finalContent}\n`, 'utf8');

  console.log(`✓ Built ${channelName} userscript (v${version}) to ${channel.outputFile}${isMainChannel ? ' and ts.user.js' : ''}`);
}

buildUserscript().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
