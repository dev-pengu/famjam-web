import { Form } from '@/components/ui';
import {
  claimManagedAccountInputSchema,
  useClaimManagedAccount,
} from '../../api/dependent/claim-managed-account';
import type { ClaimManagedFormProps } from './claim-managed-form.types';
import styles from './claim-managed-form.module.css';
import { Controller } from 'react-hook-form';
import {
  Button,
  ButtonColor,
  ButtonSize,
  ButtonVariant,
  Icon,
  IconName,
  Input,
  InputAdornment,
  InputState,
  InputVariant,
  LabelVariant,
} from '@famjam/ui';
import { useState } from 'react';

export const ClaimManagedForm = ({
  familyId,
  dependentId,
  onSuccess,
  onCancel,
}: ClaimManagedFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const claimManagedAccount = useClaimManagedAccount({
    familyId,
    mutationConfig: {
      onSuccess: () => {
        onSuccess?.();
      },
    },
  });

  return (
    <Form
      onSubmit={(values) => claimManagedAccount.mutate({ data: values })}
      schema={claimManagedAccountInputSchema}
      options={{
        defaultValues: { email: '', password: '', familyId, dependentId },
      }}
      className={styles.form}
    >
      {({ control }) => (
        <>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                variant={InputVariant.Email}
                label="Email Address"
                labelVariant={LabelVariant.Float}
                state={error ? InputState.Error : InputState.Default}
                helperMessage={error?.message}
                className={styles.input}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                variant={
                  showPassword ? InputVariant.Text : InputVariant.Password
                }
                label="Password"
                labelVariant={LabelVariant.Float}
                state={error ? InputState.Error : InputState.Default}
                helperMessage={error?.message}
                className={styles.input}
              >
                <InputAdornment position="end">
                  <Button
                    onClick={() => setShowPassword((prev) => !prev)}
                    variant={ButtonVariant.Text}
                  >
                    <Icon
                      name={
                        showPassword
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
          <div className={styles.buttonContainer}>
            {onCancel && (
              <Button
                variant={ButtonVariant.Glass}
                size={ButtonSize.Small}
                color={ButtonColor.Error}
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              variant={ButtonVariant.Glass}
              size={ButtonSize.Small}
              loading={claimManagedAccount.isPending}
              type="submit"
            >
              Submit
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};
