import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { EventParticipant } from '@/types/api';

export const addEventParticipant = ({
  familyId,
  eventId,
  personId,
}: {
  familyId: string;
  eventId: string;
  personId: string;
}): Promise<EventParticipant> => {
  return apiClient.post<EventParticipant>(`/api/v1/families/${familyId}/events/${eventId}/participants`, {
    person_id: personId,
  });
};

type UseAddEventParticipantOptions = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof addEventParticipant>;
};

export const useAddEventParticipant = ({ familyId, mutationConfig }: UseAddEventParticipantOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['events', familyId] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: addEventParticipant,
  });
};
