import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { TokenPair } from '@/types/api';
import { getDeviceName } from '@/utils/device-info';
import { authStorage } from '@/lib/authStorage';
import { getUserQueryOptions } from './get-user';

export const oauthLoginInputSchema = z.object({
  idToken: z.string().min(1, 'Required'),
});

export type OauthLoginInput = z.infer<typeof oauthLoginInputSchema>;

export const loginWithOauth = ({
  data,
  provider,
}: {
  data: OauthLoginInput;
  provider: string;
}): Promise<TokenPair> => {
  return apiClient.post(`/api/v1/oauth/${provider}`, {
    id_token: data.idToken,
    device_name: getDeviceName(),
  });
};

type UseLoginWithOauthOptions = {
  mutationConfig?: MutationConfig<typeof loginWithOauth>;
};

export const useLoginWithOauth = ({
  mutationConfig,
}: UseLoginWithOauthOptions = {}) => {
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
    mutationFn: loginWithOauth,
  });
};

export type UseLoginWithOauthReturn = typeof useLoginWithOauth;
