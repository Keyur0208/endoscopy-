import { celebrate, Joi, Segments } from 'celebrate';

export const CreateBranchValidator = celebrate({
  [Segments.BODY]: Joi.object({
    organizationId: Joi.number().integer().positive().required(),
    name: Joi.string().trim().min(1).required(),
    email: Joi.string().trim().lowercase().email().required(),
    code: Joi.string().trim().allow(null, '').optional(),
    isDefault: Joi.boolean().optional(),
    legalName: Joi.string().trim().allow(null, '').optional(),
    address: Joi.string().trim().allow(null, '').optional(),
    logoImage: Joi.string().uri().allow(null, '').optional(),
    bannerImage: Joi.string().uri().allow(null, '').optional(),
    phoneNumber: Joi.string().trim().allow(null, '').optional(),
    mobile: Joi.string().trim().allow(null, '').optional(),
    website: Joi.string().trim().allow(null, '').optional(),
    rohiniId: Joi.string().trim().allow(null, '').optional(),
    gstNo: Joi.string().trim().allow(null, '').optional(),
    jurisdiction: Joi.string().trim().allow(null, '').optional(),
    city: Joi.string().trim().allow(null, '').optional(),
    state: Joi.string().trim().allow(null, '').optional(),
    country: Joi.string().trim().allow(null, '').optional(),
    zipCode: Joi.string().trim().allow(null, '').optional(),
    isActive: Joi.boolean().optional(),
    timezone : Joi.string().trim().allow(null, '').optional(),
  }).required(),
});

export const UpdateBranchValidator = celebrate({
  [Segments.BODY]: Joi.object({
    organizationId: Joi.number().integer().positive().optional(),
    name: Joi.string().trim().min(1).optional(),
    email: Joi.string().trim().lowercase().email().optional(),
    code: Joi.string().trim().allow(null, '').optional(),
    isDefault: Joi.boolean().optional(),
    legalName: Joi.string().trim().allow(null, '').optional(),
    address: Joi.string().trim().allow(null, '').optional(),
    logoImage: Joi.string().uri().allow(null, '').optional(),
    bannerImage: Joi.string().uri().allow(null, '').optional(),
    phoneNumber: Joi.string().trim().allow(null, '').optional(),
    mobile: Joi.string().trim().allow(null, '').optional(),
    website: Joi.string().trim().allow(null, '').optional(),
    rohiniId: Joi.string().trim().allow(null, '').optional(),
    gstNo: Joi.string().trim().allow(null, '').optional(),
    jurisdiction: Joi.string().trim().allow(null, '').optional(),
    city: Joi.string().trim().allow(null, '').optional(),
    state: Joi.string().trim().allow(null, '').optional(),
    country: Joi.string().trim().allow(null, '').optional(),
    zipCode: Joi.string().trim().allow(null, '').optional(),
    isActive: Joi.boolean().optional(),
    timezone : Joi.string().trim().allow(null, '').optional(),
  })
    .min(1)
    .required(),
});

export const BranchIdParamValidator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().integer().positive().required(),
  }),
});
