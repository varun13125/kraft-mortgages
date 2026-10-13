import { firestore } from "@/lib/firebaseAdmin";

/**
 * Optional Prisma (Postgres) store, Firestore otherwise.
 *
 * BUG-034: the Prisma client is never generated in the build, so the old
 * `require("@prisma/client")` + `new PrismaClient()` at import time threw
 * ("did not initialize yet - run prisma generate") the moment DATABASE_URL was
 * set, crashing every route that imports this module. Prisma is now loaded only
 * when DATABASE_URL is set AND the generated client can be constructed; on any
 * failure we log once and fall back to Firestore.
 *
 * Callers must branch on `isPrismaEnabled()` (not on `process.env.DATABASE_URL`):
 *   if (isPrismaEnabled()) { await prisma.lead.create(...) } else { firestore()... }
 */
type DbClient = any;

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient__: DbClient | null | undefined;
}

let prismaLoadFailedLogged = false;

function loadPrismaClient(): DbClient | null {
  if (global.__prismaClient__ !== undefined) return global.__prismaClient__;
  let client: DbClient | null = null;
  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = require("@prisma/client");
      client = new PrismaClient();
    } catch (err) {
      client = null;
      if (!prismaLoadFailedLogged) {
        prismaLoadFailedLogged = true;
        console.error(
          "[db] DATABASE_URL is set but the Prisma client could not be loaded (was `prisma generate` run in the build?). Falling back to Firestore.",
          err instanceof Error ? err.message.split("\n")[0] : err
        );
      }
    }
  }
  // Cache in dev too (hot reload would otherwise create a new client per reload).
  global.__prismaClient__ = client;
  return client;
}

/** True when the Prisma client is available and should be used instead of Firestore. */
export function isPrismaEnabled(): boolean {
  return loadPrismaClient() !== null;
}

/**
 * The Prisma client when enabled, otherwise the Firestore instance (legacy
 * contract). Resolved lazily on first property access, so importing this module
 * never initialises a database client by itself.
 */
export const prisma: DbClient = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = loadPrismaClient() ?? firestore();
      const value = client[prop as keyof typeof client];
      return typeof value === "function" ? value.bind(client) : value;
    },
  }
);
