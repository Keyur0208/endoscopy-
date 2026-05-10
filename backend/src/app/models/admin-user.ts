import { AdminUser as PrismaAdminUser } from '@prisma/client';
import { DatabaseClient, prisma } from '../../config/database';

export interface AdminUserRecord {
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  isAdmin: boolean;
  created_at: string;
}

export interface CreateAdminUserInput {
  fullName: string;
  email: string;
  mobile?: string;
  password: string;
}

const mapAdminUserRecord = (record: PrismaAdminUser): AdminUserRecord => ({
  id: record.id,
  fullName: record.name,
  email: record.email,
  mobile: record.mobile,
  password: record.password,
  isAdmin: record.isAdmin,
  created_at: record.createdAt.toISOString(),
});

export const createAdminUser = async (
  payload: CreateAdminUserInput,
  dbClient: DatabaseClient = prisma
): Promise<AdminUserRecord> =>
  mapAdminUserRecord(
    await dbClient.adminUser.create({
      data: {
        name: payload.fullName,
        email: payload.email,
        mobile: payload.mobile || '',
        password: payload.password,
        isAdmin: true,
        resourceInfo: null,
      },
    })
  );

export const findAdminUserByEmail = async (
  email: string,
  dbClient: DatabaseClient = prisma
): Promise<AdminUserRecord | undefined> =>
  dbClient.adminUser.findUnique({ where: { email } }).then((record) => (record ? mapAdminUserRecord(record) : undefined));

export const findAdminUserById = async (
  id: number,
  dbClient: DatabaseClient = prisma
): Promise<AdminUserRecord | undefined> =>
  dbClient.adminUser.findUnique({ where: { id } }).then((record) => (record ? mapAdminUserRecord(record) : undefined));

export const getAdminUser = async (dbClient: DatabaseClient = prisma): Promise<AdminUserRecord | undefined> =>
  dbClient.adminUser
    .findFirst({
      orderBy: { createdAt: 'asc' },
    })
    .then((record) => (record ? mapAdminUserRecord(record) : undefined));