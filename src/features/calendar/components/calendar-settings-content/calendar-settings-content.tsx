import { useState } from 'react';
import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonVariant,
  Divider,
  Icon,
  IconName,
  Input,
  InputVariant,
  Select,
  Switch,
  Typography,
  TypographyTextSize,
  useSnackbar,
} from '@famjam/ui';

import { CopyButton } from '@/components/ui';
import { AgendaScope } from '../../api/agenda-subscriptions/create-subscription';
import { useAgendaSubscriptions } from '../../api/agenda-subscriptions/get-subscriptions';
import { useCreateAgendaSubscription } from '../../api/agenda-subscriptions/create-subscription';
import { useUpdateAgendaSubscription } from '../../api/agenda-subscriptions/update-subscription';
import { useDeleteAgendaSubscription } from '../../api/agenda-subscriptions/delete-subscription';
import { useIcalFeedToken } from '../../api/ical-feed/get-token';
import { useRegenerateIcalFeedToken } from '../../api/ical-feed/regenerate-token';
import type { CalendarSettingsContentProps } from './calendar-settings-content.types';
import styles from './calendar-settings-content.module.css';

const SCOPE_OPTIONS = [
  { label: 'Just my events', value: AgendaScope.mine },
  { label: 'Whole family', value: AgendaScope.whole_family },
];

const SCOPE_LABEL: Record<string, string> = {
  [AgendaScope.mine]: 'Just my events',
  [AgendaScope.whole_family]: 'Whole family',
};

export const CalendarSettingsContent = ({ familyId }: Readonly<CalendarSettingsContentProps>) => {
  const { addToast } = useSnackbar();
  const { data: subscriptions } = useAgendaSubscriptions({ familyId });
  const { data: icalToken } = useIcalFeedToken();

  const [newScope, setNewScope] = useState<string>(AgendaScope.mine);
  const [newIntervalDays, setNewIntervalDays] = useState('7');
  const [newSendHour, setNewSendHour] = useState('7');

  const createSubscriptionMutation = useCreateAgendaSubscription({
    familyId,
    mutationConfig: { onSuccess: () => addToast({ message: 'Agenda email subscription created' }) },
  });
  const updateSubscriptionMutation = useUpdateAgendaSubscription({ familyId });
  const deleteSubscriptionMutation = useDeleteAgendaSubscription({
    familyId,
    mutationConfig: { onSuccess: () => addToast({ message: 'Subscription removed' }) },
  });
  const regenerateTokenMutation = useRegenerateIcalFeedToken({
    mutationConfig: { onSuccess: () => addToast({ message: 'iCal link regenerated - the old link no longer works' }) },
  });

  return (
    <div className={styles.container}>
      <section>
        <Typography.Title as="h3" size={TypographyTextSize.Small} bold className={styles.sectionTitle}>
          Agenda Emails
        </Typography.Title>
        <Typography.Body size={TypographyTextSize.Small} muted className={styles.sectionDescription}>
          Get a recurring email summary of upcoming events.
        </Typography.Body>

        {(subscriptions ?? []).map((subscription) => (
          <div key={subscription.id} className={styles.subscriptionRow}>
            <Switch
              checked={subscription.enabled}
              onChange={(enabled) =>
                updateSubscriptionMutation.mutate({
                  familyId,
                  subscriptionId: subscription.id,
                  data: { enabled: !!enabled },
                })
              }
            />
            <Typography.Body size={TypographyTextSize.Small} as="span">
              {SCOPE_LABEL[subscription.scope]} every {subscription.interval_days} day
              {subscription.interval_days === 1 ? '' : 's'} at {subscription.send_hour_local}:00
            </Typography.Body>
            <Button
              variant={ButtonVariant.Text}
              size={ButtonSize.Small}
              color={ButtonColor.Error}
              loading={deleteSubscriptionMutation.isPending}
              onClick={() => deleteSubscriptionMutation.mutate({ familyId, subscriptionId: subscription.id })}
            >
              <Icon name={IconName.Delete} decorative size={14} />
            </Button>
          </div>
        ))}

        <div className={styles.newSubscriptionRow}>
          <Select options={SCOPE_OPTIONS} value={newScope} onChange={(v) => setNewScope(v as string)} />
          <Input
            variant={InputVariant.Number}
            value={newIntervalDays}
            onChange={(e) => setNewIntervalDays(e.target.value)}
            label="Every N days"
          />
          <Input
            variant={InputVariant.Number}
            value={newSendHour}
            onChange={(e) => setNewSendHour(e.target.value)}
            label="Send hour (0-23)"
          />
          <Button
            variant={ButtonVariant.Glass}
            size={ButtonSize.Small}
            loading={createSubscriptionMutation.isPending}
            onClick={() =>
              createSubscriptionMutation.mutate({
                familyId,
                data: {
                  scope: newScope as (typeof AgendaScope)[keyof typeof AgendaScope],
                  intervalDays: Number(newIntervalDays) || 7,
                  sendHourLocal: Number(newSendHour) || 7,
                },
              })
            }
          >
            Add
          </Button>
        </div>
      </section>

      <Divider className={styles.divider} />

      <section>
        <Typography.Title as="h3" size={TypographyTextSize.Small} bold className={styles.sectionTitle}>
          Subscribe in your calendar app
        </Typography.Title>
        <Typography.Body size={TypographyTextSize.Small} muted className={styles.sectionDescription}>
          Add this family's calendar to Apple Calendar, Google Calendar, or Outlook.
        </Typography.Body>

        {icalToken && (
          <div className={styles.icalRow}>
            <CopyButton ariaLabel="Copy calendar link">
              <Typography.Body as="code" size={TypographyTextSize.Small}>
                {icalToken.webcal_url}
              </Typography.Body>
            </CopyButton>
          </div>
        )}

        <Button
          variant={ButtonVariant.Glass}
          size={ButtonSize.Small}
          loading={regenerateTokenMutation.isPending}
          onClick={() => regenerateTokenMutation.mutate(undefined)}
        >
          {icalToken ? 'Regenerate link' : 'Generate link'}
        </Button>
      </section>
    </div>
  );
};
