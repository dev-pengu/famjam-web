import { Link as RouterLink, useSearchParams } from 'react-router-dom';

import {
  Input,
  InputAdornment,
  Link,
  Button,
  InputVariant,
  Icon,
  IconName,
  LabelVariant,
  InputState,
  ButtonVariant,
} from '@famjam/ui';
import { Form } from '@/components/ui';
import { paths } from '@/config/paths';
import styles from './auth-form.module.css';
import { Controller } from 'react-hook-form';
import { passwordResetInputSchema, usePasswordReset } from '../auth';
import { useState } from 'react';

type ResetPasswordFormProps = {
  onSuccess?: () => void;
};

export const ResetPasswordForm = ({ onSuccess }: ResetPasswordFormProps) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [showPassword, setShowPassword] = useState(false);
  const resetPassword = usePasswordReset({
    mutationConfig: {
      onSuccess: () => {
        onSuccess?.();
      },
    },
  });

  return (
    <div>
      <Form
        onSubmit={(values) => resetPassword.mutate({ data: values })}
        schema={passwordResetInputSchema}
        options={{ defaultValues: { password: '', token } }}
        className={styles.form}
      >
        {({ control }) => (
          <>
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  variant={
                    showPassword ? InputVariant.Text : InputVariant.Password
                  }
                  label="New Password"
                  labelVariant={LabelVariant.Float}
                  state={error ? InputState.Error : InputState.Default}
                  helperMessage={error?.message}
                  className={styles.input}
                >
                  <InputAdornment position="start" disablePointerEvents>
                    <Icon name={IconName.Lock} size={18} decorative />
                  </InputAdornment>
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
              <Button
                loading={resetPassword.isPending}
                type="submit"
                variant={ButtonVariant.Glass}
              >
                Submit
              </Button>
            </div>
          </>
        )}
      </Form>
      <div className={styles.formFooter}>
        <Link as={RouterLink} to={paths.auth.login.getHref()}>
          Back to Log in
        </Link>
      </div>
    </div>
  );
};
