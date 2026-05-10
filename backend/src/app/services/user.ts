import bcrypt from 'bcrypt';
import { findAdminUserById } from '../models/admin-user';
import { prisma } from '../../config/database';
import { AuthenticatedUser, PublicUser, UserType } from '../../config/types/auth';
import { ICreateUser, IUpdateUser } from '../../config/types/user';
import { AppError } from '../../utils/app-error';
import { MESSAGES } from '../../utils/messages';
import { applyBranchScope } from '../../utils/model_helper';
import { extractOrgAndBranch } from '../../utils/ability_helper';

const SALT_ROUNDS = 10;

export const getCurrentUser = async (requester: AuthenticatedUser) => {
  try {
    const { id: userId, userType, resourceInfo } = requester;
    const abilities = resourceInfo ?? [];
    const { orgId: organizationId, branchId } = extractOrgAndBranch(abilities);

    if (userType === 'admin') {
      const adminUser = await findAdminUserById(userId);
      if (!adminUser) throw new AppError(404, MESSAGES.USER_NOT_FOUND);

      return {
        success: true,
        user: {
          id: adminUser.id,
          fullName: adminUser.fullName,
          email: adminUser.email,
          mobile: adminUser.mobile,
          isAdmin: true,
          created_at: adminUser.created_at,
        },
        abilities,
        organizationId,
        branchId,
        currentBranch: null,
        message: MESSAGES.USER_FETCHED_SUCCESSFULLY,
      };
    }

    const user = await prisma.user.findFirst({
      where: { id: userId, isActive: true },
      include: {
        branch: { include: { organization: true } },
        organization: true,
      },
    });
    if (!user) throw new AppError(404, MESSAGES.USER_NOT_FOUND);

    let currentBranch = null;
    if (branchId) {
      currentBranch = await prisma.branch.findFirst({ where: { id: branchId } });
    }

    return {
      success: true,
      user,
      abilities,
      organizationId,
      branchId,
      currentBranch,
      message: MESSAGES.USER_FETCHED_SUCCESSFULLY,
    };
  } catch (error: any) {
    return { success: false, message: MESSAGES.COMMON_MESSAGES_ERROR, error: error?.message };
  }
};


export const findAllUsers = async (
  requester: AuthenticatedUser,
  {
    page = 1,
    perPage = 50,
    searchedValue,
  }: {
    page?: number;
    perPage?: number;
    searchedValue?: string;
  } = {}
) => {
  try {

    const pageNumber = Number(page) || 1;
    const perPageNumber = Number(perPage) || 50;
    const skip = (pageNumber - 1) * perPageNumber;

    const searchFilter =
      searchedValue && searchedValue.trim() !== ''
        ? {
          OR: [
            { fullName: { contains: searchedValue } },
            { email: { contains: searchedValue } },
            { mobile: { contains: searchedValue } },
          ],
        }
        : {};

    const where = applyBranchScope({ isActive: true, ...searchFilter }, requester);

    const [users, total, lastUser] = await Promise.all([
      prisma.user.findMany({
        where, orderBy: { createdAt: 'asc' }, skip, take: perPageNumber, include: {
          branch: true, 
          organization: true,
          createdByUser: true,
          updatedByUser: true,
        }
      }),
      prisma.user.count({ where }),
      prisma.user.findFirst({ where: { isActive: true }, orderBy: { id: 'asc' }, select: { id: true } }),
    ]);

    const lastPage = Math.ceil(total / perPageNumber);

    return {
      success: true,
      data: users,
      message: MESSAGES.USER_FETCHED_SUCCESSFULLY,
      meta: { currentPage: pageNumber, perPage: perPageNumber, total, lastPage, lastId: lastUser?.id ?? null },
    };
  }
  catch (error: any) {
    return { success: false, message: MESSAGES.COMMON_MESSAGES_ERROR, error: error?.message };
  }
};

export const findSearchUsers = async (requester: AuthenticatedUser, search: string) => {
  try {
    const where = applyBranchScope(
      {
        isActive: true,
        OR: [
          { fullName: { contains: search } }
        ],
      },
      requester
    );

    const users = await prisma.user.findMany({ where, orderBy: { createdAt: 'asc' }, include: { branch: true, organization: true } });

    return {
      success: true,
      data: users,
      message: MESSAGES.USER_FETCHED_SUCCESSFULLY,
    };
  } catch (error: any) {
    return { success: false, message: MESSAGES.COMMON_MESSAGES_ERROR, error: error?.message };
  }
}

