import { Navigate, useLocation } from 'react-router-dom';
import { paths } from '@/config/paths';
import { useUser } from '@/features/auth/auth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const location = useLocation();

  // Render nothing (swap for a spinner/skeleton) rather than redirecting
  // while the silent-refresh-on-load attempt is still in flight
  if (user.isPending) return null;

  if (!user.data) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return children;
};
