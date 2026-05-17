import fs from 'fs'
import path from 'path'

import { PrismaClient, Prisma } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

import { env } from './env'

const resolvedDbPath = path.resolve(process.cwd(), env.dbPath)

fs.mkdirSync(path.dirname(resolvedDbPath), {
  recursive: true,
})

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
}

const adapter = new PrismaBetterSqlite3({
  url: env.databaseUrl,
})

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export type DatabaseClient =
  | PrismaClient
  | Prisma.TransactionClient

export const initializeDatabase = async (): Promise<void> => {
  await prisma.$connect()
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON')
}