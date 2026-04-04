const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.join(__dirname, '..');
const headerTemplateFile = path.join(repoRoot, 'src', 'userscript-header.txt');
const packageJsonFile = path.join(repoRoot, 'package.json');
const distFile = path.join(repoRoot, 'dist', 'timekeeper.js');
const userscriptFile = path.join(repoRoot, 'ts.user.js');
const stylesFile = path.join(repoRoot, 'dist', 'styles.js');

function readHeaderTemplate() {
  if (!fs.existsSync(headerTemplateFile)) {
    throw new Error('Header template src/userscript-header.txt was not found.');
  }
  return fs.readFileSync(headerTemplateFile, 'utf8').trim();
}

function readVersion() {
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

function ensureDistExists() {
  if (!fs.existsSync(distFile)) {
    throw new Error('dist/timekeeper.js does not exist. Did tsc run successfully?');
  }
  if (!fs.existsSync(stylesFile)) {
    throw new Error('dist/styles.js does not exist. Did tsc run successfully?');
  }
}

function getInlineStylesConstant() {
  const stylesSource = fs.readFileSync(stylesFile, 'utf8').trim();
  if (!stylesSource.startsWith('export const PANE_STYLES')) {
    throw new Error('Unable to locate exported PANE_STYLES in dist/styles.js');
  }
  // Replace the ES module export with a local const so the userscript remains self-contained.
  return stylesSource.replace(/^export\s+const/, 'const');
}

function buildUserscript() {
  ensureDistExists();

  const headerTemplate = readHeaderTemplate();
  const version = readVersion();
  const renderedHeader = headerTemplate.replace(/\$\{TIMEKEEPER_VERSION\}/g, version);

  const distContent = fs.readFileSync(distFile, 'utf8');
  const inlineStylesConst = getInlineStylesConstant();
  const bodyWithoutHeader = removeExistingHeader(distContent);
  const body = bodyWithoutHeader.replace(/import\s*\{\s*PANE_STYLES\s*\}\s*from\s*['"]\.\/styles['"];?\s*/, `${inlineStylesConst}\n\n`);
  const finalContent = `${renderedHeader}\n\n${body}`.replace(/\r\n/g, '\n');

  fs.writeFileSync(distFile, `${finalContent}\n`, 'utf8');
  fs.writeFileSync(userscriptFile, `${finalContent}\n`, 'utf8');
}

buildUserscript();
