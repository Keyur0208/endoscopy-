import { AuthAccessToken as PrismaAuthAccessToken } from '@prisma/client';
import { DatabaseClient, prisma } from '../../config/database';
import { UserType } from '../../config/types/auth';

export type AuthTokenType = 'auth_token' | 'admin_token';

export interface AuthAccessTokenRecord {
  id: number;
  tokenId: string;
  actorId: number;
  userType: UserType;
  type: AuthTokenType;
  token: string;
  resourceInfo: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAuthAccessTokenInput {
  tokenId: string;
  actorId: number;
  userType: UserType;
  type: AuthTokenType;
  token: string;
  resourceInfo?: string[];
  expiresAt?: string | null;
}

const parseResourceInfo = (value: string | null): string[] => {
  if (!value) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(value) as unknown;

    return Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
};

const mapAuthAccessToken = (record: PrismaAuthAccessToken): AuthAccessTokenRecord => ({
  id: record.id,
  tokenId: record.tokenId,
  actorId: record.actorId,
  userType: record.userType as UserType,
  type: record.type as AuthTokenType,
  token: record.token,
  resourceInfo: parseResourceInfo(record.ability),
  lastUsedAt: record.lastUsedAt ? record.lastUsedAt.toISOString() : null,
  expiresAt: record.expiresAt ? record.expiresAt.toISOString() : null,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});

export const createAuthAccessToken = async (
  payload: CreateAuthAccessTokenInput,
  dbClient: DatabaseClient = prisma
): Promise<AuthAccessTokenRecord> =>
  mapAuthAccessToken(
    await dbClient.authAccessToken.create({
      data: {
        tokenId: payload.tokenId,
        actorId: payload.actorId,
        userType: payload.userType,
        type: payload.type,
        token: payload.token,
        ability: JSON.stringify(payload.resourceInfo ?? []),
        lastUsedAt: new Date(),
        expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null,
      },
    })
  );

export const findAuthAccessTokenByTokenId = async (
  tokenId: string,
  dbClient: DatabaseClient = prisma
): Promise<AuthAccessTokenRecord | undefined> =>
  dbClient.authAccessToken.findUnique({ where: { tokenId } }).then((record) => (record ? mapAuthAccessToken(record) : undefined));

export const touchAuthAccessToken = async (tokenId: string, dbClient: DatabaseClient = prisma): Promise<void> => {
  await dbClient.authAccessToken.updateMany({
    where: { tokenId },
    data: {
      lastUsedAt: new Date(),
    },
  });
};