import { Router } from 'express';
import {
  createBranchController,
  deleteBranchController,
  getBranchByIdController,
  getBranchesController,
  getSearchBranchesController,
  updateBranchController,
} from '../app/controllers/branch';
import { authenticate } from '../middlewares/auth';
import { allowRoles } from '../middlewares/role';
import {
  BranchIdParamValidator,
  CreateBranchValidator,
  UpdateBranchValidator,
} from '../app/validations/branch';

const branchRouter = Router();

branchRouter.use(authenticate);

branchRouter
  .route('/')
  .get(getBranchesController)
  .post(allowRoles('admin'), CreateBranchValidator, createBranchController);

branchRouter
  .route('/search')
  .get(getSearchBranchesController);

branchRouter
  .route('/:id')
  .get(BranchIdParamValidator, getBranchByIdController)
  .put(allowRoles('admin'), BranchIdParamValidator, UpdateBranchValidator, updateBranchController)
  .delete(allowRoles('admin'), BranchIdParamValidator, deleteBranchController);

export default branchRouter;