import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

const siteDir = 'apps/web/app/(site)';
const files = globSync(`${siteDir}/**/page.tsx`, { absolute: true });
let modified = 0;

for (const file of files) {
  let content = readFileSync(file, 'utf8');
  const original = content;

  // Remove import lines
  content = content.replace(/import Navigation from ["']@\/components\/Navigation["'];?\n?/g, '');
  content = content.replace(/import Footer from ["']@\/components\/Footer["'];?\n?/g, '');

  // Remove JSX self-closing tags (with optional whitespace/newlines around them)
  content = content.replace(/\s*<Navigation\s*\/>\s*\n?/g, '\n');
  content = content.replace(/\s*<Footer\s*\/>\s*\n?/g, '\n');

  // Clean up multiple blank lines left behind
  content = content.replace(/\n{3,}/g, '\n\n');

  if (content !== original) {
    writeFileSync(file, content);
    modified++;
    console.log(`✓ ${file.replace(process.cwd() + '/', '')}`);
  }
}

console.log(`\nDone. Modified ${modified} of ${files.length} page files.`);
