import { prisma } from '../../config/database';
import { MESSAGES } from '../../utils/messages';
import {
    ICreateParameterMaster,
    IUpdateParameterMaster,
} from '../../config/types/parameter-master';
import { AuthenticatedUser } from '../../config/types/auth';
import { applyBranchScope } from '../../utils/model_helper';

export const findAllParameterMasters = async (
    user: AuthenticatedUser, {
        page = 1,
        perPage = 50,
        searchedValue,
    }: {
        page?: number;
        perPage?: number;
        searchedValue?: string;
    }) => {
    try {
        const pageNumber = Number(page) || 1;
        const perPageNumber = Number(perPage) || 50;
        const skip = (pageNumber - 1) * perPageNumber;

        const baseWhere: Record<string, unknown> = {};

        const where = applyBranchScope(baseWhere, user);

        if (searchedValue && searchedValue.trim() !== '') {
            where.OR = [
                {
                    name: {
                        contains: searchedValue,
                        mode: 'insensitive' as const,
                    }
                },
            ];
        }

        const [parameters, total, lastOrg] = await Promise.all([
            prisma.parameterMaster.findMany({
                where,
                orderBy: { createdAt: 'asc' },
                include: {
                    createdByUser: true,
                    updatedByUser: true,
                    createdByAdminUser: true,
                    updatedByAdminUser: true,
                    // branches: true,
                },
                skip,
                take: perPageNumber,
            }),
            prisma.parameterMaster.count({ where }),
            prisma.parameterMaster.findFirst({
                where: { isActive: true },
                orderBy: { id: 'asc' },
                select: { id: true },
            }),
        ]);

        const lastPage = Math.ceil(total / perPageNumber);

        return {
            success: true,
            data: parameters,
            message: MESSAGES.PARAMETER_MASTER_FETCHED_SUCCESSFULLY,
            meta: {
                currentPage: pageNumber,
                perPage: perPageNumber,
                total,
                lastPage,
                lastId: lastOrg?.id ?? null,
            },
        };
    } catch (error: any) {
        return {
            success: false,
            message: MESSAGES.COMMON_MESSAGES_ERROR,
            error: error?.message,
        };
    }
};

export const findSearchParameterMasters = async (requester: AuthenticatedUser, q?: string) => {
    try {
        const baseWhere: Record<string, unknown> = { isActive: true };
        const where = applyBranchScope(baseWhere, requester);

        if (q && q.trim() !== '') {
            where.OR = [
                {
                    name: {
                        contains: q,
                        mode: 'insensitive' as const,
                    }
                },
                { isActive: true }
            ];
        }
        const parameterMasters = await prisma.parameterMaster.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        return {
            success: true,
            data: parameterMasters,
            message: MESSAGES.PARAMETER_MASTER_FETCHED_SUCCESSFULLY,
        };

    }
    catch (error) {
        return {
            success: false,
            data: [],
            message: MESSAGES.PARAMETER_MASTER_FETCHED_SUCCESSFULLY,
        };
    }
}

export const findByParameterMasterId = async (id: number) => {
    const baseWhere = { isActive: true };

    const parameterMaster = await prisma.parameterMaster.findFirst({
        where: { id, ...baseWhere },
        include: {
            branch: true,
            organization: true,
            createdByUser: true,
            updatedByUser: true,
            createdByAdminUser: true,
            updatedByAdminUser: true,
        },
    });

    if (!parameterMaster) {
        return { success: false, message: MESSAGES.PARAMETER_MASTER_NOT_FOUND };
    }

    const [next, previous, positionResult, totalResult] = await Promise.all([
        prisma.parameterMaster.findFirst({
            where: { ...baseWhere, id: { gt: id } },
            orderBy: { id: 'asc' },
            select: { id: true },
        }),
        prisma.parameterMaster.findFirst({
            where: { ...baseWhere, id: { lt: id } },
            orderBy: { id: 'desc' },
            select: { id: true },
        }),
        prisma.parameterMaster.count({ where: { ...baseWhere, id: { lte: id } } }),
        prisma.parameterMaster.count({ where: baseWhere }),
    ]);

    return {
        success: true,
        data: parameterMaster,
        message: MESSAGES.PARAMETER_MASTER_FETCHED_SUCCESSFULLY,
        meta: {
            position: positionResult,
            total: totalResult,
            nextId: next?.id ?? null,
            prevId: previous?.id ?? null,
        },
    };
};


export const createParameterMaster = async (
    payload: ICreateParameterMaster
) => {
    try {

        const existingTemplate = await prisma.parameterMaster.findFirst({
            where: {
                name: payload.name,
                isActive: true,
                ...(payload.branchId ? { branchId: payload.branchId } : {}),
                ...(payload.organizationId ? { organizationId: payload.organizationId } : {}),
            },
        });

        if (existingTemplate) {
            return {
                success: false,
                message: MESSAGES.PARAMETER_MASTER_ALREADY_EXISTS,
            };
        }

        const parameter = await prisma.parameterMaster.create({
            data: {
                ...payload,
                createdBy: payload.createdBy ?? null,
                updatedBy: payload.updatedBy ?? null,
                createdByAdmin: payload.createdByAdmin ?? null,
                updatedByAdmin: payload.updatedByAdmin ?? null,
            },
        });

        return {
            success: true,
            data: parameter,
            message: MESSAGES.PARAMETER_MASTER_CREATED_SUCCESSFULLY,
        };
    } catch (error) {
        return {
            success: false,
            message: MESSAGES.COMMON_MESSAGES_ERROR,
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
        };
    }
};

export const updateParameterMaster = async (
    id: number,
    payload: IUpdateParameterMaster
) => {
    try {
        const { id: _id, ...updateData } = payload;
        const parameter = await prisma.parameterMaster.update({
            where: { id },
            data: {
                ...updateData,
                updatedBy: updateData.updatedBy ?? null,
                updatedByAdmin: updateData.updatedByAdmin ?? null,
                resourceInfo: updateData.resourceInfo ?? null,
            },
        });

        return {
            success: true,
            data: parameter,
            message: MESSAGES.PARAMETER_MASTER_UPDATED_SUCCESSFULLY,
        };
    } catch (error) {
        return {
            success: false,
            message: MESSAGES.COMMON_MESSAGES_ERROR,
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
        };
    }
};

export const deleteParameterMaster = async (
    id: number,
    audit: { updatedBy?: number | null; updatedByAdmin?: number | null; resourceInfo?: string | null } = {}
) => {
    try {

        const parameter = await prisma.parameterMaster.update({
            where: { id },
            data: {
                isActive: false,
                updatedBy: audit.updatedBy ?? null,
                updatedByAdmin: audit.updatedByAdmin ?? null,
                resourceInfo: audit.resourceInfo ?? null,
            },
        });

        if (!parameter) {
            return {
                success: false,
                message: MESSAGES.PARAMETER_MASTER_NOT_FOUND,
            };
        }
        return {
            success: true,
            message: MESSAGES.PARAMETER_MASTER_DELETED_SUCCESSFULLY,
        };
    }
    catch (error) {
        return {
            success: false,
            message: MESSAGES.COMMON_MESSAGES_ERROR,
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
        }
    }
};

