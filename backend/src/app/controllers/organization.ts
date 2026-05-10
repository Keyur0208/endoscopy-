import { Request, Response } from 'express';
import {
  createOrganization,
  deleteOrganization,
  findByOrganizationId,
  findAllOrganizations,
  updateOrganization,
  findSearchOrganizations,
} from '../services/organization';
import { AuthenticatedRequest } from '../../config/types/auth';
import { asyncHandler } from '../../utils/async-handler';
import { MESSAGES } from '../../utils/messages';
import { getRequestUser } from '../../utils/request-user';
import { ICreateOrganization, IUpdateOrganization } from '../../config/types/organization';
import { assignCreatedBy, assignUpdatedBy } from '../../utils/model_helper';

export const createOrganizationController = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = getRequestUser(req);
    const { createdBy, createdByAdmin, resourceInfo } = assignCreatedBy(user);
    const payload: ICreateOrganization = {
      ...req.body,
      resourceInfo,
      createdBy,
      createdByAdmin,
      updatedBy: null,
      updatedByAdmin: null,
    };
    const result = await createOrganization(payload);
    res.status(201).json(result);
  }
);

export const getOrganizationsController = asyncHandler(async (req: Request, res: Response) => {
  const { page, perPage, searchedValue } = req.query;
  const organizations = await findAllOrganizations({
    page: page ? Number(page) : undefined,
    perPage: perPage ? Number(perPage) : undefined,
    searchedValue: searchedValue as string | undefined,
  });
  res.status(200).json(organizations);
});

export const getSearchOrganizationsController = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;
  const organizations = await findSearchOrganizations(q as string);
  res.status(200).json(organizations);
});

export const getOrganizationByIdController = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const organization = await findByOrganizationId(id);
  res.status(200).json(organization);
});

export const updateOrganizationController = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = getRequestUser(req);
    const id = Number(req.params.id);
    const { updatedBy, updatedByAdmin, resourceInfo } = assignUpdatedBy(user);
    const payload: IUpdateOrganization = {
      ...req.body,
      resourceInfo,
      updatedBy,
      updatedByAdmin,
    };
    const organization = await updateOrganization(id, payload);
    res.status(200).json(organization);
  }
);

export const deleteOrganizationController = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = getRequestUser(req);
    const id = Number(req.params.id);
    const { updatedBy, updatedByAdmin, resourceInfo } = assignUpdatedBy(user);
    await deleteOrganization(id, { updatedBy, updatedByAdmin, resourceInfo });
    res.status(200).json({ message: MESSAGES.ORGANIZATION_DELETED_SUCCESSFULLY });
  }
);
