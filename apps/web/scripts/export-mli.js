// Simple exporter: copies public assets from mli-select-complete into web public under /mli
import { mkdirSync, cpSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const root = dirname(dirname(new URL(import.meta.url).pathname)); // apps/web
const repoRoot = dirname(root); // repo root

const srcOut = join(repoRoot, 'mli-select-complete', 'out');
const destMli = join(root, 'public', 'mli');

console.log('[mli] Source path:', srcOut);
console.log('[mli] Destination path:', destMli);

try {
  if (!existsSync(srcOut)) {
    console.log('[mli] out folder does not exist, skipping export');
    
    // List what exists in mli-select-complete
    const mliDir = join(repoRoot, 'mli-select-complete');
    if (existsSync(mliDir)) {
      console.log('[mli] Contents of mli-select-complete:', readdirSync(mliDir));
    }
    process.exit(0);
  }
  
  // List contents of out folder
  console.log('[mli] Contents of out folder:', readdirSync(srcOut));
  
  mkdirSync(destMli, { recursive: true });
  cpSync(srcOut, destMli, { recursive: true, force: true });
  
  // Verify copy worked
  if (existsSync(destMli)) {
    console.log('[mli] Successfully exported microsite to /public/mli');
    console.log('[mli] Exported files:', readdirSync(destMli));
  } else {
    console.log('[mli] Export failed - destination folder not created');
  }
} catch (e) {
  console.log('[mli] export failed:', e?.message || e);
}


