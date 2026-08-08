import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import { getAgendaSubscriptionsQueryOptions } from './get-subscriptions';

export const deleteAgendaSubscription = ({
  familyId,
  subscriptionId,
}: {
  familyId: string;
  subscriptionId: string;
}) => {
  return apiClient.delete(`/api/v1/families/${familyId}/agenda_subscriptions/${subscriptionId}`);
};

type UseDeleteAgendaSubscriptionOptions = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof deleteAgendaSubscription>;
};

export const useDeleteAgendaSubscription = ({ familyId, mutationConfig }: UseDeleteAgendaSubscriptionOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getAgendaSubscriptionsQueryOptions(familyId).queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteAgendaSubscription,
  });
};
