/**
 * Zero-dependency resolver for running the app's TypeScript modules under `node --test`.
 *
 * Node >= 22.18 / 23.6 strips TypeScript types natively, but it cannot resolve the
 * `@/` path alias (tsconfig `paths`) or extensionless relative imports (`./payment`).
 * This registers an in-process synchronous resolve hook (node:module `registerHooks`,
 * Node >= 22.15) that maps:
 *   "@/lib/calc/payment"  -> <apps/web>/lib/calc/payment.ts
 *   "./payment" (from a .ts file) -> ./payment.ts
 * Everything else falls through to Node's default resolver. No loader flags, no packages.
 *
 * Usage (must run BEFORE the modules under test are resolved, so import them dynamically):
 *   import { importApp } from "./helpers/register-ts-paths.mjs";
 *   const mli = await importApp("lib/mli/calcs.ts");
 */
import { registerHooks } from "node:module";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
/** apps/web (tests/specialty/helpers -> ../../..) */
export const APP_ROOT = path.resolve(here, "..", "..", "..");

const EXTENSIONS = [".ts", ".tsx", ".mts", ".js", ".mjs"];

function isFile(p) {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
}

function resolveFile(base) {
  if (isFile(base)) return base;
  for (const ext of EXTENSIONS) if (isFile(base + ext)) return base + ext;
  if (existsSync(base)) {
    for (const ext of EXTENSIONS) {
      const idx = path.join(base, "index" + ext);
      if (isFile(idx)) return idx;
    }
  }
  return null;
}

/** App .ts files use ESM syntax but apps/web/package.json has no "type"; say so up front. */
function withFormat(url) {
  return /\.(ts|mts)$/.test(url)
    ? { url, format: "module-typescript", shortCircuit: true }
    : { url, shortCircuit: true };
}

const STATE_KEY = Symbol.for("kraft.tests.registerTsPaths");
if (!globalThis[STATE_KEY]) {
  globalThis[STATE_KEY] = true;
  registerHooks({
    resolve(specifier, context, nextResolve) {
      if (specifier.startsWith("@/")) {
        const file = resolveFile(path.join(APP_ROOT, specifier.slice(2)));
        if (file) return withFormat(pathToFileURL(file).href);
      } else if (
        (specifier.startsWith("./") || specifier.startsWith("../")) &&
        context.parentURL?.startsWith("file:") &&
        /\.(ts|tsx|mts)$/.test(context.parentURL) &&
        !path.extname(specifier)
      ) {
        const parentDir = path.dirname(fileURLToPath(context.parentURL));
        const file = resolveFile(path.resolve(parentDir, specifier));
        if (file) return withFormat(pathToFileURL(file).href);
      }
      const result = nextResolve(specifier, context);
      if (result?.url && /\.(ts|mts)$/.test(result.url) && !result.format) {
        return { ...result, format: "module-typescript" };
      }
      return result;
    },
  });
}

/** Dynamically import an app module by its path relative to apps/web. */
export function importApp(relPath) {
  return import(pathToFileURL(path.join(APP_ROOT, relPath)).href);
}
