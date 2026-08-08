import { useQuery, queryOptions } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { CalendarEvent } from '@/types/api';

export const getEvent = ({ familyId, eventId }: { familyId: string; eventId: string }): Promise<CalendarEvent> => {
  return apiClient.get<CalendarEvent>(`/api/v1/families/${familyId}/events/${eventId}`);
};

export const getEventQueryOptions = ({ familyId, eventId }: { familyId: string; eventId: string }) => {
  return queryOptions({
    queryKey: ['events', familyId, eventId],
    queryFn: () => getEvent({ familyId, eventId }),
  });
};

type UseEventOptions = {
  familyId: string;
  eventId: string;
  queryConfig?: QueryConfig<typeof getEventQueryOptions>;
};

export const useEvent = ({ familyId, eventId, queryConfig }: UseEventOptions) => {
  return useQuery({
    ...getEventQueryOptions({ familyId, eventId }),
    ...queryConfig,
  });
};
