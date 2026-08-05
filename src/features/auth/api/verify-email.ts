import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';

export const emailVerificationInputSchema = z.object({
  token: z.string().min(1, 'Required'),
});

export type EmailVerificationInput = z.infer<
  typeof emailVerificationInputSchema
>;

export const verifyEmail = ({ data }: { data: EmailVerificationInput }) => {
  return apiClient.post('/api/v1/email_verification', {
    token: data.token,
  });
};

type UseVerifyEmailOptions = {
  mutationConfig?: MutationConfig<typeof verifyEmail>;
};

export const useVerifyEmail = ({ mutationConfig }: UseVerifyEmailOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: verifyEmail,
  });
};

export type UseVerifyEmailResult = typeof useVerifyEmail;
