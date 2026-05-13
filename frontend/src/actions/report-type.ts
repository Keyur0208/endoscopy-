import type {
  IReportTypeRecord,
  ICreateReportType,
  IUpdateReportType,
} from 'src/types/report-type';
import type {
  IPaginationFilter,
  IPaginatedResponseMeta,
  ICurrentPaginatedResponse,
} from 'src/types/pagination-fillter';

import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------
const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetReportTypes(params: IPaginationFilter) {
  const queryParams = new URLSearchParams();

  if (params?.searchFor) queryParams.append('searchFor', params.searchFor);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.perPage) queryParams.append('perPage', params.perPage.toString());
  if (params?.searchedValue) queryParams.append('searchedValue', params.searchedValue);

  const url = `${endpoints.reportType.getAll}?${queryParams.toString()}`;

  const { data, isLoading, error, isValidating } = useSWR<{
    data: IReportTypeRecord[];
    meta?: IPaginatedResponseMeta;
  }>(url, fetcher, swrOptions);

  return useMemo(
    () => ({
      reportTypes: data?.data || [],
      reportTypesMeta: data?.meta || undefined,
      isLoading,
      reportTypesError: error,
      reportTypesValidating: isValidating,
      reportTypesEmpty: !isLoading && (!data?.data || data.data.length === 0),
    }),
    [data?.data, data?.meta, error, isLoading, isValidating]
  );
}

export function useSearchReportTypes(search: string) {
  const queryParams = new URLSearchParams();
  queryParams.append('q', search);
  const url = `${endpoints.reportType.search}?${queryParams.toString()}`;

  const { data, isLoading, error } = useSWR<{ data: IReportTypeRecord[] }>(
    search ? url : null,
    fetcher,
    swrOptions
  );

  return useMemo(
    () => ({
      searchReportTypes: data?.data || [],
      searchReportTypesIsLoading: isLoading,
      searchReportTypesError: error,
    }),
    [data?.data, error, isLoading]
  );
}

export function useGetReportType(reportTypeId?: number | null) {
  const url = reportTypeId ? endpoints.reportType.getById(reportTypeId) : null;

  const { data, isLoading, error, isValidating } = useSWR<{
    data: IReportTypeRecord;
    meta: ICurrentPaginatedResponse;
  }>(url, fetcher);

  return useMemo(
    () => ({
      reportTypeMeta: data?.meta || undefined,
      reportType: data?.data || null,
      isLoading,
      reportTypeError: error,
      reportTypeValidating: isValidating,
      reportTypeEmpty: !data && !isLoading && !error,
    }),
    [data, error, isLoading, isValidating]
  );
}

export async function createReportType(reportTypeData: ICreateReportType) {
  const url = endpoints.reportType.create;
  try {
    const res = await axios.post(url, reportTypeData);
    if (res?.data?.success === true) {
      toast.success('Report type created successfully');
      return res.data?.data;
    }
    toast.error(`Failed to create report type: ${res?.data?.message || 'Unknown error'}`);
    return null;
  } catch (error) {
    toast.error(`Failed to create report type: ${error?.response?.data?.message || error.message}`);
  }
  return null;
}

export async function updateReportType(reportTypeId: number, reportTypeData: IUpdateReportType) {
  const url = endpoints.reportType.update(reportTypeId);
  try {
    const res = await axios.put(url, reportTypeData);
    if (res?.data?.success === true) {
      toast.success('Report type updated successfully');
      return res.data?.data;
    }
    toast.error(`Failed to update report type: ${res?.data?.message || 'Unknown error'}`);
    return null;
  } catch (error) {
    toast.error(`Failed to update report type: ${error?.response?.data?.message || error.message}`);
    return null;
  }
}

export async function deleteReportType(reportTypeId: number) {
  const url = endpoints.reportType.delete(reportTypeId);
  try {
    const res = await axios.delete(url);
    if (res?.data?.success === true) {
      toast.success('Report type deleted successfully');
    }
    return res;
  } catch (error) {
    toast.error(`Failed to delete report type: ${error?.response?.data?.message || error.message}`);
    throw error;
  }
}
