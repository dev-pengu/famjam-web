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
  Typography,
  ButtonShape,
} from '@famjam/ui';
import { Form } from '@/components/ui';
import { paths } from '@/config/paths';
import { useState } from 'react';
import styles from './auth-form.module.css';
import { Controller } from 'react-hook-form';
import { loginInputSchema, useLogin } from '../auth';

type LoginFormProps = {
  onSuccess?: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const login = useLogin({
    mutationConfig: {
      onSuccess: () => {
        onSuccess?.();
      },
    },
  });

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div>
      <Form
        onSubmit={(values) => login.mutate({ data: values })}
        schema={loginInputSchema}
        options={{ defaultValues: { email: '', password: '' } }}
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
                >
                  <InputAdornment position="start" disablePointerEvents>
                    <Icon name={IconName.Mail} size={18} decorative />
                  </InputAdornment>
                </Input>
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
                  <InputAdornment position="start" disablePointerEvents>
                    <Icon name={IconName.Lock} size={18} decorative />
                  </InputAdornment>
                  <InputAdornment position="end">
                    <Button
                      onClick={handlePasswordToggle}
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
            <div className={styles.forgotLink}>
              <Link
                as={RouterLink}
                to={paths.auth.forgotPassword.getHref(redirectTo)}
              >
                Forgot your password?
              </Link>
            </div>
            <div className={styles.buttonContainer}>
              <Button
                loading={login.isPending}
                type="submit"
                shape={ButtonShape.Square}
              >
                Log in
              </Button>
            </div>
          </>
        )}
      </Form>
      <div className={styles.formFooter}>
        <Typography.Body as="span">Don't have an account?</Typography.Body>{' '}
        <Link as={RouterLink} to={paths.auth.register.getHref(redirectTo)}>
          Register
        </Link>
      </div>
    </div>
  );
};
