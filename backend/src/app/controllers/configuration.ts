import { Response } from 'express';
import { AuthenticatedRequest } from '../../config/types/auth';
import { ICreateConfiguration, IBulkUpdateConfigItem, IUpdateConfiguration } from '../../config/types/configuration';
import { asyncHandler } from '../../utils/async-handler';
import { MESSAGES } from '../../utils/messages';
import { getRequestUser } from '../../utils/request-user';
import { assignCreatedBy, assignUpdatedBy } from '../../utils/model_helper';
import {
    bulkUpdateConfigurations,
    createConfiguration,
    deleteConfiguration,
    findAllConfigurations,
    findByConfigId,
    findByModuleAndSubmodule,
    updateConfiguration,
} from '../services/configuration';

export const getConfigurationsController = asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
        const user = getRequestUser(req);
        const { page, perPage, module, subModule, searchFor, organizationId } = req.query;

        const result = await findAllConfigurations(user, {
            page: page ? Number(page) : undefined,
            perPage: perPage ? Number(perPage) : undefined,
            module: module as string | undefined,
            subModule: subModule as string | undefined,
            searchFor: searchFor as string | undefined,
            organizationId: organizationId ? Number(organizationId) : undefined,
        });

        res.status(200).json(result);
    }
);

export const getConfigByModuleController = asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
        const user = getRequestUser(req);
        const { module, subModule } = req.query as { module: string; subModule: string };

        const result = await findByModuleAndSubmodule(module, subModule, user);
        res.status(200).json(result);
    }
);

export const getConfigByIdController = asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
        const id = Number(req.params.id);
        const result = await findByConfigId(id);
        res.status(200).json(result);
    }
);

export const createConfigurationController = asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
        const user = getRequestUser(req);
        const { createdBy, createdByAdmin, resourceInfo } = assignCreatedBy(user);

        const payload: ICreateConfiguration = {
            ...req.body,
            resourceInfo,
            createdBy,
            createdByAdmin,
            updatedBy: null,
            updatedByAdmin: null,
        };

        const result = await createConfiguration(payload);
        res.status(201).json(result);
    }
);

export const updateConfigurationController = asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
        const user = getRequestUser(req);
        const id = Number(req.params.id);
        const { updatedBy, updatedByAdmin, resourceInfo } = assignUpdatedBy(user);

        const payload: IUpdateConfiguration = {
            ...req.body,
            resourceInfo,
            updatedBy,
            updatedByAdmin,
        };

        const result = await updateConfiguration(id, payload);
        res.status(200).json(result);
    }
);

export const deleteConfigurationController = asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
        const user = getRequestUser(req);
        const id = Number(req.params.id);
        const { updatedBy, updatedByAdmin, resourceInfo } = assignUpdatedBy(user);

        const result = await deleteConfiguration(id, { updatedBy, updatedByAdmin, resourceInfo });
        res.status(200).json({ message: MESSAGES.CONFIGURATION_DELETED_SUCCESSFULLY });
    }
);

export const bulkUpdateConfigurationsController = asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
        const user = getRequestUser(req);
        const { createdBy, createdByAdmin, resourceInfo } = assignCreatedBy(user);
        const { updatedBy, updatedByAdmin } = assignUpdatedBy(user);

        const items: IBulkUpdateConfigItem[] = req.body;

        const result = await bulkUpdateConfigurations(items, {
            createdBy,
            createdByAdmin,
            updatedBy,
            updatedByAdmin,
            resourceInfo,
        });

        res.status(200).json(result);
    }
);
