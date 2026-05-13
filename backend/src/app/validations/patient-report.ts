import { celebrate, Joi, Segments } from 'celebrate';

export const CreatePatientReportValidator = celebrate({
  [Segments.BODY]: Joi.object({
    reportTypeId: Joi.number().integer().positive().required(),
    patientId: Joi.number().integer().positive().required(),
    reportDate: Joi.string().isoDate().optional(),
    entryDate: Joi.string().isoDate().optional(),
    remark: Joi.string().trim().allow(null, '').optional(),
    templateId: Joi.number().integer().positive().required(),
    organizationId: Joi.number()
      .integer()
      .positive()
      .allow(null)
      .optional(),

    branchId: Joi.number()
      .integer()
      .positive()
      .allow(null)
      .optional(),

    values: Joi.array()
      .items(
        Joi.object({
          templateSectionId: Joi.number()
            .integer()
            .positive()
            .required(),

          value: Joi.alternatives()
            .try(
              Joi.string().allow('', null),
              Joi.number(),
              Joi.boolean()
            )
            .optional(),
        })
      )
      .min(1)
      .required(),
    images: Joi.array()
      .items(
        Joi.object({
          templateSectionId: Joi.number()
            .integer()
            .positive()
            .allow(null)
            .optional(),

          imagePath: Joi.string().trim().required(),
        })
      )
      .optional(),
  }).required(),
});

export const UpdatePatientReportValidator = celebrate({
  [Segments.BODY]: Joi.object({
    patientId: Joi.number().integer().positive().required(),
    reportTypeId: Joi.number().integer().positive().required(),
    templateId: Joi.number().integer().positive().required(),
    reportDate: Joi.string().isoDate().optional(),
    entryDate: Joi.string().isoDate().optional(),
    remark: Joi.string().trim().allow(null, '').optional(),
    organizationId: Joi.number()
      .integer()
      .positive()
      .allow(null)
      .optional(),

    branchId: Joi.number()
      .integer()
      .positive()
      .allow(null)
      .optional(),

    values: Joi.array()
      .items(
        Joi.object({
          id: Joi.number().integer().positive().optional(),

          templateSectionId: Joi.number()
            .integer()
            .positive()
            .required(),

          value: Joi.alternatives()
            .try(
              Joi.string().allow('', null),
              Joi.number(),
              Joi.boolean()
            )
            .optional(),
        })
      )
      .optional(),

    images: Joi.array()
      .items(
        Joi.object({
          id: Joi.number().integer().positive().optional(),

          templateSectionId: Joi.number()
            .integer()
            .positive()
            .allow(null)
            .optional(),

          imagePath: Joi.string().trim().required(),
        })
      )
      .optional(),
  })
    .min(1)
    .required(),
});

export const PatientReportIdParamValidator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.number().integer().positive().required(),
  }).required(),
});