import { useQuery, queryOptions } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { EventOccurrence } from '@/types/api';

export const getEvents = ({
  familyId,
  from,
  to,
}: {
  familyId: string;
  from: string;
  to: string;
}): Promise<EventOccurrence[]> => {
  const query = new URLSearchParams({ from, to });
  return apiClient.get<EventOccurrence[]>(`/api/v1/families/${familyId}/events?${query}`);
};

export const getEventsQueryOptions = ({
  familyId,
  from,
  to,
}: {
  familyId: string;
  from: string;
  to: string;
}) => {
  return queryOptions({
    queryKey: ['events', familyId, from, to],
    queryFn: () => getEvents({ familyId, from, to }),
  });
};

type UseEventsOptions = {
  familyId: string;
  from: string;
  to: string;
  queryConfig?: QueryConfig<typeof getEventsQueryOptions>;
};

export const useEvents = ({ familyId, from, to, queryConfig }: UseEventsOptions) => {
  return useQuery({
    ...getEventsQueryOptions({ familyId, from, to }),
    ...queryConfig,
  });
};
