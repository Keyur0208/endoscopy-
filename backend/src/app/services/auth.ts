import bcrypt from 'bcrypt';
import crypto from 'crypto';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { User as PrismaUser } from '@prisma/client';
import { env } from '../../config/env';
import { AdminUserRecord, createAdminUser, findAdminUserByEmail, findAdminUserById, getAdminUser } from '../models/admin-user';
import { createAuthAccessToken } from '../models/auth-access-token';
import { prisma } from '../../config/database';
import { LoginInput, LoginResult, PublicUser, SeedAdminResult, SignupInput, UserType } from '../../config/types/auth';
import { AppError } from '../../utils/app-error';
import { extractOrgAndBranch } from '../../utils/ability_helper';

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

// In-memory store for pending OTP verifications keyed by formatted mobile number
export const TEMP_LOGIN: Record<string, { id: number; type: 'admin' | 'user' }> = {};

export const OtpType = {
  Login: 'login',
  ForgotPassword: 'forgot_password',
} as const;

export const OtpStatus = {
  Sent: 'sent',
} as const;

type AuthUserRecord = PrismaUser | AdminUserRecord;

const toPublicUser = (user: AuthUserRecord, userType: UserType): PublicUser => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  mobile: 'mobile' in user ? user.mobile : '',
  isAdmin: userType === 'admin',
  isActive: 'isActive' in user ? user.isActive : true,
  isOrganizationAdmin: 'isOrganizationAdmin' in user ? user.isOrganizationAdmin : false,
  isOtpRequired: 'isOtpRequired' in user ? user.isOtpRequired : false,
  canSwitchBranch: 'canSwitchBranch' in user ? user.canSwitchBranch : false,
  branchId: 'branchId' in user ? user.branchId : null,
  created_at: 'created_at' in user ? (user as AdminUserRecord).created_at : (user as PrismaUser).createdAt.toISOString(),
});

const createToken = (user: AuthUserRecord, userType: UserType, tokenId: string): string =>
  jwt.sign({ id: user.id, email: user.email, isAdmin: userType === 'admin', userType, tokenId }, env.jwtSecret, {
    expiresIn: '7d',
  });

export const login = async ({ email, password, resourceInfo }: LoginInput): Promise<LoginResult> => {
  const normalizedEmail = email.trim().toLowerCase();
  const adminUser = await findAdminUserByEmail(normalizedEmail);
  const regularUser = await (adminUser
    ? Promise.resolve(null)
    : prisma.user.findFirst({
      where: { email: normalizedEmail, isActive: true },
      include: { branch: { include: { organization: true } } },
    }));
  const user = adminUser ?? regularUser;
  const userType: UserType | undefined = adminUser ? 'admin' : regularUser ? 'user' : undefined;

  if (!user || !userType) {
    throw new AppError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  const currentDate = new Date()

  if (
    regularUser?.branch?.organization?.expiryDate &&
    new Date(regularUser.branch.organization.expiryDate) < currentDate
  ) {
    throw new AppError(401, 'Your account has expired. Please contact administrator.');
  }

  if (regularUser?.branch?.isActive === false) {
    throw new AppError(401, 'Your branch is inactive. Please contact administrator.');
  }

  if ('isActive' in user && !user.isActive) {
    throw new AppError(401, 'Your account is inactive. Please contact administrator.');
  }

  const tokenId = crypto.randomUUID();
  const tokenType = userType === 'admin' ? 'admin_token' : 'auth_token';
  const token = createToken(user, userType, tokenId);

  const resolvedResourceInfo: string[] = [
    ...(resourceInfo ?? []),
    ...(regularUser?.organizationId != null ? [`organization:${regularUser.organizationId}`] : []),
    ...(regularUser?.branchId != null ? [`branch:${regularUser.branchId}`] : []),
  ];

  await createAuthAccessToken({
    tokenId,
    actorId: user.id,
    userType,
    type: tokenType,
    token,
    resourceInfo: resolvedResourceInfo,
    expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MS).toISOString(),
  });

  return {
    token,
    user: toPublicUser(user, userType),
  };
};

export const seedDefaultAdmin = async (): Promise<SeedAdminResult> => {
  const adminUser = await getAdminUser();

  if (adminUser) {
    return {
      user: toPublicUser(adminUser, 'admin'),
      created: false,
    };
  }

  const hashedPassword = await bcrypt.hash(env.adminPassword, SALT_ROUNDS);

  const user = await createAdminUser({
    fullName: 'administrator',
    email: env.adminEmail,
    mobile: '',
    password: hashedPassword,
  });

  return {
    user: toPublicUser(user, 'admin'),
    created: true,
  };
};

export const sanitizeUser = (user: AuthUserRecord, userType: UserType): PublicUser => toPublicUser(user, userType);

// ---------------------------------------------------------------------------
// Admin-only login (with optional OTP flow)
// ---------------------------------------------------------------------------

export type AdminLoginResult =
  | { otpRequired: true; mobile: string; message: string }
  | { otpRequired: false; token: string; user: PublicUser };

const formatMobile = (mobile: string): string => {
  const digits = mobile.replace(/\D/g, '');
  return digits.startsWith('91') ? digits : `91${digits}`;
};

