import {
  ToggleGroup,
  ToggleGroupItem,
  Icon,
  IconName,
  Tooltip,
} from '@famjam/ui';
import type {
  CalendarViewMode,
  CalendarViewToggleProps,
} from './calendar-view-toggle.types';
import styles from './calendar-view-toggle.module.css';

const OPTIONS: { value: CalendarViewMode; icon: IconName }[] = [
  { value: 'agenda', icon: IconName.Agenda },
  { value: 'calendar', icon: IconName.Calendar },
];

export const CalendarViewToggle = ({
  value,
  onChange,
}: Readonly<CalendarViewToggleProps>) => {
  const handleChange = (value: React.SetStateAction<string | undefined>) => {
    if (value) {
      onChange(value as CalendarViewMode);
    }
  };
  return (
    <ToggleGroup
      value={value}
      onChange={handleChange}
      className={styles.container}
      ariaLabel="Calendar View Mode Toggle"
    >
      {OPTIONS.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value}>
          <Tooltip content={`Change to ${option.value} view`}>
            <Icon
              name={option.icon}
              decorative={false}
              accessibilityLabel={`Change to ${option.value} view`}
            />
          </Tooltip>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
