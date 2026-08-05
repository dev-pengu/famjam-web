import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { TokenPair } from '@/types/api';
import { getDeviceName } from '@/utils/device-info';

import { getUserQueryOptions } from './get-user';
import { authStorage } from '@/lib/authStorage';

export const loginInputSchema = z.object({
  email: z.email().min(1, 'Required'),
  password: z.string().min(10, 'Required'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const login = ({ data }: { data: LoginInput }): Promise<TokenPair> => {
  return apiClient.post<TokenPair>('/api/v1/session', {
    email: data.email,
    password: data.password,
    device_name: getDeviceName(),
  });
};

type UseLoginOptions = {
  mutationConfig?: MutationConfig<typeof login>;
};

export const useLogin = ({ mutationConfig }: UseLoginOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      authStorage.setAccessToken(data.access_token);
      authStorage.setRefreshToken(data.refresh_token);
      queryClient.invalidateQueries({
        queryKey: getUserQueryOptions().queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: login,
  });
};

export type UseLoginReturn = typeof useLogin;