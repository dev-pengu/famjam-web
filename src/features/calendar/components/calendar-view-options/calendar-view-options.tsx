import { cx } from '@/utils/cx';
import {
  Typography,
  TypographyTextSize,
  Button,
  Icon,
  IconName,
  ButtonVariant,
  ButtonSize,
  ToggleGroup,
  ToggleGroupItem,
} from '@famjam/ui';
import type { CalendarViewOptionsProps } from './calendar-view-options.types';

import styles from './calendar-view-options.module.css';
import type { CalendarRangeMode } from '../../utils/calendar-range';
import { EventFormDrawer } from '../event-form-drawer';

const iconsByRangeMode: Record<CalendarRangeMode, IconName> = {
  day: IconName.CalendarDayView,
  week: IconName.CalendarWeekView,
  month: IconName.CalendarMonthView,
};

export const CalendarViewOptions = ({
  familyId,
  className,
  rangeMode,
  rangeLabel,
  onRangeModeChange,
  onPrev,
  onNext,
  onToday,
}: CalendarViewOptionsProps) => {
  const handleRangeModeChange = (value: unknown) => {
    if (value) {
      onRangeModeChange(value as CalendarRangeMode);
    }
  };

  return (
    <div className={cx(styles.container, className)}>
      <div className={styles.nav}>
        <Button
          variant={ButtonVariant.Glass}
          size={ButtonSize.Small}
          onClick={onPrev}
        >
          <Icon name={IconName.ArrowLeft} decorative size={16} />
        </Button>
        <Button
          variant={ButtonVariant.Glass}
          size={ButtonSize.Small}
          onClick={onToday}
        >
          Today
        </Button>
        <Button
          variant={ButtonVariant.Glass}
          size={ButtonSize.Small}
          onClick={onNext}
        >
          <Icon name={IconName.ArrowRight} decorative size={16} />
        </Button>
        <Typography.Body size={TypographyTextSize.Small}>
          {rangeLabel}
        </Typography.Body>
      </div>
      <span className={styles.endActions}>
        <ToggleGroup
          value={rangeMode}
          onChange={handleRangeModeChange}
          ariaLabel="Change active event range"
        >
          {Object.keys(iconsByRangeMode).map((mode) => (
            <ToggleGroupItem key={mode} value={mode}>
              <Icon name={iconsByRangeMode[mode as CalendarRangeMode]} />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <EventFormDrawer
          familyId={familyId}
          triggerButton={
            <Button variant={ButtonVariant.Glass} size={ButtonSize.Small}>
              <Icon name={IconName.EventAdd} size={18} />
            </Button>
          }
        />
      </span>
    </div>
  );
};
