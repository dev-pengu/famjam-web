import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { Guardianship } from '@/types/api';
import { getMembershipQueryOptions } from '../membership/get-memberships';

export const guaridanshipInputSchema = z.object({
  dependentPersonId: z.string().min(1, 'Required'),
  guardianUserId: z.string().min(1, 'Required'),
  familyid: z.string().min(1, 'Required'),
});

export type GuardianshipInput = z.infer<typeof guaridanshipInputSchema>;

export const createGuardianship = ({
  data,
}: {
  data: GuardianshipInput;
}): Promise<Guardianship> => {
  return apiClient.post<Guardianship>(
    `/api/v1/families/${data.familyid}/guardianships`,
    {
      dependent_person_id: data.dependentPersonId,
      guardian_user_id: data.guardianUserId,
    },
  );
};

type UseCreateGuardianship = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof createGuardianship>;
};

export const useCreateGuardianship = ({
  familyId,
  mutationConfig,
}: UseCreateGuardianship) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getMembershipQueryOptions(familyId).queryKey
      })
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createGuardianship,
  });
};
