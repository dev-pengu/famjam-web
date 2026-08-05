import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { TokenPair } from '@/types/api';
import { getDeviceName } from '@/utils/device-info';
import { authStorage } from '@/lib/authStorage';
import { getUserQueryOptions } from './get-user';

export const accountLinkInputSchema = z.object({
  userId: z.uuid(),
  password: z.string().min(1, 'Required'),
  providerUid: z.string(),
});

export type AccountLinkInput = z.infer<typeof accountLinkInputSchema>;

export const linkAccount = ({
  data,
}: {
  data: AccountLinkInput;
}): Promise<TokenPair> => {
  return apiClient.post<TokenPair>('/api/v1/account_link', {
    user_id: data.userId,
    password: data.password,
    provider_uid: data.providerUid,
    device_name: getDeviceName(),
  });
};

type UseLinkAccountOptions = {
  mutationConfig?: MutationConfig<typeof linkAccount>;
};

export const useLinkAccount = ({
  mutationConfig,
}: UseLinkAccountOptions = {}) => {
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
    mutationFn: linkAccount,
  });
};

export type UseLinkAccountReturn = typeof useLinkAccount;
