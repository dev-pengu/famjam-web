import { DateTime } from 'luxon';
import { startOfWeekSunday } from './start-of-week';

export type CalendarRangeMode = 'day' | 'week' | 'month';

export const CALENDAR_RANGE_OPTIONS: { value: CalendarRangeMode; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

export const rangeStartFor = (anchor: DateTime, mode: CalendarRangeMode): DateTime => {
  switch (mode) {
    case 'day':
      return anchor.startOf('day');
    case 'week':
      return startOfWeekSunday(anchor);
    case 'month':
      return anchor.startOf('month');
  }
};

export const rangeEndFor = (start: DateTime, mode: CalendarRangeMode): DateTime => {
  switch (mode) {
    case 'day':
      return start.plus({ days: 1 });
    case 'week':
      return start.plus({ weeks: 1 });
    case 'month':
      return start.plus({ months: 1 });
  }
};

export const shiftRange = (anchor: DateTime, mode: CalendarRangeMode, direction: 1 | -1): DateTime => {
  switch (mode) {
    case 'day':
      return anchor.plus({ days: direction });
    case 'week':
      return anchor.plus({ weeks: direction });
    case 'month':
      return anchor.plus({ months: direction });
  }
};

export const formatRangeLabel = (start: DateTime, end: DateTime, mode: CalendarRangeMode): string => {
  switch (mode) {
    case 'day':
      return start.toFormat('cccc, LLLL d, yyyy');
    case 'week':
      return `${start.toFormat('LLL d')} - ${end.minus({ days: 1 }).toFormat('LLL d, yyyy')}`;
    case 'month':
      return start.toFormat('LLLL yyyy');
  }
};