export const findByUserId = async (id: number, requester: AuthenticatedUser) => {
  try {
    const baseWhere = { isActive: true };
    const user = await prisma.user.findFirst({
      where: { id, ...baseWhere }, include: {
        branch: true, organization: true,
        createdByAdminUser: true, updatedByAdminUser: true,
        createdByUser: true,
        updatedByUser: true,
      }
    });

    const [next, previous, positionResult, totalResult] = await Promise.all([
      prisma.user.findFirst({ where: { ...baseWhere, id: { gt: id } }, orderBy: { id: 'asc' }, select: { id: true } }),
      prisma.user.findFirst({ where: { ...baseWhere, id: { lt: id } }, orderBy: { id: 'asc' }, select: { id: true } }),
      prisma.user.count({ where: { ...baseWhere, id: { lte: id } } }),
      prisma.user.count({ where: baseWhere }),
    ]);

    return {
      status: true,
      data: user,
      message: MESSAGES.USER_FETCHED_SUCCESSFULLY,
      meta: {
        position: positionResult,
        total: totalResult,
        nextId: next?.id ?? null,
        prevId: previous?.id ?? null,
      },
    };
  } catch (error: any) {
    return { status: false, message: MESSAGES.COMMON_MESSAGES_ERROR, error: error?.message };
  }
};

export const createUser = async (payload: ICreateUser) => {
  try {
    const existingEmail = await prisma.user.findFirst({ where: { email: payload.email, isActive: true } });
    if (existingEmail) return { status: false, message: MESSAGES.USER_EMAIL_ALREADY_EXISTS };

    if (payload.mobile && payload.mobile.trim() !== '') {
      const existingMobile = await prisma.user.findFirst({ where: { mobile: payload.mobile.trim(), isActive: true } });
      if (existingMobile) return { status: false, message: MESSAGES.USER_MOBILE_ALREADY_EXISTS };
    }

    const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        ...payload,
        password: hashedPassword,
        isOrganizationAdmin: payload.isOrganizationAdmin ?? false,

      },
    });

    return { status: true, message: MESSAGES.USER_CREATED_SUCCESSFULLY, data: user };
  } catch (error: any) {
    return { status: false, message: MESSAGES.COMMON_MESSAGES_ERROR, error: error?.message };
  }
};

export const updateUser = async (id: number, payload: IUpdateUser, requester: AuthenticatedUser) => {
  try {

    const requesterRecord = await prisma.user.findFirst({
      where: { id: requester.id, isActive: true },
      select: { branchId: true },
    });
    const targetUser = await prisma.user.findFirst({ where: { id, isActive: true }, select: { branchId: true } });
    if (!targetUser) return { status: false, message: MESSAGES.USER_NOT_FOUND };
    if (!requesterRecord?.branchId || requesterRecord.branchId !== targetUser.branchId) {
      return { status: false, message: MESSAGES.FORBIDDEN };
    }
    if (payload.email) {
      const existingEmail = await prisma.user.findFirst({
        where: { email: payload.email, isActive: true, NOT: { id } },
      });
      if (existingEmail) return { status: false, message: MESSAGES.USER_EMAIL_ALREADY_EXISTS };
    }

    if (payload.mobile && payload.mobile.trim() !== '') {
      const existingMobile = await prisma.user.findFirst({
        where: { mobile: payload.mobile.trim(), isActive: true, NOT: { id } },
      });
      if (existingMobile) return { status: false, message: MESSAGES.USER_MOBILE_ALREADY_EXISTS };
    }

    const { password, email, ...rest } = payload;
    const updateData: Record<string, unknown> = { ...rest };
    if (email) updateData.email = email.trim().toLowerCase();
    if (password) updateData.password = await bcrypt.hash(password, SALT_ROUNDS);

    const updated = await prisma.user.update({ where: { id }, data: updateData });
    return { success: true, data: updated, message: MESSAGES.USER_UPDATED_SUCCESSFULLY };
  } catch (error: any) {
    return {
      status: false,
      message: MESSAGES.COMMON_MESSAGES_ERROR,
      error: error?.message,
    };
  }
};

export const deleteUser = async (
  id: number,
  requester: AuthenticatedUser,
  audit: { updatedBy?: number | null; updatedByAdmin?: number | null; resourceInfo?: string | null } = {}
) => {
  try {

    const requesterRecord = await prisma.user.findFirst({
      where: { id: requester.id, isActive: true },
      select: { branchId: true },
    });
    const targetUser = await prisma.user.findFirst({ where: { id, isActive: true }, select: { branchId: true } });
    if (!targetUser) return { status: false, message: MESSAGES.USER_NOT_FOUND };
    if (!requesterRecord?.branchId || requesterRecord.branchId !== targetUser.branchId) {
      return { status: false, message: MESSAGES.FORBIDDEN };
    }

    await prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        updatedBy: audit.updatedBy ?? null,
        updatedByAdmin: audit.updatedByAdmin ?? null,
        resourceInfo: audit.resourceInfo ?? null,
      },
    });

    return { success: true, message: MESSAGES.USER_DELETED_SUCCESSFULLY };
  } catch (error) {
    return {
      status: false,
      message: MESSAGES.COMMON_MESSAGES_ERROR,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

