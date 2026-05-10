import { celebrate, Joi, Segments } from 'celebrate';

export const CreateOrganizationValidator = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().min(1).required(),
    bannerImage: Joi.string().uri().allow(null, '').optional(),
    logoImage: Joi.string().uri().allow(null, '').optional(),
    legalName: Joi.string().trim().allow(null, '').optional(),
    email: Joi.string().trim().lowercase().email().required(),
    mobile: Joi.string().trim().allow(null, '').optional(),
    licenseKey: Joi.string().trim().allow(null, '').optional(),
    licenseType: Joi.string().trim().allow(null, '').optional(),
    expiryDate: Joi.string().trim().allow(null, '').optional(),
    status: Joi.string().trim().allow(null, '').optional(),
    isActive: Joi.boolean().optional(),
  }).required(),
});

export const UpdateOrganizationValidator = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().min(1).optional(),
    bannerImage: Joi.string().uri().allow(null, '').optional(),
    logoImage: Joi.string().uri().allow(null, '').optional(),
    legalName: Joi.string().trim().allow(null, '').optional(),
    email: Joi.string().trim().lowercase().email().optional(),
    mobile: Joi.string().trim().allow(null, '').optional(),
    licenseKey: Joi.string().trim().allow(null, '').optional(),
    licenseType: Joi.string().trim().allow(null, '').optional(),
    expiryDate: Joi.string().trim().allow(null, '').optional(),
    status: Joi.string().trim().allow(null, '').optional(),
    isActive: Joi.boolean().optional(),
  })
    .min(1)
    .required(),
});

export const OrganizationIdParamValidator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().integer().positive().required(),
  }),
});