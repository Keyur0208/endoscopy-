import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
    bulkUpdateConfigurationsController,
    createConfigurationController,
    deleteConfigurationController,
    getConfigByIdController,
    getConfigByModuleController,
    getConfigurationsController,
    updateConfigurationController,
} from '../app/controllers/configuration';
import {
    BulkUpdateConfigValidator,
    ConfigIdParamValidator,
    CreateConfigurationValidator,
    ModuleSubmoduleQueryValidator,
    UpdateConfigurationValidator,
} from '../app/validations/configuration';

const configurationRouter = Router();

configurationRouter.use(authenticate);

configurationRouter.get('/module-configs', ModuleSubmoduleQueryValidator, getConfigByModuleController);

configurationRouter
    .route('/bulk-update')
    .post(BulkUpdateConfigValidator, bulkUpdateConfigurationsController)
    .put(BulkUpdateConfigValidator, bulkUpdateConfigurationsController);

configurationRouter
    .route('/')
    .get(getConfigurationsController)
    .post(CreateConfigurationValidator, createConfigurationController);

configurationRouter
    .route('/:id')
    .get(ConfigIdParamValidator, getConfigByIdController)
    .put(ConfigIdParamValidator, UpdateConfigurationValidator, updateConfigurationController)
    .delete(ConfigIdParamValidator, deleteConfigurationController);

export default configurationRouter;
