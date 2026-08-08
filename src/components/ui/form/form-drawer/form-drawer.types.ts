export type FormDrawerProps = {
  isDone: boolean;
  // Uncontrolled (default): omit triggerButton is not allowed, the drawer
  // opens only when triggerButton is clicked.
  // Controlled: pass open/onOpenChange instead, and omit triggerButton, to
  // drive the drawer from elsewhere - e.g. closing a parent Modal (which
  // unmounts its children, including a nested FormDrawer) at the same time
  // as opening this one, so the drawer survives independently as a sibling.
  triggerButton?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  submitButton: React.ReactElement;
  title: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
};
