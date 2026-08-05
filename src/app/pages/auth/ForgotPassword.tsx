import { AuthLayout } from '@/components/layouts';
import { Typography } from '@famjam/ui';
import styles from './ForgotPassword.module.css';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';
import { useSearchParams } from 'react-router-dom';

const ForgotPassword = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isSuccess = Boolean(searchParams.get('success'));

  const handleSuccess = () => {
    const next = new URLSearchParams(searchParams);
    next.set('success', 'true');
    setSearchParams(next, { replace: true });
  };

  return (
    <AuthLayout title="Forgot Password">
      <Typography.Title bold className={styles.centerText}>
        Lets get you back in!
      </Typography.Title>
      <Typography.Body className={styles.centerText}>
        Enter your email and we'll send you instructions to reset your password.
      </Typography.Body>
      {!isSuccess && <ForgotPasswordForm onSuccess={handleSuccess} />}
      {isSuccess && (
        <Typography.Body>
          If that email is registered, a reset link has been sent.
        </Typography.Body>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
