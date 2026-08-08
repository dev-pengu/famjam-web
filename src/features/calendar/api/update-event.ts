import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import { eventInputToRequestBody, type EventInput, type CreateEventResult } from './create-event';

export const updateEvent = ({
  familyId,
  eventId,
  data,
}: {
  familyId: string;
  eventId: string;
  data: EventInput;
}): Promise<CreateEventResult> => {
  return apiClient.patch<CreateEventResult>(
    `/api/v1/families/${familyId}/events/${eventId}`,
    eventInputToRequestBody(data),
  );
};

type UseUpdateEventOptions = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof updateEvent>;
};

export const useUpdateEvent = ({ familyId, mutationConfig }: UseUpdateEventOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['events', familyId] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateEvent,
  });
};
