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
import { forgotPasswordInputSchema, usePasswordResetRequest } from '../auth';

type ForgotPasswordFormProps = {
  onSuccess?: () => void;
};

export const ForgotPasswordForm = ({ onSuccess }: ForgotPasswordFormProps) => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const forgotPassword = usePasswordResetRequest({
    mutationConfig: {
      onSuccess: () => {
        onSuccess?.();
      },
    },
  });

  return (
    <div>
      <Form
        onSubmit={(values) => forgotPassword.mutate({ data: values })}
        schema={forgotPasswordInputSchema}
        options={{ defaultValues: { email: '' } }}
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
            <div className={styles.buttonContainer}>
              <Button
                loading={forgotPassword.isPending}
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
        <Link as={RouterLink} to={paths.auth.login.getHref(redirectTo)}>
          Back to Log in
        </Link>
      </div>
    </div>
  );
};
