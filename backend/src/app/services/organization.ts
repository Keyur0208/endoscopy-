import bcrypt from 'bcrypt';
import { prisma } from '../../config/database';
import { MESSAGES } from '../../utils/messages';
import { ICreateOrganization, IUpdateOrganization } from '../../config/types/organization';
import { DateTime } from 'luxon';
import { generatePrefix } from '../../config/helper/prefix_generator';
import { env } from '../../config/env';

const SALT_ROUNDS = 10;

export const findAllOrganizations = async ({
  page = 1,
  perPage = 50,
  searchedValue,
}: {
  page?: number;
  perPage?: number;
  searchedValue?: string;
} = {}) => {
  const pageNumber = Number(page) || 1;
  const perPageNumber = Number(perPage) || 50;
  const skip = (pageNumber - 1) * perPageNumber;

  const where = {
    isActive: true,
    ...(searchedValue && searchedValue.trim() !== ''
      ? {
        OR: [
          { name: { contains: searchedValue } },
          { email: { contains: searchedValue } },
          { mobile: { contains: searchedValue } },
          { legalName: { contains: searchedValue } },
          { licenseKey: { contains: searchedValue } },
        ],
      }
      : {}),
  };

  const [organizations, total, lastOrg] = await Promise.all([
    prisma.organization.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      include: {
        createdByUser: true,
        updatedByUser: true,
        createdByAdminUser: true,
        updatedByAdminUser: true,
        branches: true,
      },
      skip,
      take: perPageNumber,
    }),
    prisma.organization.count({ where }),
    prisma.organization.findFirst({
      where: { isActive: true },
      orderBy: { id: 'asc' },
      select: { id: true },
    }),
  ]);

  const lastPage = Math.ceil(total / perPageNumber);

  return {
    success: true,
    data: organizations,
    message: MESSAGES.ORGANIZATION_FETCHED_SUCCESSFULLY,
    meta: {
      currentPage: pageNumber,
      perPage: perPageNumber,
      total,
      lastPage,
      lastId: lastOrg?.id ?? null,
    },
  };
};

