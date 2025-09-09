import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { queryKeys } from '@/api/queryClient';
import { Role, Permission } from '../types';

// Get all permissions
export const usePermissions = () => {
  return useQuery({
    queryKey: queryKeys.users.permissions(),
    queryFn: async (): Promise<Permission[]> => {
      const response = await api.get('/users/permissions/');
      return response.data;
    },
  });
};

// Get all roles
export const useRoles = () => {
  return useQuery({
    queryKey: queryKeys.users.roles(),
    queryFn: async (): Promise<Role[]> => {
      const response = await api.get('/users/roles/');
      return response.data;
    },
  });
};