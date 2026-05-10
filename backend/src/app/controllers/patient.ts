import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../config/types/auth';
import { ICreatePatient, IUpdatePatient } from '../../config/types/patient';
import { asyncHandler } from '../../utils/async-handler';
import { getRequestUser } from '../../utils/request-user';
import { assignCreatedBy, assignUpdatedBy } from '../../utils/model_helper';
import {
    createPatient,
    deletePatient,
    findAllPatients,
    findByPatientId,
    getPatientSearch,
    updatePatient,
} from '../services/patient';

export const getPatientsController = asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
        const user = getRequestUser(req);
        const { page, perPage, search, organizationId } = req.query;

        const result = await findAllPatients(user, {
            page: page ? Number(page) : undefined,
            perPage: perPage ? Number(perPage) : undefined,
            searchedValue: search as string | undefined,
            organizationId: organizationId ? Number(organizationId) : undefined,
        });

        res.status(200).json(result);
    }
);

export const getPatientSearchController = asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
        const user = getRequestUser(req);
        const { q } = req.query;
        const result = await getPatientSearch(user, q as string | undefined);
        res.status(200).json(result);
    }
);

export const getPatientByIdController = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await findByPatientId(id);
    res.status(200).json(result);
});

export const createPatientController = asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
        const user = getRequestUser(req);
        const { createdBy, createdByAdmin, resourceInfo, branchId: auditBranchId } = assignCreatedBy(user);

        const payload: ICreatePatient = {
            ...req.body,
            resourceInfo,
            createdBy,
            createdByAdmin,
            updatedBy: null,
            updatedByAdmin: null,
            branchId: user.userType === 'admin' ? (req.body.branchId ?? null) : (auditBranchId ?? null),
        };

        const result = await createPatient(payload);
        res.status(201).json(result);
    }
);

export const updatePatientController = asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
        const user = getRequestUser(req);
        const id = Number(req.params.id);
        const { updatedBy, updatedByAdmin, resourceInfo } = assignUpdatedBy(user);

        const payload: IUpdatePatient = {
            ...req.body,
            resourceInfo,
            updatedBy,
            updatedByAdmin,
        };

        const result = await updatePatient(id, payload);
        res.status(200).json(result);
    }
);

export const deletePatientController = asyncHandler<AuthenticatedRequest>(
    async (req: AuthenticatedRequest, res: Response) => {
        const user = getRequestUser(req);
        const id = Number(req.params.id);
        const { updatedBy, updatedByAdmin, resourceInfo } = assignUpdatedBy(user);

        const result = await deletePatient(id, { updatedBy, updatedByAdmin, resourceInfo });
        res.status(200).json(result);
    }
);
