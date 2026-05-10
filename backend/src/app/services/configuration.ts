import { ConfigurationModule as PrismaConfig } from '@prisma/client';
import { prisma } from '../../config/database';
import { ICreateConfiguration, IBulkUpdateConfigItem, IUpdateConfiguration } from '../../config/types/configuration';
import { AuthenticatedUser } from '../../config/types/auth';
import { MESSAGES } from '../../utils/messages';

// ---------------------------------------------------------------------------
// JSON helpers (SQLite stores JSON as TEXT)
// ---------------------------------------------------------------------------

const safeJsonParse = (value: string | null | undefined): any => {
    if (value === null || value === undefined) return null;
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

const safeJsonStringify = (value: any): string | null => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
};

// ---------------------------------------------------------------------------
// Mapper
// ---------------------------------------------------------------------------

const mapConfig = (c: PrismaConfig) => ({
    ...c,
    value: safeJsonParse(c.value),
    defaultValue: safeJsonParse(c.defaultValue),
    meta: safeJsonParse(c.meta),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
});

// ---------------------------------------------------------------------------
// Scope helper: resolve organizationId for a non-admin user via their branch
// ---------------------------------------------------------------------------

const resolveOrgScope = async (
    requester: AuthenticatedUser
): Promise<number | null> => {
    if (requester.isAdmin) return null;
    if (!requester.branchId) return null;
    const branch = await prisma.branch.findFirst({
        where: { id: requester.branchId },
        select: { organizationId: true },
    });
    return branch?.organizationId ?? null;
};

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export const findAllConfigurations = async (
    requester: AuthenticatedUser,
    {
        page = 1,
        perPage = 50,
        module: moduleFilter,
        subModule: subModuleFilter,
        searchFor,
        organizationId,
    }: {
        page?: number;
        perPage?: number;
        module?: string;
        subModule?: string;
        searchFor?: string;
        organizationId?: number;
    } = {}
) => {
    const pageNumber = Number(page) || 1;
    const perPageNumber = Number(perPage) || 50;
    const skip = (pageNumber - 1) * perPageNumber;

    const where: any = {};

    if (searchFor !== 'all') {
        where.isActive = true;
    }

    if (moduleFilter?.trim()) {
        where.module = { contains: moduleFilter.trim() };
    }

    if (subModuleFilter?.trim()) {
        where.subModule = { contains: subModuleFilter.trim() };
    }

    // Scope: admin can optionally filter by organizationId; non-admin is always scoped
    if (requester.isAdmin) {
        if (organizationId) where.organizationId = organizationId;
    } else {
        const orgId = await resolveOrgScope(requester);
        if (orgId) where.organizationId = orgId;
    }

    const [configs, total] = await Promise.all([
        prisma.configurationModule.findMany({
            where,
            orderBy: { priority: 'asc' },
            skip,
            take: perPageNumber,
        }),
        prisma.configurationModule.count({ where }),
    ]);

    const lastPage = Math.ceil(total / perPageNumber);

    // Build module/subModule index maps
    const moduleMap = new Map<string, { id: number; module: string }>();
    const subModuleMap = new Map<string, { id: number; subModule: string }>();

    configs.forEach((c) => {
        if (!moduleMap.has(c.module)) moduleMap.set(c.module, { id: c.id, module: c.module });
        if (!subModuleMap.has(c.subModule)) subModuleMap.set(c.subModule, { id: c.id, subModule: c.subModule });
    });

    return {
        success: true,
        message: MESSAGES.CONFIGURATION_FETCHED_SUCCESSFULLY,
        data: configs.map(mapConfig),
        modules: Array.from(moduleMap.values()),
        subModules: Array.from(subModuleMap.values()),
        meta: {
            currentPage: pageNumber,
            perPage: perPageNumber,
            total,
            lastPage,
        },
    };
};

export const findByModuleAndSubmodule = async (
    module: string,
    subModule: string,
    requester: AuthenticatedUser
) => {
    const where: any = {
        module,
        subModule,
        isActive: true,
    };

    if (!requester.isAdmin) {
        const orgId = await resolveOrgScope(requester);
        if (orgId) where.organizationId = orgId;
    }

    const configs = await prisma.configurationModule.findMany({
        where,
        orderBy: { priority: 'asc' },
    });

    return {
        success: true,
        message: MESSAGES.CONFIGURATION_FETCHED_SUCCESSFULLY,
        data: configs.map(mapConfig),
    };
};

