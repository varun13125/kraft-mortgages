// ESM loader: resolves extensionless relative imports to .ts/.js files.
// Node's default ESM resolver requires file extensions; this adds the TS fallback
// so lib/seo/jsonld.ts can import './business-config' (no extension).
export async function resolve(specifier, context, nextResolve) {
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && !/\.[a-z]+$/i.test(specifier)) {
    for (const ext of ['.ts', '.tsx', '.js', '.mjs']) {
      try {
        return await nextResolve(specifier + ext, context);
      } catch { /* try next extension */ }
    }
  }
  return nextResolve(specifier, context);
}
