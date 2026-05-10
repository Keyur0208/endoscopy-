import { Request, Response } from 'express';

import {
  createPatientReport,
  deletePatientReport,
  findAllPatientReports,
  findPatientReportById,
  getPatientReportSearch,
  updatePatientReport,
} from '../services/patient-report';

import { AuthenticatedRequest } from '../../config/types/auth';

import { asyncHandler } from '../../utils/async-handler';
import { MESSAGES } from '../../utils/messages';
import { getRequestUser } from '../../utils/request-user';


import {
  assignCreatedBy,
  assignUpdatedBy,
} from '../../utils/model_helper';
import { ICreatePatientReport, IUpdatePatientReport } from '../../config/types/patient-report';

export const createPatientReportController =
  asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
      const user = getRequestUser(req);

      const {
        createdBy,
        createdByAdmin,
        resourceInfo,
      } = assignCreatedBy(user);

      const payload: ICreatePatientReport = {
        ...req.body,
        resourceInfo,
        createdBy,
        createdByAdmin,
        updatedBy: null,
        updatedByAdmin: null,
      };

      const result = await createPatientReport(payload);

      res.status(201).json(result);
    }
  );

export const getPatientReportsController =
  asyncHandler(async (req: Request, res: Response) => {
    const { page, perPage, searchedValue } = req.query;
    const user = getRequestUser(req);

    const result = await findAllPatientReports(
      user, {
      page: page ? Number(page) : undefined,
      perPage: perPage ? Number(perPage) : undefined,
      searchedValue: searchedValue as string | undefined,
    });

    res.status(200).json(result);
  });

export const getPatientReportSearchController =
  asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;
    const user = getRequestUser(req);
    const result = await getPatientReportSearch(
      user, q as string | undefined);
    res.status(200).json(result);
  });

export const getPatientReportByIdController =
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await findPatientReportById(id);
    res.status(200).json(result);
  });

export const updatePatientReportController =
  asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
      const user = getRequestUser(req);

      const id = Number(req.params.id);

      const {
        updatedBy,
        updatedByAdmin,
        resourceInfo,
      } = assignUpdatedBy(user);

      const payload: IUpdatePatientReport = {
        ...req.body,
        resourceInfo,
        updatedBy,
        updatedByAdmin,
      };

      const result = await updatePatientReport(id, payload);

      res.status(200).json(result);
    }
  );

export const deletePatientReportController =
  asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
      const user = getRequestUser(req);

      const id = Number(req.params.id);

      await deletePatientReport(id);

      res.status(200).json({
        message: MESSAGES.PATIENT_REPORT_DELETED_SUCCESSFULLY,
      });
    }
  );