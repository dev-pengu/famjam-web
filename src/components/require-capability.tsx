import { canAccess } from '@/lib/authorization';
import { paths } from '@/config/paths';
import { useFamily } from '@/features/family/context/family-context';
import { Navigate, Outlet } from 'react-router-dom';
import type { MembershipAction } from '@/types/api';


interface RequireCapabilityProps {
  action: MembershipAction;
  redirectTo?: string;
};

/**
 *  <Route element={<RequireCapability action="editFamilySettings" />}>
 *   <Route path="/families/:id/settings" element={<FamilySettingsPage />} />
 * </Route>
 *
 * Like <Can>, this only gates the ROUTE (avoids rendering a page whose
 * every action would 403) - it is not itself a security boundary. Nest this
 * inside <ProtectedRoute /> so isAuthenticated is already guaranteed by the
 * time this runs.
 */
export const RequireCapability = ({
  action,
  redirectTo = paths.app.dashboard.getHref(),
}: RequireCapabilityProps) => {
  const { activeMembership, isLoading } = useFamily();

  if (isLoading) return null;

  if (!canAccess(action, activeMembership?.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};
