import { prisma } from '../../config/database';
import { MESSAGES } from '../../utils/messages';
import { AuthenticatedUser } from '../../config/types/auth';
import { applyBranchScope } from '../../utils/model_helper';
import { ICreateReportType, IUpdateReportType } from '../../config/types/report-type';

export const findAllReportTypes = async (
  user: AuthenticatedUser,
  { page = 1, perPage = 50, searchedValue }: { page?: number; perPage?: number; searchedValue?: string } = {}
) => {
  try {
    const pageNumber = Number(page) || 1;
    const perPageNumber = Number(perPage) || 50;
    const skip = (pageNumber - 1) * perPageNumber;
    const baseWhere: Record<string, unknown> = {};
    const where = applyBranchScope(baseWhere, user);
    if (searchedValue && searchedValue.trim() !== '') {
      where.OR = [
        { name: { contains: searchedValue, mode: 'insensitive' as const } },
        { code: { contains: searchedValue, mode: 'insensitive' as const } },
      ];
    }
    const [types, total, lastType] = await Promise.all([
      prisma.reportType.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: perPageNumber,
      }),
      prisma.reportType.count({ where }),
      prisma.reportType.findFirst({ orderBy: { id: 'desc' }, select: { id: true } }),
    ]);
    const lastPage = Math.ceil(total / perPageNumber);
    return {
      success: true,
      data: types,
      message: MESSAGES.REPORT_TYPE_FETCHED_SUCCESSFULLY,
      meta: { currentPage: pageNumber, perPage: perPageNumber, total, lastPage, lastId: lastType?.id ?? null },
    };
  } catch (error: any) {
    return { success: false, message: MESSAGES.COMMON_MESSAGES_ERROR, error: error?.message };
  }

};
export const searchReportType = async (user: AuthenticatedUser, q: string) => {
  try {
    const baseWhere: Record<string, unknown> = {
      isActive: true,
    };

    const where = applyBranchScope(baseWhere, user);

    if (q && q.trim() !== '') {
      where.OR = [
        {
          name: {
            contains: q,
          },
        },
      ];
    }
    const templates = await prisma.reportType.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return {
      success: true,
      data: templates,
      message: MESSAGES.REPORT_TYPE_FETCHED_SUCCESSFULLY,
    };
  } catch (error: any) {
    return {
      success: false,
      message: MESSAGES.COMMON_MESSAGES_ERROR,
      error: error?.message,
    };
  }
};


export const findByReportTypeId = async (id: number) => {
  try {
    const baseWhere = { isActive: true };
    const type = await prisma.reportType.findUnique({ where: { id, ...baseWhere } });
    if (!type) {
      return { success: false, message: MESSAGES.REPORT_TYPE_NOT_FOUND };
    }
    const [next, previous, positionResult, totalResult] = await Promise.all([
      prisma.reportType.findFirst({ where: { ...baseWhere, id: { gt: id } }, orderBy: { id: 'asc' }, select: { id: true } }),
      prisma.reportType.findFirst({ where: { ...baseWhere, id: { lt: id } }, orderBy: { id: 'desc' }, select: { id: true } }),
      prisma.reportType.count({ where: { ...baseWhere, id: { lte: id } } }),
      prisma.reportType.count({ where: baseWhere }),
    ]);
    return {
      success: true,
      data: type,
      message: MESSAGES.REPORT_TYPE_FETCHED_SUCCESSFULLY,
      meta: { position: positionResult, total: totalResult, nextId: next?.id ?? null, prevId: previous?.id ?? null },
    };
  } catch (error: any) {
    return { success: false, message: MESSAGES.COMMON_MESSAGES_ERROR, error: error?.message };
  }
};

export const createReportType = async (payload: ICreateReportType) => {
  return prisma.$transaction(async (tx) => {
    try {
      const existingType = await tx.reportType.findFirst({
        where: {
          code: payload.code,
          isActive: true,
          resourceInfo: payload.resourceInfo ?? null,
          ...(payload.branchId ? { branchId: payload.branchId } : {}),
          ...(payload.organizationId ? { organizationId: payload.organizationId } : {}),
        },
      });
      if (existingType) {
        return { success: false, message: MESSAGES.REPORT_TYPE_ALREADY_EXISTS };
      }

      if (payload.isDefault) {
        await tx.reportType.updateMany({
          where: {
            isActive: true,
            isDefault: true,
            ...(payload.branchId ? { branchId: payload.branchId } : {}),
            ...(payload.organizationId ? { organizationId: payload.organizationId } : {}),
            resourceInfo: payload.resourceInfo ?? null,
          },
          data: { isDefault: false },
        });
      }

      const type = await tx.reportType.create({ data: { ...payload, resourceInfo: payload.resourceInfo ?? null } });
      return { success: true, data: type, message: MESSAGES.REPORT_TYPE_CREATED_SUCCESSFULLY };
    } catch (error: any) {
      return { success: false, message: MESSAGES.COMMON_MESSAGES_ERROR, error: error?.message };
    }
  });
};

export const updateReportType = async (id: number, payload: IUpdateReportType) => {
  return prisma.$transaction(async (tx) => {
    try {
      const existingType = await tx.reportType.findUnique({ where: { id } });
      if (!existingType) {
        return { success: false, message: MESSAGES.REPORT_TYPE_NOT_FOUND };
      }

      if (payload.isDefault) {
        await tx.reportType.updateMany({
          where: {
            isActive: true,
            isDefault: true,
            id: { not: id },
            ...(payload.branchId ? { branchId: payload.branchId } : existingType.branchId ? { branchId: existingType.branchId } : {}),
            ...(payload.organizationId ? { organizationId: payload.organizationId } : existingType.organizationId ? { organizationId: existingType.organizationId } : {}),
            resourceInfo: payload.resourceInfo ?? existingType.resourceInfo ?? null,
          },
          data: { isDefault: false },
        });
      }

      await tx.reportType.update({ where: { id }, data: payload });
      return { success: true, message: MESSAGES.REPORT_TYPE_UPDATED_SUCCESSFULLY };
    } catch (error: any) {
      return { success: false, message: MESSAGES.COMMON_MESSAGES_ERROR, error: error?.message };
    }
  });
};

export const deleteReportType = async (
  id: number,
  audit: { updatedBy?: number | null; updatedByAdmin?: number | null; resourceInfo?: string | null } = {}
) => {
  try {
    const type = await prisma.reportType.update({
      where: { id },
      data: {
        isActive: false,
        updatedBy: audit.updatedBy ?? null,
        updatedByAdmin: audit.updatedByAdmin ?? null,
        resourceInfo: audit.resourceInfo ?? null,
      },
    });
    if (!type) {
      return { success: false, message: MESSAGES.REPORT_TYPE_NOT_FOUND };
    }
    return { success: true, message: MESSAGES.REPORT_TYPE_DELETED_SUCCESSFULLY };
  } catch (error: any) {
    return { success: false, message: MESSAGES.COMMON_MESSAGES_ERROR, error: error?.message };
  }
};
