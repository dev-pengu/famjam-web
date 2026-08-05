import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import { authStorage } from '@/lib/authStorage';
import { getUserQueryOptions } from './get-user';

export const logout = () => {
  return apiClient.delete('/api/v1/refresh_tokens/destroy_all');
};

type UseLogoutOptions = {
  mutationConfig?: MutationConfig<typeof logout>;
};

export const useLogout = ({ mutationConfig }: UseLogoutOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    onSettled: () => {
      authStorage.clear();
      queryClient.setQueryData(getUserQueryOptions().queryKey, null);
    },
    ...restConfig,
    mutationFn: logout,
  });
};

export type UseLogoutReturn = typeof useLogout;
