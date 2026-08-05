import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';

export const switchFamily = ({ familyId }: { familyId: string }) => {
  return apiClient.post(`/api/v1/families/${familyId}/switch`);
};

type UseSwitchFamilyOptions = {
  mutationConfig?: MutationConfig<typeof switchFamily>;
};

export const useSwitchFamily = ({ mutationConfig }: UseSwitchFamilyOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: switchFamily,
  });
};
