import { Router } from 'express';
import {
    createOrganizationController,
    deleteOrganizationController,
    getOrganizationByIdController,
    getOrganizationsController,
    getSearchOrganizationsController,
    updateOrganizationController,
} from '../app/controllers/organization';
import { authenticate } from '../middlewares/auth';
import { allowRoles } from '../middlewares/role';
import {
    CreateOrganizationValidator,
    OrganizationIdParamValidator,
    UpdateOrganizationValidator,
} from '../app/validations/organization';

const organizationRouter = Router();

organizationRouter.use(authenticate);

organizationRouter.route('/').get(getOrganizationsController).post(allowRoles('admin'), CreateOrganizationValidator, createOrganizationController);

organizationRouter.route('/search').get(getSearchOrganizationsController);

organizationRouter
    .route('/:id')
    .get(OrganizationIdParamValidator, getOrganizationByIdController)
    .put(allowRoles('admin'), OrganizationIdParamValidator, UpdateOrganizationValidator, updateOrganizationController)
    .delete(allowRoles('admin'), OrganizationIdParamValidator, deleteOrganizationController);

export default organizationRouter;