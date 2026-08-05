import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';

export const forgotPasswordInputSchema = z.object({
  email: z.email().min(1, 'Required'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>;

export const passwordResetRequest = ({
  data,
}: {
  data: ForgotPasswordInput;
}) => {
  return apiClient.post('/api/v1/password_reset', {
    email: data.email,
  });
};

type UsePasswordResetRequestOptions = {
  mutationConfig?: MutationConfig<typeof passwordResetRequest>;
};

export const usePasswordResetRequest = ({
  mutationConfig,
}: UsePasswordResetRequestOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: passwordResetRequest,
  });
};

export type UsePasswordResetRequestReturn = typeof usePasswordResetRequest;