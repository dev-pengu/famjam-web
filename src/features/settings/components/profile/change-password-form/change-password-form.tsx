import { Form } from '@/components/ui';
import { useState } from 'react';
import {
  Button,
  ButtonColor,
  ButtonVariant,
  Icon,
  IconName,
  Input,
  InputAdornment,
  InputState,
  InputVariant,
  LabelVariant,
  useSnackbar,
} from '@famjam/ui';
import { Controller } from 'react-hook-form';
import styles from './change-password-form.module.css';
import {
  updatePasswordInputSchema,
  useUpdatePassword,
} from '../../../api/update-password';
import type { ChangePasswordFormProps } from './change-password-form.types';

export const ChangePasswordForm = ({
  onSuccess,
  onCancel,
}: ChangePasswordFormProps) => {
  const { addToast } = useSnackbar();
  const changePasswordMutation = useUpdatePassword({
    mutationConfig: {
      onSuccess: () => {
        addToast({ message: 'Password changed successfully!' });
        onSuccess?.();
      },
    },
  });
  const [showExisting, setShowExisting] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <Form
      onSubmit={(values) => {
        changePasswordMutation.mutate({ data: values });
      }}
      schema={updatePasswordInputSchema}
      options={{
        defaultValues: {
          existingPassword: '',
          newPassword: '',
        },
      }}
      className={styles.form}
    >
      {({ control }) => (
        <>
          <Controller
            name="existingPassword"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                variant={
                  showExisting ? InputVariant.Text : InputVariant.Password
                }
                label="Existing"
                labelVariant={LabelVariant.Float}
                state={error ? InputState.Error : InputState.Default}
                helperMessage={error?.message}
                className={styles.input}
              >
                <InputAdornment position="end">
                  <Button
                    onClick={() => setShowExisting((prev) => !prev)}
                    variant={ButtonVariant.Text}
                  >
                    <Icon
                      name={
                        showExisting
                          ? IconName.VisibilityOff
                          : IconName.Visibility
                      }
                      size={18}
                    />
                  </Button>
                </InputAdornment>
              </Input>
            )}
          />
          <Controller
            name="newPassword"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                variant={showNew ? InputVariant.Text : InputVariant.Password}
                label="New"
                labelVariant={LabelVariant.Float}
                state={error ? InputState.Error : InputState.Default}
                helperMessage={error?.message}
                className={styles.input}
              >
                <InputAdornment position="end">
                  <Button
                    onClick={() => setShowNew((prev) => !prev)}
                    variant={ButtonVariant.Text}
                  >
                    <Icon
                      name={
                        showNew ? IconName.VisibilityOff : IconName.Visibility
                      }
                      size={18}
                    />
                  </Button>
                </InputAdornment>
              </Input>
            )}
          />
          <div className={styles.buttonContainer}>
            <Button
              onClick={handleCancel}
              loading={changePasswordMutation.isPending}
              variant={ButtonVariant.Glass}
              color={ButtonColor.Error}
            >
              Cancel
            </Button>
            <Button
              loading={changePasswordMutation.isPending}
              type="submit"
              color={ButtonColor.Secondary}
              variant={ButtonVariant.Glass}
            >
              Submit
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};
