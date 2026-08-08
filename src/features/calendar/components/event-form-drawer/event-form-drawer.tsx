import { Controller } from 'react-hook-form';
import { DateTime } from 'luxon';
import {
  Button,
  ButtonColor,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
  Checkbox,
  Combobox,
  Input,
  InputState,
  InputVariant,
  LabelVariant,
  Select,
  Switch,
  Typography,
  TypographyTextSize,
  useSnackbar,
} from '@famjam/ui';

import { Form, FormDrawer, FormRow } from '@/components/ui';
import styles from './event-form-drawer.module.css';
import { useTimezones, toTimezoneComboboxOptions } from '@/hooks/use-timezones';
import { useMemberships } from '@/features/family/api/membership/get-memberships';
import { useFamily } from '@/features/family/context/family-context';
import {
  eventInputSchema,
  RecurrenceFrequency,
  type EventInput,
} from '../../api/create-event';
import { useCreateEvent } from '../../api/create-event';
import { useUpdateEvent } from '../../api/update-event';
import { CATEGORY_OPTIONS } from '../../constants/event-category';
import type { EventFormDrawerProps } from './event-form-drawer.types';

const RECURRENCE_OPTIONS = [
  { label: 'Does not repeat', value: 'none' },
  { label: 'Daily', value: RecurrenceFrequency.daily },
  { label: 'Weekly', value: RecurrenceFrequency.weekly },
  { label: 'Monthly', value: RecurrenceFrequency.monthly },
  { label: 'Yearly', value: RecurrenceFrequency.yearly },
];

// RRULE two-letter weekday codes, matching what the backend's
// RecurrenceExpander expects in recurrence_byday. Order is Sun-Sat to match
// common calendar UI convention.
const WEEKDAY_OPTIONS = [
  { code: 'SU', label: 'S' },
  { code: 'MO', label: 'M' },
  { code: 'TU', label: 'T' },
  { code: 'WE', label: 'W' },
  { code: 'TH', label: 'T' },
  { code: 'FR', label: 'F' },
  { code: 'SA', label: 'S' },
];

const defaultsFromEvent = (
  event: EventFormDrawerProps['event'],
  familyTimezone: string,
): EventInput => {
  if (!event) {
    const now = DateTime.now().plus({ hours: 1 }).set({ minute: 0 });
    return {
      title: '',
      description: '',
      location: '',
      category: undefined,
      timezone: familyTimezone,
      allDay: false,
      startsAtDate: now.toISODate() ?? '',
      startsAtTime: now.toFormat('HH:mm'),
      endsAtDate: now.toISODate() ?? '',
      endsAtTime: now.plus({ hours: 1 }).toFormat('HH:mm'),
      recurrenceFrequency: undefined,
      recurrenceInterval: 1,
      recurrenceByday: [],
      recurrenceUntil: '',
      participantPersonIds: [],
      includeAllFamilyMembers: false,
    };
  }

  const starts = DateTime.fromISO(event.starts_at, { zone: event.timezone });
  const ends = DateTime.fromISO(event.ends_at, { zone: event.timezone });

  return {
    title: event.title,
    description: event.description ?? '',
    location: event.location ?? '',
    category: event.category ?? undefined,
    timezone: event.timezone,
    allDay: event.all_day,
    startsAtDate: starts.toISODate() ?? '',
    startsAtTime: starts.toFormat('HH:mm'),
    endsAtDate: ends.toISODate() ?? '',
    endsAtTime: ends.toFormat('HH:mm'),
    recurrenceFrequency: event.recurrence_frequency ?? undefined,
    recurrenceInterval: event.recurrence_interval ?? 1,
    recurrenceByday: event.recurrence_byday ?? [],
    recurrenceUntil: event.recurrence_until ?? '',
    participantPersonIds: event.participants.map((p) => p.id),
    includeAllFamilyMembers: false,
  };
};

