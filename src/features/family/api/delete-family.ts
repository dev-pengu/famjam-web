import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';

import { getFamiliesQueryOptions } from './get-families';

export const deleteFamily = ({ familyId }: { familyId: string }) => {
  return apiClient.delete(`/api/v1/families/${familyId}`);
};

type UseDeleteFamilyOptions = {
  mutationConfig?: MutationConfig<typeof deleteFamily>;
};

export const useDeleteFamily = ({
  mutationConfig,
}: UseDeleteFamilyOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getFamiliesQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteFamily,
  });
};
