const { cpSync, existsSync, mkdirSync, readdirSync } = require('fs');
const { join } = require('path');

function exportMli() {
  const repoRoot = join(__dirname, '..', '..', '..');
  const srcOut = join(repoRoot, 'mli-select-complete', 'out');
  const destMli = join(__dirname, '..', 'public', 'mli-select');

  try {
    if (!existsSync(srcOut)) {
      console.log(`[mli] Source directory ${srcOut} not found. Creating empty destination directory.`);
      mkdirSync(destMli, { recursive: true });
      return;
    }

    console.log(`[mli] Exporting microsite from ${srcOut} to ${destMli}`);
    mkdirSync(destMli, { recursive: true });
    cpSync(srcOut, destMli, { recursive: true });
    console.log('[mli] Successfully exported microsite to /public/mli-select');

    if (existsSync(destMli)) {
      console.log('[mli] Verified destination directory contents:');
      const files = readdirSync(destMli);
      files.forEach(file => console.log(`- ${file}`));
    } else {
      console.error('[mli] Verification failed: Destination directory does not exist after copy.');
    }
  } catch (error) {
    console.error('[mli] An error occurred during the export process:', error);
    // Attempt to create an empty directory to prevent build failures
    if (!existsSync(destMli)) {
      mkdirSync(destMli, { recursive: true });
    }
  }
}

exportMli();