export const findByConfigId = async (id: number) => {
    const config = await prisma.configurationModule.findFirst({
        where: { id, isActive: true },
        include: {
            branch: true,
            organization: true,
            createdByUser: true,
            updatedByUser: true,
            createdByAdminUser: true,
            updatedByAdminUser: true,
        },
    });

    if (!config) {
        return { success: false, message: MESSAGES.CONFIGURATION_NOT_FOUND };
    }

    return {
        success: true,
        message: MESSAGES.CONFIGURATION_FETCHED_SUCCESSFULLY,
        data: mapConfig(config),
    };
};

export const createConfiguration = async (payload: ICreateConfiguration) => {
    const data = {
        ...payload,
        value: safeJsonStringify(payload.value),
        defaultValue: safeJsonStringify(payload.defaultValue),
        meta: safeJsonStringify(payload.meta),
    };

    const config = await prisma.configurationModule.create({ data });

    return {
        success: true,
        message: MESSAGES.CONFIGURATION_CREATED_SUCCESSFULLY,
        data: mapConfig(config),
    };
};

export const updateConfiguration = async (id: number, payload: IUpdateConfiguration) => {
    const existing = await prisma.configurationModule.findFirst({ where: { id, isActive: true } });
    if (!existing) {
        return { success: false, message: MESSAGES.CONFIGURATION_NOT_FOUND };
    }

    const data: any = { ...payload };
    if ('value' in payload) data.value = safeJsonStringify(payload.value);
    if ('defaultValue' in payload) data.defaultValue = safeJsonStringify(payload.defaultValue);
    if ('meta' in payload) data.meta = safeJsonStringify(payload.meta);

    const updated = await prisma.configurationModule.update({ where: { id }, data });

    return {
        success: true,
        message: MESSAGES.CONFIGURATION_UPDATED_SUCCESSFULLY,
        data: mapConfig(updated),
    };
};

export const deleteConfiguration = async (
    id: number,
    audit: { updatedBy: number | null; updatedByAdmin: number | null; resourceInfo: string | null }
) => {
    const existing = await prisma.configurationModule.findFirst({ where: { id, isActive: true } });
    if (!existing) {
        return { success: false, message: MESSAGES.CONFIGURATION_NOT_FOUND };
    }

    await prisma.configurationModule.update({
        where: { id },
        data: {
            isActive: false,
            updatedBy: audit.updatedBy,
            updatedByAdmin: audit.updatedByAdmin,
            resourceInfo: audit.resourceInfo,
        },
    });

    return { success: true, message: MESSAGES.CONFIGURATION_DELETED_SUCCESSFULLY };
};

export const bulkUpdateConfigurations = async (
    items: IBulkUpdateConfigItem[],
    audit: { updatedBy: number | null; updatedByAdmin: number | null; createdBy: number | null; createdByAdmin: number | null; resourceInfo: string | null }
) => {
    const results: any[] = [];

    for (const item of items) {
        if (!item.fieldKey || !item.module || !item.subModule) continue;

        const existing = item.id
            ? await prisma.configurationModule.findFirst({
                  where: {
                      id: item.id,
                      fieldKey: item.fieldKey,
                      module: item.module,
                      subModule: item.subModule,
                  },
              })
            : null;

        if (existing) {
            const updated = await prisma.configurationModule.update({
                where: { id: existing.id },
                data: {
                    ...item,
                    value: safeJsonStringify(item.value),
                    defaultValue: safeJsonStringify(item.defaultValue),
                    meta: safeJsonStringify(item.meta),
                    updatedBy: audit.updatedBy,
                    updatedByAdmin: audit.updatedByAdmin,
                    resourceInfo: audit.resourceInfo,
                },
            });
            results.push(mapConfig(updated));
        } else {
            const created = await prisma.configurationModule.create({
                data: {
                    module: item.module,
                    subModule: item.subModule,
                    fieldKey: item.fieldKey,
                    fieldLabel: item.fieldLabel ?? item.fieldKey,
                    fieldType: item.fieldType ?? 'string',
                    value: safeJsonStringify(item.value),
                    defaultValue: safeJsonStringify(item.defaultValue),
                    meta: safeJsonStringify(item.meta),
                    isActive: item.isActive ?? true,
                    priority: item.priority ?? 0,
                    branchId: item.branchId ?? null,
                    organizationId: item.organizationId ?? null,
                    createdBy: audit.createdBy,
                    createdByAdmin: audit.createdByAdmin,
                    updatedBy: audit.updatedBy,
                    updatedByAdmin: audit.updatedByAdmin,
                    resourceInfo: audit.resourceInfo,
                },
            });
            results.push(mapConfig(created));
        }
    }

    return {
        success: true,
        message: MESSAGES.CONFIGURATION_UPDATED_SUCCESSFULLY,
        data: results,
    };
};
