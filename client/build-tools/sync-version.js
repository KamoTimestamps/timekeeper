const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.join(__dirname, '..');
const packageJsonFile = path.join(repoRoot, 'package.json');
const versionFile = path.join(repoRoot, 'src', 'version.ts');
const manifestFile = path.join(repoRoot, 'manifest.json');

// Skip unchanged writes so a file watcher on src/ doesn't retrigger itself.
function writeIfChanged(file, content) {
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) return;
  fs.writeFileSync(file, content, 'utf8');
}

function syncVersion() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, 'utf8'));
  const version = packageJson.version;
  if (!version) {
    throw new Error('Unable to read version from package.json');
  }

  writeIfChanged(versionFile, `export const TIMEKEEPER_VERSION = '${version}';\n`);

  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  manifest.version = version;
  writeIfChanged(manifestFile, JSON.stringify(manifest, null, 2) + '\n');

  console.log(`✓ Synced version ${version} to src/version.ts and manifest.json`);
  return version;
}

module.exports = { syncVersion };

if (require.main === module) {
  syncVersion();
}
