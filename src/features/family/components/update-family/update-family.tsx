import {
  Button,
  ButtonColor,
  ButtonVariant,
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

export const UpdateFamily = ({ family }: { family: Family | FamilyWithMembership }) => {
  const { addToast } = useSnackbar();
  const updateFamilyMutation = useUpdateFamily({
    mutationConfig: {
      onSuccess: () => {
        addToast({ message: 'Family updated successfully!' });
      },
    },
  });
  const [isEditing, setIsEditing] = useState(false);

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
              <div className={styles.buttonContainer}>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant={ButtonVariant.Glass}
                    color={ButtonColor.Secondary}
                  >
                    Edit
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
                    >
                      Cancel
                    </Button>
                    <Button
                      loading={updateFamilyMutation.isPending}
                      type="submit"
                      variant={ButtonVariant.Glass}
                      color={ButtonColor.Secondary}
                    >
                      Save Changes
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
