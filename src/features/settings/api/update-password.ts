import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { TokenPair } from '@/types/api';
import { getDeviceName } from '@/utils/device-info';
import { authStorage } from '@/lib/authStorage';

export const updatePasswordInputSchema = z.object({
  existingPassword: z.string().min(10, 'Required'),
  newPassword: z.string().min(10, 'Required'),
});

export type UpdatePasswordInput = z.infer<typeof updatePasswordInputSchema>;

export const updatePassword = ({
  data,
}: {
  data: UpdatePasswordInput;
}): Promise<TokenPair> => {
  return apiClient.patch<TokenPair>('/api/v1/password_change', {
    current_password: data.existingPassword,
    new_password: data.newPassword,
    device_name: getDeviceName(),
  });
};

type UseUpdatePasswordOptions = {
  mutationConfig?: MutationConfig<typeof updatePassword>;
};

export const useUpdatePassword = ({
  mutationConfig,
}: UseUpdatePasswordOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      authStorage.setAccessToken(data.access_token);
      authStorage.setRefreshToken(data.refresh_token);
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updatePassword,
  });
};
