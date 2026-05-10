import { celebrate, Joi, Segments } from 'celebrate';
import { FIELD_TYPES } from 'endoscopy-shared';

export const CreateConfigurationValidator = celebrate({
    [Segments.BODY]: Joi.object({
        module: Joi.string().trim().min(1).required(),
        subModule: Joi.string().trim().min(1).required(),
        fieldKey: Joi.string().trim().min(1).required(),
        fieldLabel: Joi.string().trim().min(1).required(),
        fieldType: Joi.string().valid(...Object.values(FIELD_TYPES)).required(),
        value: Joi.any().optional(),
        defaultValue: Joi.any().optional(),
        meta: Joi.any().optional(),
        isActive: Joi.boolean().optional(),
        priority: Joi.number().integer().min(0).optional(),
        branchId: Joi.number().integer().positive().allow(null).optional(),
        organizationId: Joi.number().integer().positive().allow(null).optional(),
    }).required(),
});

export const UpdateConfigurationValidator = celebrate({
    [Segments.BODY]: Joi.object({
        module: Joi.string().trim().min(1).optional(),
        subModule: Joi.string().trim().min(1).optional(),
        fieldKey: Joi.string().trim().min(1).optional(),
        fieldLabel: Joi.string().trim().min(1).optional(),
        fieldType: Joi.string().valid(...Object.values(FIELD_TYPES)).optional(),
        value: Joi.any().optional(),
        defaultValue: Joi.any().optional(),
        meta: Joi.any().optional(),
        isActive: Joi.boolean().optional(),
        priority: Joi.number().integer().min(0).optional(),
        branchId: Joi.number().integer().positive().allow(null).optional(),
        organizationId: Joi.number().integer().positive().allow(null).optional(),
    })
        .min(1)
        .required(),
});

export const ConfigIdParamValidator = celebrate({
    [Segments.PARAMS]: Joi.object({
        id: Joi.number().integer().positive().required(),
    }),
});

export const ModuleSubmoduleQueryValidator = celebrate({
    [Segments.QUERY]: Joi.object({
        module: Joi.string().trim().min(1).required(),
        subModule: Joi.string().trim().min(1).required(),
    }).unknown(true),
});

export const BulkUpdateConfigValidator = celebrate({
    [Segments.BODY]: Joi.array()
        .items(
            Joi.object({
                module: Joi.string().trim().min(1).required(),
                subModule: Joi.string().trim().min(1).required(),
                fieldKey: Joi.string().trim().min(1).required(),
                fieldLabel: Joi.string().trim().optional(),
                fieldType: Joi.string().valid(...Object.values(FIELD_TYPES)).optional(),
                value: Joi.any().optional(),
                defaultValue: Joi.any().optional(),
                meta: Joi.any().optional(),
                isActive: Joi.boolean().optional(),
                priority: Joi.number().integer().min(0).optional(),
             }).unknown(true)
        )
        .min(1)
        .required(),
});
