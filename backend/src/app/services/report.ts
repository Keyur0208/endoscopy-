import { prisma } from '../../config/database';
import { MESSAGES } from '../../utils/messages';
import {
    ICreateReportTemplate,
    IUpdateReportTemplate,
} from '../../config/types/report';
import { AuthenticatedUser } from '../../config/types/auth';
import { applyBranchScope } from '../../utils/model_helper';

export const findAllReportTemplates = async (
    user: AuthenticatedUser, {
        page = 1,
        perPage = 50,
        searchedValue,
    }: {
        page?: number;
        perPage?: number;
        searchedValue?: string;
    } = {}) => {
    try {
        const pageNumber = Number(page) || 1;
        const perPageNumber = Number(perPage) || 50;
        const skip = (pageNumber - 1) * perPageNumber;
        const baseWhere: Record<string, unknown> = {};
        const where = applyBranchScope(baseWhere, user);

        if (searchedValue && searchedValue.trim() !== '') {
            where.OR = [
                {
                    title: {
                        contains: searchedValue,
                        mode: 'insensitive' as const,
                    },
                    code: {
                        contains: searchedValue,
                        mode: 'insensitive' as const,
                    },
                },
            ];
        }

        const [templates, total, lastReport] = await Promise.all([
            prisma.reportTemplate.findMany({
                where,
                include: {
                    sections: {
                        include: {
                            parameter: true,
                        },
                        orderBy: {
                            sequence: 'asc',
                        },
                    },
                    createdByUser: true,
                    updatedByUser: true,
                    createdByAdminUser: true,
                    updatedByAdminUser: true,
                    reportType: true,
                },
                skip,
                take: perPageNumber,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.reportTemplate.count({ where }),
            prisma.reportTemplate.findFirst({
                orderBy: { id: 'desc' },
                select: { id: true },
            }),
        ]);

        const lastPage = Math.ceil(total / perPageNumber);


        return {
            success: true,
            data: templates,
            message: MESSAGES.REPORT_TEMPLATE_FETCHED_SUCCESSFULLY,
            meta: {
                currentPage: pageNumber,
                perPage: perPageNumber,
                total,
                lastPage,
                lastId: lastReport?.id ?? null,
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

export const findSearchReportTemplates = async (user: AuthenticatedUser, q: string) => {
    try {
        const where: Record<string, unknown> = {
            isActive: true,
        };

        applyBranchScope(where, user);

        if (q && q.trim() !== '') {
            where.OR = [
                {
                    title: {
                        contains: q,
                        mode: 'insensitive' as const,
                    },
                    code: {
                        contains: q,
                        mode: 'insensitive' as const,
                    },
                },
            ];
        }
        const templates = await prisma.reportTemplate.findMany({
            where,
            include: {
                sections: {
                    include: {
                        parameter: true,
                    },
                    orderBy: {
                        sequence: 'asc',
                    },
                },
                reportType: true,
            }
        });

        return {
            success: true,
            data: templates,
            message: MESSAGES.REPORT_TEMPLATE_FETCHED_SUCCESSFULLY,
        };
    } catch (error: any) {
        return {
            success: false,
            message: MESSAGES.COMMON_MESSAGES_ERROR,
            error: error?.message,
        };
    }
};

export const findByReportTemplateId = async (id: number) => {
    try {
        const baseWhere = { isActive: true };

        const template = await prisma.reportTemplate.findUnique({
            where: { id, ...baseWhere },
            include: {
                sections: {
                    include: {
                        parameter: true,
                    },
                    orderBy: {
                        sequence: 'asc',
                    },
                },
                reportType: true,
                createdByUser: true,
                updatedByUser: true,
                createdByAdminUser: true,
                updatedByAdminUser: true,
            },
        });

        if (!template) {
            return {
                success: false,
                message: MESSAGES.REPORT_TEMPLATE_NOT_FOUND,
            };
        }

        const [next, previous, positionResult, totalResult] = await Promise.all([
            prisma.reportTemplate.findFirst({
                where: { ...baseWhere, id: { gt: id } },
                orderBy: { id: 'asc' },
                select: { id: true },
            }),
            prisma.reportTemplate.findFirst({
                where: { ...baseWhere, id: { lt: id } },
                orderBy: { id: 'desc' },
                select: { id: true },
            }),
            prisma.reportTemplate.count({ where: { ...baseWhere, id: { lte: id } } }),
            prisma.reportTemplate.count({ where: baseWhere }),
        ]);


        return {
            success: true,
            data: template,
            message: MESSAGES.REPORT_TEMPLATE_FETCHED_SUCCESSFULLY,
            meta: {
                position: positionResult,
                total: totalResult,
                nextId: next?.id ?? null,
                prevId: previous?.id ?? null,
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

export const createReportTemplate = async (
    payload: ICreateReportTemplate
) => {
    return prisma.$transaction(async (tx) => {
        try {
            const existingTemplate = await tx.reportTemplate.findFirst({
                where: {
                    code: payload.code,
                    isActive: true,
                    ...(payload.branchId ? { branchId: payload.branchId } : {}),
                    ...(payload.organizationId ? { organizationId: payload.organizationId } : {}),
                },
            });

            if (existingTemplate) {
                return {
                    success: false,
                    message: MESSAGES.REPORT_TEMPLATE_ALREADY_EXISTS,
                };
            }

            const template = await tx.reportTemplate.create({
                data: {
                    reportTypeId: payload.reportTypeId,
                    title: payload.title,
                    code: payload.code,
                    maxImages: payload.maxImages,
                    isActive: payload.isActive,
                    branchId: payload.branchId ?? null,
                    organizationId: payload.organizationId ?? null,
                    resourceInfo: payload.resourceInfo ?? null,
                    createdBy: payload.createdBy ?? null,
                    updatedBy: payload.updatedBy ?? null,
                    createdByAdmin: payload.createdByAdmin ?? null,
                    updatedByAdmin: payload.updatedByAdmin ?? null,
                },
            });

            if (payload.sections?.length) {
                await tx.reportTemplateSection.createMany({
                    data: payload.sections.map((section) => ({
                        templateId: template.id,
                        parameterId: section.parameterId ?? null,
                        sequence: section.sequence,
                        isRequired: section.isRequired ?? false,
                        createdBy: payload.createdBy ?? null,
                        updatedBy: payload.updatedBy ?? null,
                        createdByAdmin: payload.createdByAdmin ?? null,
                        updatedByAdmin: payload.updatedByAdmin ?? null,
                    })),
                });
            }

            return {
                success: true,
                data: template,
                message: MESSAGES.REPORT_TEMPLATE_CREATED_SUCCESSFULLY,
            };
        } catch (error: any) {
            return {
                success: false,
                message: MESSAGES.COMMON_MESSAGES_ERROR,
                error: error?.message,
            };
        }
    });
};

export const updateReportTemplate = async (
    id: number,
    payload: IUpdateReportTemplate
) => {
    return prisma.$transaction(async (tx) => {
        try {
            const existingTemplate = await tx.reportTemplate.findUnique({
                where: { id },
            });

            if (!existingTemplate) {
                return {
                    success: false,
                    message: MESSAGES.REPORT_TEMPLATE_NOT_FOUND,
                };
            }

            await tx.reportTemplate.update({
                where: { id },

                data: {
                    reportTypeId: payload.reportTypeId,
                    title: payload.title,
                    code: payload.code,
                    maxImages: payload.maxImages,
                    isActive: payload.isActive,
                    resourceInfo: payload.resourceInfo ?? null,
                    updatedBy: payload.updatedBy ?? null,
                    updatedByAdmin: payload.updatedByAdmin ?? null,
                },
            });

            if (payload.sections) {
                await tx.reportTemplateSection.deleteMany({
                    where: {
                        templateId: id,
                    },
                });

                await tx.reportTemplateSection.createMany({
                    data: payload.sections.map((section) => ({
                        templateId: id,
                        parameterId: section.parameterId,
                        sequence: section.sequence,
                        isRequired: section.isRequired ?? false,
                        branchId: payload.branchId ?? null,
                        organizationId: payload.organizationId ?? null,
                        createdBy: payload.createdBy ?? null,
                        updatedBy: payload.updatedBy ?? null,
                        createdByAdmin: payload.createdByAdmin ?? null,
                        updatedByAdmin: payload.updatedByAdmin ?? null,
                    })),
                });
            }

            return {
                success: true,
                message: MESSAGES.REPORT_TEMPLATE_UPDATED_SUCCESSFULLY,
            };
        } catch (error: any) {
            return {
                success: false,
                message: MESSAGES.COMMON_MESSAGES_ERROR,
                error: error?.message,
            };
        }
    });
};

export const deleteReportTemplate = async (id: number,
    audit: { updatedBy?: number | null; updatedByAdmin?: number | null; resourceInfo?: string | null } = {}

) => {
    try {
        const template = await prisma.reportTemplate.update({
            where: { id },
            data: {
                isActive: false,
                updatedBy: audit.updatedBy ?? null,
                updatedByAdmin: audit.updatedByAdmin ?? null,
                resourceInfo: audit.resourceInfo ?? null,
            },
        });

        if (!template) {
            return {
                success: false,
                message: MESSAGES.REPORT_TEMPLATE_NOT_FOUND,
            };
        }

        return {
            success: true,
            message: MESSAGES.REPORT_TEMPLATE_DELETED_SUCCESSFULLY,
        };
    } catch (error: any) {
        return {
            success: false,
            message: MESSAGES.COMMON_MESSAGES_ERROR,
            error: error?.message,
        };
    }
};