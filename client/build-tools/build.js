const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execSync } = require('node:child_process');
const esbuild = require('esbuild');
const { syncVersion } = require('./sync-version');
const { syncGenerated } = require('./sync-generated');
const channels = require('./channels');

const repoRoot = path.join(__dirname, '..');
const srcDir = path.join(repoRoot, 'src');
const assetsDir = path.join(repoRoot, 'assets');
const headerTemplateFile = path.join(srcDir, 'userscript-header.txt');
const packageJsonFile = path.join(repoRoot, 'package.json');
const distDir = path.join(repoRoot, 'dist');
const publishRoot = path.join(repoRoot, '..');

// `node build-tools/build.js [--channel=<name>] [--watch]`; see channels.js
const channelName = (process.argv.find((a) => a.startsWith('--channel=')) || '--channel=main').split('=')[1];
const watchMode = process.argv.includes('--watch');
const channel = channels[channelName];
if (!channel) {
  console.error(`Unknown channel "${channelName}". Known: ${Object.keys(channels).join(', ')}`);
  process.exit(1);
}
const isMainChannel = channelName === 'main';
const userscriptDir = path.join(publishRoot, channel.outDir || '');
const userscriptFile = path.join(userscriptDir, channel.outputFile);
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

// Suffix for the version shown in the UI/logs (the short hash of the commit the build was made from).
function displaySuffix() {
  if (channel.buildStamp) return `${channel.buildSuffix}.${BUILD_NUMBER_PLACEHOLDER}`;
  if (channel.buildSuffix) return channel.buildSuffix;
  if (!channel.displayCommitHash) return '';
  return `+${execSync('git rev-parse --short HEAD', { cwd: repoRoot }).toString().trim()}`;
}

function channelVersion(baseVersion) {
  if (!channel.versionFromCommitCount) return baseVersion;
  const commits = execSync('git rev-list --count HEAD', { cwd: repoRoot }).toString().trim();
  return `${baseVersion}.${commits}`;
}

// Apply the channel's identity and self-update settings to the header.
function applyChannelHeader(header) {
  if (channel.scriptName) {
    header = header.replace(/^(\/\/ @name\s+).*$/m, `$1${channel.scriptName}`);
  }
  if (channel.selfUpdate === false) {
    return header.replace(/^\/\/ @(?:downloadURL|updateURL)\s.*\n/gm, '');
  }
  if (isMainChannel) return header;
  // Point the self-update URLs at the channel's branch and output file.
  return header.replace(
    /(@(?:downloadURL|updateURL)\s+https:\/\/raw\.githubusercontent\.com\/KamoTimestamps\/timekeeper\/)main\/timekeeper\.user\.js/g,
    `$1${channel.branch}/${channel.outputFile}`,
  );
}

function removeExistingHeader(content) {
  const headerPattern = /^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\s*/;
  return content.replace(headerPattern, '').trimStart();
}

// Build-stamped channels (see channels.js) bake a placeholder into the bundle. It is replaced
// after bundling, so a rebuild whose output is otherwise identical can be detected and skipped:
// the counter then only advances (and Violentmonkey only reloads) when something really changed.
const BUILD_NUMBER_PLACEHOLDER = '@@BUILD_NUMBER@@';
const BUILD_TIME_PLACEHOLDER = '@@BUILD_TIME@@';
const buildNumberFile = path.join(userscriptDir, 'build-number'); // persists across watcher restarts
let lastUnstampedHash;

// Returns the stamped content and its build number, or null if nothing changed since the last build.
function stampBuild(content) {
  const hash = crypto.createHash('sha1').update(content).digest('hex');
  if (hash === lastUnstampedHash) return null;
  lastUnstampedHash = hash;
  const previous = fs.existsSync(buildNumberFile) ? parseInt(fs.readFileSync(buildNumberFile, 'utf8'), 10) : 0;
  const buildNumber = (previous || 0) + 1;
  fs.writeFileSync(buildNumberFile, `${buildNumber}\n`, 'utf8');
  const stamped = content
    .replaceAll(BUILD_NUMBER_PLACEHOLDER, String(buildNumber))
    .replaceAll(BUILD_TIME_PLACEHOLDER, new Date().toISOString());
  return { content: stamped, buildNumber };
}

