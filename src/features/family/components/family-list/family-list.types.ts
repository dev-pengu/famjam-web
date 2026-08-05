import type { Family, FamilyWithMembership } from '@/types/api';

export type FamilyListProps = {
  families: (Family | FamilyWithMembership)[];
  className?: string;
};
