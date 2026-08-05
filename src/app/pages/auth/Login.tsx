import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { AuthLayout } from '@/components/layouts';
import {
  Typography,
  Divider,
  Modal,
  ModalTitle,
  ModalContent,
  Button,
  ButtonVariant,
  Input,
  InputVariant,
  LabelVariant,
  InputState,
  InputAdornment,
  IconName,
  Icon,
  InputSize,
  ButtonSize,
} from '@famjam/ui';
import { LoginForm } from '@/features/auth/components/login-form';
import styles from './Login.module.css';
import {
  accountLinkInputSchema,
  useLinkAccount,
  useLoginWithOauth,
} from '@/features/auth/auth';
import { OAuthLinkError } from '@/lib/api-client';
import { useDisclosure } from '@/hooks/use-diclosure';
import { Form } from '@/components/ui';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

const Login = () => {
  const linkAccount = useLinkAccount();
  const {
    isOpen: isPasswordModalOpen,
    open: openPasswordModal,
    close: closePasswordModal,
  } = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);
  const [oauthError, setOauthError] = useState<OAuthLinkError | null>(null);
  const loginWithOauth = useLoginWithOauth({
    mutationConfig: {
      retry: false,
      onError: (error) => {
        if (error instanceof OAuthLinkError) {
          setOauthError(error);
          openPasswordModal();
        }
      },
    },
  });

  const handleOauthLogin = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    loginWithOauth.mutate({
      data: { idToken: credentialResponse.credential },
      provider: 'google',
    });
  };

  return (
    <>
      <Modal open={isPasswordModalOpen} onClose={closePasswordModal}>
        <ModalTitle>Matching Account Found</ModalTitle>
        <ModalContent>
          <Typography.Body>
            An account with the same email was found in our system. Please enter
            the password of the account in our system to allow the link.
          </Typography.Body>
          {oauthError && (
            <Form
              onSubmit={(values) => linkAccount.mutate({ data: values })}
              schema={accountLinkInputSchema}
              options={{
                defaultValues: {
                  userId: oauthError.user_id,
                  providerUid: oauthError.provider_uid,
                  password: '',
                },
              }}
              className={styles.linkForm}
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
                          showPassword
                            ? InputVariant.Text
                            : InputVariant.Password
                        }
                        label="Password"
                        labelVariant={LabelVariant.Float}
                        state={error ? InputState.Error : InputState.Default}
                        helperMessage={error?.message}
                        className={styles.input}
                        inputSize={InputSize.Small}
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

                  <Button
                    loading={linkAccount.isPending}
                    type="submit"
                    variant={ButtonVariant.Glass}
                    size={ButtonSize.Small}
                  >
                    Submit
                  </Button>
                </>
              )}
            </Form>
          )}
        </ModalContent>
      </Modal>
      <AuthLayout title="Log in">
        <Typography.Body className={styles.subtitle}>
          Welcome back!
        </Typography.Body>
        <div className={styles.oauthWrapper}>
          <GoogleLogin onSuccess={handleOauthLogin} theme="filled_black" />
        </div>
        <Divider className={styles.divider}>
          <Typography.Body>OR</Typography.Body>
        </Divider>
        <LoginForm />
      </AuthLayout>
    </>
  );
};

export default Login;
