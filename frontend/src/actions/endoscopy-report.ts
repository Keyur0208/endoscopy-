import type {
  IEndoscopyReportRecord,
  ICreateEndoscopyReport,
  IUpdateEndoscopyReport,
} from 'src/types/endoscopy-report';
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

export function useGetEndoscopyReports(params: IPaginationFilter) {
  const queryParams = new URLSearchParams();

  if (params?.searchFor) queryParams.append('searchFor', params.searchFor);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.perPage) queryParams.append('perPage', params.perPage.toString());
  if (params?.searchedValue) queryParams.append('searchedValue', params.searchedValue);

  const url = `${endpoints.endoscopyReport.getAll}?${queryParams.toString()}`;

  const { data, isLoading, error, isValidating } = useSWR<{
    data: IEndoscopyReportRecord[];
    meta?: IPaginatedResponseMeta;
  }>(url, fetcher, swrOptions);

  return useMemo(
    () => ({
      endoscopyReports: data?.data || [],
      endoscopyReportsMeta: data?.meta || undefined,
      isLoading,
      endoscopyReportsError: error,
      endoscopyReportsValidating: isValidating,
      endoscopyReportsEmpty: !isLoading && (!data?.data || data.data.length === 0),
    }),
    [data?.data, data?.meta, error, isLoading, isValidating]
  );
}

export function useGetEndoscopyReport(endoscopyReportId?: number | null) {
  const url = endoscopyReportId ? endpoints.endoscopyReport.getById(endoscopyReportId) : null;

  const { data, isLoading, error, isValidating } = useSWR<{
    data: IEndoscopyReportRecord;
    meta: ICurrentPaginatedResponse;
  }>(url, fetcher);

  return useMemo(
    () => ({
      endoscopyReportMeta: data?.meta || undefined,
      endoscopyReport: data?.data || null,
      isLoading,
      endoscopyReportError: error,
      endoscopyReportValidating: isValidating,
      endoscopyReportEmpty: !data && !isLoading && !error,
    }),
    [data, error, isLoading, isValidating]
  );
}

export async function createEndoscopyReport(reportTemplateData: ICreateEndoscopyReport) {
  const url = endpoints.endoscopyReport.create;
  try {
    const res = await axios.post(url, reportTemplateData);
    if (res?.data?.success === true) {
      toast.success('Endoscopy report created successfully');
      return res.data?.data;
    }
    toast.error(`Failed to create endoscopy report: ${res?.data?.message || 'Unknown error'}`);
    return null;
  } catch (error) {
    toast.error(
      `Failed to create endoscopy report: ${error?.response?.data?.message || error.message}`
    );
  }
  return null;
}

export async function updateEndoscopyReport(
  endoscopyReportId: number,
  endoscopyReportData: IUpdateEndoscopyReport
) {
  const url = endpoints.endoscopyReport.update(endoscopyReportId);
  try {
    const res = await axios.put(url, endoscopyReportData);
    if (res?.data?.success === true) {
      toast.success('Endoscopy report updated successfully');
      return res.data?.data;
    }
    toast.error(`Failed to update endoscopy report: ${res?.data?.message || 'Unknown error'}`);
    return null;
  } catch (error) {
    toast.error(
      `Failed to update endoscopy report: ${error?.response?.data?.message || error.message}`
    );
    return null;
  }
}

export async function deleteEndoscopyReport(endoscopyReportId: number) {
  const url = endpoints.endoscopyReport.delete(endoscopyReportId);
  try {
    const res = await axios.delete(url);
    if (res?.data?.success === true) {
      toast.success('Endoscopy report deleted successfully');
    }
    return res;
  } catch (error) {
    toast.error(
      `Failed to delete endoscopy report: ${error?.response?.data?.message || error.message}`
    );
    throw error;
  }
}
