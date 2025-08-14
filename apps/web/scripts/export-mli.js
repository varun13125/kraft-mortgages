// Simple exporter: copies public assets from mli-select-complete into web public under /mli-select
import { mkdirSync, cpSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Fix for ES modules to get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const root = dirname(__dirname); // apps/web (from scripts folder)
const repoRoot = dirname(dirname(root)); // repo root (from apps folder)

const srcOut = join(repoRoot, 'mli-select-complete', 'out');
const destMli = join(root, 'public', 'mli-select');

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
    
    // Create empty destination directory so the route handler doesn't fail
    mkdirSync(destMli, { recursive: true });
    console.log('[mli] Created empty destination directory for future use');
    process.exit(0);
  }
  
  // List contents of out folder
  console.log('[mli] Contents of out folder:', readdirSync(srcOut));
  
  mkdirSync(destMli, { recursive: true });
  cpSync(srcOut, destMli, { recursive: true, force: true });
  
  // Verify copy worked
  if (existsSync(destMli)) {
    console.log('[mli] Successfully exported microsite to /public/mli-select');
    console.log('[mli] Exported files:', readdirSync(destMli));
  } else {
    console.log('[mli] Export failed - destination folder not created');
  }
} catch (e) {
  console.log('[mli] export failed:', e?.message || e);
  // Create empty destination directory so the route handler doesn't fail
  try {
    mkdirSync(destMli, { recursive: true });
    console.log('[mli] Created empty destination directory after error');
  } catch (createError) {
    console.log('[mli] Failed to create destination directory:', createError?.message || createError);
  }
}