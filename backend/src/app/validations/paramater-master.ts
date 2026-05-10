import { celebrate, Joi, Segments } from 'celebrate';

export const CreateParameterMasterValidator = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().min(1).required(),
    inputType: Joi.string()
      .valid(
        'TEXT',
        'TEXTAREA',
        'NUMBER',
        'DATE',
        'CHECKBOX',
        'SELECT',
        'RICH_TEXT'
      )
      .required(),
    defaultValue: Joi.string().allow(null, '').optional(),
    isHeading: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),    
  }).required(),
});

export const UpdateParameterMasterValidator = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().min(1).optional(),
    inputType: Joi.string()
      .valid(
        'TEXT',
        'TEXTAREA',
        'NUMBER',
        'DATE',
        'CHECKBOX',
        'SELECT',
        'RICH_TEXT'
      )
      .optional(),
    defaultValue: Joi.string().allow(null, '').optional(),
    isHeading: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),    
  })
    .min(1)
    .required(),
});

export const ParameterMasterIdParamValidator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().integer().positive().required(),
  }).required(),
});