import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';

export const resendVerification = () => {
  return apiClient.post('/api/v1/email_verification/resend');
};

type UseResendVerificationOptions = {
  mutationConfig?: MutationConfig<typeof resendVerification>;
};

export const useResendVerification = ({
  mutationConfig,
}: UseResendVerificationOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: resendVerification,
  });
};

export type UseResendVerificationResult = typeof useResendVerification;