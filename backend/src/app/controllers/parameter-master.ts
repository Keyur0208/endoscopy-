import { Request, Response } from 'express';

import {
  createParameterMaster,
  deleteParameterMaster,
  findAllParameterMasters,
  findByParameterMasterId,
  findSearchParameterMasters,
  updateParameterMaster,
} from '../services/parameter-master';

import { AuthenticatedRequest } from '../../config/types/auth';

import { asyncHandler } from '../../utils/async-handler';
import { MESSAGES } from '../../utils/messages';
import { getRequestUser } from '../../utils/request-user';

import { ICreateParameterMaster, IUpdateParameterMaster } from '../../config/types/parameter-master';

import {
  assignCreatedBy,
  assignUpdatedBy,
} from '../../utils/model_helper';

export const createParameterMasterController =
  asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
      const user = getRequestUser(req);

      const {
        createdBy,
        createdByAdmin,
        resourceInfo,
      } = assignCreatedBy(user);

      const payload: ICreateParameterMaster = {
        ...req.body,
        resourceInfo,
        createdBy,
        createdByAdmin,
        updatedBy: null,
        updatedByAdmin: null,
      };

      const result = await createParameterMaster(payload);

      res.status(201).json(result);
    }
  );

export const getParameterMastersController =
  asyncHandler(async (req: Request, res: Response) => {
    const { page, perPage, searchedValue } = req.query;
    const user = getRequestUser(req);

    const result = await findAllParameterMasters(user, {
      page: page ? Number(page) : undefined,
      perPage: perPage ? Number(perPage) : undefined,
      searchedValue: searchedValue as string | undefined,
    });

    res.status(200).json(result);
  });

export const getSearchParameterMastersController =
  asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;
    const user = getRequestUser(req);


    const result = await findSearchParameterMasters(
      user,
      q as string
    );

    res.status(200).json(result);
  });

export const getParameterMasterByIdController =
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const result = await findByParameterMasterId(id);

    res.status(200).json(result);
  });

export const updateParameterMasterController =
  asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
      const user = getRequestUser(req);

      const id = Number(req.params.id);

      const {
        updatedBy,
        updatedByAdmin,
        resourceInfo,
      } = assignUpdatedBy(user);

      const payload: IUpdateParameterMaster = {
        ...req.body,
        resourceInfo,
        updatedBy,
        updatedByAdmin,
      };

      const result = await updateParameterMaster(id, payload);

      res.status(200).json(result);
    }
  );

export const deleteParameterMasterController =
  asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
      const user = getRequestUser(req);

      const id = Number(req.params.id);

      const {
        updatedBy,
        updatedByAdmin,
        resourceInfo,
      } = assignUpdatedBy(user);

      await deleteParameterMaster(id, {
        updatedBy,
        updatedByAdmin,
        resourceInfo,
      });

      res.status(200).json({
        message: MESSAGES.PARAMETER_MASTER_DELETED_SUCCESSFULLY,
      });
    }
  );
