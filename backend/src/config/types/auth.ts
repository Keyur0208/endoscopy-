import { Request } from 'express';

export type UserType = 'admin' | 'user';

export interface SignupInput {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
  resourceInfo?: string[];
}

export interface PublicUser {
  id: number;
  fullName: string | null;
  email: string;
  mobile: string;
  isAdmin: boolean;
  isActive?: boolean;
  isOrganizationAdmin?: boolean;
  isOtpRequired?: boolean;
  canSwitchBranch?: boolean;
  branchId?: number | null;
  created_at: string;
}

export interface AuthenticatedUser {
  id: number;
  fullName: string | null;
  email: string;
  isAdmin: boolean;
  userType: UserType;
  tokenId: string;
  tokenType: 'auth_token' | 'admin_token';
  resourceInfo: string[];
  branchId?: number | null;
  organizationId?: number | null;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface SeedAdminResult {
  user: PublicUser;
  created: boolean;
}

export interface LoginResult {
  token: string;
  user: PublicUser;
}