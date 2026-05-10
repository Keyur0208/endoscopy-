import type {
  IPaginationFilter,
  IPaginatedResponseMeta,
  ICurrentPaginatedResponse,
} from 'src/types/pagination-fillter';
import type {
  IPatientRegistrationItem,
  ICreatePatientRegistration,
  IUpdatePatientRegistration,
} from 'src/types/patient-registration';

import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------
// SWR Options for data fetching
const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// patient registration list with pagination

export function useGetPatientRegistrations(params: IPaginationFilter) {
  const queryParams = new URLSearchParams();

  if (params?.searchFor) queryParams.append('searchFor', params.searchFor);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.perPage) queryParams.append('perPage', params.perPage.toString());
  if (params?.searchedValue) queryParams.append('searchedValue', params.searchedValue);

  const url = `${endpoints.patientRegistration.getAll}?${queryParams.toString()}`;

  const { data, isLoading, error, isValidating } = useSWR<{
    data: IPatientRegistrationItem[];
    meta?: IPaginatedResponseMeta;
  }>(url, fetcher, swrOptions);

  return useMemo(
    () => ({
      patientRegistrations: data?.data || [],
      patientRegistrationsMeta: data?.meta || undefined,
      isLoading,
      patientRegistrationsError: error,
      patientRegistrationsValidating: isValidating,
      patientRegistrationsEmpty: !isLoading && (!data?.data || data.data.length === 0),
    }),
    [data?.data, data?.meta, error, isLoading, isValidating]
  );
}

// Hook to fetch a single patient registration by ID
export function useGetPatientRegistration(patientRegistrationId?: number | null) {
  const url = patientRegistrationId
    ? endpoints.patientRegistration.getById(patientRegistrationId)
    : null;

  const { data, isLoading, error, isValidating } = useSWR<{
    data: IPatientRegistrationItem;
    meta: ICurrentPaginatedResponse;
  }>(url, fetcher);

  return useMemo(
    () => ({
      patientRegistrationMeta: data?.meta || undefined,
      patientRegistration: data?.data || null,
      isLoading,
      patientRegistrationError: error,
      patientRegistrationValidating: isValidating,
      patientRegistrationEmpty: !data && !isLoading && !error,
    }),
    [data, error, isLoading, isValidating]
  );
}

// Hook to search patient registrations by name
export function useSearchPatientRegistrations(name: string) {
  const url = `${endpoints.patientRegistration.search}?q=${name.toString()}`;

  const { data, isLoading, error, isValidating } = useSWR<{ data: IPatientRegistrationItem[] }>(
    url,
    fetcher
  );

  return useMemo(
    () => ({
      searchPatientRegistrations: data?.data || [],
      searchPatientRegistrationsIsLoading: isLoading,
      searchPatientRegistrationsError: error,
      searchPatientRegistrationsValidating: isValidating,
      searchPatientRegistrationsEmpty: !data && !isLoading && !error,
    }),
    [data, error, isLoading, isValidating]
  );
}

// ----------------------------------------------------------------------
// Create Patient Registration
export async function createPatientRegistration(
  patientRegistrationData: ICreatePatientRegistration
) {
  const url = endpoints.patientRegistration.create;
  try {
    const res = await axios.post(url, patientRegistrationData);
    if (res?.data?.status === true) {
      toast.success('Patient registration created successfully');
      return res.data?.data;
    }
    return null;
  } catch (error) {
    toast.error(
      `Failed to create patient registration: ${error?.response?.data?.message || error.message}`
    );
  }
  return null;
}

// Update Patient Registration
export async function updatePatientRegistration(
  patientRegistrationId: number,
  patientRegistrationData: IUpdatePatientRegistration,
  isRecentMsg?: boolean
) {
  const params = new URLSearchParams();
  if (typeof isRecentMsg !== 'undefined') {
    params.append('isSendSms', String(isRecentMsg));
  }

  const url = `${endpoints.patientRegistration.update(patientRegistrationId)}?${params.toString()}`;
  try {
    const res = await axios.put(url, { patientRegistrationId, ...patientRegistrationData });
    if (res?.data?.status === true) {
      toast.success('Patient registration updated successfully');
    }
  } catch (error) {
    toast.error(
      `Failed to update patient registration: ${error?.response?.data?.message || error.message}`
    );
  }
}

// Delete Patient Registration
export async function deletePatientRegistration(patientRegistrationId: number) {
  const url = endpoints.patientRegistration.delete(patientRegistrationId);
  try {
    const res = await axios.delete(url);
    if (res?.data?.status === true) {
      toast.success('Patient registration deleted successfully');
    }
    return res;
  } catch (error) {
    toast.error(
      `Failed to delete patient registration: ${error?.response?.data?.message || error.message}`
    );
    throw error;
  }
}
