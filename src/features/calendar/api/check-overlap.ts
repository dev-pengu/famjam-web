import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { EventOccurrence } from '@/types/api';
import { toIsoInstant } from './create-event';

export type CheckOverlapInput = {
  startsAtDate: string;
  startsAtTime: string;
  endsAtDate: string;
  endsAtTime: string;
  timezone: string;
  participantPersonIds?: string[];
  includeAllFamilyMembers?: boolean;
  excludeEventId?: string;
};

export const checkOverlap = ({
  familyId,
  data,
}: {
  familyId: string;
  data: CheckOverlapInput;
}): Promise<EventOccurrence[]> => {
  return apiClient.post<EventOccurrence[]>(`/api/v1/families/${familyId}/events/check_overlap`, {
    starts_at: toIsoInstant(data.startsAtDate, data.startsAtTime, data.timezone),
    ends_at: toIsoInstant(data.endsAtDate, data.endsAtTime, data.timezone),
    participant_person_ids: data.participantPersonIds ?? [],
    include_all_family_members: data.includeAllFamilyMembers ?? false,
    exclude_event_id: data.excludeEventId,
  });
};

type UseCheckOverlapOptions = {
  mutationConfig?: MutationConfig<typeof checkOverlap>;
};

export const useCheckOverlap = ({ mutationConfig }: UseCheckOverlapOptions) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: checkOverlap,
  });
};
