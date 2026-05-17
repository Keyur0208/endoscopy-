import { DateTime } from 'luxon';
import { prisma } from '../../config/database';
import { AuthenticatedUser } from '../../config/types/auth';
import { ICreatePatient, IUpdatePatient } from '../../config/types/patient';
import { MESSAGES } from '../../utils/messages';
import { applyBranchScope } from '../../utils/model_helper';
import { Prisma } from '@prisma/client';

// ---------------------------------------------------------------------------
// UHID / RecordId generator (sequential, scoped to branch or org)
// ---------------------------------------------------------------------------

const generateUhid = async (branchId?: number | null, organizationId?: number | null): Promise<string> => {
  const where: Record<string, unknown> = { isActive: true };
  if (branchId) where.branchId = branchId;
  else if (organizationId) where.organizationId = organizationId;

  const lastPatient = await prisma.patientRegistration.findFirst({
    where,
    orderBy: { id: 'desc' },
    select: { uhid: true },
  });

  if (lastPatient?.uhid) {
    const parsed = parseInt(lastPatient.uhid, 10);
    if (!isNaN(parsed)) return String(parsed + 1);
  }

  return '1';
};

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export const findAllPatients = async (
  requester: AuthenticatedUser,
  {
    page = 1,
    perPage = 50,
    searchedValue,
    organizationId,
  }: {
    page?: number;
    perPage?: number;
    searchedValue?: string;
    organizationId?: number;
  } = {}
) => {
  const pageNumber = Number(page) || 1;
  const perPageNumber = Number(perPage) || 50;
  const skip = (pageNumber - 1) * perPageNumber;

  const baseWhere: Record<string, unknown> = { isActive: true };
  if (organizationId && requester.userType === 'admin') {
    baseWhere.organizationId = organizationId;
  }

  const where = applyBranchScope(baseWhere, requester);

  if (searchedValue && searchedValue.trim() !== '') {
    where.OR = [
      { firstName: { contains: searchedValue } },
      { lastName: { contains: searchedValue } },
      { mobile: { contains: searchedValue } },
      { uhid: { contains: searchedValue } },
      { recordId: { contains: searchedValue } },
    ];
  }

  const [patients, total, lastPatient] = await Promise.all([
    prisma.patientRegistration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPageNumber,
    }),
    prisma.patientRegistration.count({ where }),
    prisma.patientRegistration.findFirst({
      where: { isActive: true },
      orderBy: { id: 'desc' },
      select: { id: true },
    }),
  ]);

  const lastPage = Math.ceil(total / perPageNumber);

  return {
    success: true,
    data: patients,
    message: MESSAGES.PATIENT_FETCHED_SUCCESSFULLY,
    meta: {
      currentPage: pageNumber,
      perPage: perPageNumber,
      total,
      lastPage,
      lastId: lastPatient?.id ?? null,
    },
  };
};

export const getPatientSearch = async (requester: AuthenticatedUser, q?: string) => {

  try {
    const baseWhere: Record<string, unknown> = { isActive: true };
    const where = applyBranchScope(baseWhere, requester);

    if (q && q.trim() !== '') {
      where.OR = [
        { recordId: { contains: q } },
      ];
    }
    const patients = await prisma.patientRegistration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return {
      success: true,
      data: patients,
      message: MESSAGES.PATIENT_FETCHED_SUCCESSFULLY,
    };

  }
  catch (error) {
    return {
      success: false,
      data: [],
      message: MESSAGES.PATIENT_FETCHED_SUCCESSFULLY,
    };
  }
}

export const findByPatientId = async (id: number) => {
  const baseWhere = { isActive: true };

  const patient = await prisma.patientRegistration.findFirst({
    where: { id, ...baseWhere },
    include: {
      branch: true,
      organization: true,
      createdByUser: true,
      updatedByUser: true,
      createdByAdminUser: true,
      updatedByAdminUser: true,
    },
  });

  if (!patient) {
    return { success: false, message: MESSAGES.PATIENT_NOT_FOUND };
  }

  const [next, previous, positionResult, totalResult] = await Promise.all([
    prisma.patientRegistration.findFirst({
      where: { ...baseWhere, id: { gt: id } },
      orderBy: { id: 'asc' },
      select: { id: true },
    }),
    prisma.patientRegistration.findFirst({
      where: { ...baseWhere, id: { lt: id } },
      orderBy: { id: 'desc' },
      select: { id: true },
    }),
    prisma.patientRegistration.count({ where: { ...baseWhere, id: { lte: id } } }),
    prisma.patientRegistration.count({ where: baseWhere }),
  ]);

  return {
    success: true,
    data: patient,
    message: MESSAGES.PATIENT_FETCHED_SUCCESSFULLY,
    meta: {
      position: positionResult,
      total: totalResult,
      nextId: next?.id ?? null,
      prevId: previous?.id ?? null,
    },
  };
};

export const createPatient = async (payload: ICreatePatient) => {
  const today = DateTime.now().toISODate()!;

  const recordId = (await generateUhid(payload.branchId, payload.organizationId));

  const data: Prisma.PatientRegistrationUncheckedCreateInput = {
    ...payload,
    recordId,
    uhid: payload.uhid ?? '',
    registrationDate: payload.registrationDate ?? today,
    caseDate: payload.caseDate ?? today,
  };

  const patient = await prisma.patientRegistration.create({ data });

  return {
    success: true,
    message: MESSAGES.PATIENT_CREATED_SUCCESSFULLY,
    data: patient,
  };
};

export const updatePatient = async (id: number, payload: IUpdatePatient) => {
  const existing = await prisma.patientRegistration.findFirst({ where: { id, isActive: true } });

  if (!existing) {
    return { success: false, message: MESSAGES.PATIENT_NOT_FOUND };
  }

  const updated = await prisma.patientRegistration.update({ where: { id }, data: payload });

  return {
    success: true,
    data: updated,
    message: MESSAGES.PATIENT_UPDATED_SUCCESSFULLY,
  };
};

export const deletePatient = async (
  id: number,
  audit: { updatedBy?: number | null; updatedByAdmin?: number | null; resourceInfo?: string | null } = {}
) => {
  const existing = await prisma.patientRegistration.findFirst({ where: { id, isActive: true } });

  if (!existing) {
    return { success: false, message: MESSAGES.PATIENT_NOT_FOUND };
  }

  await prisma.patientRegistration.update({
    where: { id },
    data: {
      isActive: false,
      updatedBy: audit.updatedBy ?? null,
      updatedByAdmin: audit.updatedByAdmin ?? null,
      resourceInfo: audit.resourceInfo ?? null,
    },
  });

  return { success: true, message: MESSAGES.PATIENT_DELETED_SUCCESSFULLY };
};
