// ============================================
// routes/report-template.ts
// ============================================

import { Router } from 'express';

import { authenticate } from '../middlewares/auth';
import {
  createReportTemplateController,
  deleteReportTemplateController,
  getReportTemplateByIdController,
  getReportTemplatesController,
  getSearchReportTemplatesController,
  updateReportTemplateController,
} from '../app/controllers/report';

import {
  CreateReportTemplateValidator,
  ReportTemplateIdParamValidator,
  UpdateReportTemplateValidator,
} from '../app/validations/report';

const reportTemplateRouter = Router();

reportTemplateRouter.use(authenticate);

reportTemplateRouter
  .route('/')
  .get(getReportTemplatesController)
  .post(
    CreateReportTemplateValidator,
    createReportTemplateController
  );

reportTemplateRouter
  .route('/search')
  .get(getSearchReportTemplatesController);

reportTemplateRouter
  .route('/:id')
  .get(
    ReportTemplateIdParamValidator,
    getReportTemplateByIdController
  )
  .put(
    ReportTemplateIdParamValidator,
    UpdateReportTemplateValidator,
    updateReportTemplateController
  )
  .delete(
    ReportTemplateIdParamValidator,
    deleteReportTemplateController
  );

export default reportTemplateRouter;