export const EventFormDrawer = ({
  familyId,
  event,
  triggerButton,
  open,
  onOpenChange,
  onSaved,
}: Readonly<EventFormDrawerProps>) => {
  const { addToast } = useSnackbar();
  const { activeFamily } = useFamily();
  const { data: timezones } = useTimezones();
  const { data: memberships } = useMemberships({ familyId });

  const createEventMutation = useCreateEvent({
    familyId,
    mutationConfig: {
      onSuccess: (result) => {
        addToast({
          message:
            result.overlaps.length > 0
              ? 'Event created - it overlaps with another event'
              : 'Event created',
        });
        onSaved?.();
      },
    },
  });
  const updateEventMutation = useUpdateEvent({
    familyId,
    mutationConfig: {
      onSuccess: (result) => {
        addToast({
          message:
            result.overlaps.length > 0
              ? 'Event updated - it overlaps with another event'
              : 'Event updated',
        });
        onSaved?.();
      },
    },
  });

  const isEditing = !!event;
  const isPending =
    createEventMutation.isPending || updateEventMutation.isPending;
  const familyTimezone = activeFamily?.resolved_timezone ?? 'UTC';
  const timezoneOptions = toTimezoneComboboxOptions(timezones);

  return (
    <FormDrawer
      isDone={createEventMutation.isSuccess || updateEventMutation.isSuccess}
      position="right"
      triggerButton={triggerButton}
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Event' : 'New Event'}
      submitButton={
        <Button
          form="event-form"
          type="submit"
          size={ButtonSize.Small}
          loading={isPending}
          color={ButtonColor.Secondary}
          variant={ButtonVariant.Glass}
        >
          Save
        </Button>
      }
    >
      <Form
        id="event-form"
        onSubmit={(values) => {
          if (isEditing) {
            updateEventMutation.mutate({
              familyId,
              eventId: event.id,
              data: values,
            });
          } else {
            createEventMutation.mutate({ familyId, data: values });
          }
        }}
        schema={eventInputSchema}
        options={{ defaultValues: defaultsFromEvent(event, familyTimezone) }}
      >
        {({ control, watch }) => {
          const recurrenceFrequency = watch('recurrenceFrequency');
          const allDay = watch('allDay');

          return (
            <>
              <FormRow>
                <Controller
                  name="title"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      variant={InputVariant.Text}
                      label="Title"
                      labelVariant={LabelVariant.Float}
                      state={error ? InputState.Error : InputState.Default}
                      helperMessage={error?.message}
                      required
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
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant={InputVariant.TextArea}
                      label="Description"
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
                      placeholder="Uncategorized"
                    />
                  )}
                />
              </FormRow>
              <FormRow>
                <Controller
                  name="timezone"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Combobox
                      options={timezoneOptions}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Timezone"
                      labelVariant={LabelVariant.Float}
                      state={error ? InputState.Error : InputState.Default}
                      helperMessage={error?.message}
                      required
                    />
                  )}
                />
              </FormRow>
              <FormRow>
                <Controller
                  name="allDay"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      label="All day"
                      checked={!!field.value}
                      onChange={(value) => field.onChange(!!value)}
                    />
                  )}
                />
              </FormRow>
              <FormRow>
                <Controller
                  name="startsAtDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      variant={InputVariant.Date}
                      value={field.value}
                      onChange={field.onChange}
                      label="Start date"
                      labelVariant={LabelVariant.Float}
                      state={error ? InputState.Error : InputState.Default}
                      helperMessage={error?.message}
                      required
                    />
                  )}
                />
                {!allDay && (
                  <Controller
                    name="startsAtTime"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        variant={InputVariant.Time}
                        value={field.value}
                        onChange={field.onChange}
                        label="Start time"
                        labelVariant={LabelVariant.Float}
                        state={error ? InputState.Error : InputState.Default}
                        helperMessage={error?.message}
                        required
                      />
                    )}
                  />
                )}
              </FormRow>
              <FormRow>
                <Controller
                  name="endsAtDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      variant={InputVariant.Date}
                      value={field.value}
                      onChange={field.onChange}
                      label="End date"
                      labelVariant={LabelVariant.Float}
                      state={error ? InputState.Error : InputState.Default}
                      helperMessage={error?.message}
                      required
                    />
                  )}
                />
                {!allDay && (
                  <Controller
                    name="endsAtTime"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        variant={InputVariant.Time}
                        value={field.value}
                        onChange={field.onChange}
                        label="End time"
                        labelVariant={LabelVariant.Float}
                        state={error ? InputState.Error : InputState.Default}
                        helperMessage={error?.message}
                        required
                      />
                    )}
                  />
                )}
              </FormRow>
              <FormRow>
                <Controller
                  name="recurrenceFrequency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={RECURRENCE_OPTIONS}
                      value={field.value ?? 'none'}
                      onChange={(value) =>
                        field.onChange(value === 'none' ? undefined : value)
                      }
                      label="Repeats"
                      labelVariant={LabelVariant.Float}
                    />
                  )}
                />
              </FormRow>
              {recurrenceFrequency === RecurrenceFrequency.weekly && (
                <FormRow>
                  <div>
                    <Typography.Body size={TypographyTextSize.Small} bold>
                      Repeat on
                    </Typography.Body>
                    <Controller
                      name="recurrenceByday"
                      control={control}
                      render={({ field }) => (
                        <div className={styles.weekdayRow}>
                          {WEEKDAY_OPTIONS.map((day) => {
                            const selected = field.value?.includes(day.code) ?? false;
                            return (
                              <Button
                                key={day.code}
                                type="button"
                                size={ButtonSize.Small}
                                shape={ButtonShape.Rounded}
                                variant={selected ? ButtonVariant.Filled : ButtonVariant.Glass}
                                color={selected ? ButtonColor.Secondary : undefined}
                                aria-pressed={selected}
                                aria-label={day.code}
                                onClick={() => {
                                  const current = field.value ?? [];
                                  field.onChange(
                                    selected ? current.filter((code) => code !== day.code) : [...current, day.code],
                                  );
                                }}
                              >
                                {day.label}
                              </Button>
                            );
                          })}
                        </div>
                      )}
                    />
                    <Typography.Body size={TypographyTextSize.Small} muted>
                      Leave unset to repeat on the same weekday as the start date.
                    </Typography.Body>
                  </div>
                </FormRow>
              )}
              {recurrenceFrequency && (
                <>
                  <FormRow>
                    <Controller
                      name="recurrenceInterval"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value ?? 1}
                          variant={InputVariant.Number}
                          label="Repeat every (interval)"
                          labelVariant={LabelVariant.Float}
                        />
                      )}
                    />
                  </FormRow>
                  <FormRow>
                    <Controller
                      name="recurrenceUntil"
                      control={control}
                      render={({ field }) => (
                        <Input
                          variant={InputVariant.Date}
                          value={field.value}
                          onChange={field.onChange}
                          label="Ends on (optional)"
                          labelVariant={LabelVariant.Float}
                        />
                      )}
                    />
                  </FormRow>
                </>
              )}
              <FormRow>
                <Controller
                  name="includeAllFamilyMembers"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      label="Whole family event"
                      checked={!!field.value}
                      onChange={(value) => field.onChange(!!value)}
                    />
                  )}
                />
              </FormRow>
              {!watch('includeAllFamilyMembers') && (
                <FormRow>
                  <div>
                    <Typography.Body size={TypographyTextSize.Small} bold>
                      Participants
                    </Typography.Body>
                    <Controller
                      name="participantPersonIds"
                      control={control}
                      render={({ field }) => (
                        <div className={styles.participantList}>
                          {(memberships ?? []).map((membership) => {
                            const selected =
                              field.value?.includes(membership.person.id) ??
                              false;
                            return (
                              <Checkbox
                                key={membership.id}
                                label={membership.person.display_name}
                                checked={selected}
                                onCheckedChange={() => {
                                  const current = field.value ?? [];
                                  field.onChange(
                                    selected
                                      ? current.filter(
                                          (id) => id !== membership.person.id,
                                        )
                                      : [...current, membership.person.id],
                                  );
                                }}
                              />
                            );
                          })}
                        </div>
                      )}
                    />
                  </div>
                </FormRow>
              )}
            </>
          );
        }}
      </Form>
    </FormDrawer>
  );
};
