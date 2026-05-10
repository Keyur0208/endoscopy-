import { Router } from 'express';
import {
  createPatientController,
  deletePatientController,
  getPatientByIdController,
  getPatientsController,
  getPatientSearchController,
  updatePatientController,
} from '../app/controllers/patient';
import { authenticate } from '../middlewares/auth';
import {
  CreatePatientValidator,
  PatientIdParamValidator,
  UpdatePatientValidator,
} from '../app/validations/patient';

const patientRouter = Router();

patientRouter.use(authenticate);

patientRouter
  .route('/')
  .get(getPatientsController)
  .post(CreatePatientValidator, createPatientController);

patientRouter.get('/search', getPatientSearchController);

patientRouter
  .route('/:id')
  .get(PatientIdParamValidator, getPatientByIdController)
  .put(PatientIdParamValidator, UpdatePatientValidator, updatePatientController)
  .delete(PatientIdParamValidator, deletePatientController);

export default patientRouter;
