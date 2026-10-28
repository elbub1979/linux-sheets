import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname);
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const stripModuleSyntax = (src) => src
  .replace(/^import\s[\s\S]*?from\s+'[^']+';\s*$/gm, '')
  .replace(/^export\s+(const|function|let)\s/gm, '$1 ');

const js = stripModuleSyntax(read('src/app.js'));
const css = read('src/styles.css');
const html = read('index.html')
  .replace('<link rel="stylesheet" href="src/styles.css">', `<style>\n${css}\n</style>`)
  .replace('<script type="module" src="src/app.js"></script>', '')
  .replace(/\s*<link rel="(manifest|apple-touch-icon)"[^>]*>/g, '')
  .replace(/\s*<meta name="theme-color"[^>]*>/g, '')
  .replace('</body>', `<script>\n${js.replace(/<\/script/gi, '<\\/script')}\n</script>\n</body>`);

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const out = path.join(root, 'dist/linux-ref.html');
fs.writeFileSync(out, html);
console.log(`Собрано: ${out} (${(html.length / 1024).toFixed(0)} КБ)`);
