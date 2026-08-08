import type { CalendarEvent } from '@/types/api';

export type EventFormDrawerProps = {
  familyId: string;
  // Present = editing this event's whole series; absent = creating a new event.
  event?: CalendarEvent;
  // Uncontrolled (default): the drawer opens only when triggerButton is
  // clicked. Controlled: pass open/onOpenChange instead and omit
  // triggerButton, to drive the drawer from elsewhere - see FormDrawer.
  triggerButton?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSaved?: () => void;
};
