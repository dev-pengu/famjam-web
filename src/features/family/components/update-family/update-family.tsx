import {
  Button,
  ButtonColor,
  ButtonVariant,
  Combobox,
  Icon,
  IconName,
  Input,
  InputState,
  InputVariant,
  LabelVariant,
  useSnackbar,
} from '@famjam/ui';
import {
  updateFamilyInputSchema,
  useUpdateFamily,
} from '../../api/update-family';
import { Form } from '@/components/ui';
import { Controller } from 'react-hook-form';
import styles from './update-family.module.css';
import { useState } from 'react';
import type { Family, FamilyWithMembership } from '@/types/api';
import { useTimezones, toTimezoneComboboxOptions } from '@/hooks/use-timezones';

export const UpdateFamily = ({
  family,
  onSuccess,
}: {
  family: Family | FamilyWithMembership;
  onSuccess?: () => void;
}) => {
  const { addToast } = useSnackbar();
  const updateFamilyMutation = useUpdateFamily({
    mutationConfig: {
      onSuccess: () => {
        onSuccess?.();
        setIsEditing(false);
        addToast({ message: 'Family updated successfully!' });
      },
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const { data: timezones } = useTimezones();
  const timezoneOptions = toTimezoneComboboxOptions(timezones);

  return (
    <>
      {family && (
        <Form
          onSubmit={(values) => {
            updateFamilyMutation.mutate({
              data: values,
              familyId: family.id,
            });
          }}
          schema={updateFamilyInputSchema}
          options={{
            defaultValues: {
              name: family.name,
              invitationTtlHours: family.invitation_ttl_hours ?? 0,
              timezone: family.default_timezone ?? undefined,
            },
          }}
        >
          {({ control }) => (
            <>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    readOnly={!isEditing}
                    variant={InputVariant.Text}
                    label="Family Name"
                    labelVariant={LabelVariant.Float}
                    state={error ? InputState.Error : InputState.Default}
                    helperMessage={error?.message}
                    className={styles.input}
                  />
                )}
              />
              <Controller
                name="invitationTtlHours"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    readOnly={!isEditing}
                    variant={InputVariant.Number}
                    label="Invitation Expiry (in Hrs)"
                    labelVariant={LabelVariant.Float}
                    state={error ? InputState.Error : InputState.Default}
                    helperMessage={error?.message}
                    className={styles.input}
                  />
                )}
              />
              <Controller
                name="timezone"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Combobox
                    options={timezoneOptions}
                    {...field}
                    readOnly={!isEditing}
                    label="Default Timezone"
                    labelVariant={LabelVariant.Float}
                    state={error ? InputState.Error : InputState.Default}
                    helperMessage={
                      error?.message ??
                      'Used for family members who have not set their own timezone.'
                    }
                    className={styles.input}
                  />
                )}
              />
              <div className={styles.buttonContainer}>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant={ButtonVariant.Glass}
                    color={ButtonColor.Secondary}
                    aria-label="Edit Family Info"
                  >
                    <Icon name={IconName.Edit} size={18} />
                  </Button>
                )}
                {isEditing && (
                  <>
                    <Button
                      onClick={() => setIsEditing(false)}
                      loading={updateFamilyMutation.isPending}
                      variant={ButtonVariant.Glass}
                      color={ButtonColor.Error}
                      className={styles.cancelEditButton}
                      aria-label="Cancel"
                    >
                      <Icon name={IconName.Block} size={18} />
                    </Button>
                    <Button
                      loading={updateFamilyMutation.isPending}
                      type="submit"
                      variant={ButtonVariant.Glass}
                      color={ButtonColor.Secondary}
                      aria-label="Save"
                    >
                      <Icon name={IconName.Publish} size={18} />
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </Form>
      )}
    </>
  );
};
