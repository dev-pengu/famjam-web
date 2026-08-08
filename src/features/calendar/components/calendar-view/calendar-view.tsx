import { useMemo, useState } from 'react';
import { Spinner } from '@famjam/ui';

import { useDisclosure } from '@/hooks/use-diclosure';
import { useDisplayTimezone } from '@/hooks/use-display-timezone';
import { useMemberships } from '@/features/family/api/membership/get-memberships';
import { MEMBERSHIP_COLOR_TOKEN } from '@/utils/membership-color';
import type { EventOccurrence } from '@/types/api';
import { EventDetailModal } from '../event-detail-modal';
import { CalendarViewOptions } from '../calendar-view-options';
import { useRangeMode } from '../../hooks/use-range-mode';
import { useCalendarData } from '../../hooks/use-calendar-data';
import { TimeGrid } from './time-grid';
import { MonthGrid } from './month-grid';
import type { CalendarViewProps } from './calendar-view.types';
import styles from './calendar-view.module.css';

export const CalendarView = ({ familyId }: Readonly<CalendarViewProps>) => {
  const displayTimezone = useDisplayTimezone();
  const {
    rangeMode,
    range,
    rangeLabel,
    setRangeMode,
    prevWindow,
    nextWindow,
    anchorOnToday,
    goToDay,
  } = useRangeMode();

  const { data: memberships } = useMemberships({ familyId });
  const {
    occurrences,
    isLoading,
    start: gridStart,
    end: gridEnd,
  } = useCalendarData({
    familyId,
    range,
    isMonthCalendar: rangeMode === 'month',
  });

  const {
    isOpen: detailOpen,
    open: openDetail,
    close: closeDetail,
  } = useDisclosure();
  const [selectedOccurrence, setSelectedOccurrence] =
    useState<EventOccurrence | null>(null);

  const colorByPersonId = new Map(
    (memberships ?? []).map((m) => [
      m.person.id,
      MEMBERSHIP_COLOR_TOKEN[m.color],
    ]),
  );

  const days = useMemo(() => {
    if (!gridStart || !gridEnd) return [];
    const dayCount = Math.round(gridEnd.diff(gridStart, 'days').days);
    return Array.from({ length: dayCount }, (_, i) =>
      gridStart.plus({ days: i }),
    );
  }, [gridStart, gridEnd]);

  const handleOccurrenceClick = (occurrence: EventOccurrence) => {
    setSelectedOccurrence(occurrence);
    openDetail();
  };

  return (
    <div className={styles.container}>
      <CalendarViewOptions
        familyId={familyId}
        rangeMode={rangeMode}
        rangeLabel={rangeLabel}
        onRangeModeChange={setRangeMode}
        onPrev={prevWindow}
        onNext={nextWindow}
        onToday={anchorOnToday}
      />

      {isLoading && <Spinner />}

      {!isLoading && rangeMode !== 'month' && (
        <TimeGrid
          days={days}
          occurrences={occurrences ?? []}
          displayTimezone={displayTimezone}
          colorByPersonId={colorByPersonId}
          onOccurrenceClick={handleOccurrenceClick}
        />
      )}

      {!isLoading && rangeMode === 'month' && (
        <MonthGrid
          days={days}
          currentMonth={range.start.month}
          occurrences={occurrences ?? []}
          displayTimezone={displayTimezone}
          colorByPersonId={colorByPersonId}
          onOccurrenceClick={handleOccurrenceClick}
          onDayClick={goToDay}
        />
      )}

      {selectedOccurrence && (
        <EventDetailModal
          familyId={familyId}
          occurrence={selectedOccurrence}
          open={detailOpen}
          onClose={closeDetail}
        />
      )}
    </div>
  );
};
