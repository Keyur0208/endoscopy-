import { prisma } from '../../config/database';
import { AuthenticatedUser } from '../../config/types/auth';
import {
  ICreatePatientReport,
  IUpdatePatientReport,
} from '../../config/types/patient-report';
import { MESSAGES } from '../../utils/messages';
import { applyBranchScope } from '../../utils/model_helper';


export const findAllPatientReports = async (
  requester: AuthenticatedUser,
  {
    page = 1,
    perPage = 50,
    searchedValue,
  }: {
    page?: number;
    perPage?: number;
    searchedValue?: string;
  } = {}
) => {
  try {
    const pageNumber = Number(page) || 1;
    const perPageNumber = Number(perPage) || 50;
    const skip = (pageNumber - 1) * perPageNumber;
    const baseWhere: Record<string, unknown> = {};

    const where = applyBranchScope(baseWhere, requester);

    if (searchedValue && searchedValue.trim() !== '') {
      where.OR = [
        {
          template: {
            title: {
              contains: searchedValue,
              mode: 'insensitive' as const,
            },
          },
        },
        {
          patient: {
            firstName: {
              contains: searchedValue,
              mode: 'insensitive' as const,
            },
            middleName: {
              contains: searchedValue,
              mode: 'insensitive' as const,
            },
            lastName: {
              contains: searchedValue,
              mode: 'insensitive' as const,
            },
            mobile: {
              contains: searchedValue,
            },
          },
        },
      ];
    }

    const [reports, total, lastReport] = await Promise.all([
      prisma.patientReport.findMany({
        where,

        include: {
          patient: true,
          template: true,
          branch: true,
          organization: true,

          values: {
            include: {
              templateSection: true,
            },
          },
          images: true,
          createdByUser: true,
          updatedByUser: true,
          createdByAdminUser: true,
          updatedByAdminUser: true,
        },

        orderBy: {
          createdAt: 'desc',
        },

        skip,
        take: perPageNumber,
      }),

      prisma.patientReport.count({
        where,
      }),

      prisma.patientReport.findFirst({
        orderBy: {
          id: 'desc',
        },
        select: {
          id: true,
        },
      }),
    ]);

    return {
      success: true,
      data: reports,
      message: MESSAGES.PATIENT_REPORT_FETCHED_SUCCESSFULLY,
      meta: {
        currentPage: pageNumber,
        perPage: perPageNumber,
        total,
        lastPage: Math.ceil(total / perPageNumber),
        lastId: lastReport?.id ?? null,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: MESSAGES.COMMON_MESSAGES_ERROR,
      error: error?.message,
    };
  }
};

export const getPatientReportSearch = async (
  requester: AuthenticatedUser,
  q?: string
) => {
  try {
    const baseWhere: Record<string, unknown> = {};

    const where = applyBranchScope(baseWhere, requester);

    if (q && q.trim() !== '') {
      where.OR = [
        {
          template: {
            title: {
              contains: q,
            },
          },
        },
      ];
    }

    const reports = await prisma.patientReport.findMany({
      where,

      include: {
        patient: true,
        template: true,
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: 50,
    });

    return {
      success: true,
      data: reports,
      message: MESSAGES.PATIENT_REPORT_FETCHED_SUCCESSFULLY,
    };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: MESSAGES.COMMON_MESSAGES_ERROR,
      error: error?.message,
    };
  }
};

export const findPatientReportById = async (id: number) => {
  try {
    const report = await prisma.patientReport.findFirst({
      where: {
        id,
      },

      include: {
        patient: true,
        template: true,
        branch: true,
        organization: true,

        values: {
          include: {
            templateSection: true,
          },
        },

        reportType: true,

        images: true,

        createdByUser: true,
        updatedByUser: true,
        createdByAdminUser: true,
        updatedByAdminUser: true,
      },
    });

    if (!report) {
      return {
        success: false,
        message: MESSAGES.PATIENT_REPORT_NOT_FOUND,
      };
    }

    const [next, previous, positionResult, totalResult] = await Promise.all([
      prisma.patientReport.findFirst({
        where: {
          id: {
            gt: id,
          },
        },

        orderBy: {
          id: 'asc',
        },

        select: {
          id: true,
        },
      }),

      prisma.patientReport.findFirst({
        where: {
          id: {
            lt: id,
          },
        },

        orderBy: {
          id: 'desc',
        },

        select: {
          id: true,
        },
      }),

      prisma.patientReport.count({
        where: {
          id: {
            lte: id,
          },
        },
      }),

      prisma.patientReport.count(),
    ]);

    return {
      success: true,
      data: report,
      message: MESSAGES.PATIENT_REPORT_FETCHED_SUCCESSFULLY,

      meta: {
        position: positionResult,
        total: totalResult,
        nextId: next?.id ?? null,
        prevId: previous?.id ?? null,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: MESSAGES.COMMON_MESSAGES_ERROR,
      error: error?.message,
    };
  }
};


export const createPatientReport = async (
  payload: ICreatePatientReport
) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const template = await tx.reportTemplate.findFirst({
        where: {
          id: payload.templateId,
        },

        include: {
          sections: {
            include: {
              parameter: true,
            },

            orderBy: {
              sequence: 'asc',
            },
          },
        },
      });

      if (!template) {
        throw new Error(MESSAGES.REPORT_TEMPLATE_NOT_FOUND);
      }

      const patient = await tx.patientRegistration.findFirst({
        where: {
          id: payload.patientId,
          isActive: true,
        },
      });

      if (!patient) {
        throw new Error(MESSAGES.PATIENT_NOT_FOUND);
      }

      const { values, images, ...reportData } = payload;

      const report = await tx.patientReport.create({
        data: {
          ...reportData,
          patientId: payload.patientId,
          reportDate: payload.reportDate,
          entryDate: payload.entryDate,
          reportTypeId: payload.reportTypeId ?? null,
          templateId: payload.templateId,
          organizationId: payload.organizationId ?? null,
          branchId: payload.branchId ?? null,
          createdBy: payload.createdBy ?? null,
          updatedBy: payload.updatedBy ?? null,
          createdByAdmin: payload.createdByAdmin ?? null,
          updatedByAdmin: payload.updatedByAdmin ?? null,
          resourceInfo: payload.resourceInfo ?? null,
        },
      });

      if (values?.length) {
        await tx.patientReportValue.createMany({
          data: values.map((item) => ({
            reportId: report.id,
            templateSectionId: item.templateSectionId ?? null,
            value: item.value,
            createdBy: payload.createdBy ?? null,
            updatedBy: payload.updatedBy ?? null,
            createdByAdmin: payload.createdByAdmin ?? null,
            updatedByAdmin: payload.updatedByAdmin ?? null,
            resourceInfo: payload.resourceInfo ?? null,
          })),
        });
      }

      if (images?.length) {
        await tx.patientReportImage.createMany({
          data: images.map((item) => ({
            reportId: report.id,
            templateSectionId: item.templateSectionId ?? null,
            imagePath: item.imagePath,
            createdBy: payload.createdBy ?? null,
            updatedBy: payload.updatedBy ?? null,
            createdByAdmin: payload.createdByAdmin ?? null,
            updatedByAdmin: payload.updatedByAdmin ?? null,
            resourceInfo: payload.resourceInfo ?? null,
          })),
        });
      }

      return {
        success: true,
        data: report,
        message: MESSAGES.PATIENT_REPORT_CREATED_SUCCESSFULLY,
      };
    });
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || MESSAGES.COMMON_MESSAGES_ERROR,
      error: error?.message,
    };
  }
};


