import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { IcalFeedToken } from '@/types/api';
import { getIcalFeedTokenQueryOptions } from './get-token';

export const regenerateIcalFeedToken = (): Promise<IcalFeedToken> => {
  return apiClient.post<IcalFeedToken>('/api/v1/ical_feed_token');
};

type UseRegenerateIcalFeedTokenOptions = {
  mutationConfig?: MutationConfig<typeof regenerateIcalFeedToken>;
};

export const useRegenerateIcalFeedToken = ({ mutationConfig }: UseRegenerateIcalFeedTokenOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getIcalFeedTokenQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: regenerateIcalFeedToken,
  });
};
