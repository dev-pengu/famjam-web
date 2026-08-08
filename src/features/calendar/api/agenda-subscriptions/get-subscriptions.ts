import { useQuery, queryOptions } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { AgendaSubscription } from '@/types/api';

export const getAgendaSubscriptions = ({ familyId }: { familyId: string }): Promise<AgendaSubscription[]> => {
  return apiClient.get<AgendaSubscription[]>(`/api/v1/families/${familyId}/agenda_subscriptions`);
};

export const getAgendaSubscriptionsQueryOptions = (familyId: string) => {
  return queryOptions({
    queryKey: ['agenda-subscriptions', familyId],
    queryFn: () => getAgendaSubscriptions({ familyId }),
  });
};

type UseAgendaSubscriptionsOptions = {
  familyId: string;
  queryConfig?: QueryConfig<typeof getAgendaSubscriptionsQueryOptions>;
};

export const useAgendaSubscriptions = ({ familyId, queryConfig }: UseAgendaSubscriptionsOptions) => {
  return useQuery({
    ...getAgendaSubscriptionsQueryOptions(familyId),
    ...queryConfig,
  });
};
