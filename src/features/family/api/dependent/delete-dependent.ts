import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';

import { getMembershipQueryOptions } from '../membership/get-memberships';

export const deleteDependent = ({
  familyId,
  dependentId,
}: {
  familyId: string;
  dependentId: string;
}) => {
  return apiClient.delete(
    `/api/v1/families/${familyId}/dependents/${dependentId}`,
  );
};

type UseDeleteDependentOptions = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof deleteDependent>;
};

export const useDeleteDependent = ({
  familyId,
  mutationConfig,
}: UseDeleteDependentOptions) => {
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
    mutationFn: deleteDependent,
  });
};
