import type {
  IPaginationFilter,
  IPaginatedResponseMeta,
  ICurrentPaginatedResponse,
} from 'src/types/pagination-fillter';
import type {
  IParameterMasterRecord,
  ICreateParameterMaster,
  IUpdateParameterMaster,
} from 'src/types/parameter-master';

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

// parameter master list with pagination

export function useGetParameterMasters(params: IPaginationFilter) {
  const queryParams = new URLSearchParams();

  if (params?.searchFor) queryParams.append('searchFor', params.searchFor);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.perPage) queryParams.append('perPage', params.perPage.toString());
  if (params?.searchedValue) queryParams.append('searchedValue', params.searchedValue);

  const url = `${endpoints.parameterMaster.getAll}?${queryParams.toString()}`;

  const { data, isLoading, error, isValidating } = useSWR<{
    data: IParameterMasterRecord[];
    meta?: IPaginatedResponseMeta;
  }>(url, fetcher, swrOptions);

  return useMemo(
    () => ({
      parameterMasters: data?.data || [],
      parameterMastersMeta: data?.meta || undefined,
      isLoading,
      parameterMastersError: error,
      parameterMastersValidating: isValidating,
      parameterMastersEmpty: !isLoading && (!data?.data || data.data.length === 0),
    }),
    [data?.data, data?.meta, error, isLoading, isValidating]
  );
}

// Hook to fetch a single parameter master by ID
export function useGetParameterMaster(parameterMasterId?: number | null) {
  const url = parameterMasterId ? endpoints.parameterMaster.getById(parameterMasterId) : null;

  const { data, isLoading, error, isValidating } = useSWR<{
    data: IParameterMasterRecord;
    meta: ICurrentPaginatedResponse;
  }>(url, fetcher);

  return useMemo(
    () => ({
      parameterMasterMeta: data?.meta || undefined,
      parameterMaster: data?.data || null,
      isLoading,
      parameterMasterError: error,
      parameterMasterValidating: isValidating,
      parameterMasterEmpty: !data && !isLoading && !error,
    }),
    [data, error, isLoading, isValidating]
  );
}

// Hook to search parameter masters by name
export function useSearchParameterMasters(name: string) {
  const url = `${endpoints.parameterMaster.search}?q=${name.toString()}`;

  const { data, isLoading, error, isValidating } = useSWR<{ data: IParameterMasterRecord[] }>(
    url,
    fetcher
  );

  return useMemo(
    () => ({
      searchParameterMasters: data?.data || [],
      searchParameterMastersIsLoading: isLoading,
      searchParameterMastersError: error,
      searchParameterMastersValidating: isValidating,
      searchParameterMastersEmpty: !data && !isLoading && !error,
    }),
    [data, error, isLoading, isValidating]
  );
}

// ----------------------------------------------------------------------
// Create Parameter Master
export async function createParameterMaster(parameterMasterData: ICreateParameterMaster) {
  const url = endpoints.parameterMaster.create;
  try {
    const res = await axios.post(url, parameterMasterData);
    if (res?.data?.success === true) {
      toast.success('Parameter master created successfully');
      return res.data?.data;
    }
    toast.error(`Failed to create parameter master: ${res?.data?.message || 'Unknown error'}`);
    return null;
  } catch (error) {
    toast.error(
      `Failed to create parameter master: ${error?.response?.data?.message || error.message}`
    );
  }
  return null;
}

// Update Parameter Master
export async function updateParameterMaster(
  parameterMasterId: number,
  parameterMasterData: IUpdateParameterMaster
) {
  const url = endpoints.parameterMaster.update(parameterMasterId);
  try {
    const res = await axios.put(url, parameterMasterData);
    if (res?.data?.success === true) {
      toast.success('Parameter master updated successfully');
      return res.data?.data;
    }
    toast.error(`Failed to update parameter master: ${res?.data?.message || 'Unknown error'}`);
    return null;
  } catch (error) {
    toast.error(
      `Failed to update parameter master: ${error?.response?.data?.message || error.message}`
    );
    return null;
  }
}

// Delete Parameter Master
export async function deleteParameterMaster(parameterMasterId: number) {
  const url = endpoints.parameterMaster.delete(parameterMasterId);
  try {
    const res = await axios.delete(url);
    if (res?.data?.success === true) {
      toast.success('Parameter master deleted successfully');
      return res;
    }
    toast.error(`Failed to delete parameter master: ${res?.data?.message || 'Unknown error'}`);
    return null;
  } catch (error) {
    toast.error(
      `Failed to delete parameter master: ${error?.response?.data?.message || error.message}`
    );
    throw error;
  }
}
