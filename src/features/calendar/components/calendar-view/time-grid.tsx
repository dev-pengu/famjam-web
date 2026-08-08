import { useMemo } from 'react';
import { DateTime } from 'luxon';
import { Chip, Typography, TypographyTextSize } from '@famjam/ui';

import type { EventOccurrence } from '@/types/api';
import { CATEGORY_COLOR } from '../../constants/event-category';
import { packDayOccurrences, HOUR_HEIGHT_PX, type TimedOccurrence } from './pack-day-occurrences';
import type { TimeGridProps } from './time-grid.types';
import styles from './calendar-view.module.css';

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

const formatHourLabel = (hour: number): string => {
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour} ${period}`;
};

export const TimeGrid = ({
  days,
  occurrences,
  displayTimezone,
  colorByPersonId,
  onOccurrenceClick,
}: Readonly<TimeGridProps>) => {
  const { allDayByDate, timedByDate } = useMemo(() => {
    const allDay = new Map<string, EventOccurrence[]>();
    const timed = new Map<string, TimedOccurrence[]>();

    occurrences
      .filter((o) => !o.cancelled)
      .forEach((occurrence) => {
        const start = DateTime.fromISO(occurrence.starts_at, { zone: displayTimezone });
        const end = DateTime.fromISO(occurrence.ends_at, { zone: displayTimezone });
        const dateKey = start.toISODate() ?? '';

        if (occurrence.event.all_day) {
          const existing = allDay.get(dateKey) ?? [];
          existing.push(occurrence);
          allDay.set(dateKey, existing);
        } else {
          const existing = timed.get(dateKey) ?? [];
          existing.push({ occurrence, start, end });
          timed.set(dateKey, existing);
        }
      });

    return { allDayByDate: allDay, timedByDate: timed };
  }, [occurrences, displayTimezone]);

  const today = DateTime.now().setZone(displayTimezone).toISODate();

  return (
    <div className={styles.grid}>
      <div className={styles.gutterColumn}>
        <div className={styles.dayHeaderSpacer} />
        <div className={styles.allDaySpacer} />
        {HOURS.map((hour) => (
          <div key={hour} className={styles.hourLabel} style={{ height: HOUR_HEIGHT_PX }}>
            <Typography.Body as="span" size={TypographyTextSize.Small}>
              {hour > 0 && formatHourLabel(hour)}
            </Typography.Body>
          </div>
        ))}
      </div>

      {days.map((day) => {
        const dateKey = day.toISODate() ?? '';
        const dayAllDay = allDayByDate.get(dateKey) ?? [];
        const dayTimed = packDayOccurrences(timedByDate.get(dateKey) ?? []);

        return (
          <div key={dateKey} className={styles.dayColumn}>
            <div className={styles.dayHeader}>
              <Typography.Body size={TypographyTextSize.Small} muted>
                {day.toFormat('ccc')}
              </Typography.Body>
              <Typography.Body bold className={dateKey === today ? styles.today : undefined}>
                {day.toFormat('d')}
              </Typography.Body>
            </div>

            <div className={styles.allDayRow}>
              {dayAllDay.map((occurrence) => (
                <Chip
                  key={`${occurrence.event_id}-${occurrence.occurrence_start_at}`}
                  label={occurrence.title}
                  color={occurrence.category ? CATEGORY_COLOR[occurrence.category] : undefined}
                  dismissable={false}
                  onClick={() => onOccurrenceClick(occurrence)}
                  className={styles.allDayChip}
                />
              ))}
            </div>

            <div className={styles.hourGrid} style={{ height: HOUR_HEIGHT_PX * 24 }}>
              {HOURS.map((hour) => (
                <div key={hour} className={styles.hourRow} style={{ height: HOUR_HEIGHT_PX }} />
              ))}
              {dayTimed.map((packed) => {
                const firstParticipant = packed.occurrence.event.participants[0];
                const accentColor = firstParticipant ? colorByPersonId.get(firstParticipant.id) : undefined;

                return (
                  <button
                    key={`${packed.occurrence.event_id}-${packed.occurrence.occurrence_start_at}`}
                    type="button"
                    className={styles.eventBlock}
                    style={{
                      top: packed.topPx,
                      height: packed.heightPx,
                      left: `${packed.leftPercent}%`,
                      width: `${packed.widthPercent}%`,
                      borderLeftColor: accentColor ?? 'var(--color-border-primary)',
                    }}
                    onClick={() => onOccurrenceClick(packed.occurrence)}
                  >
                    <span className={styles.eventBlockTitle}>{packed.occurrence.title}</span>
                    <span className={styles.eventBlockTime}>
                      {packed.occurrence.starts_at
                        ? DateTime.fromISO(packed.occurrence.starts_at, { zone: displayTimezone }).toFormat('h:mm a')
                        : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
