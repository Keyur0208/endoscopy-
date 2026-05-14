import type {
  IReportTemplateRecord,
  ICreateReportTemplate,
  IUpdateReportTemplate,
} from 'src/types/report-template';
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

export function useGetReportTemplates(params: IPaginationFilter) {
  const queryParams = new URLSearchParams();

  if (params?.searchFor) queryParams.append('searchFor', params.searchFor);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.perPage) queryParams.append('perPage', params.perPage.toString());
  if (params?.searchedValue) queryParams.append('searchedValue', params.searchedValue);

  const url = `${endpoints.reportTemplate.getAll}?${queryParams.toString()}`;

  const { data, isLoading, error, isValidating } = useSWR<{
    data: IReportTemplateRecord[];
    meta?: IPaginatedResponseMeta;
  }>(url, fetcher, swrOptions);

  return useMemo(
    () => ({
      reportTemplates: data?.data || [],
      reportTemplatesMeta: data?.meta || undefined,
      isLoading,
      reportTemplatesError: error,
      reportTemplatesValidating: isValidating,
      reportTemplatesEmpty: !isLoading && (!data?.data || data.data.length === 0),
    }),
    [data?.data, data?.meta, error, isLoading, isValidating]
  );
}

export function useSearchReportTemplates(search: string,reportTypeId?: number | null) {
  const queryParams = new URLSearchParams();
  
  queryParams.append('q', search);

  if (reportTypeId !== undefined && reportTypeId !== null) {
    queryParams.append('reportTypeId', reportTypeId.toString());
  }
  const url = `${endpoints.reportTemplate.search}?${queryParams.toString()}`;

  const { data, isLoading, error } = useSWR<{ data: IReportTemplateRecord[] }>(
    search ? url : null,
    fetcher,
    swrOptions
  );

  return useMemo(
    () => ({
      searchReportTemplates: data?.data || [],
      searchReportTemplatesIsLoading: isLoading,
      searchReportTemplatesError: error,
    }),
    [data?.data, error, isLoading]
  );
}

export function useGetReportTemplate(reportTemplateId?: number | null) {
  const url = reportTemplateId ? endpoints.reportTemplate.getById(reportTemplateId) : null;

  const { data, isLoading, error, isValidating } = useSWR<{
    data: IReportTemplateRecord;
    meta: ICurrentPaginatedResponse;
  }>(url, fetcher);

  return useMemo(
    () => ({
      reportTemplateMeta: data?.meta || undefined,
      reportTemplate: data?.data || null,
      isLoading,
      reportTemplateError: error,
      reportTemplateValidating: isValidating,
      reportTemplateEmpty: !data && !isLoading && !error,
    }),
    [data, error, isLoading, isValidating]
  );
}

export async function createReportTemplate(reportTemplateData: ICreateReportTemplate) {
  const url = endpoints.reportTemplate.create;
  try {
    const res = await axios.post(url, reportTemplateData);
    if (res?.data?.success === true) {
      toast.success('Report template created successfully');
      return res.data?.data;
    }
    toast.error(`Failed to create report template: ${res?.data?.message || 'Unknown error'}`);
    return null;
  } catch (error) {
    toast.error(
      `Failed to create report template: ${error?.response?.data?.message || error.message}`
    );
  }
  return null;
}

export async function updateReportTemplate(
  reportTemplateId: number,
  reportTemplateData: IUpdateReportTemplate
) {
  const url = endpoints.reportTemplate.update(reportTemplateId);
  try {
    const res = await axios.put(url, reportTemplateData);
    if (res?.data?.success === true) {
      toast.success('Report template updated successfully');
      return res.data?.data;
    }
    toast.error(`Failed to update report template: ${res?.data?.message || 'Unknown error'}`);
    return null;
  } catch (error) {
    toast.error(
      `Failed to update report template: ${error?.response?.data?.message || error.message}`
    );
    return null;
  }
}

export async function deleteReportTemplate(reportTemplateId: number) {
  const url = endpoints.reportTemplate.delete(reportTemplateId);
  try {
    const res = await axios.delete(url);
    if (res?.data?.success === true) {
      toast.success('Report template deleted successfully');
    }
    return res;
  } catch (error) {
    toast.error(
      `Failed to delete report template: ${error?.response?.data?.message || error.message}`
    );
    throw error;
  }
}
