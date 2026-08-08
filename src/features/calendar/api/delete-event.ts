import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';

export const deleteEvent = ({ familyId, eventId }: { familyId: string; eventId: string }) => {
  return apiClient.delete(`/api/v1/families/${familyId}/events/${eventId}`);
};

type UseDeleteEventOptions = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof deleteEvent>;
};

export const useDeleteEvent = ({ familyId, mutationConfig }: UseDeleteEventOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['events', familyId] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteEvent,
  });
};
