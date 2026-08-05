import { useCanAccess } from '@/lib/authorization';
import type { MembershipAction, Role } from '@/types/api';
import type { ReactNode } from 'react';

interface CanProps {
  action: MembershipAction;
  targetRole?: Role;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * <Can action="removeMember" targetRole={member.role}>
 *   <RemoveMemberButton member={member} />
 * </Can>
 *
 * This is a UX convenience (hide a button the request would 403 on anyway),
 * not the security boundary - the backend Pundit policy is still what
 * actually protects the endpoint.
 */
export const Can = ({
  action,
  targetRole,
  children,
  fallback = null,
}: CanProps) => {
  const canAccess = useCanAccess();
  return <>{canAccess(action, targetRole) ? children : fallback}</>;
};
