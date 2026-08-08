import type { CalendarRangeMode } from '../../utils/calendar-range';

export type CalendarViewOptionsProps = {
  familyId: string;
  className?: string;
  rangeMode: CalendarRangeMode;
  rangeLabel: string;
  onRangeModeChange: (mode: CalendarRangeMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};
