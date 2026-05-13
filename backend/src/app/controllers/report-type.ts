import { Request, Response } from 'express';
import {
  createReportType,
  deleteReportType,
  findAllReportTypes,
  findByReportTypeId,
  searchReportType,
  updateReportType,
} from '../services/report-type';
import { AuthenticatedRequest } from '../../config/types/auth';
import { asyncHandler } from '../../utils/async-handler';
import { MESSAGES } from '../../utils/messages';
import { getRequestUser } from '../../utils/request-user';
import { assignCreatedBy, assignUpdatedBy } from '../../utils/model_helper';
import { ICreateReportType, IUpdateReportType } from '../../config/types/report-type';

export const createReportTypeController = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = getRequestUser(req);
    const { createdBy, createdByAdmin, resourceInfo, branchId, organizationId } = assignCreatedBy(user);
    const payload: ICreateReportType = {
      ...req.body,
      resourceInfo,
      createdBy,
      createdByAdmin,
      updatedBy: null,
      updatedByAdmin: null,
      organizationId: organizationId ?? null,
      branchId: branchId ?? null,
    };
    const result = await createReportType(payload);
    res.status(201).json(result);
  }
);

export const getReportTypesController = asyncHandler(async (req: Request, res: Response) => {
  const { page, perPage, searchedValue } = req.query;
  const user = getRequestUser(req);
  const result = await findAllReportTypes(user, {
    page: page ? Number(page) : undefined,
    perPage: perPage ? Number(perPage) : undefined,
    searchedValue: searchedValue as string | undefined,
  });
  res.status(200).json(result);
});

export const getSearchReportTypesController = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;
  const user = getRequestUser(req);
  const result = await searchReportType(user, q as string);
  res.status(200).json(result);
});

export const getReportTypeByIdController = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await findByReportTypeId(id);
  res.status(200).json(result);
});

export const updateReportTypeController = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = getRequestUser(req);
    const id = Number(req.params.id);
    const { updatedBy, updatedByAdmin, resourceInfo, branchId, organizationId } = assignUpdatedBy(user);
    const payload: IUpdateReportType = {
      ...req.body,
      resourceInfo,
      branchId: branchId ?? null,
      organizationId: organizationId ?? null,
      updatedBy,
      updatedByAdmin,
    };
    const result = await updateReportType(id, payload);
    res.status(200).json(result);
  }
);

export const deleteReportTypeController = asyncHandler<AuthenticatedRequest>(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = getRequestUser(req);
    const id = Number(req.params.id);
    const { updatedBy, updatedByAdmin, resourceInfo } = assignUpdatedBy(user);
    await deleteReportType(id, { updatedBy, updatedByAdmin, resourceInfo });
    res.status(200).json({ message: MESSAGES.REPORT_TYPE_DELETED_SUCCESSFULLY });
  }
);
