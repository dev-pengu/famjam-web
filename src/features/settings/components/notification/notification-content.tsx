import {
  Switch,
  SwitchSize,
  Typography,
  TypographyTextSize,
  useSnackbar,
} from '@famjam/ui';

import { useNotificationPreferences } from '@/features/calendar/api/notification-preferences/get-preferences';
import { useUpdateNotificationPreferences } from '@/features/calendar/api/notification-preferences/update-preferences';
import type { NotificationType } from '@/types/api';
import styles from './notification-content.module.css';

const LABELS: Record<NotificationType, { title: string; description: string }> =
  {
    event_reminder: {
      title: 'Event reminders',
      description: 'Reminders you set on events you’re part of.',
    },
    event_invited: {
      title: 'Added to an event',
      description: 'When someone adds you as a participant on an event.',
    },
    event_updated: {
      title: 'Event changes',
      description: 'When an event you’re part of is edited.',
    },
    event_cancelled: {
      title: 'Event cancellations',
      description: 'When an event or occurrence you’re part of is cancelled.',
    },
    agenda_email: {
      title: 'Agenda emails',
      description: 'The recurring agenda email summaries you’ve subscribed to.',
    },
  };

const NOTIFICATION_TYPE_ORDER: NotificationType[] = [
  'event_reminder',
  'event_invited',
  'event_updated',
  'event_cancelled',
  'agenda_email',
];

export const NotificationContent = () => {
  const { addToast } = useSnackbar();
  const { data: preferences } = useNotificationPreferences();
  const updatePreferencesMutation = useUpdateNotificationPreferences({
    mutationConfig: {
      onSuccess: () =>
        addToast({ message: 'Notification preferences updated' }),
    },
  });

  const enabledFor = (type: NotificationType) =>
    preferences?.find((p) => p.notification_type === type)?.enabled ?? true;

  return (
    <div className={styles.container}>
      <Typography.Title bold>Calendar</Typography.Title>
      <Typography.Body
        size={TypographyTextSize.Small}
        muted
        className={styles.description}
      >
        Choose which calendar emails you want to receive.
      </Typography.Body>
      {NOTIFICATION_TYPE_ORDER.map((type) => (
        <div key={type} className={styles.row}>
          <Switch
            checked={enabledFor(type)}
            onChange={(enabled) =>
              updatePreferencesMutation.mutate({
                preferences: [{ notificationType: type, enabled: !!enabled }],
              })
            }
            label={LABELS[type].title}
            size={SwitchSize.Small}
          />
          <Typography.Body
            size={TypographyTextSize.Small}
            muted
            className={styles.rowDescription}
          >
            {LABELS[type].description}
          </Typography.Body>
        </div>
      ))}
    </div>
  );
};
