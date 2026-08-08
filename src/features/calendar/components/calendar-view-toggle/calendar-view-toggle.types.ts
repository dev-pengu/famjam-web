export type CalendarViewMode = 'agenda' | 'calendar';

export type CalendarViewToggleProps = {
  value: CalendarViewMode;
  onChange: (value: CalendarViewMode) => void;
};
