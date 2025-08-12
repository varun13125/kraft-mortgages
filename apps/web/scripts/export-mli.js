// Simple exporter: copies public assets from mli-select-complete into web public under /mli
import { mkdirSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const root = dirname(dirname(new URL(import.meta.url).pathname)); // apps/web
const repoRoot = dirname(root); // repo root

const srcOut = join(repoRoot, 'mli-select-complete', 'out');
const destMli = join(root, 'public', 'mli');

try {
  if (!existsSync(srcOut)) {
    console.log('[mli] out folder does not exist, skipping export');
    process.exit(0);
  }
  
  mkdirSync(destMli, { recursive: true });
  cpSync(srcOut, destMli, { recursive: true });
  console.log('[mli] Exported microsite to /public/mli');
} catch (e) {
  console.log('[mli] export failed:', e?.message);
}


