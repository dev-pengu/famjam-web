import { useCanAccessManaged } from '@/lib/authorization';
import type { Person } from '@/types/api';

interface CanManagedProps {
  targetPerson: Person;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * <CanManaged targetPerson={member.person}>
 *   <RemoveMemberButton member={member} />
 * </CanManaged>
 *
 * This is a UX convenience for checking access for managed person actions
 * (hide a button the request would 403 on anyway),not the security
 * boundary - the backend Pundit policy is still what actually protects
 * the endpoint.
 */
export const CanManaged = ({
  targetPerson,
  children,
  fallback,
}: CanManagedProps) => {
  const canAccess = useCanAccessManaged();
  return <>{canAccess(targetPerson) ? children : fallback}</>;
};
