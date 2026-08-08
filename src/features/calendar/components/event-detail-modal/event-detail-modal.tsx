import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { DateTime } from 'luxon';
import {
  Avatar,
  AvatarSize,
  Button,
  ButtonColor,
  ButtonSize,
  ButtonVariant,
  Chip,
  ChipColor,
  Icon,
  IconName,
  Input,
  InputVariant,
  LabelVariant,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Select,
  Typography,
  TypographyTextSize,
  useSnackbar,
} from '@famjam/ui';

import { Form, FormRow } from '@/components/ui';
import { useDisclosure } from '@/hooks/use-diclosure';
import { useUser } from '@/features/auth/api/get-user';
import { useFamily } from '@/features/family/context/family-context';
import { useMemberships } from '@/features/family/api/membership/get-memberships';
import { MEMBERSHIP_COLOR_TOKEN } from '@/utils/membership-color';
import { EventFormDrawer } from '../event-form-drawer';
import { OccurrenceEditChoiceModal } from '../occurrence-edit-choice-modal';
import { useDeleteEvent } from '../../api/delete-event';
import {
  occurrenceOverrideInputSchema,
  useUpdateOccurrence,
} from '../../api/update-occurrence';
import { useDeleteOccurrence } from '../../api/delete-occurrence';
import { useEventReminders } from '../../api/event-reminders/get-reminders';
import { useCreateEventReminder } from '../../api/event-reminders/create-reminder';
import { useDeleteEventReminder } from '../../api/event-reminders/delete-reminder';
import { CATEGORY_LABEL, CATEGORY_COLOR, CATEGORY_OPTIONS } from '../../constants/event-category';
import type { EventDetailModalProps } from './event-detail-modal.types';
import styles from './event-detail-modal.module.css';

