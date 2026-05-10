import { Response } from 'express';
import {
  createUser,
  deleteUser,
  findAllUsers,
  findByUserId,
  findSearchUsers,
  getCurrentUser,
  updateUser,
} from '../services/user';
import { AuthenticatedRequest } from '../../config/types/auth';
import { ICreateUser, IUpdateUser } from '../../config/types/user';
import { asyncHandler } from '../../utils/async-handler';
import { getRequestUser } from '../../utils/request-user';
import { assignCreatedBy, assignUpdatedBy } from '../../utils/model_helper';

export const getUsersController = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const requester = getRequestUser(req);
    const { page, perPage, search } = req.query;
    const result = await findAllUsers(requester, {
      page: page ? Number(page) : undefined,
      perPage: perPage ? Number(perPage) : undefined,
      searchedValue: search as string | undefined,
    });
    res.status(200).json(result);
  }
);

export const getProfileController = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const requester = getRequestUser(req);
    const user = await getCurrentUser(requester);
    res.status(200).json(user);
  }
);

export const getUserByIdController = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const requester = getRequestUser(req);
    const id = Number(req.params.id);
    const user = await findByUserId(id, requester);
    res.status(200).json(user);
  }
);

export const getSearchUsersController = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const requester = getRequestUser(req);
    const { q } = req.query;
    const result = await findSearchUsers(requester, q as string);
    res.status(200).json(result);
  }
);

export const createUserController = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = getRequestUser(req);
    const { createdBy, createdByAdmin, resourceInfo, branchId: auditBranchId } = assignCreatedBy(user);
    const payload: ICreateUser = {
      ...req.body,
      resourceInfo,
      createdBy,
      createdByAdmin,
      updatedBy: null,
      updatedByAdmin: null,
    };
    const result = await createUser(payload);
    res.status(201).json(result);
  }
);

export const updateUserController = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = getRequestUser(req);
    const id = Number(req.params.id);
    const { updatedBy, updatedByAdmin, resourceInfo } = assignUpdatedBy(user);
    const payload: IUpdateUser = {
      ...req.body,
      resourceInfo,
      updatedBy,
      updatedByAdmin,
    };
    const result = await updateUser(id, payload, user);
    res.status(200).json(result);
  }
);

export const deleteUserController = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = getRequestUser(req);
    const id = Number(req.params.id);
    const { updatedBy, updatedByAdmin, resourceInfo } = assignUpdatedBy(user);
    const result = await deleteUser(id, user, { updatedBy, updatedByAdmin, resourceInfo });
    res.status(200).json(result);
  }
);