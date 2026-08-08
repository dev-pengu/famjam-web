import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { AgendaSubscription } from '@/types/api';
import { getAgendaSubscriptionsQueryOptions } from './get-subscriptions';
import type { AgendaScope } from '@/types/api';

export type AgendaSubscriptionUpdateInput = {
  scope?: AgendaScope;
  intervalDays?: number;
  sendHourLocal?: number;
  enabled?: boolean;
};

export const updateAgendaSubscription = ({
  familyId,
  subscriptionId,
  data,
}: {
  familyId: string;
  subscriptionId: string;
  data: AgendaSubscriptionUpdateInput;
}): Promise<AgendaSubscription> => {
  return apiClient.patch<AgendaSubscription>(`/api/v1/families/${familyId}/agenda_subscriptions/${subscriptionId}`, {
    scope: data.scope,
    interval_days: data.intervalDays,
    send_hour_local: data.sendHourLocal,
    enabled: data.enabled,
  });
};

type UseUpdateAgendaSubscriptionOptions = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof updateAgendaSubscription>;
};

export const useUpdateAgendaSubscription = ({ familyId, mutationConfig }: UseUpdateAgendaSubscriptionOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getAgendaSubscriptionsQueryOptions(familyId).queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateAgendaSubscription,
  });
};
