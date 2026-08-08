import type { EventOccurrence } from '@/types/api';
import type { Color } from '@famjam/ui';

export type AgendaCardProps = {
  occurrence: EventOccurrence;
  onOccurrenceClick: (occurrence: EventOccurrence) => void;
  colorByPersonId: Map<string, Color>;
};
