import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { Family } from '@/types/api';

import { getFamilyQueryOptions } from './get-family';

export const updateFamilyInputSchema = z.object({
  name: z.string().min(3, 'Required'),
  invitationTtlHours: z.int().optional(),
});

export type UpdateFamilyInput = z.infer<typeof updateFamilyInputSchema>;

export const updateFamily = ({
  data,
  familyId,
}: {
  data: UpdateFamilyInput;
  familyId: string;
}): Promise<Family> => {
  return apiClient.patch<Family>(`/api/v1/families/${familyId}`, {
    name: data.name,
    ...((data.invitationTtlHours ?? 0) > 0 && {
      invitation_ttl_hours: data.invitationTtlHours,
    }),
  });
};

type UseUpdateFamilyOptions = {
  mutationConfig?: MutationConfig<typeof updateFamily>;
};

export const useUpdateFamily = ({
  mutationConfig,
}: UseUpdateFamilyOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.refetchQueries({
        queryKey: getFamilyQueryOptions(data.id).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateFamily,
  });
};
