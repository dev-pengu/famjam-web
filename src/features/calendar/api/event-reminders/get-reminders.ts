import { useQuery, queryOptions } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { EventReminder } from '@/types/api';

export const getEventReminders = ({
  familyId,
  eventId,
}: {
  familyId: string;
  eventId: string;
}): Promise<EventReminder[]> => {
  return apiClient.get<EventReminder[]>(`/api/v1/families/${familyId}/events/${eventId}/reminders`);
};

export const getEventRemindersQueryOptions = ({ familyId, eventId }: { familyId: string; eventId: string }) => {
  return queryOptions({
    queryKey: ['event-reminders', familyId, eventId],
    queryFn: () => getEventReminders({ familyId, eventId }),
  });
};

type UseEventRemindersOptions = {
  familyId: string;
  eventId: string;
  queryConfig?: QueryConfig<typeof getEventRemindersQueryOptions>;
};

export const useEventReminders = ({ familyId, eventId, queryConfig }: UseEventRemindersOptions) => {
  return useQuery({
    ...getEventRemindersQueryOptions({ familyId, eventId }),
    ...queryConfig,
  });
};
