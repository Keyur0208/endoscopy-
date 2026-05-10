import type {
  IOrganizationItem,
  ICreateOrganizationItem,
  IUpdateOrganizationItem,
} from 'src/types/organization';
import type {
  IPaginationFilter,
  IPaginatedResponseMeta,
  ICurrentPaginatedResponse,
} from 'src/types/pagination-fillter';

import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

// SWR Options
const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// Fetch all organizations
export function useGetOrganizations(params: IPaginationFilter) {
  const queryParams = new URLSearchParams();

  if (params?.searchFor) queryParams.append('searchFor', params.searchFor);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.perPage) queryParams.append('perPage', params.perPage.toString());
  if (params?.searchedValue) queryParams.append('searchedValue', params.searchedValue);

  const url = `${endpoints.organization.getAll}?${queryParams.toString()}`;

  const { data, isLoading, error, isValidating } = useSWR<{
    data: IOrganizationItem[];
    meta?: IPaginatedResponseMeta;
  }>(url, fetcher, swrOptions);

  return useMemo(
    () => ({
      organizations: data?.data || [],
      organizationsMeta: data?.meta || undefined,
      isLoading,
      organizationsError: error,
      organizationsValidating: isValidating,
      organizationsEmpty: !isLoading && (!data?.data || data.data.length === 0),
    }),
    [data, error, isLoading, isValidating]
  );
}

export function useSearchOranizations(name: string) {
  const shouldFetch = !!name;
  const url = shouldFetch ? `${endpoints.organization.search}?q=${name.toString()}` : null;

  const { data, isLoading, error, isValidating } = useSWR<{ data: IOrganizationItem[] }>(
    url,
    fetcher
  );

  return useMemo(
    () => ({
      searchOrganizations: data?.data || [],
      searchOrganizationsIsLoading: isLoading,
      searchOrganizationsError: error,
      searchOrganizationsValidating: isValidating,
      searchOrganizationsEmpty: !data && !isLoading && !error,
    }),
    [data, error, isLoading, isValidating]
  );
}

// Fetch single organization by ID
export function useGetOrganization(organizationId: number) {
  const url = organizationId ? endpoints.organization.getById(organizationId) : null;
  const { data, isLoading, error, isValidating } = useSWR<{
    data: IOrganizationItem;
    meta: ICurrentPaginatedResponse;
  }>(url, fetcher, swrOptions);

  return useMemo(
    () => ({
      organization: data?.data || null,
      organizationMeta: data?.meta || undefined,
      isLoading,
      organizationError: error,
      organizationValidating: isValidating,
      organizationEmpty: !data && !isLoading && !error,
    }),
    [data, error, isLoading, isValidating]
  );
}

// Hook to search Organization by name
export function useSearchOrganizations(name: string) {
  const url = `${endpoints.organization.search}?q=${name.toString()}`;

  const { data, isLoading, error, isValidating } = useSWR<{ data: IOrganizationItem[] }>(
    url,
    fetcher
  );

  return useMemo(
    () => ({
      searchOrganizations: data?.data || [],
      searchOrganizationsIsLoading: isLoading,
      searchOrganizationsError: error,
      searchOrganizationsValidating: isValidating,
      searchOrganizationsEmpty: !data && !isLoading && !error,
    }),
    [data, error, isLoading, isValidating]
  );
}

// Create Organization
export async function createOrganization(organizationData: ICreateOrganizationItem) {
  const url = endpoints.organization.create;
  try {
    const res = await axios.post(url, organizationData);
    if (res?.data?.status === true) {
      toast.success('Organization created successfully');
      return res?.data?.data;
    }
    return null;
  } catch (error: any) {
    toast.error(`Failed to create organization: ${error?.response?.data || error.message}`);
    return null;
  }
}

// Update Organization
export async function updateOrganization(
  organizationId: number,
  organizationData: IUpdateOrganizationItem
) {
  const url = endpoints.organization.update(organizationId);
  try {
    const res = await axios.put(url, organizationData);
    if (res?.data?.status === true) {
      toast.success('Organization updated successfully');
    }
  } catch (error: any) {
    toast.error(`Failed to update organization: ${error?.response?.data || error.message}`);
  }
}

// Delete Organization
export async function deleteOrganization(organizationId: number) {
  const url = endpoints.organization.delete(organizationId);
  try {
    const res = await axios.delete(url);
    if (res?.data?.status === true) {
      toast.success('Organization deleted successfully');
    }
    return res;
  } catch (error: any) {
    toast.error(
      `Failed to delete organization: ${error?.response?.data?.message || error.message}`
    );
    throw error;
  }
}
