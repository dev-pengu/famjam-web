import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';

// occurrence_start_at travels as a query param, not a body: DELETE-with-body
// is inconsistently supported across fetch/server stacks, and Rails reads
// query params into `params` identically to a JSON body either way.
export const deleteOccurrence = ({
  familyId,
  eventId,
  occurrenceStartAt,
}: {
  familyId: string;
  eventId: string;
  occurrenceStartAt: string;
}) => {
  const query = new URLSearchParams({ occurrence_start_at: occurrenceStartAt });
  return apiClient.delete(`/api/v1/families/${familyId}/events/${eventId}/occurrence?${query}`);
};

type UseDeleteOccurrenceOptions = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof deleteOccurrence>;
};

export const useDeleteOccurrence = ({ familyId, mutationConfig }: UseDeleteOccurrenceOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['events', familyId] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteOccurrence,
  });
};
