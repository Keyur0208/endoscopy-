import { Request, Response } from 'express';
import {
  createOrganizationBranch,
  deleteBranch,
  findByBranchId,
  findAllBranches,
  updateBranch,
  findSearchBranches,
} from '../services/branch';
import { AuthenticatedRequest } from '../../config/types/auth';
import { ICreateBranch, IUpdateBranch } from '../../config/types/branch';
import { asyncHandler } from '../../utils/async-handler';
import { MESSAGES } from '../../utils/messages';
import { getRequestUser } from '../../utils/request-user';
import { assignCreatedBy, assignUpdatedBy } from '../../utils/model_helper';

export const createBranchController = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = getRequestUser(req);
    const { createdBy, createdByAdmin, resourceInfo } = assignCreatedBy(user);
    const payload: ICreateBranch = {
      ...req.body,
      resourceInfo,
      createdBy,
      createdByAdmin,
      updatedBy: null,
      updatedByAdmin: null,
    };
    const result = await createOrganizationBranch(payload);
    res.status(201).json(result);
  }
);

export const getBranchesController = asyncHandler(async (req: Request, res: Response) => {
  const { page, perPage, searchedValue, organizationId } = req.query;
  const branches = await findAllBranches({
    page: page ? Number(page) : undefined,
    perPage: perPage ? Number(perPage) : undefined,
    searchedValue: searchedValue as string | undefined,
    organizationId: organizationId ? Number(organizationId) : undefined,
  });
  res.status(200).json(branches);
});

export const getSearchBranchesController = asyncHandler(async (req: Request, res: Response) => {
  const { q , organizationId } = req.query;
  const branches = await findSearchBranches(q as string, organizationId ? Number(organizationId) : undefined);
  res.status(200).json(branches);
});

export const getBranchByIdController = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const branch = await findByBranchId(id);
  res.status(200).json(branch);
});

export const updateBranchController = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = getRequestUser(req);
    const id = Number(req.params.id);
    const { updatedBy, updatedByAdmin, resourceInfo } = assignUpdatedBy(user);
    const payload: IUpdateBranch = {
      ...req.body,
      resourceInfo,
      updatedBy,
      updatedByAdmin,
    };
    const branch = await updateBranch(id, payload);
    res.status(200).json(branch);
  }
);

export const deleteBranchController = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = getRequestUser(req);
    const id = Number(req.params.id);
    const { updatedBy, updatedByAdmin, resourceInfo } = assignUpdatedBy(user);
    await deleteBranch(id, { updatedBy, updatedByAdmin, resourceInfo });
    res.status(200).json({ message: MESSAGES.BRANCH_DELETED_SUCCESSFULLY });
  }
);