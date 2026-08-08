import type { EventOccurrence } from '@/types/api';

export type EventDetailModalProps = {
  familyId: string;
  occurrence: EventOccurrence;
  open: boolean;
  onClose: () => void;
};
