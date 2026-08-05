import type { Membership, MembershipAction, Person, Role } from '@/types/api';
import { useFamily } from '@/features/family/context/family-context';

// Mirrors app/policies/*.rb on backend. This is to gate UI only, not as the actual authorization boundary.
// Drift between the two should be treated as UX bug, not a security bug.
// TODO: look at exposing this matrix of policy rules from a shared endpoint or package
export const policies: Record<
  MembershipAction,
  (actingRole: Role, targetRole?: Role) => boolean
> = {
  view: () => true,
  createInvitation: (role) => role === 'owner' || role === 'admin',
  revokeInvitation: (role) => role === 'owner' || role === 'admin',
  viewInvitations: (role) => role === 'owner' || role === 'admin',
  removeMember: (role, target) => {
    if (target === 'owner') return false;
    if (role === 'owner') return true;
    if (role === 'admin') return target === 'adult' || target === 'child';
    return false;
  },
  reactivateMember: (role, target) => {
    if (target === 'owner') return false;
    if (role === 'owner') return true;
    if (role === 'admin') return target === 'adult' || target === 'child';
    return false;
  },
  viewFormerMembers: (role) => role === 'owner' || role === 'admin',
  grantAdmin: (role, target) => role === 'owner' && target === 'adult',
  revokeAdmin: (role, target) => role === 'owner' && target === 'admin',
  transferOwnership: (role, target) =>
    role === 'owner' && (target === 'admin' || target === 'adult'),
  ageUp: (role, target) =>
    (role === 'owner' || role === 'admin') && target === 'child',
  createDependent: (role) =>
    role === 'owner' || role === 'admin' || role === 'adult',
  editFamilySettings: (role) => role === 'owner' || role === 'admin',
  leaveFamily: (role) => role === 'admin' || role === 'adult',
  canManageMemberships: (role) => role === 'owner' || role === 'admin',
};

export const canAccess = (
  action: MembershipAction,
  actingRole: Role | undefined,
  targetRole?: Role,
): boolean => {
  if (!actingRole) return false;
  return policies[action](actingRole, targetRole);
};

export const useCanAccess = () => {
  const { activeMembership } = useFamily();
  const role = activeMembership?.role as Role | undefined;

  return (action: MembershipAction, targetRole?: Role) =>
    canAccess(action, role, targetRole);
};

export const canAccessManaged = (
  actingMembership: Membership | undefined,
  targetPerson: Person,
): boolean => {
  if (!targetPerson.managed) return true;
  if (!actingMembership) return false;
  return (
    actingMembership.role === 'owner' ||
    actingMembership.role === 'admin' ||
    (actingMembership.role === 'adult' &&
      targetPerson.guardians!.find(
        (p) => p.id === actingMembership.person.id,
      )) !== undefined
  );
};

export const useCanAccessManaged = () => {
  const { activeMembership } = useFamily();

  return (targetPerson: Person) =>
    canAccessManaged(activeMembership ?? undefined, targetPerson);
};
