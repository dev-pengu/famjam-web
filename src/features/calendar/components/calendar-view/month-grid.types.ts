import type { DateTime } from 'luxon';
import type { EventOccurrence } from '@/types/api';

export type MonthGridProps = {
  days: DateTime[];
  currentMonth: number;
  occurrences: EventOccurrence[];
  displayTimezone: string;
  colorByPersonId: Map<string, string>;
  onOccurrenceClick: (occurrence: EventOccurrence) => void;
  onDayClick: (day: DateTime) => void;
};
