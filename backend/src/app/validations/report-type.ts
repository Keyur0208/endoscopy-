import { celebrate, Joi, Segments } from 'celebrate';

export const CreateReportTypeValidator = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().min(1).required(),
    code: Joi.string().trim().optional(),
    description: Joi.string().allow(null, '').optional(),
    isActive: Joi.boolean().optional(),
    isDefault: Joi.boolean().optional(),
    organizationId: Joi.number().integer().positive().optional(),
    branchId: Joi.number().integer().positive().optional(),
  }).required(),
});

export const UpdateReportTypeValidator = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().min(1).optional(),
    code: Joi.string().trim().optional(),
    description: Joi.string().allow(null, '').optional(),
    isActive: Joi.boolean().optional(),
    isDefault: Joi.boolean().optional(),
    organizationId: Joi.number().integer().positive().optional(),
    branchId: Joi.number().integer().positive().optional(),
  })
    .min(1)
    .required(),
});

export const ReportTypeIdParamValidator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().integer().positive().required(),
  }).required(),
});