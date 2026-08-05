import { useUser } from '../auth';

export const RequiresVerification = ({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const user = useUser();

  if (user?.data?.email_verified) {
    return children;
  }

  return fallback;
};
