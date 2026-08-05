import { AuthLayout } from '@/components/layouts';
import { Typography, useSnackbar } from '@famjam/ui';
import styles from './PasswordReset.module.css';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

const PasswordReset = () => {
  const navigate = useNavigate();
  const { addToast } = useSnackbar();

  const handleSuccess = () => {
    addToast({ message: 'Password reset successfully. Please login.' });
    navigate('/auth/login');
  };

  return (
    <AuthLayout title="Reset Password">
      <Typography.Title bold className={styles.centerText}>
        Lets get you back in!
      </Typography.Title>
      <Typography.Body className={styles.centerText}>
        Enter a new password.
      </Typography.Body>
      <ResetPasswordForm onSuccess={handleSuccess} />
    </AuthLayout>
  );
};

export default PasswordReset;
