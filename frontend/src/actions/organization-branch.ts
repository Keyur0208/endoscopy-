import type {
  IPaginationFilter,
  IPaginatedResponseMeta,
  ICurrentPaginatedResponse,
} from 'src/types/pagination-fillter';
import type {
  IOrganizationBranchItem,
  ICreateOrganizationBranchItem,
  IUpdateOrganizationBranchItem,
} from 'src/types/organization-branch';

import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

import { setSession } from 'src/auth/context/jwt';

// SWR Options
const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// Fetch all branches
export function useGetOrganizationBranches(params: IPaginationFilter) {
  const queryParams = new URLSearchParams();

  if (params?.searchFor) queryParams.append('searchFor', params.searchFor);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.perPage) queryParams.append('perPage', params.perPage.toString());
  if (params?.searchedValue) queryParams.append('searchedValue', params.searchedValue);

  const url = `${endpoints.organizationBranch.getAll}?${queryParams.toString()}`;

  const { data, isLoading, error, isValidating } = useSWR<{
    data: IOrganizationBranchItem[];
    meta?: IPaginatedResponseMeta;
  }>(url, fetcher, swrOptions);

  return useMemo(
    () => ({
      organizationbranches: data?.data || [],
      organizationbranchesMeta: data?.meta || undefined,
      isLoading,
      organizationbranchesError: error,
      organizationbranchesValidating: isValidating,
      organizationbranchesEmpty: !isLoading && (!data?.data || data.data.length === 0),
    }),
    [data, error, isLoading, isValidating]
  );
}

// Search branches by name
export function useSearchOrganizationBranches(params: {
  name: string;
  organizationId?: number | null;
}) {
  const { name } = params;
  const shouldFetch = !!name;

  const query = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      query.append(key, String(value));
    }
  });

  const url = shouldFetch ? `${endpoints.organizationBranch.search}?${query.toString()}` : null;

  const { data, isLoading, error, isValidating } = useSWR<{ data: IOrganizationBranchItem[] }>(
    url,
    fetcher
  );

  return useMemo(
    () => ({
      searchOrganizationBranches: data?.data || [],
      isLoading,
      searchOrganizationBranchesError: error,
      searchOrganizationBranchesValidating: isValidating,
      searchOrganizationBranchesEmpty: !isLoading && (!data?.data || data.data.length === 0),
    }),
    [data, error, isLoading, isValidating]
  );
}

// Fetch single organization Branch by ID
export function useGetOrganizationBranch(branchId: number) {
  const url = branchId ? endpoints.organizationBranch.getById(branchId) : null;

  const { data, isLoading, error, isValidating } = useSWR<{
    data: IOrganizationBranchItem;
    meta: ICurrentPaginatedResponse;
  }>(url, fetcher, swrOptions);

  return useMemo(
    () => ({
      organizationBranch: data?.data || null,
      organizationBranchMeta: data?.meta || undefined,
      isLoading,
      organizationBranchError: error,
      organizationBranchValidating: isValidating,
      organizationBranchEmpty: !data && !isLoading && !error,
    }),
    [data, error, isLoading, isValidating]
  );
}

// Create Branch
export async function createOrganizationBranch(branchData: ICreateOrganizationBranchItem) {
  const url = endpoints.organizationBranch.create;
  try {
    const res = await axios.post(url, branchData);
    if (res?.data?.status === true) {
      toast.success('organization Branch created successfully');
      return res?.data?.data;
    }
    return null;
  } catch (error: any) {
    toast.error(`Failed to create organization Branch: ${error?.response?.data || error.message}`);
    return null;
  }
}

// Update Branch
export async function updateOrganizationBranch(
  branchId: number,
  branchData: IUpdateOrganizationBranchItem
) {
  const url = endpoints.organizationBranch.update(branchId);
  try {
    const res = await axios.put(url, branchData);
    if (res?.data?.status === true) {
      toast.success('Branch updated successfully');
    }
  } catch (error: any) {
    toast.error(`Failed to update organization Branch: ${error?.response?.data || error.message}`);
  }
}

// Delete Branch
export async function deleteOrganizationBranch(branchId: number) {
  const url = endpoints.organizationBranch.delete(branchId);
  try {
    const res = await axios.delete(url);
    if (res?.data?.status === true) {
      toast.success('Branch deleted successfully');
    }
    return res;
  } catch (error: any) {
    toast.error(
      `Failed to delete organization Branch: ${error?.response?.data?.message || error.message}`
    );
    throw error;
  }
}

// Swipe Branch
export async function swipeOrganizationBranch(branchId: any) {
  const url = endpoints.organizationBranch.switch;
  try {
    const res = await axios.post(url, branchId);
    const { token } = res.data;

    if (!token) {
      throw new Error('Access token not found in response');
    }
    await setSession(token);
  } catch (error: any) {
    toast.error(
      `Failed to delete organization Branch: ${error?.response?.data?.message || error.message}`
    );
    throw error;
  }
}
