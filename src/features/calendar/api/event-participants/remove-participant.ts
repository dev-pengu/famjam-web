import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';

export const removeEventParticipant = ({
  familyId,
  eventId,
  participantId,
}: {
  familyId: string;
  eventId: string;
  participantId: string;
}) => {
  return apiClient.delete(`/api/v1/families/${familyId}/events/${eventId}/participants/${participantId}`);
};

type UseRemoveEventParticipantOptions = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof removeEventParticipant>;
};

export const useRemoveEventParticipant = ({ familyId, mutationConfig }: UseRemoveEventParticipantOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['events', familyId] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: removeEventParticipant,
  });
};
