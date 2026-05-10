import { celebrate, Joi, Segments } from 'celebrate';

export const UserIdParamValidator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().integer().positive().required(),
  }),
});

export const CreateUserValidator = celebrate({
  [Segments.BODY]: Joi.object({
    fullName: Joi.string().trim().min(1).required(),
    email: Joi.string().trim().lowercase().email().required(),
    mobile: Joi.string().trim().allow(null, '').optional(),
    password: Joi.string().min(6).required(),
    isActive: Joi.boolean().optional(),
    isOrganizationAdmin: Joi.boolean().optional(),
    isOtpRequired: Joi.boolean().optional(),
    canSwitchBranch: Joi.boolean().optional(),
    organizationId: Joi.number().integer().positive().allow(null).optional(),
    branchId: Joi.number().integer().positive().allow(null).optional(),
  }).unknown(true).required(),
});

export const UpdateUserValidator = celebrate({
  [Segments.BODY]: Joi.object({
    fullName: Joi.string().trim().min(1).optional(),
    email: Joi.string().trim().lowercase().email().optional(),
    mobile: Joi.string().trim().allow(null, '').optional(),
    password: Joi.string().min(6).optional(),
    isActive: Joi.boolean().optional(),
    isOrganizationAdmin: Joi.boolean().optional(),
    isOtpRequired: Joi.boolean().optional(),
    canSwitchBranch: Joi.boolean().optional(),
    organizationId: Joi.number().integer().positive().allow(null).optional(),
    branchId: Joi.number().integer().positive().allow(null).optional(),
  }).unknown(true)
    .min(1)
    .required(),
});