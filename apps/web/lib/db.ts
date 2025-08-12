import { firestore } from "@/lib/firebaseAdmin";

type DbClient = any | ReturnType<typeof firestore>;

declare global {
  // eslint-disable-next-line no-var
  var __db__: DbClient | undefined;
}

function createClient(): DbClient {
  if (process.env.DATABASE_URL) {
    // Only import PrismaClient if DATABASE_URL is set
    const { PrismaClient } = require("@prisma/client");
    return new PrismaClient();
  }
  return firestore();
}

export const prisma = (global.__db__ ?? createClient()) as any;
if (process.env.NODE_ENV !== "production") global.__db__ = prisma;
