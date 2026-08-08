import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { EventReminder } from '@/types/api';
import { getEventRemindersQueryOptions } from './get-reminders';

export const createEventReminder = ({
  familyId,
  eventId,
  minutesBefore,
  userId,
}: {
  familyId: string;
  eventId: string;
  minutesBefore: number;
  userId?: string;
}): Promise<EventReminder> => {
  return apiClient.post<EventReminder>(`/api/v1/families/${familyId}/events/${eventId}/reminders`, {
    minutes_before: minutesBefore,
    user_id: userId,
  });
};

type UseCreateEventReminderOptions = {
  familyId: string;
  eventId: string;
  mutationConfig?: MutationConfig<typeof createEventReminder>;
};

export const useCreateEventReminder = ({ familyId, eventId, mutationConfig }: UseCreateEventReminderOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getEventRemindersQueryOptions({ familyId, eventId }).queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createEventReminder,
  });
};