export const adminLogin = async ({
  email,
  password,
  abilities,
  enableOtp,
}: {
  email: string;
  password: string;
  abilities: string[];
  enableOtp: boolean;
}): Promise<AdminLoginResult> => {
  const normalizedEmail = email.trim().toLowerCase();
  const adminUser = await findAdminUserByEmail(normalizedEmail);

  if (!adminUser) {
    throw new AppError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, adminUser.password);

  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  if (enableOtp) {
    const mobile = formatMobile(adminUser.mobile);
    TEMP_LOGIN[mobile] = { id: adminUser.id, type: 'admin' };

    const { pcName } = extractOrgAndBranch(abilities);

    setImmediate(async () => {
      try {
        const otpResponse = await axios.post(`${env.otpServiceUrl}/send-otp`, {
          mobile,
          email: adminUser.email,
          branchName: 'Nilkanth Medico PVT.LTD.',
          pcName,
          otpType: OtpType.Login,
          adminUserId: adminUser.id,
          resourceInfo: abilities,
        });

        if (otpResponse.status === 200) {
          console.log(`OTP sent to ${mobile} — ${otpResponse.data?.message ?? ''}`);
        }
      } catch (err) {
        console.error('OTP API Error:', err);
      }
    });

    return {
      otpRequired: true,
      mobile,
      message: `OTP has been sent to ${mobile}${adminUser.email ? ' and ' + adminUser.email : ''}. Please verify to complete login.`,
    } as AdminLoginResult;
  }

  // OTP disabled — issue token immediately
  const tokenId = crypto.randomUUID();
  const token = createToken(adminUser, 'admin', tokenId);

  await createAuthAccessToken({
    tokenId,
    actorId: adminUser.id,
    userType: 'admin',
    type: 'admin_token',
    token,
    resourceInfo: abilities.length ? abilities : undefined,
    expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MS).toISOString(),
  });

  return {
    otpRequired: false,
    token,
    user: toPublicUser(adminUser, 'admin'),
  } as AdminLoginResult;
};

export const verifyAdminOtp = async ({
  mobile,
  otp,
}: {
  mobile: string;
  otp: string;
}) => {
  try {
    const formattedMobile = formatMobile(mobile);
    const verifyResponse = await axios.post(`${env.otpServiceUrl}/verify-otp`, {
      mobile: formattedMobile,
      otp,
    })

    const isVerificationSuccessful = verifyResponse.status === 200

    if (isVerificationSuccessful) {
      const pendingLogin = TEMP_LOGIN[formattedMobile];
      if (!pendingLogin) {
        throw new AppError(400, 'No pending login found for this mobile number');
      }

      const adminUser = await findAdminUserById(pendingLogin.id);
      if (!adminUser) {
        throw new AppError(404, 'Admin user not found');
      }
      const tokenId = crypto.randomUUID();
      const token = createToken(adminUser, 'admin', tokenId);
      await createAuthAccessToken({
        tokenId,
        actorId: adminUser.id,
        userType: 'admin',
        type: 'admin_token',
        token,
        expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MS).toISOString(),
      });

      delete TEMP_LOGIN[formattedMobile];

      return {
        success: true,
        token,
        user: toPublicUser(adminUser, 'admin'),
        message: 'OTP verified successfully. Login complete.',
      };
    } else {
      return {
        success: false,
        message: verifyResponse.data?.message || 'OTP verification failed',
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'error verifying OTP',
    };
  };
}

export const sendForgotPasswordOtp = async ({ email }: { email: string }) => {
  try {

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: { email: normalizedEmail, isActive: true },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const mobile = formatMobile(user.mobile);
    TEMP_LOGIN[mobile] = { id: user.id, type: 'user' };

    setImmediate(async () => {
      try {
        const otpResponse = await axios.post(`${env.otpServiceUrl}/send-otp`, {
          mobile,
          email: user.email,
          isforgot: true,
          otpType: OtpType.ForgotPassword,
          userId: user.id,
        });

        if (otpResponse.status === 200) {
          console.log(`Forgot-password OTP sent to ${mobile} — ${otpResponse.data?.message ?? ''}`);
        }
      } catch (err) {
        console.error('Forgot-password OTP send error:', err);
      }
    });

    return {
      message: `OTP has been sent to ${mobile}`,
      mobile,
    };
  }
  catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error sending OTP',
    };
  }
};

export const verifyForgotPasswordOtp = async ({
  mobile,
  otp,
  newPassword,
}: {
  mobile: string;
  otp: string;
  newPassword: string;
}) => {
  const formattedMobile = formatMobile(mobile);

  try {
    const verifyResponse = await axios.post(`${env.otpServiceUrl}/verify-otp`, {
      mobile: formattedMobile,
      otp,
    });

    const isVerificationSuccessful = verifyResponse.status === 200;

    if (!isVerificationSuccessful) {
      return {
        success: false,
        message: verifyResponse.data?.message || 'OTP verification failed',
      };
    }

    const session = TEMP_LOGIN[formattedMobile];
    if (!session) {
      throw new AppError(400, 'Session expired. Please request a new OTP.');
    }

    const user = await prisma.user.findUnique({ where: { id: session.id } });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    delete TEMP_LOGIN[formattedMobile];

    return {
      success: true,
      message: 'Password reset successfully',
    };
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid or expired OTP',
    };
  }
};