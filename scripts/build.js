const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
const { execSync } = require('node:child_process');

const repoRoot = path.join(__dirname, '..');
const headerTemplateFile = path.join(repoRoot, 'src', 'userscript-header.txt');
const packageJsonFile = path.join(repoRoot, 'package.json');
const distDir = path.join(repoRoot, 'dist');
const userscriptFile = path.join(repoRoot, 'timekeeper.user.js');
const legacyUserscriptFile = path.join(repoRoot, 'ts.user.js');
const cssSourceFile = path.join(repoRoot, 'src', 'styles.css');
const cssMinifiedFile = path.join(distDir, 'styles.min.css');

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

function minifyCSS() {
  console.log('Minifying CSS...');
  // Use cleancss to minify the CSS file
  execSync(`npx cleancss -o "${cssMinifiedFile}" "${cssSourceFile}"`, {
    cwd: repoRoot,
    stdio: 'inherit'
  });
  console.log('✓ CSS minified');
}

// esbuild plugin to inject minified CSS
const injectCSSPlugin = {
  name: 'inject-css',
  setup(build) {
    // Intercept imports that end with .css or resolve to styles.css
    build.onResolve({ filter: /\.css$/ }, args => {
      // Check if this is our styles.css import
      if (args.path === './styles.css' || args.path.endsWith('/styles.css')) {
        return { path: cssMinifiedFile, namespace: 'inject-css' };
      }
      return null;
    });
    build.onLoad({ filter: /.*/, namespace: 'inject-css' }, async () => {
      const css = fs.readFileSync(cssMinifiedFile, 'utf8');
      // Return as a JS module that exports the CSS string
      return {
        contents: `export const PANE_STYLES = ${JSON.stringify(css)};`,
        loader: 'js'
      };
    });
  }
};

async function buildUserscript() {
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Minify CSS first
  minifyCSS();

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
    plugins: [injectCSSPlugin],
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
