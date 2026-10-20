import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { APP_ROOT, loadApp } from './_helpers/load.mjs';
const { calculatorCatalog } = await loadApp('lib/calculators/catalog.ts');
test('public calculator directory includes every leaf calculator exactly once', () => {
  const root = path.join(APP_ROOT, 'app', '(site)'), routes = [];
  function walk(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name === 'page.tsx') { const route = '/' + path.relative(root, dir).split(path.sep).join('/'); if (/\/calculators\/[^/]+$/.test(route)) routes.push(route); }
  } }
  walk(root);
  assert.deepEqual(calculatorCatalog.map(c => c.href).sort(), routes.sort());
  assert.equal(new Set(calculatorCatalog.map(c => c.href)).size, routes.length);
});
