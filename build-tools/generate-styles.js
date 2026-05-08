const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const repoRoot = path.join(__dirname, '..');
const cssSourceFile = path.join(repoRoot, 'src', 'styles.css');
const distDir = path.join(repoRoot, 'dist');
const cssMinifiedFile = path.join(distDir, 'styles.min.css');
const stylesFile = path.join(repoRoot, 'src', 'styles.ts');

function generateStyles() {
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
  execSync(`npx cleancss -o "${cssMinifiedFile}" "${cssSourceFile}"`, { cwd: repoRoot, stdio: 'inherit' });
  const minified = fs.readFileSync(cssMinifiedFile, 'utf8');
  fs.writeFileSync(
    stylesFile,
    `// Auto-generated from src/styles.css — do not edit directly\nexport const PANE_STYLES = ${JSON.stringify(minified)};\n`
  );
  console.log('✓ Generated src/styles.ts');
}

if (require.main === module) generateStyles();
module.exports = { generateStyles };
