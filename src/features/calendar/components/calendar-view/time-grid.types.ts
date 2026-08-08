import type { DateTime } from 'luxon';
import type { EventOccurrence } from '@/types/api';

export type TimeGridProps = {
  days: DateTime[];
  occurrences: EventOccurrence[];
  displayTimezone: string;
  colorByPersonId: Map<string, string>;
  onOccurrenceClick: (occurrence: EventOccurrence) => void;
};
