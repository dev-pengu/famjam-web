import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { DateTime } from 'luxon';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { CalendarEvent } from '@/types/api';

export const EventCategory = {
  school: 'school',
  practice_sports: 'practice_sports',
  medical: 'medical',
  travel: 'travel',
} as const;

export const RecurrenceFrequency = {
  daily: 'daily',
  weekly: 'weekly',
  monthly: 'monthly',
  yearly: 'yearly',
} as const;

export const eventInputSchema = z.object({
  title: z.string().min(1, 'Required'),
  description: z.string().optional(),
  location: z.string().optional(),
  category: z.enum(EventCategory).optional(),
  timezone: z.string().min(1, 'Required'),
  allDay: z.boolean().optional(),
  startsAtDate: z.string().min(1, 'Required'),
  startsAtTime: z.string().min(1, 'Required'),
  endsAtDate: z.string().min(1, 'Required'),
  endsAtTime: z.string().min(1, 'Required'),
  recurrenceFrequency: z.enum(RecurrenceFrequency).optional(),
  recurrenceInterval: z.int().optional(),
  recurrenceByday: z.array(z.string()).optional(),
  recurrenceUntil: z.string().optional(),
  participantPersonIds: z.array(z.string()).optional(),
  includeAllFamilyMembers: z.boolean().optional(),
});

export type EventInput = z.infer<typeof eventInputSchema>;

// Combines a DatePicker date ('YYYY-MM-DD') and TimePicker time ('HH:mm')
// into a UTC ISO instant, interpreting the wall-clock date+time in the
// event's own timezone - this is what makes recurrence/reminders land at
// the right local time regardless of the viewer's own timezone.
export const toIsoInstant = (date: string, time: string, timezone: string): string => {
  return DateTime.fromISO(`${date}T${time}`, { zone: timezone }).toUTC().toISO() ?? '';
};

export const eventInputToRequestBody = (data: EventInput) => ({
  title: data.title,
  description: data.description || null,
  location: data.location || null,
  category: data.category ?? null,
  timezone: data.timezone,
  all_day: data.allDay ?? false,
  starts_at: toIsoInstant(data.startsAtDate, data.startsAtTime, data.timezone),
  ends_at: toIsoInstant(data.endsAtDate, data.endsAtTime, data.timezone),
  recurrence_frequency: data.recurrenceFrequency ?? null,
  recurrence_interval: data.recurrenceInterval ?? 1,
  recurrence_byday: data.recurrenceByday ?? [],
  recurrence_until: data.recurrenceUntil || null,
  participant_person_ids: data.participantPersonIds ?? [],
  include_all_family_members: data.includeAllFamilyMembers ?? false,
});

export type CreateEventResult = CalendarEvent & { overlaps: unknown[] };

export const createEvent = ({
  familyId,
  data,
}: {
  familyId: string;
  data: EventInput;
}): Promise<CreateEventResult> => {
  return apiClient.post<CreateEventResult>(`/api/v1/families/${familyId}/events`, eventInputToRequestBody(data));
};

type UseCreateEventOptions = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof createEvent>;
};

export const useCreateEvent = ({ familyId, mutationConfig }: UseCreateEventOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['events', familyId] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createEvent,
  });
};
