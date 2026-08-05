import type { Membership } from '@/types/api';

export type MemberListProps = {
  memberships: Membership[];
  actions?: (membership: Membership) => React.ReactNode;
  onRowClick?: (membership: Membership) => void;
};
