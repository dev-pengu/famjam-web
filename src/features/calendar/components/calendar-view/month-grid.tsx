import { useMemo } from 'react';
import { DateTime } from 'luxon';
import { Typography, TypographyTextSize } from '@famjam/ui';

import type { EventOccurrence } from '@/types/api';
import type { MonthGridProps } from './month-grid.types';
import styles from './month-grid.module.css';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAX_VISIBLE_PER_DAY = 3;

const chunkIntoWeeks = (days: DateTime[]): DateTime[][] => {
  const weeks: DateTime[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
};

export const MonthGrid = ({
  days,
  currentMonth,
  occurrences,
  displayTimezone,
  colorByPersonId,
  onOccurrenceClick,
  onDayClick,
}: Readonly<MonthGridProps>) => {
  const occurrencesByDate = useMemo(() => {
    const byDate = new Map<string, EventOccurrence[]>();

    occurrences
      .filter((o) => !o.cancelled)
      .forEach((occurrence) => {
        const start = DateTime.fromISO(occurrence.starts_at, { zone: displayTimezone });
        const dateKey = start.toISODate() ?? '';
        const existing = byDate.get(dateKey) ?? [];
        existing.push(occurrence);
        byDate.set(dateKey, existing);
      });

    byDate.forEach((dayOccurrences) => {
      dayOccurrences.sort((a, b) => {
        if (a.event.all_day !== b.event.all_day) return a.event.all_day ? -1 : 1;
        return a.starts_at.localeCompare(b.starts_at);
      });
    });

    return byDate;
  }, [occurrences, displayTimezone]);

  const today = DateTime.now().setZone(displayTimezone).toISODate();
  const weeks = chunkIntoWeeks(days);

  return (
    <div className={styles.container}>
      <div className={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className={styles.weekdayLabel}>
            <Typography.Body size={TypographyTextSize.Small} muted>
              {label}
            </Typography.Body>
          </div>
        ))}
      </div>

      {weeks.map((week) => (
        <div key={week[0]?.toISODate() ?? ''} className={styles.weekRow}>
          {week.map((day) => {
            const dateKey = day.toISODate() ?? '';
            const dayOccurrences = occurrencesByDate.get(dateKey) ?? [];
            const visible = dayOccurrences.slice(0, MAX_VISIBLE_PER_DAY);
            const overflowCount = dayOccurrences.length - visible.length;

            return (
              <div
                key={dateKey}
                className={
                  day.month === currentMonth ? styles.dayCell : `${styles.dayCell} ${styles.outsideMonth}`
                }
              >
                <button
                  type="button"
                  className={dateKey === today ? `${styles.dayNumber} ${styles.today}` : styles.dayNumber}
                  onClick={() => onDayClick(day)}
                >
                  {day.toFormat('d')}
                </button>

                <div className={styles.eventList}>
                  {visible.map((occurrence) => {
                    const firstParticipant = occurrence.event.participants[0];
                    const dotColor = firstParticipant ? colorByPersonId.get(firstParticipant.id) : undefined;

                    return (
                      <button
                        key={`${occurrence.event_id}-${occurrence.occurrence_start_at}`}
                        type="button"
                        className={styles.eventRow}
                        onClick={() => onOccurrenceClick(occurrence)}
                      >
                        <span
                          className={styles.eventDot}
                          style={{ background: dotColor ?? 'var(--color-border-primary)' }}
                        />
                        <span className={styles.eventLabel}>
                          {!occurrence.event.all_day &&
                            `${DateTime.fromISO(occurrence.starts_at, { zone: displayTimezone }).toFormat('h:mm a')} `}
                          {occurrence.title}
                        </span>
                      </button>
                    );
                  })}
                  {overflowCount > 0 && (
                    <button type="button" className={styles.moreButton} onClick={() => onDayClick(day)}>
                      <Typography.Body size={TypographyTextSize.Small} muted>
                        +{overflowCount} more
                      </Typography.Body>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
