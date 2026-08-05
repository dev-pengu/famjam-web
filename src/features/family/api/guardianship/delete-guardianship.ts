import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import { getMembershipQueryOptions } from '../membership/get-memberships';

export const deleteGuardianship = ({
  familyId,
  guardianshipId,
}: {
  familyId: string;
  guardianshipId: string;
}) => {
  return apiClient.delete(
    `/api/v1/families/${familyId}/guardianships/${guardianshipId}`,
  );
};

type UseDeleteGuardianshipOptions = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof deleteGuardianship>;
};

export const useDeleteGuardianship = ({
  familyId,
  mutationConfig,
}: UseDeleteGuardianshipOptions) => {
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
    mutationFn: deleteGuardianship,
  });
};
