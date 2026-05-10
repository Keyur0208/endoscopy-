import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const toAbsoluteSqliteUrl = (filePath: string): string => {
  const resolvedPath = path.resolve(process.cwd(), filePath).replace(/\\/g, '/');

  return `file:${resolvedPath}`;
};

const normalizeSqliteUrl = (value: string): string => {
  if (!value.startsWith('file:')) {
    return toAbsoluteSqliteUrl(value);
  }

  const filePath = value.slice('file:'.length);

  // Convert relative SQLite URLs from .env into an absolute URL Prisma can open on Windows.
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return toAbsoluteSqliteUrl(filePath);
  }

  return value.replace(/\\/g, '/');
};

const dbPath = process.env.DB_PATH || './data/app.db';
const databaseUrl = normalizeSqliteUrl(process.env.DATABASE_URL || dbPath);

process.env.DATABASE_URL = databaseUrl;

export const env = {
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
  dbPath,
  databaseUrl,
  adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'change-this-password',
  enableAdminOtp: process.env.ENABLE_ADMIN_OTP || 'false',
  otpServiceUrl: process.env.OTP_SERVICE_URL || 'http://localhost:4000',
  ffmpegBin: process.env.FFMPEG_PATH || 'ffmpeg',
};