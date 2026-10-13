/**
 * Loads the app's TypeScript calculator modules under `node --test` with zero dependencies.
 *
 * Node >= 22.18 / 24 strips TypeScript types natively, but ESM resolution can't find
 * extensionless relative imports (`import { payment } from "./payment"` inside lib/calc/*.ts).
 * This registers an in-process resolve hook (node:module `registerHooks`, Node >= 22.15) that
 * retries such specifiers with ".ts", and marks .ts files as ES modules (apps/web/package.json
 * has no "type", which otherwise prints a MODULE_TYPELESS_PACKAGE_JSON warning).
 *
 * The modules under test must not use the "@/" path alias (lib/calc/* don't).
 * Import them dynamically AFTER this module has run:
 *   import { loadCalc } from "./_helpers/load.mjs";
 *   const P = await loadCalc("payment");
 */
import { registerHooks } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
/** apps/web */
export const APP_ROOT = path.resolve(here, "..", "..", "..");

const KEY = Symbol.for("kraft.tests.calc.tsHooks");
if (!globalThis[KEY]) {
  globalThis[KEY] = true;
  registerHooks({
    resolve(specifier, context, nextResolve) {
      try {
        return nextResolve(specifier, context);
      } catch (err) {
        const fromTs = context.parentURL && /\.tsx?$/.test(context.parentURL);
        if (fromTs && /^\.{1,2}\//.test(specifier) && !/\.[cm]?[jt]sx?$/.test(specifier)) {
          return nextResolve(specifier + ".ts", context);
        }
        throw err;
      }
    },
    load(url, context, nextLoad) {
      if (/\.ts$/.test(url) && url.startsWith("file:")) {
        return nextLoad(url, { ...context, format: "module-typescript" });
      }
      return nextLoad(url, context);
    },
  });
}

/** Import apps/web/lib/calc/<name>.ts */
export function loadCalc(name) {
  return import(pathToFileURL(path.join(APP_ROOT, "lib", "calc", `${name}.ts`)).href);
}

/** Import any apps/web-relative module path (must not use the "@/" alias at runtime). */
export function loadApp(relPath) {
  return import(pathToFileURL(path.join(APP_ROOT, relPath)).href);
}

/** assert |actual - expected| <= tol */
export function near(actual, expected, tol = 0.01, label = "") {
  if (!(Math.abs(actual - expected) <= tol)) {
    throw new Error(`${label ? label + ": " : ""}expected ${expected} ± ${tol}, got ${actual}`);
  }
}
