import fs from 'fs';
import path from 'path';
import { Prisma, PrismaClient } from '@prisma/client';
import { env } from './env';

const resolvedDbPath = path.resolve(process.cwd(), env.dbPath);
fs.mkdirSync(path.dirname(resolvedDbPath), { recursive: true });

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: env.databaseUrl,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export type DatabaseClient = PrismaClient | Prisma.TransactionClient;

export const initializeDatabase = async (): Promise<void> => {
  await prisma.$connect();
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON');
};
