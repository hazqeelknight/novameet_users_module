import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { queryKeys } from '@/api/queryClient';
import { toast } from 'react-toastify';
import { Profile } from '../types';

// Get user profile
export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.users.profile(),
    queryFn: async (): Promise<Profile> => {
      const response = await api.get('/users/profile/');
      return response.data;
    },
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<Profile> | FormData) => {
      const response = await api.patch('/users/profile/', updates);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.users.profile(), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile() });
      toast.success('Profile updated successfully');
    },
  });
};

// Get public profile by organizer slug
export const usePublicProfile = (organizerSlug: string) => {
  return useQuery({
    queryKey: ['users', 'public-profile', organizerSlug],
    queryFn: async (): Promise<Profile> => {
      const response = await api.get(`/users/public/${organizerSlug}/`);
      return response.data;
    },
    enabled: !!organizerSlug,
  });
};