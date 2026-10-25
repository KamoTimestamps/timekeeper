const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.join(__dirname, '..');
const srcDir = path.join(repoRoot, 'src');
const assetsDir = path.join(repoRoot, 'assets');

const stylesCssFile = path.join(srcDir, 'styles.css');
const stylesTsFile = path.join(srcDir, 'styles.ts');
const headerIconsTsFile = path.join(srcDir, 'header-icons.ts');

const HEADER_ICONS = {
  HEADER_ICON_DEFAULT_URL: 'Kamo_64px_Indexed.png',
  HEADER_ICON_HOVER_URL: 'Kamo_Eyebrow_64px_Indexed.png',
};

function writeIfChanged(file, content) {
  const existing = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (existing === content) return false;
  fs.writeFileSync(file, content, 'utf8');
  return true;
}

// src/styles.ts is the CSS shipped inside the bundle; styles.css is the source of truth.
function syncStyles() {
  const css = fs.readFileSync(stylesCssFile, 'utf8');
  const content =
    '// CSS styles are generated from src/styles.css by build-tools/sync-generated.js\n' +
    '// Edit src/styles.css to modify styles\n' +
    `export const PANE_STYLES = ${JSON.stringify(css)};\n`;
  const changed = writeIfChanged(stylesTsFile, content);
  console.log(`✓ ${changed ? 'Synced' : 'Verified'} src/styles.ts from src/styles.css`);
}

// Header icons are inlined as data URIs so the page never fetches them from GitHub
// (no network request, no cross-origin preload failures inside userscript sandboxes).
function syncHeaderIcons() {
  const lines = [
    '// Generated from assets/*.png by build-tools/sync-generated.js — do not edit by hand',
  ];
  for (const [name, fileName] of Object.entries(HEADER_ICONS)) {
    const base64 = fs.readFileSync(path.join(assetsDir, fileName)).toString('base64');
    lines.push(`export const ${name} = "data:image/png;base64,${base64}";`);
  }
  const changed = writeIfChanged(headerIconsTsFile, lines.join('\n') + '\n');
  console.log(`✓ ${changed ? 'Synced' : 'Verified'} src/header-icons.ts from assets/`);
}

function syncGenerated() {
  syncStyles();
  syncHeaderIcons();
}

module.exports = { syncGenerated, syncStyles, syncHeaderIcons };

if (require.main === module) {
  syncGenerated();
}
