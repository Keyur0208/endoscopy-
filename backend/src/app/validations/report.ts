import { celebrate, Joi, Segments } from 'celebrate';

export const CreateReportTemplateValidator = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().trim().min(1).required(),
    code: Joi.string().trim().allow(null, '').optional(),
    maxImages: Joi.number().integer().min(0).optional(),
    organizationId: Joi.number().integer().positive().allow(null).optional(),
    branchId: Joi.number().integer().positive().allow(null).optional(),
    isActive: Joi.boolean().optional(),    
    sections: Joi.array()
      .items(
        Joi.object({
          parameterId: Joi.number().integer().positive().required(),
          sequence: Joi.number().integer().min(1).required(),
          isRequired: Joi.boolean().optional(),
        })
      )
      .min(1)
      .required(),
  }).required(),
});

export const UpdateReportTemplateValidator = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().trim().min(1).optional(),
    code: Joi.string().trim().allow(null, '').optional(),
    maxImages: Joi.number().integer().min(0).optional(),
    organizationId: Joi.number().integer().positive().allow(null).optional(),
    branchId: Joi.number().integer().positive().allow(null).optional(),
    isActive: Joi.boolean().optional(),    
    sections: Joi.array()
      .items(
        Joi.object({
          id: Joi.number().integer().positive().optional(),
          parameterId: Joi.number().integer().positive().required(),
          sequence: Joi.number().integer().min(1).required(),
          isRequired: Joi.boolean().optional(),
        })
      )
      .optional(),
  })
    .min(1)
    .required(),
});


// =========================
// Common Params Validator
// =========================

export const ReportTemplateIdParamValidator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().integer().positive().required(),
  }),
});