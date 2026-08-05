import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { Membership } from '@/types/api';
import { getMembershipQueryOptions } from '../membership/get-memberships';

export const dependentInputSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  nickname: z.string().optional(),
  familyId: z.string().min(1, 'Required'),
});

export type DependentInput = z.infer<typeof dependentInputSchema>;

export const createDependent = ({
  data,
}: {
  data: DependentInput;
}): Promise<Membership> => {
  return apiClient.post<Membership>(
    `/api/v1/families/${data.familyId}/dependents`,
    {
      first_name: data.firstName,
      last_name: data.lastName,
      ...(data.nickname && { nickname: data.nickname }),
    },
  );
};

type UseCreateDependentOptions = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof createDependent>;
};

export const useCreateDependent = ({
  familyId,
  mutationConfig,
}: UseCreateDependentOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getMembershipQueryOptions(familyId).queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createDependent,
  });
};
