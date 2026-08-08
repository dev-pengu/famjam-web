import { useEvents } from '../api/get-events';
import { startOfWeekSunday } from '../utils/start-of-week';
import type { DateRange } from './use-range-mode';

type UseCalendarDataProps = {
  familyId: string;
  range?: DateRange;
  isMonthCalendar?: boolean;
};

const MONTH_GRID_WEEKS = 6;

export const useCalendarData = ({ familyId, range, isMonthCalendar = false }: UseCalendarDataProps) => {
  const start = isMonthCalendar && range?.start ? startOfWeekSunday(range.start) : range?.start;
  const end = isMonthCalendar ? start?.plus({ weeks: MONTH_GRID_WEEKS }) : range?.end;

  const { data: occurrences, isLoading } = useEvents({
    familyId,
    from: start?.toUTC().toISO() ?? '',
    to: end?.toUTC().toISO() ?? '',
  });

  return { occurrences, isLoading, start, end };
};
