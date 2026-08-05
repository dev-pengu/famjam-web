import { AuthLayout } from '@/components/layouts';
import { paths } from '@/config/paths';
import { EmailVerificationForm } from '@/features/auth/components/email-verification-form';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const navigate = useNavigate();

  const handleFormSuccess = () => {
    navigate(paths.auth.login.getHref());
  };

  return (
    <AuthLayout title="Email Verification">
      <EmailVerificationForm onSuccess={handleFormSuccess} />
    </AuthLayout>
  );
};

export default EmailVerification;