// Prepend the rendered header to the esbuild output and write the published file(s).
function writeUserscript(distContent) {
  const headerTemplate = readHeaderTemplate();
  const version = channelVersion(readVersion());
  const renderedHeader = applyChannelHeader(headerTemplate.replace(/\$\{TIMEKEEPER_VERSION\}/g, version));

  const bodyWithoutHeader = removeExistingHeader(distContent);
  let finalContent = `${renderedHeader}\n\n${bodyWithoutHeader}`.replace(/\r\n/g, '\n');

  let buildNote = '';
  if (channel.buildStamp) {
    fs.mkdirSync(userscriptDir, { recursive: true });
    const stamped = stampBuild(finalContent);
    if (!stamped) {
      console.log('· Output unchanged; skipped');
      return;
    }
    finalContent = stamped.content;
    buildNote = ` build ${stamped.buildNumber}`;
  }

  fs.writeFileSync(path.join(distDir, 'timekeeper.js'), `${finalContent}\n`, 'utf8');
  fs.mkdirSync(userscriptDir, { recursive: true });
  fs.writeFileSync(userscriptFile, `${finalContent}\n`, 'utf8');
  if (isMainChannel) fs.writeFileSync(legacyUserscriptFile, `${finalContent}\n`, 'utf8');

  console.log(`✓ Built ${channelName} userscript (v${version}${buildNote}) to ${path.join(channel.outDir || '', channel.outputFile)}${isMainChannel ? ' and ts.user.js' : ''}`);
}

const writeUserscriptPlugin = {
  name: 'write-userscript',
  setup(build) {
    build.onEnd((result) => {
      if (result.errors.length) return;
      try {
        // esbuild runs with write:false, so the raw bundle is never read back from the stamped dist file.
        writeUserscript(result.outputFiles[0].text);
      } catch (err) {
        console.error('Writing userscript failed:', err);
        if (!watchMode) process.exitCode = 1;
      }
    });
  },
};

const buildOptions = {
  entryPoints: [path.join(srcDir, 'timekeeper.ts')],
  bundle: true,
  outfile: path.join(distDir, 'timekeeper.js'),
  write: false,
  format: 'iife',
  platform: 'browser',
  target: 'ES2020',
  external: ['GM', 'GM_info'],
  minify: channel.minify !== false,
  loader: {
    '.svg': 'text',
  },
  define: {
    __BUILD_SUFFIX__: JSON.stringify(displaySuffix()),
    __BUILD_TIME__: JSON.stringify(channel.buildStamp ? BUILD_TIME_PLACEHOLDER : ''),
    __SYNC_API_URL__: JSON.stringify(channel.syncApiUrl),
    __SYNC_GOOGLE_CLIENT_ID__: JSON.stringify(channel.syncGoogleClientId),
  },
  plugins: [writeUserscriptPlugin],
};

// Sync version from package.json to src/version.ts and manifest.json, and regenerate
// src/styles.ts and src/header-icons.ts from their sources so the bundle can never ship
// stale CSS or icons.
function syncSources() {
  syncVersion();
  syncGenerated();
}

async function buildUserscript() {
  fs.mkdirSync(distDir, { recursive: true });
  syncSources();
  await esbuild.build(buildOptions);
}

// esbuild only watches the files it bundles, so the sources that feed the generated files and
// the header (CSS, icons, header template, package.json) are watched here and trigger a full
// resync + rebuild.
async function watchUserscript() {
  fs.mkdirSync(distDir, { recursive: true });
  syncSources();
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();

  const triggers = new Set(['styles.css', 'userscript-header.txt', 'package.json']);
  let timer;
  const onChange = (_event, fileName) => {
    if (fileName && !triggers.has(fileName) && !fileName.endsWith('.png')) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        syncSources();
        ctx.rebuild().catch(() => {}); // esbuild already logged the errors
      } catch (err) {
        console.error('Resync failed:', err);
      }
    }, 50);
  };
  for (const dir of [srcDir, assetsDir, repoRoot]) fs.watch(dir, onChange);

  console.log(`Watching ${channelName} channel; Ctrl-C to stop.`);
  if (channelName === 'local') {
    console.log(`Install once in Violentmonkey: http://localhost:${process.env.DEV_PORT || 8765}/timekeeper.local.user.js`);
    console.log('Click "Track external edits", tick "Reload tab", and keep that installer tab open.');
  }
}

(watchMode ? watchUserscript() : buildUserscript()).catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
