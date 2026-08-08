import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import { getEventRemindersQueryOptions } from './get-reminders';

export const deleteEventReminder = ({
  familyId,
  eventId,
  reminderId,
}: {
  familyId: string;
  eventId: string;
  reminderId: string;
}) => {
  return apiClient.delete(`/api/v1/families/${familyId}/events/${eventId}/reminders/${reminderId}`);
};

type UseDeleteEventReminderOptions = {
  familyId: string;
  eventId: string;
  mutationConfig?: MutationConfig<typeof deleteEventReminder>;
};

export const useDeleteEventReminder = ({ familyId, eventId, mutationConfig }: UseDeleteEventReminderOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getEventRemindersQueryOptions({ familyId, eventId }).queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteEventReminder,
  });
};
