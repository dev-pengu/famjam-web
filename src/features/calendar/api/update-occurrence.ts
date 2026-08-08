import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { EventOccurrenceException } from '@/types/api';
import { EventCategory, toIsoInstant } from './create-event';

export const occurrenceOverrideInputSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  category: z.enum(EventCategory).optional(),
  startsAtDate: z.string().optional(),
  startsAtTime: z.string().optional(),
  endsAtDate: z.string().optional(),
  endsAtTime: z.string().optional(),
});

export type OccurrenceOverrideInput = z.infer<typeof occurrenceOverrideInputSchema>;

export const updateOccurrence = ({
  familyId,
  eventId,
  occurrenceStartAt,
  timezone,
  data,
}: {
  familyId: string;
  eventId: string;
  occurrenceStartAt: string;
  timezone: string;
  data: OccurrenceOverrideInput;
}): Promise<EventOccurrenceException> => {
  return apiClient.patch<EventOccurrenceException>(`/api/v1/families/${familyId}/events/${eventId}/occurrence`, {
    occurrence_start_at: occurrenceStartAt,
    title: data.title || undefined,
    description: data.description || undefined,
    location: data.location || undefined,
    category: data.category || undefined,
    starts_at:
      data.startsAtDate && data.startsAtTime ? toIsoInstant(data.startsAtDate, data.startsAtTime, timezone) : undefined,
    ends_at: data.endsAtDate && data.endsAtTime ? toIsoInstant(data.endsAtDate, data.endsAtTime, timezone) : undefined,
  });
};

type UseUpdateOccurrenceOptions = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof updateOccurrence>;
};

export const useUpdateOccurrence = ({ familyId, mutationConfig }: UseUpdateOccurrenceOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['events', familyId] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateOccurrence,
  });
};
