import { Router } from 'express';
import { authenticate } from '../middlewares/auth';

import {
  createParameterMasterController,
  deleteParameterMasterController,
  getParameterMasterByIdController,
  getParameterMastersController,
  getSearchParameterMastersController,
  updateParameterMasterController,
} from '../app/controllers/parameter-master';

import {
  CreateParameterMasterValidator,
  ParameterMasterIdParamValidator,
  UpdateParameterMasterValidator,
} from '../app/validations/paramater-master';

const parameterMasterRouter = Router();

parameterMasterRouter.use(authenticate);

parameterMasterRouter
  .route('/')
  .get(getParameterMastersController)
  .post(
    CreateParameterMasterValidator,
    createParameterMasterController
  );

parameterMasterRouter
  .route('/search')
  .get(getSearchParameterMastersController);

parameterMasterRouter
  .route('/:id')
  .get(
    ParameterMasterIdParamValidator,
    getParameterMasterByIdController
  )
  .put(
    ParameterMasterIdParamValidator,
    UpdateParameterMasterValidator,
    updateParameterMasterController
  )
  .delete(
    ParameterMasterIdParamValidator,
    deleteParameterMasterController
  );

export default parameterMasterRouter;