export const findSearchOrganizations = async (q: string) => {
  try {
    const searchText = q?.trim();

    const baseWhere = {
      isActive: true,
    };

    const organizations = await prisma.organization.findMany({
      where: searchText
        ? {
          ...baseWhere,
          OR: [
            {
              name: {
                contains: searchText,
                mode: 'insensitive',
              },
            },
          ],
        }
        : baseWhere,

      take: 50,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      status: true,
      data: organizations,
      message: MESSAGES.ORGANIZATION_FETCHED_SUCCESSFULLY,
    };
  } catch (error: any) {
    return {
      status: false,
      message: MESSAGES.COMMON_MESSAGES_ERROR,
      error: error?.message,
    };
  }
};

export const findByOrganizationId = async (id: number) => {
  try {
    const baseWhere = { isActive: true };

    const organization = await prisma.organization.findFirst({
      where: { id, ...baseWhere },
    });

    if (!organization) {
      return {
        status: false,
        message: MESSAGES.ORGANIZATION_NOT_FOUND,
      };
    }

    const [next, previous, positionResult, totalResult] = await Promise.all([
      prisma.organization.findFirst({
        where: { ...baseWhere, id: { gt: id } },
        orderBy: { id: 'asc' },
        select: { id: true },
      }),
      prisma.organization.findFirst({
        where: { ...baseWhere, id: { lt: id } },
        orderBy: { id: 'asc' },
        select: { id: true },
      }),
      prisma.organization.count({
        where: { ...baseWhere, id: { lte: id } },
      }),
      prisma.organization.count({
        where: baseWhere,
      }),
    ]);

    return {
      status: true,
      data: organization,
      message: MESSAGES.ORGANIZATION_FETCHED_SUCCESSFULLY,
      meta: {
        position: positionResult,
        total: totalResult,
        nextId: next?.id ?? null,
        prevId: previous?.id ?? null,
      },
    };
  } catch (error: any) {
    return {
      status: false,
      message: MESSAGES.COMMON_MESSAGES_ERROR,
      error: error?.message,
    };
  }
};

export const createOrganization = async (
  payload: ICreateOrganization
) => {
  return prisma.$transaction(async (tx) => {
    try {
      const existingOrg = await tx.organization.findFirst({
        where: {
          email: payload?.email,
          isActive: true,
        },
      });

      if (existingOrg) {
        return {
          status: false,
          message: MESSAGES.ORGANIZATION_EMAIL_ALREADY_EXISTS,
        };
      }

      const now = DateTime.now()
      const year = now.year.toString().slice(-2)
      const month = String(now.month).padStart(2, '0')
      const yymm = `${year}${month}`
      let prefix = generatePrefix(payload.name)

      const lastOrgArr = await tx.organization.findMany({
        orderBy: { id: 'asc' },
        take: 1,
      });

      const lastOrg = lastOrgArr[0];

      let sequence = 1
      if (lastOrg?.licenseKey) {
        const match = lastOrg.licenseKey.match(/NMS(\d+)$/)
        if (match) {
          sequence = Number.parseInt(match[1]) + 1
        }
      }

      const licenseKey = `${prefix}${yymm}/NMS${sequence}`

      const licenseType = payload.licenseType || 'trial'
      const expiryDate =
        licenseType === 'trial'
          ? now.plus({ days: 14 }).toISODate()
          : payload.expiryDate

      const status = payload.status || 'active'

      const organization = await tx.organization.create({
        data: {
          ...payload,
          licenseKey: licenseKey,
          licenseType: licenseType,
          expiryDate: expiryDate,
          status,
          resourceInfo: payload.resourceInfo ?? null,
          createdBy: payload.createdBy ?? null,
          updatedBy: payload.updatedBy ?? null,
          createdByAdmin: payload.createdByAdmin ?? null,
          updatedByAdmin: payload.updatedByAdmin ?? null,
        }
      });

      let branchPrefix = generatePrefix(`${organization.name} Default Branch`)

      const lastBranch = await tx.branch.findFirst({
        where: { organizationId: organization.id },
        orderBy: { id: 'asc' },
      })

      let branchSequence = 1
      if (lastBranch?.code) {
        const match = lastBranch.code.match(/(\d+)$/)
        if (match) {
          branchSequence = Number.parseInt(match[1]) + 1
        }
      }

      const branchCode = `${branchPrefix}${branchSequence.toString()}`;

      const branch = await tx.branch.create({
        data: {
          organizationId: organization.id,
          code: branchCode,
          isDefault: true,
          legalName: organization?.legalName ?? null,
          name: organization?.name || `${organization.name} - Default Branch`,
          address: null,
          logoImage: organization?.logoImage ?? null,
          bannerImage: organization?.bannerImage ?? null,
          phoneNumber: null,
          mobile: organization?.mobile ?? null,
          email: organization.email,
          website: null,
          rohiniId: null,
          gstNo: null,
          jurisdiction: null,
          city: null,
          state: null,
          country: null,
          zipCode: null,
          createdBy: payload.createdBy ?? null,
          updatedBy: payload.updatedBy ?? null,
          createdByAdmin: payload.createdByAdmin ?? null,
          updatedByAdmin: payload.updatedByAdmin ?? null,
          resourceInfo: payload.resourceInfo ?? null,
        },
      });

      const hashedPassword = await bcrypt.hash(env.adminPassword, SALT_ROUNDS);

      await tx.user.create({
        data: {
          fullName: `${organization.name} Admin`,
          email: organization.email,
          mobile: organization.mobile ?? '',
          password: hashedPassword,
          isActive: true,
          isOrganizationAdmin: true,
          isOtpRequired: true,
          canSwitchBranch: false,
          branchId: branch.id,
          organizationId: organization.id,
          resourceInfo: payload.resourceInfo ?? null,
          createdBy: payload.createdBy ?? null,
          updatedBy: payload.updatedBy ?? null,
          createdByAdmin: payload.createdByAdmin ?? null,
          updatedByAdmin: payload.updatedByAdmin ?? null,
        },
      });
      return {
        status: true,
        message: MESSAGES.ORGANIZATION_CREATED_SUCCESSFULLY,
        data: organization,
      };
    }
    catch (error) {
      return {
        status: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  });
};

export const updateOrganization = async (
  id: number,
  payload: IUpdateOrganization,
) => {
  try {
    const { id: _id, ...updateData } = payload;
    const updatedOrganization = await prisma.organization.update({
      where: { id },
      data: {
        ...updateData,
        updatedBy: updateData.updatedBy ?? null,
        updatedByAdmin: updateData.updatedByAdmin ?? null,
        resourceInfo: updateData.resourceInfo ?? null,
      },
    });
    return {
      status: true,
      data: updatedOrganization,
      message: MESSAGES.ORGANIZATION_UPDATED_SUCCESSFULLY,
    };
  }
  catch (error) {
    return {
      status: false,
      message: MESSAGES.COMMON_MESSAGES_ERROR,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export const deleteOrganization = async (
  id: number,
  audit: { updatedBy?: number | null; updatedByAdmin?: number | null; resourceInfo?: string | null } = {}
) => {
  try {
    const organization = await prisma.organization.update({
      where: { id },
      data: {
        isActive: false,
        updatedBy: audit.updatedBy ?? null,
        updatedByAdmin: audit.updatedByAdmin ?? null,
        resourceInfo: audit.resourceInfo ?? null,
      },
    });

    if (!organization) {
      return {
        status: false,
        message: MESSAGES.ORGANIZATION_NOT_FOUND,
      };
    }

    return {
      status: true,
      message: MESSAGES.ORGANIZATION_DELETED_SUCCESSFULLY,
    };
  }
  catch (error) {
    return {
      status: false,
      message: MESSAGES.COMMON_MESSAGES_ERROR,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
};