export const EventDetailModal = ({
  familyId,
  occurrence,
  open,
  onClose,
}: Readonly<EventDetailModalProps>) => {
  const { addToast } = useSnackbar();
  const { data: authUser } = useUser();
  const { activeMembership } = useFamily();
  const { data: memberships } = useMemberships({ familyId });
  const { data: reminders } = useEventReminders({
    familyId,
    eventId: occurrence.event.id,
  });

  const {
    isOpen: editingOccurrence,
    open: startEditingOccurrence,
    close: stopEditingOccurrence,
  } = useDisclosure();
  const {
    isOpen: deleteChoiceOpen,
    open: openDeleteChoice,
    close: closeDeleteChoice,
  } = useDisclosure();
  // Rendered as a sibling of Modal below, not nested inside it: Modal
  // unmounts its entire children subtree once it closes, which would kill a
  // nested edit Drawer the instant it opened. Opening this and closing the
  // Modal happen in the same click so only one dialog is ever visible.
  const {
    isOpen: editSeriesOpen,
    open: startEditingSeries,
    close: stopEditingSeries,
  } = useDisclosure();
  const [reminderMinutes, setReminderMinutes] = useState('30');

  const deleteEventMutation = useDeleteEvent({
    familyId,
    mutationConfig: {
      onSuccess: () => {
        addToast({ message: 'Event deleted' });
        onClose();
      },
    },
  });
  const updateOccurrenceMutation = useUpdateOccurrence({
    familyId,
    mutationConfig: {
      onSuccess: () => {
        addToast({ message: 'Occurrence updated' });
        stopEditingOccurrence();
        onClose();
      },
    },
  });
  const deleteOccurrenceMutation = useDeleteOccurrence({
    familyId,
    mutationConfig: {
      onSuccess: () => {
        addToast({ message: 'Occurrence cancelled' });
        onClose();
      },
    },
  });
  const createReminderMutation = useCreateEventReminder({
    familyId,
    eventId: occurrence.event.id,
    mutationConfig: {
      onSuccess: () => addToast({ message: 'Reminder added' }),
    },
  });
  const deleteReminderMutation = useDeleteEventReminder({
    familyId,
    eventId: occurrence.event.id,
    mutationConfig: {
      onSuccess: () => addToast({ message: 'Reminder removed' }),
    },
  });

  const colorByPersonId = new Map(
    (memberships ?? []).map((m) => [
      m.person.id,
      MEMBERSHIP_COLOR_TOKEN[m.color],
    ]),
  );

  const managedParticipants = occurrence.event.participants.filter(
    (p) => p.managed,
  );
  const isCreator = authUser?.person.id === occurrence.event.created_by.id;
  const isOwnerOrAdmin =
    activeMembership?.role === 'owner' || activeMembership?.role === 'admin';
  const isGuardianOfParticipant = managedParticipants.some((p) =>
    p.guardianships?.some((g) => g.guardian.id === authUser?.person.id),
  );
  const canEdit = isCreator || isOwnerOrAdmin || isGuardianOfParticipant;
  const isRecurring = !!occurrence.event.recurrence_frequency;

  const zone = occurrence.event.timezone;
  const start = DateTime.fromISO(occurrence.starts_at, { zone });
  const end = DateTime.fromISO(occurrence.ends_at, { zone });
  const sameDay = start.hasSame(end, 'day');

  const handleDeleteWholeEvent = () => {
    if (isRecurring) {
      openDeleteChoice();
    } else {
      deleteEventMutation.mutate({ familyId, eventId: occurrence.event.id });
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <ModalTitle>{occurrence.title}</ModalTitle>
        <ModalContent>
          <div className={styles.chipWrapper}>
            {occurrence.category && (
              <Chip
                label={CATEGORY_LABEL[occurrence.category]}
                color={CATEGORY_COLOR[occurrence.category]}
                dismissable={false}
              />
            )}
            {occurrence.modified && (
              <Chip
                label="Modified occurrence"
                color={ChipColor.Warning}
                dismissable={false}
              />
            )}
            {occurrence.cancelled && (
              <Chip
                label="Cancelled"
                color={ChipColor.Error}
                dismissable={false}
              />
            )}
          </div>
          {!editingOccurrence && (
            <>
              <Typography.Body className={styles.row}>
                {sameDay
                  ? `${start.toFormat('cccc, LLLL d')} · ${start.toFormat('h:mm a')} - ${end.toFormat('h:mm a')} (${zone})`
                  : `${start.toFormat('cccc, LLLL d, h:mm a')} - ${end.toFormat('cccc, LLLL d, h:mm a')} (${zone})`}
              </Typography.Body>

              {occurrence.location && (
                <Typography.Body className={styles.row}>
                  {occurrence.location}
                </Typography.Body>
              )}
              {occurrence.description && (
                <Typography.Body className={styles.row}>
                  {occurrence.description}
                </Typography.Body>
              )}

              <div className={styles.participants}>
                {occurrence.event.participants.map((person) => (
                  <div key={person.id} className={styles.participant}>
                    <Avatar
                      size={AvatarSize.Small}
                      name={person.display_name}
                      color={colorByPersonId.get(person.id)}
                    />
                    <Typography.Body size={TypographyTextSize.Small} as="span">
                      {person.display_name}
                    </Typography.Body>
                  </div>
                ))}
              </div>

              <div className={styles.reminders}>
                <Typography.Body size={TypographyTextSize.Small} bold>
                  Reminders
                </Typography.Body>
                {(reminders ?? []).map((reminder) => (
                  <div key={reminder.id} className={styles.reminderRow}>
                    <Typography.Body size={TypographyTextSize.Small} as="span">
                      {reminder.minutes_before} minutes before
                      {reminder.user_id ? ' (just you)' : ' (everyone)'}
                    </Typography.Body>
                    <Button
                      variant={ButtonVariant.Text}
                      size={ButtonSize.Small}
                      color={ButtonColor.Error}
                      loading={deleteReminderMutation.isPending}
                      onClick={() =>
                        deleteReminderMutation.mutate({
                          familyId,
                          eventId: occurrence.event.id,
                          reminderId: reminder.id,
                        })
                      }
                    >
                      <Icon name={IconName.Delete} decorative size={14} />
                    </Button>
                  </div>
                ))}
                <div className={styles.reminderRow}>
                  <Input
                    variant={InputVariant.Number}
                    value={reminderMinutes}
                    onChange={(e) => setReminderMinutes(e.target.value)}
                  />
                  <Button
                    variant={ButtonVariant.Glass}
                    size={ButtonSize.Small}
                    loading={createReminderMutation.isPending}
                    onClick={() =>
                      createReminderMutation.mutate({
                        familyId,
                        eventId: occurrence.event.id,
                        minutesBefore: Number(reminderMinutes) || 30,
                      })
                    }
                  >
                    Add reminder
                  </Button>
                </div>
              </div>
            </>
          )}

          {editingOccurrence && (
            <Form
              id="occurrence-edit-form"
              onSubmit={(values) =>
                updateOccurrenceMutation.mutate({
                  familyId,
                  eventId: occurrence.event.id,
                  occurrenceStartAt: occurrence.occurrence_start_at,
                  timezone: zone,
                  data: values,
                })
              }
              schema={occurrenceOverrideInputSchema}
              options={{
                defaultValues: {
                  title: occurrence.title,
                  location: occurrence.location ?? '',
                  category: occurrence.category ?? undefined,
                  startsAtDate: start.toISODate() ?? '',
                  startsAtTime: start.toFormat('HH:mm'),
                  endsAtDate: end.toISODate() ?? '',
                  endsAtTime: end.toFormat('HH:mm'),
                },
              }}
            >
              {({ control }) => (
                <>
                  <FormRow>
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          variant={InputVariant.Text}
                          label="Title"
                          labelVariant={LabelVariant.Float}
                        />
                      )}
                    />
                  </FormRow>
                  <FormRow>
                    <Controller
                      name="location"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          variant={InputVariant.Text}
                          label="Location"
                          labelVariant={LabelVariant.Float}
                        />
                      )}
                    />
                  </FormRow>
                  <FormRow>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={CATEGORY_OPTIONS}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Category"
                          labelVariant={LabelVariant.Float}
                        />
                      )}
                    />
                  </FormRow>
                  <FormRow>
                    <Controller
                      name="startsAtDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          variant={InputVariant.Date}
                          value={field.value}
                          onChange={field.onChange}
                          label="Start date"
                          labelVariant={LabelVariant.Float}
                        />
                      )}
                    />
                    <Controller
                      name="startsAtTime"
                      control={control}
                      render={({ field }) => (
                        <Input
                          variant={InputVariant.Time}
                          value={field.value}
                          onChange={field.onChange}
                          label="Start time"
                          labelVariant={LabelVariant.Float}
                        />
                      )}
                    />
                  </FormRow>
                  <FormRow>
                    <Controller
                      name="endsAtDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          variant={InputVariant.Date}
                          value={field.value}
                          onChange={field.onChange}
                          label="End date"
                          labelVariant={LabelVariant.Float}
                        />
                      )}
                    />
                    <Controller
                      name="endsAtTime"
                      control={control}
                      render={({ field }) => (
                        <Input
                          variant={InputVariant.Time}
                          value={field.value}
                          onChange={field.onChange}
                          label="End time"
                          labelVariant={LabelVariant.Float}
                        />
                      )}
                    />
                  </FormRow>
                </>
              )}
            </Form>
          )}
        </ModalContent>
        <ModalActions align="space-between">
          {!editingOccurrence && (
            <>
              <Button
                variant={ButtonVariant.Glass}
                size={ButtonSize.Small}
                onClick={onClose}
              >
                Close
              </Button>
              {canEdit && (
                <>
                  {isRecurring && (
                    <Button
                      variant={ButtonVariant.Glass}
                      size={ButtonSize.Small}
                      onClick={startEditingOccurrence}
                    >
                      Edit this occurrence
                    </Button>
                  )}
                  <Button
                    variant={ButtonVariant.Glass}
                    size={ButtonSize.Small}
                    onClick={() => {
                      startEditingSeries();
                      onClose();
                    }}
                  >
                    {isRecurring ? 'Edit series' : 'Edit'}
                  </Button>
                  <Button
                    variant={ButtonVariant.Glass}
                    size={ButtonSize.Small}
                    color={ButtonColor.Error}
                    loading={deleteEventMutation.isPending}
                    onClick={handleDeleteWholeEvent}
                  >
                    Delete
                  </Button>
                </>
              )}
            </>
          )}
          {editingOccurrence && (
            <>
              <Button
                variant={ButtonVariant.Glass}
                size={ButtonSize.Small}
                onClick={stopEditingOccurrence}
              >
                Back
              </Button>
              <Button
                form="occurrence-edit-form"
                type="submit"
                size={ButtonSize.Small}
                loading={updateOccurrenceMutation.isPending}
                color={ButtonColor.Secondary}
                variant={ButtonVariant.Glass}
              >
                Save this occurrence
              </Button>
            </>
          )}
        </ModalActions>
      </Modal>

      <EventFormDrawer
        familyId={familyId}
        event={occurrence.event}
        open={editSeriesOpen}
        onOpenChange={(next) =>
          next ? startEditingSeries() : stopEditingSeries()
        }
        onSaved={stopEditingSeries}
      />

      <OccurrenceEditChoiceModal
        open={deleteChoiceOpen}
        onClose={closeDeleteChoice}
        mode="delete"
        onChooseOccurrence={() => {
          closeDeleteChoice();
          deleteOccurrenceMutation.mutate({
            familyId,
            eventId: occurrence.event.id,
            occurrenceStartAt: occurrence.occurrence_start_at,
          });
        }}
        onChooseSeries={() => {
          closeDeleteChoice();
          deleteEventMutation.mutate({
            familyId,
            eventId: occurrence.event.id,
          });
        }}
      />
    </>
  );
};
