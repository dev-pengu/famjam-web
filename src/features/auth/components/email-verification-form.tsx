import { Link as RouterLink, useSearchParams } from 'react-router-dom';

import {
  Input,
  Link,
  Button,
  InputVariant,
  LabelVariant,
  InputState,
  ButtonShape,
} from '@famjam/ui';
import { Form } from '@/components/ui';
import { paths } from '@/config/paths';
import styles from './auth-form.module.css';
import { Controller } from 'react-hook-form';
import { emailVerificationInputSchema, useVerifyEmail } from '../auth';

type EmailVerificationFormProps = {
  onSuccess?: () => void;
};

export const EmailVerificationForm = ({
  onSuccess,
}: EmailVerificationFormProps) => {
  const verifyEmail = useVerifyEmail({
    mutationConfig: {
      onSuccess: () => {
        onSuccess?.();
      },
    },
  });
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div>
      <Form
        onSubmit={(values) => verifyEmail.mutate({ data: values })}
        schema={emailVerificationInputSchema}
        options={{ defaultValues: { token: token ?? '' } }}
        className={styles.form}
      >
        {({ control }) => (
          <>
            <Controller
              name="token"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  variant={InputVariant.TextArea}
                  label="Verification Token"
                  labelVariant={LabelVariant.Float}
                  state={error ? InputState.Error : InputState.Default}
                  helperMessage={error?.message}
                  className={styles.input}
                />
              )}
            />
            <div className={styles.buttonContainer}>
              <Button
                loading={verifyEmail.isPending}
                type="submit"
                shape={ButtonShape.Square}
              >
                Submit
              </Button>
            </div>
          </>
        )}
      </Form>
      <div className={styles.formFooter}>
        <Link as={RouterLink} to={paths.home.getHref()}>
          Back to Home
        </Link>
      </div>
    </div>
  );
};