export const updatePatientReport = async (
  id: number,
  payload: IUpdatePatientReport
) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const existingReport = await tx.patientReport.findFirst({
        where: {
          id,
        },
      });

      if (!existingReport) {
        throw new Error(MESSAGES.PATIENT_REPORT_NOT_FOUND);
      }

      const patient = await tx.patientRegistration.findFirst({
        where: {
          id: payload.patientId,
          isActive: true,
        },
      });

      if (!patient) {
        throw new Error(MESSAGES.PATIENT_NOT_FOUND);
      }

      const template = await tx.reportTemplate.findFirst({
        where: {
          id: payload.templateId,
          isActive: true,
        },
      });

      if (!template) {
        throw new Error(MESSAGES.REPORT_TEMPLATE_NOT_FOUND);
      }

      await tx.patientReport.update({
        where: {
          id,
        },

        data: {
          templateId: payload.templateId,
          reportTypeId: payload.reportTypeId ?? null,
          reportDate: payload.reportDate,
          entryDate: payload.entryDate,
          updatedBy: payload.updatedBy ?? null,
          updatedByAdmin: payload.updatedByAdmin ?? null,
          resourceInfo: payload.resourceInfo ?? null,
        },
      });


      await tx.patientReportValue.deleteMany({
        where: {
          reportId: id,
        },
      });

      await tx.patientReportImage.deleteMany({
        where: {
          reportId: id,
        },
      });

      const validSectionIds = (
        await tx.reportTemplateSection.findMany({
          where: {
            templateId: payload.templateId,
          },

          select: {
            id: true,
          },
        })
      ).map((item) => item.id);

      if (payload.values?.length) {
        const invalidValueSection = payload.values.find(
          (item) =>
            item.templateSectionId &&
            !validSectionIds.includes(item.templateSectionId)
        );

        if (invalidValueSection) {
          throw new Error('Invalid template section in report values');
        }

        await tx.patientReportValue.createMany({
          data: payload.values.map((item) => ({
            reportId: id,
            // reportDate: payload.reportDate,
            // entryDate: payload.entryDate,
            reportTypeId: payload.reportTypeId ?? null,
            templateSectionId: item.templateSectionId ?? null,
            value: item.value,
            createdBy: payload.createdBy ?? null,
            updatedBy: payload.updatedBy ?? null,
            createdByAdmin: payload.createdByAdmin ?? null,
            updatedByAdmin: payload.updatedByAdmin ?? null,
            resourceInfo: payload.resourceInfo ?? null,
          })),
        });
      }

      if (payload.images?.length) {
        const invalidImageSection = payload.images.find(
          (item) =>
            item.templateSectionId &&
            !validSectionIds.includes(item.templateSectionId)
        );

        if (invalidImageSection) {
          throw new Error('Invalid template section in report images');
        }

        await tx.patientReportImage.createMany({
          data: payload.images.map((item) => ({
            reportId: id,
            templateSectionId: item.templateSectionId ?? null,
            imagePath: item.imagePath ?? '',
            createdBy: payload.createdBy ?? null,
            updatedBy: payload.updatedBy ?? null,
            createdByAdmin: payload.createdByAdmin ?? null,
            updatedByAdmin: payload.updatedByAdmin ?? null,
            resourceInfo: payload.resourceInfo ?? null,
          })),
        });
      }

      return {
        success: true,
        message: MESSAGES.PATIENT_REPORT_UPDATED_SUCCESSFULLY,
      };
    });
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || MESSAGES.COMMON_MESSAGES_ERROR,
      error: error?.message,
    };
  }
 
};

// ---------------------------------------------------------------------------
// Delete Patient Report
// ---------------------------------------------------------------------------

export const deletePatientReport = async (id: number) => {
  try {
    const existingReport = await prisma.patientReport.findFirst({
      where: {
        id,
      },
    });

    if (!existingReport) {
      return {
        success: false,
        message: MESSAGES.PATIENT_REPORT_NOT_FOUND,
      };
    }

    await prisma.patientReportValue.deleteMany({
      where: {
        reportId: id,
      },
    });

    await prisma.patientReportImage.deleteMany({
      where: {
        reportId: id,
      },
    });

    await prisma.patientReport.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: MESSAGES.PATIENT_REPORT_DELETED_SUCCESSFULLY,
    };
  } catch (error: any) {
    return {
      success: false,
      message: MESSAGES.COMMON_MESSAGES_ERROR,
      error: error?.message,
    };
  }
};