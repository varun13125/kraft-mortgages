// Simple exporter: copies public assets from mli-select-complete into web public under /mli
import { mkdirSync, cpSync } from 'node:fs';
import { join, dirname } from 'node:path';

const root = dirname(dirname(new URL(import.meta.url).pathname)); // apps/web
const repoRoot = dirname(root); // repo root

const srcOut = join(repoRoot, 'mli-select-complete', 'out');
const destPublic = join(root, 'public');

try {
  mkdirSync(destPublic, { recursive: true });
  cpSync(srcOut, destPublic, { recursive: true });
  console.log('[mli] Exported microsite to /public');
} catch (e) {
  console.log('[mli] export failed:', e?.message);
}


