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

export function useGetConfigurationModules(params: {
  moduleq?: string | null;
  subModuleq?: string | null;
  type?: string | null;
  searchFor?: string;
}) {
  const query = new URLSearchParams();
  // const shouldFetch = !!params.moduleq;

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null && key !== 'reportType') {
      query.append(key, String(value));
    }
  });

  const url = `${endpoints.configurationModule.getAll}?${query.toString()}`;

  const { data, isLoading, error, isValidating } = useSWR<{
    data: any;
    modules: any;
    subModules: any;
  }>(url, fetcher, swrOptions);

  return useMemo(
    () => ({
      configurations: data?.data || [],
      modules: data?.modules || [],
      subModules: data?.subModules || [],
      isLoading,
      configurationsError: error,
      configurationsValidating: isValidating,
      configurationsEmpty: !isLoading && (!data?.data || data.data.length === 0),
    }),
    [data, error, isLoading, isValidating]
  );
}

// Fetch single Configuration Module by ID
export function useGetConfigurationModule(configurationId: number) {
  const url = endpoints.configurationModule.getById(configurationId);
  const { data, isLoading, error, isValidating } = useSWR<{ data: any }>(url, fetcher, swrOptions);

  return useMemo(
    () => ({
      configuration: data?.data || null,
      isLoading,
      configurationError: error,
      configurationValidating: isValidating,
      configurationEmpty: !data && !isLoading && !error,
    }),
    [data, error, isLoading, isValidating]
  );
}

// Fetch single Configuration Module by ID
export function useGetConfigurationsByModuleAndSubmodules(module: string, subModule: string) {
  const url = `${endpoints.configurationModule.getBymoduleAndSubModule}?module=${module}&subModule=${subModule}`;
  const { data, isLoading, error, isValidating } = useSWR<{ data: any }>(url, fetcher, swrOptions);

  return useMemo(
    () => ({
      configs: data?.data || null,
      isLoading,
      configsError: error,
      configsValidating: isValidating,
      configsEmpty: !data && !isLoading && !error,
    }),
    [data, error, isLoading, isValidating]
  );
}

// Create ConfigurationModule
export async function createConfigurationModule(configurationData: any) {
  const url = endpoints.configurationModule.create;
  try {
    const res = await axios.post(url, configurationData);
    if (res?.data?.status) {
      toast.success(res?.data?.message);
    } else {
      toast.error(res?.data?.message);
    }
    return res?.data;
  } catch (error) {
    toast.error(`Failed to create Configuration Module: ${error?.response?.data || error.message}`);
    throw error;
  }
}

// Update Configuration Module
export async function updateConfigurationModule(configurationData: any) {
  const url = endpoints.configurationModule.update;
  try {
    const res = await axios.put(url, configurationData);
    if (res?.data?.status) {
      toast.success(res?.data?.message);
    } else {
      toast.error(res?.data?.message);
    }
    return res?.data;
  } catch (error) {
    toast.error(`Failed to update Configuration Module: ${error?.response?.data || error.message}`);
    return null;
  }
}

// Delete ConfigurationModule
export async function deleteConfigurationModule(configurationId: number) {
  const url = endpoints.configurationModule.delete(configurationId);
  try {
    const res = await axios.delete(url);
    if (res?.data?.status) {
      toast.success(res?.data?.message);
    } else {
      toast.error(res?.data?.message);
    }
    return res?.data;
  } catch (error) {
    toast.error(
      `Failed to delete Configuration Module: ${error?.response?.data?.message || error.message}`
    );
    throw error;
  }
}
