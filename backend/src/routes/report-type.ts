// ============================================
// routes/report-type.ts
// ============================================

import { Router } from 'express';

import { authenticate } from '../middlewares/auth';
  import {
    createReportTypeController,
    deleteReportTypeController,
    getReportTypeByIdController,
    getReportTypesController,
    getSearchReportTypesController,
    updateReportTypeController,
} from '../app/controllers/report-type';

import {
  CreateReportTypeValidator,
  ReportTypeIdParamValidator,
  UpdateReportTypeValidator,
} from '../app/validations/report-type';

const reportTypeRouter = Router();

reportTypeRouter.use(authenticate);

reportTypeRouter
  .route('/')
  .get(getReportTypesController)
  .post(
    CreateReportTypeValidator,
    createReportTypeController
  );

reportTypeRouter
  .route('/search')
  .get(getSearchReportTypesController);

reportTypeRouter
  .route('/:id')
  .get(
    ReportTypeIdParamValidator,
    getReportTypeByIdController
  )
  .put(
    ReportTypeIdParamValidator,
    UpdateReportTypeValidator,
    updateReportTypeController
  )
  .delete(
    ReportTypeIdParamValidator,
    deleteReportTypeController
  );

export default reportTypeRouter;