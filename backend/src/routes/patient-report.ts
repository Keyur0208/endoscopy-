// ============================================
// routes/patient-report.ts
// ============================================

import { Router } from 'express';

import { authenticate } from '../middlewares/auth';
import { allowRoles } from '../middlewares/role';

import {
  createPatientReportController,
  deletePatientReportController,
  getPatientReportByIdController,
  getPatientReportsController,
  updatePatientReportController,
  // getPatientWiseReportsController,
} from '../app/controllers/patient-report';

import {
  CreatePatientReportValidator,
  UpdatePatientReportValidator,
  PatientReportIdParamValidator,
} from '../app/validations/patient-report';

const patientReportRouter = Router();

patientReportRouter.use(authenticate);

patientReportRouter
  .route('/')
  .get(getPatientReportsController)
  .post(
    CreatePatientReportValidator,
    createPatientReportController
  );

// patientReportRouter
//   .route('/patient/:patientId')
//   .get(
//     PatientIdParamValidator,
//     getPatientWiseReportsController
//   );

patientReportRouter
  .route('/:id')
  .get(
    PatientReportIdParamValidator,
    getPatientReportByIdController
  )
  .put(
    PatientReportIdParamValidator,
    UpdatePatientReportValidator,
    updatePatientReportController
  )
  .delete(
    PatientReportIdParamValidator,
    deletePatientReportController
  );

export default patientReportRouter;