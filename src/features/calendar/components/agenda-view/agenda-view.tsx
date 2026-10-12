import { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import {
  Avatar,
  AvatarSize,
  AvatarGroup,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  ChipColor,
  Spinner,
  Typography,
  TypographyTextSize,
} from '@famjam/ui';

import { useDisclosure } from '@/hooks/use-diclosure';
import { useDisplayTimezone } from '@/hooks/use-display-timezone';
import { useMemberships } from '@/features/family/api/membership/get-memberships';
import { APP_COLOR_TOKEN } from '@/utils/color-palette';
import type { EventOccurrence } from '@/types/api';
import { EventDetailModal } from '../event-detail-modal';
import { CalendarViewOptions } from '../calendar-view-options';
import { useRangeMode } from '../../hooks/use-range-mode';
import { useCalendarData } from '../../hooks/use-calendar-data';
import { CATEGORY_LABEL, CATEGORY_COLOR } from '../../constants/event-category';
import type { AgendaViewProps } from './agenda-view.types';
import styles from './agenda-view.module.css';
import { AgendaCard } from './agenda-card';

export const AgendaView = ({ familyId }: Readonly<AgendaViewProps>) => {
  const displayTimezone = useDisplayTimezone();
  const {
    rangeMode,
    range,
    rangeLabel,
    setRangeMode,
    prevWindow,
    nextWindow,
    anchorOnToday,
  } = useRangeMode();

  const { data: memberships } = useMemberships({ familyId });
  const { occurrences, isLoading } = useCalendarData({ familyId, range });

  const {
    isOpen: detailOpen,
    open: openDetail,
    close: closeDetail,
  } = useDisclosure();
  const [selectedOccurrence, setSelectedOccurrence] =
    useState<EventOccurrence | null>(null);

  const colorByPersonId = new Map(
    (memberships ?? []).map((m) => [m.person.id, APP_COLOR_TOKEN[m.color]]),
  );

  const groups = useMemo(() => {
    const visible = (occurrences ?? []).filter((o) => !o.cancelled);
    const byDay = new Map<string, EventOccurrence[]>();

    visible.forEach((occurrence) => {
      const day =
        DateTime.fromISO(occurrence.starts_at, {
          zone: displayTimezone,
        }).toISODate() ?? '';
      const existing = byDay.get(day) ?? [];
      existing.push(occurrence);
      byDay.set(day, existing);
    });

    return Array.from(byDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, dayOccurrences]) => ({
        day,
        occurrences: dayOccurrences.sort((a, b) =>
          a.starts_at.localeCompare(b.starts_at),
        ),
      }));
  }, [occurrences, displayTimezone]);

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

      {!isLoading && groups.length === 0 && (
        <Typography.Body className={styles.empty}>
          Nothing on the calendar for this range.
        </Typography.Body>
      )}

      {groups.map(({ day, occurrences: dayOccurrences }) => (
        <div key={day} className={styles.dayGroup}>
          <Typography.Body bold className={styles.dayHeader}>
            {DateTime.fromISO(day, { zone: displayTimezone }).toFormat(
              'cccc, LLLL d',
            )}
          </Typography.Body>
          {dayOccurrences.map((occurrence) => {
            const start = DateTime.fromISO(occurrence.starts_at, {
              zone: displayTimezone,
            });
            const end = DateTime.fromISO(occurrence.ends_at, {
              zone: displayTimezone,
            });

            return (
              <AgendaCard
                key={`${occurrence.event_id}-${occurrence.occurrence_start_at}`}
                occurrence={occurrence}
                onOccurrenceClick={handleOccurrenceClick}
                colorByPersonId={colorByPersonId}
              />
            );
          })}
        </div>
      ))}

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
