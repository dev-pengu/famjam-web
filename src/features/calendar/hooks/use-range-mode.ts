import { useCallback, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { useControlled } from '@famjam/ui';
import { useDisplayTimezone } from '@/hooks/use-display-timezone';
import {
  formatRangeLabel,
  rangeEndFor,
  rangeStartFor,
  shiftRange,
  type CalendarRangeMode,
} from '../utils/calendar-range';

export type DateRange = {
  start: DateTime;
  end: DateTime;
};

type UseRangeModeProps = {
  mode?: CalendarRangeMode;
  defaultRangeMode?: CalendarRangeMode;
  onModeChanged?: (value: React.SetStateAction<CalendarRangeMode | undefined>) => void;
};

export const useRangeMode = ({
  mode: controlledMode,
  defaultRangeMode = 'week',
  onModeChanged,
}: UseRangeModeProps = {}) => {
  const displayTimezone = useDisplayTimezone();

  const [controlledRangeMode, setRangeMode] = useControlled({
    controlledValue: controlledMode,
    defaultValue: defaultRangeMode,
    onChange: onModeChanged,
  });
  const rangeMode = controlledRangeMode ?? defaultRangeMode;

  const [anchor, setAnchor] = useState<DateTime>(() =>
    DateTime.now().setZone(displayTimezone),
  );

  const range = useMemo<DateRange>(() => {
    const start = rangeStartFor(anchor, rangeMode);
    return { start, end: rangeEndFor(start, rangeMode) };
  }, [anchor, rangeMode]);

  const prevWindow = useCallback(
    () => setAnchor((d) => shiftRange(d, rangeMode, -1)),
    [rangeMode],
  );
  const nextWindow = useCallback(
    () => setAnchor((d) => shiftRange(d, rangeMode, 1)),
    [rangeMode],
  );
  const anchorOnToday = useCallback(
    () => setAnchor(DateTime.now().setZone(displayTimezone)),
    [displayTimezone],
  );
  const goToDay = useCallback(
    (day: DateTime) => {
      setRangeMode('day');
      setAnchor(day);
    },
    [setRangeMode],
  );

  const rangeLabel = formatRangeLabel(range.start, range.end, rangeMode);

  return {
    rangeMode,
    setRangeMode,
    anchor,
    range,
    rangeLabel,
    prevWindow,
    nextWindow,
    anchorOnToday,
    goToDay,
  };
};
