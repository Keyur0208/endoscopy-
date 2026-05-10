
import { Request, Response } from 'express';

import {
  createReportTemplate,
  deleteReportTemplate,
  findAllReportTemplates,
  findByReportTemplateId,
  findSearchReportTemplates,
  updateReportTemplate,
} from '../services/report';

import { AuthenticatedRequest } from '../../config/types/auth';

import { asyncHandler } from '../../utils/async-handler';
import { MESSAGES } from '../../utils/messages';
import { getRequestUser } from '../../utils/request-user';

import {
  ICreateReportTemplate,
  IUpdateReportTemplate,
} from '../../config/types/report';

import {
  assignCreatedBy,
  assignUpdatedBy,
} from '../../utils/model_helper';

export const createReportTemplateController =
  asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
      const user = getRequestUser(req);

      const {
        createdBy,
        createdByAdmin,
        resourceInfo,
        branchId,
        organizationId
      } = assignCreatedBy(user);

      const payload: ICreateReportTemplate = {
        ...req.body,
        resourceInfo,
        createdBy,
        createdByAdmin,
        updatedBy: null,
        organizationId: organizationId ?? null,
        branchId: branchId ?? null,
        updatedByAdmin: null,
      };

      const result = await createReportTemplate(payload);

      res.status(201).json(result);
    }
  );

export const getReportTemplatesController =
  asyncHandler(async (req: Request, res: Response) => {
    const { page, perPage, searchedValue } = req.query;
      const user = getRequestUser(req);

    const result = await findAllReportTemplates(user, {
      page: page ? Number(page) : undefined,
      perPage: perPage ? Number(perPage) : undefined,
      searchedValue: searchedValue as string | undefined,
    });

    res.status(200).json(result);
  });

export const getSearchReportTemplatesController =
  asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;
    const user = getRequestUser(req);
    const result = await findSearchReportTemplates(user, q as string);
    res.status(200).json(result);
  });

export const getReportTemplateByIdController =
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await findByReportTemplateId( id);
    res.status(200).json(result);
  });

export const updateReportTemplateController =
  asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
      const user = getRequestUser(req);
      const id = Number(req.params.id);
      const {
        updatedBy,
        updatedByAdmin,
        resourceInfo,
        branchId,
        organizationId,
      } = assignUpdatedBy(user);

      const payload: IUpdateReportTemplate = {
        ...req.body,
        resourceInfo,
        branchId: branchId ?? null,
        organizationId: organizationId ?? null,
        updatedBy,
        updatedByAdmin,
      };

      const result = await updateReportTemplate(id, payload);

      res.status(200).json(result);
    }
  );

export const deleteReportTemplateController =
  asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
      const user = getRequestUser(req);

      const id = Number(req.params.id);

      const {
        updatedBy,
        updatedByAdmin,
        resourceInfo,
      } = assignUpdatedBy(user);

      await deleteReportTemplate(id, {
        updatedBy,
        updatedByAdmin,
        resourceInfo,
      });

      res.status(200).json({
        message: MESSAGES.REPORT_TEMPLATE_DELETED_SUCCESSFULLY,
      });
    }
  );