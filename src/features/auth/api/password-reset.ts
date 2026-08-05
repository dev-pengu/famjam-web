import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';

export const passwordResetInputSchema = z.object({
  password: z.string().min(10, 'Required'),
  token: z.string().min(1, 'Required'),
});

export type PasswordResetInput = z.infer<typeof passwordResetInputSchema>;

export const passwordReset = ({ data }: { data: PasswordResetInput }) => {
  return apiClient.patch('/api/v1/password_reset', {
    ...data,
  });
};

type UsePasswordReset = {
  mutationConfig?: MutationConfig<typeof passwordReset>;
};

export const usePasswordReset = ({ mutationConfig }: UsePasswordReset) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: passwordReset,
  });
};
