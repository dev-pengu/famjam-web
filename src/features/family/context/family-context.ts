import type { FamilyWithMembership, Membership } from '@/types/api';
import { createContext, useContext } from 'react';

export interface FamilyContextValue {
  families: FamilyWithMembership[];
  activeFamily: FamilyWithMembership | null;
  // The CURRENT USER's own membership in activeFamily. Never trust a role from
  // anywhere else (e.g. don't let a "view another member" screen set this).
  activeMembership: Membership | null;
  isLoading: boolean;
  isError: boolean;
  switchFamily: (familyId: string) => void;
  refetchFamilies: () => Promise<void>;
  getMembershipFor: (familyId: string) => Membership | null;
}

export const FamilyContext = createContext<FamilyContextValue | undefined>(
  undefined,
);

export const useFamily = (): FamilyContextValue => {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error('useFamily must be used within a FamilyProvider');
  return ctx;
};
