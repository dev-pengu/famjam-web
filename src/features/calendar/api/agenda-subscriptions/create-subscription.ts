import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { AgendaSubscription } from '@/types/api';
import { getAgendaSubscriptionsQueryOptions } from './get-subscriptions';

export const AgendaScope = {
  mine: 'mine',
  whole_family: 'whole_family',
} as const;

export const agendaSubscriptionInputSchema = z.object({
  scope: z.enum(AgendaScope),
  intervalDays: z.int().min(1),
  sendHourLocal: z.int().min(0).max(23),
});

export type AgendaSubscriptionInput = z.infer<typeof agendaSubscriptionInputSchema>;

export const createAgendaSubscription = ({
  familyId,
  data,
}: {
  familyId: string;
  data: AgendaSubscriptionInput;
}): Promise<AgendaSubscription> => {
  return apiClient.post<AgendaSubscription>(`/api/v1/families/${familyId}/agenda_subscriptions`, {
    scope: data.scope,
    interval_days: data.intervalDays,
    send_hour_local: data.sendHourLocal,
  });
};

type UseCreateAgendaSubscriptionOptions = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof createAgendaSubscription>;
};

export const useCreateAgendaSubscription = ({ familyId, mutationConfig }: UseCreateAgendaSubscriptionOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getAgendaSubscriptionsQueryOptions(familyId).queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createAgendaSubscription,
  });
};
