const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

const repoRoot = path.join(__dirname, '..');
const headerTemplateFile = path.join(repoRoot, 'src', 'userscript-header.txt');
const packageJsonFile = path.join(repoRoot, 'package.json');
const distDir = path.join(repoRoot, 'dist');
const userscriptFile = path.join(repoRoot, 'timekeeper.user.js');
const legacyUserscriptFile = path.join(repoRoot, 'ts.user.js');

function readHeaderTemplate() {
  if (!fs.existsSync(headerTemplateFile)) {
    throw new Error('Header template src/userscript-header.txt was not found.');
  }
  return fs.readFileSync(headerTemplateFile, 'utf8').trim();
}

function readVersion() {
  if (!fs.existsSync(packageJsonFile)) {
    throw new Error('package.json was not found.');
  }
  const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, 'utf8'));
  if (!packageJson.version) {
    throw new Error('Unable to read version from package.json');
  }
  return packageJson.version;
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

  // Bundle with esbuild
  await esbuild.build({
    entryPoints: [path.join(repoRoot, 'src', 'timekeeper.ts')],
    bundle: true,
    outfile: path.join(distDir, 'timekeeper.js'),
    format: 'iife',
    platform: 'browser',
    target: 'ES2020',
    external: ['GM', 'GM_info'],
  });

  const headerTemplate = readHeaderTemplate();
  const version = readVersion();
  const renderedHeader = headerTemplate.replace(/\$\{TIMEKEEPER_VERSION\}/g, version);

  const distContent = fs.readFileSync(path.join(distDir, 'timekeeper.js'), 'utf8');
  const bodyWithoutHeader = removeExistingHeader(distContent);
  const finalContent = `${renderedHeader}\n\n${bodyWithoutHeader}`.replace(/\r\n/g, '\n');

  fs.writeFileSync(path.join(distDir, 'timekeeper.js'), `${finalContent}\n`, 'utf8');
  fs.writeFileSync(userscriptFile, `${finalContent}\n`, 'utf8');
  fs.writeFileSync(legacyUserscriptFile, `${finalContent}\n`, 'utf8');

  console.log('✓ Built single bundled userscript to timekeeper.user.js and ts.user.js');
}

buildUserscript().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
