import type { IUserItem, ICreateUser, IUpdateUser, IChangePassword } from 'src/types/user';
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
// SWR Options for data fetching
const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
export function useGetUsers(params: IPaginationFilter) {
  const query = new URLSearchParams();
  if (params.searchFor) query.append('searchFor', params.searchFor);
  if (params.page) query.append('page', params.page.toString());
  if (params.perPage) query.append('perPage', params.perPage.toString());
  if (params.searchedValue) query.append('searchedValue', params.searchedValue);

  const url = `${endpoints.user.getAll}?${query.toString()}`;

  const { data, isLoading, error, isValidating } = useSWR<{
    data: IUserItem[];
    meta?: IPaginatedResponseMeta;
  }>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      users: data?.data || [],
      usersMeta: data?.meta || undefined,
      isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && (!data?.data || data.data.length === 0),
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// Hook to fetch a single User by ID
export function useGetUser(userId: number) {
  const url = endpoints.user.getById(userId);

  const { data, isLoading, error, isValidating } = useSWR<{
    data: IUserItem;
    meta?: ICurrentPaginatedResponse;
  }>(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      user: data?.data || null,
      usersMeta: data?.meta || undefined,
      isLoading,
      userError: error,
      userValidating: isValidating,
      userEmpty: !data && !isLoading && !error,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// Hook to search users by name or email
export function useSearchUsers(name: string) {
  const url = `${endpoints.user.search}?q=${name.toString()}`;

  const { data, isLoading, error, isValidating } = useSWR<{ data: IUserItem[] }>(url, fetcher);

  return useMemo(
    () => ({
      searchUsers: data?.data || [],
      searchUsersIsLoading: isLoading,
      searchUsersError: error,
      searchUsersValidating: isValidating,
      searchUsersEmpty: !data && !isLoading && !error,
    }),
    [data, error, isLoading, isValidating]
  );
}

// ----------------------------------------------------------------------
// Create User
export async function createUser(userData: ICreateUser) {
  const url = endpoints.user.create;

  try {
    const res = await axios.post(url, userData);
    if (res?.data?.error) {
      throw new Error(res.data.error);
    }
    toast.success(res?.data?.message);
    return res?.data?.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.error || error?.message || 'Something went wrong';
    toast.error(`Failed to create user: ${errorMessage}`);
    return null;
  }
}
// Update User
export async function updateUser(userId: number, userData: IUpdateUser) {
  const url = endpoints.user.update(userId);
  try {
    const res = await axios.put(url, userData);
    if (res?.data?.status === true) {
      toast.success('User updated successfully');
      return res?.data;
    }
    toast.error(`Failed to update user: ${res?.data?.message || 'Unknown error'}`);
    return res;
  } catch (error) {
    toast.error(`Failed to update user: ${error?.response?.data || error.message}`);
    return null;
  }
}

// Delete User
export async function deleteUser(userId: number) {
  const url = endpoints.user.delete(userId);
  try {
    const res = await axios.delete(url);
    if (res?.data?.status === true) {
      toast.success('User deleted successfully');
      return res;
    }
    toast.error(`Failed to delete user: ${res?.data?.message || 'Unknown error'}`);
    return res;
  } catch (error) {
    toast.error(`Failed to delete user: ${error?.response?.data?.message || error.message}`);
    throw error;
  }
}

// Change User Password
export async function changeUserPassword(userId: number, passwordData: IChangePassword) {
  const url = endpoints.user.updatePassword(userId);
  try {
    const res = await axios.post(url, passwordData);
    if (res?.data?.status === true) {
      toast.success(res?.data?.message);
    } else {
      toast.error(res?.data?.message);
    }
  } catch (error) {
    toast.error(`Failed to change password: ${error?.response?.data?.message || error.message}`);
    throw error;
  }
}
