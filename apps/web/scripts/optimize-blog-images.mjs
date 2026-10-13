// Creates WebP versions of the blog images in public/images/blog-*.{png,jpg,jpeg}
// next to the originals (originals are kept — stored post HTML still points at them,
// and lib/utils/blog-content.ts rewrites those URLs to .webp at render time).
//
// Run from apps/web:
//   node scripts/optimize-blog-images.mjs           # convert new/changed images
//   node scripts/optimize-blog-images.mjs --force   # re-encode everything
//   node scripts/optimize-blog-images.mjs --check   # verify blog-content.ts list matches the files
//
// After adding a new blog image: run it, then add the printed file name to
// BLOG_WEBP_AVAILABLE in lib/utils/blog-content.ts (the --check mode lists any gap).
// Uses sharp (root devDependency; also resolvable from apps/web via Next).
import sharp from 'sharp';
import { readdir, stat, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');
const BLOG_CONTENT = path.join(ROOT, 'lib', 'utils', 'blog-content.ts');
const MAX_WIDTH = 1600; // article column is ~900 CSS px; 1600 covers 2x DPR at ~800px
const QUALITY = 80;
const SOURCE_RE = /^blog-.+\.(png|jpe?g)$/i;

const force = process.argv.includes('--force');
const checkOnly = process.argv.includes('--check');

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;
const exists = async (p) => stat(p).then(() => true, () => false);

const sources = (await readdir(IMAGES_DIR)).filter((f) => SOURCE_RE.test(f)).sort();
const webpName = (f) => f.replace(/\.(png|jpe?g)$/i, '.webp');

if (checkOnly) {
  const src = await readFile(BLOG_CONTENT, 'utf8');
  const block = src.match(/BLOG_WEBP_AVAILABLE[^[]*\[([\s\S]*?)\]/);
  const listed = new Set(block ? [...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1]) : []);
  let ok = true;
  for (const f of sources) {
    const hasWebp = await exists(path.join(IMAGES_DIR, webpName(f)));
    if (hasWebp && !listed.has(f)) { ok = false; console.log(`missing from BLOG_WEBP_AVAILABLE: '${f}'`); }
    if (!hasWebp && listed.has(f)) { ok = false; console.log(`listed but no .webp on disk: '${f}'`); }
  }
  for (const f of listed) {
    if (!sources.includes(f)) { ok = false; console.log(`listed but source image not found: '${f}'`); }
  }
  console.log(ok ? 'OK: BLOG_WEBP_AVAILABLE matches public/images.' : 'Mismatch (see above).');
  process.exit(ok ? 0 : 1);
}

let before = 0;
let after = 0;
const converted = [];
for (const f of sources) {
  const input = path.join(IMAGES_DIR, f);
  const output = path.join(IMAGES_DIR, webpName(f));
  const inStat = await stat(input);
  if (!force && (await exists(output)) && (await stat(output)).mtimeMs >= inStat.mtimeMs) {
    console.log(`skip  ${f} (webp up to date)`);
    converted.push(f);
    continue;
  }
  const info = await sharp(input)
    .rotate() // honour EXIF orientation
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(output);
  before += inStat.size;
  after += info.size;
  converted.push(f);
  console.log(`webp  ${f}  ${kb(inStat.size)} -> ${kb(info.size)}  (${info.width}x${info.height})`);
}

if (before) {
  console.log(`\nTotal: ${kb(before)} -> ${kb(after)} (${(100 - (after / before) * 100).toFixed(0)}% smaller)`);
}
console.log('\nBLOG_WEBP_AVAILABLE entries (lib/utils/blog-content.ts):');
for (const f of converted) console.log(`  '${f}',`);
