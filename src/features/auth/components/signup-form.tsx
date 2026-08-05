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
import { registerInputSchema, useRegisterWithPassword } from '../auth';

type SignupFormProps = {
  onSuccess?: () => void;
};

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const register = useRegisterWithPassword({
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
      <Typography.Body bold className={styles.formHeader}>
        Sign up with email
      </Typography.Body>
      <Form
        onSubmit={(values) => register.mutate({ data: values })}
        schema={registerInputSchema}
        options={{
          defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            nickname: undefined,
          },
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
                  required
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
                  required
                >
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
                  className={styles.input}
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
                  className={styles.input}
                  required
                />
              )}
            />

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
                  className={styles.input}
                />
              )}
            />

            <div className={styles.buttonContainer}>
              <Button
                loading={register.isPending}
                type="submit"
                shape={ButtonShape.Square}
              >
                Verify email &gt;
              </Button>
            </div>
          </>
        )}
      </Form>
      <div className={styles.formFooter}>
        <Typography.Body as="span">Already have an account?</Typography.Body>{' '}
        <Link as={RouterLink} to={paths.auth.login.getHref(redirectTo)}>
          Sign in
        </Link>
      </div>
    </div>
  );
};
