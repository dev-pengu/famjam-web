import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { AuthUser } from '@/types/api';
import { getUserQueryOptions } from '@/features/auth/api/get-user';

export const updateTimezoneInputSchema = z.object({
  timezone: z.string().min(1, 'Required'),
});

export type UpdateTimezoneInput = z.infer<typeof updateTimezoneInputSchema>;

export const updateTimezone = ({
  data,
}: {
  data: UpdateTimezoneInput;
}): Promise<AuthUser> => {
  return apiClient.patch<AuthUser>('/api/v1/profile/timezone', {
    timezone: data.timezone,
  });
};

type UseUpdateTimezoneOptions = {
  mutationConfig?: MutationConfig<typeof updateTimezone>;
};

export const useUpdateTimezone = ({
  mutationConfig,
}: UseUpdateTimezoneOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getUserQueryOptions().queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateTimezone,
  });
};
