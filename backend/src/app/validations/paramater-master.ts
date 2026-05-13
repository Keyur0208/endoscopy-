import { celebrate, Joi, Segments } from 'celebrate';
import { InputType } from '../../../../endoscopy-shared/dist/types/report';


export const CreateParameterMasterValidator = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().trim().min(1).required(),
    inputType: Joi.string()
      .valid(
        ...Object.values(InputType)
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
        ...Object.values(InputType)
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