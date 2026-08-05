import { Form, FormRow } from '@/components/ui';
import type { UpdateProfileProps } from './update-profile.types';
import {
  updateProfileInputSchema,
  useUpdateProfile,
} from '@/features/settings/api/update-profile';
import { Controller } from 'react-hook-form';
import {
  Button,
  ButtonColor,
  ButtonVariant,
  Input,
  InputState,
  InputVariant,
  LabelVariant,
} from '@famjam/ui';
import styles from './update-profile.module.css';

export const UpdateProfile = ({
  onSuccess,
  onCancel,
  person,
}: UpdateProfileProps) => {
  const updateProfileMutation = useUpdateProfile({
    mutationConfig: {
      onSuccess: () => {
        onSuccess?.();
      },
    },
  });

  return (
    <Form
      onSubmit={(values) => {
        updateProfileMutation.mutate({
          data: values,
          personId: person.id ?? '',
        });
      }}
      schema={updateProfileInputSchema}
      options={{
        defaultValues: {
          firstName: person.first_name ?? '',
          lastName: person.last_name ?? '',
          nickname: person.nickname ?? '',
        },
      }}
      className={styles.profileInfoForm}
    >
      {({ control }) => (
        <>
          <FormRow>
            <Controller
              name="firstName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  variant={InputVariant.Text}
                  label="First Name"
                  labelVariant={LabelVariant.Float}
                  state={error ? InputState.Error : InputState.Default}
                  helperMessage={error?.message}
                  required
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  variant={InputVariant.Text}
                  label="Last Name"
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
              name="nickname"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  variant={InputVariant.Text}
                  label="Nickname"
                  labelVariant={LabelVariant.Float}
                  state={error ? InputState.Error : InputState.Default}
                  helperMessage={error?.message}
                />
              )}
            />
          </FormRow>

          <div className={styles.buttonContainer}>
            <Button
              onClick={() => onCancel?.()}
              loading={updateProfileMutation.isPending}
              variant={ButtonVariant.Glass}
              color={ButtonColor.Error}
            >
              Cancel
            </Button>
            <Button
              loading={updateProfileMutation.isPending}
              type="submit"
              variant={ButtonVariant.Glass}
              color={ButtonColor.Secondary}
            >
              Save Changes
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};
