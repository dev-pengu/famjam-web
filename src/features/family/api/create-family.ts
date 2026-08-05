import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { Family } from '@/types/api';
import { getFamiliesQueryOptions } from './get-families';

export const familyInputSchema = z.object({
  name: z.string().min(3, 'Required'),
});

export type FamilyInput = z.infer<typeof familyInputSchema>;

export const createFamily = ({
  data,
}: {
  data: FamilyInput;
}): Promise<Family> => {
  return apiClient.post<Family>('/api/v1/families', {
    name: data.name,
  });
};

type UseCreateFamilyOptions = {
  mutationConfig?: MutationConfig<typeof createFamily>;
};

export const useCreateFamily = ({ mutationConfig }: UseCreateFamilyOptions) => {
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
    mutationFn: createFamily,
  });
};
