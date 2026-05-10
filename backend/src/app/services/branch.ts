import { prisma } from '../../config/database';
import { ICreateBranch, IUpdateBranch } from '../../config/types/branch';
import { MESSAGES } from '../../utils/messages';
import { generatePrefix } from '../../config/helper/prefix_generator';

export const findAllBranches = async ({
    page = 1,
    perPage = 50,
    searchedValue,
    organizationId,
}: {
    page?: number;
    perPage?: number;
    searchedValue?: string;
    organizationId?: number;
} = {}) => {
    const pageNumber = Number(page) || 1;
    const perPageNumber = Number(perPage) || 50;
    const skip = (pageNumber - 1) * perPageNumber;

    const where = {
        isActive: true,
        ...(organizationId ? { organizationId } : {}),
        ...(searchedValue && searchedValue.trim() !== ''
            ? {
                OR: [
                    { name: { contains: searchedValue } },
                    { email: { contains: searchedValue } },
                    { code: { contains: searchedValue } },
                    { legalName: { contains: searchedValue } },
                ],
            }
            : {}),
    };

    const [branches, total, lastBranch] = await Promise.all([
        prisma.branch.findMany({
            where,
            orderBy: { createdAt: 'asc' },
            skip,
            take: perPageNumber,
            include: {
                organization: true,
                createdByUser: true,
                updatedByUser: true,
                createdByAdminUser: true,
                updatedByAdminUser: true,
            },
        }),
        prisma.branch.count({ where }),
        prisma.branch.findFirst({
            where: { isActive: true },
            orderBy: { id: 'asc' },
            select: { id: true },
        }),
    ]);

    const lastPage = Math.ceil(total / perPageNumber);

    return {
        success: true,
        data: branches,
        message: MESSAGES.BRANCH_FETCHED_SUCCESSFULLY,
        meta: {
            currentPage: pageNumber,
            perPage: perPageNumber,
            total,
            lastPage,
            lastId: lastBranch?.id ?? null,
        },
    };
};

export const findSearchBranches = async (
    q: string,
    organizationId?: number
) => {
    try {
        const searchText = q?.trim();

        const branches = await prisma.branch.findMany({
            where: {
                isActive: true,

                ...(organizationId && {
                    organizationId,
                }),

                ...(searchText && {
                    name: {
                        contains: searchText,
                        mode: 'insensitive',
                    },
                }),
            },

            take: 50,

            orderBy: {
                createdAt: 'desc',
            },
        });

        return {
            status: true,
            data: branches,
            message: MESSAGES.BRANCH_FETCHED_SUCCESSFULLY,
        };
    } catch (error: any) {
        return {
            status: false,
            message: MESSAGES.COMMON_MESSAGES_ERROR,
            error: error?.message,
        };
    }
};


export const findByBranchId = async (id: number) => {
    try {
        const baseWhere = { isActive: true };

        const branch = await prisma.branch.findFirst({
            where: { id, ...baseWhere },
            include: {
                organization: true,
                createdByUser: true,
                updatedByUser: true,
                createdByAdminUser: true,
                updatedByAdminUser: true,
            },
        });
        if (!branch) {
            return { status: false, message: MESSAGES.BRANCH_NOT_FOUND };
        }

        const [next, previous, positionResult, totalResult] = await Promise.all([
            prisma.branch.findFirst({
                where: { ...baseWhere, id: { gt: id } },
                orderBy: { id: 'asc' },
                select: { id: true },
            }),
            prisma.branch.findFirst({
                where: { ...baseWhere, id: { lt: id } },
                orderBy: { id: 'asc' },
                select: { id: true },
            }),
            prisma.branch.count({ where: { ...baseWhere, id: { lte: id } } }),
            prisma.branch.count({ where: baseWhere }),
        ]);

        return {
            status: true,
            data: branch,
            message: MESSAGES.BRANCH_FETCHED_SUCCESSFULLY,
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

export const createOrganizationBranch = async (payload: ICreateBranch) => {
    try {
        const existingBranch = await prisma.branch.findFirst({
            where: { email: payload.email, isActive: true },
        });

        if (existingBranch) {
            return { status: false, message: MESSAGES.BRANCH_EMAIL_ALREADY_EXISTS };
        }

        const branchPrefix = generatePrefix(payload.name);

        const lastBranch = await prisma.branch.findFirst({
            where: { organizationId: payload.organizationId },
            orderBy: { id: 'asc' },
        });

        let sequence = 1;
        if (lastBranch?.code) {
            const match = lastBranch.code.match(/(\d+)$/);
            if (match) sequence = parseInt(match[1], 10) + 1;
        }

        const code = payload.code || (branchPrefix + String(sequence));

        const branch = await prisma.branch.create({
            data: { ...payload, code },
        });

        return {
            status: true,
            message: MESSAGES.BRANCH_CREATED_SUCCESSFULLY,
            data: branch,
        };
    } catch (error) {
        return {
            status: false,
            message: error instanceof Error ? error.message : 'An unexpected error occurred',
        };
    }
};

export const updateBranch = async (id: number, payload: IUpdateBranch) => {
    try {
        const { id: _id, ...updateData } = payload;
        const updated = await prisma.branch.update({
            where: { id },
            data: updateData,
        });
        return {
            status: true,
            data: updated,
            message: MESSAGES.BRANCH_UPDATED_SUCCESSFULLY,
        };
    } catch (error) {
        return {
            status: false,
            message: MESSAGES.COMMON_MESSAGES_ERROR,
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
        };
    }
};

export const deleteBranch = async (
    id: number,
    audit: { updatedBy?: number | null; updatedByAdmin?: number | null; resourceInfo?: string | null } = {}
) => {
    try {
        await prisma.branch.update({
            where: { id },
            data: {
                isActive: false,
                updatedBy: audit.updatedBy ?? null,
                updatedByAdmin: audit.updatedByAdmin ?? null,
                resourceInfo: audit.resourceInfo ?? null,
            },
        });
        return { status: true, message: MESSAGES.BRANCH_DELETED_SUCCESSFULLY };
    } catch (error) {
        return {
            status: false,
            message: MESSAGES.COMMON_MESSAGES_ERROR,
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
        };
    }
};
