import {
  useEffect,
  useState,
  useCallback,
  type ReactNode,
  useMemo,
} from 'react';
import { registerActiveFamilyIdGetter } from '@/lib/api-client';
import type { Membership } from '@/types/api';
import {
  FamilyContext,
  type FamilyContextValue,
} from '../context/family-context';
import { useQueryClient } from '@tanstack/react-query';
import { getFamiliesQueryOptions, useFamilies } from '../api/get-families';
import { useSwitchFamily } from '../api/swith-family';
import { useUser } from '@/features/auth/auth';

const ACTIVE_FAMILY_STORAGE_KEY = 'family_app.active_family_id';

export const FamilyProvider = ({ children }: { children: ReactNode }) => {
  const user = useUser();
  const queryClient = useQueryClient();

  const [activeFamilyId, setActiveFamilyId] = useState<string | null>(null);
  const familiesQuery = useFamilies({
    queryConfig: {
      enabled: !!user.data,
      staleTime: 60_000,
    },
  });

  const families = useMemo(
    () => familiesQuery.data ?? [],
    [familiesQuery.data],
  );

  useEffect(() => {
    registerActiveFamilyIdGetter(() => activeFamilyId);
  }, [activeFamilyId]);

  useEffect(() => {
    (() => {
      if (!families.length) return;

      const stillValid = families.some((f) => f.id === activeFamilyId);
      if (stillValid) return;

      const fallback =
        families.find((f) => f.id === user?.data?.active_family_id)?.id ??
        families[0].id;
      setActiveFamilyId(fallback);
      localStorage.setItem(ACTIVE_FAMILY_STORAGE_KEY, fallback);
    })();
  }, [families, activeFamilyId, user]);

  useEffect(() => {
    (() => {
      if (user.data) return;

      setActiveFamilyId(null);
      localStorage.removeItem(ACTIVE_FAMILY_STORAGE_KEY);
      queryClient.removeQueries({
        queryKey: getFamiliesQueryOptions().queryKey,
      });
    })();
  }, [user, queryClient]);

  const membershipsByFamilyId = useMemo(() => {
    const map = new Map<string, Membership>();
    families.forEach((f) => map.set(f.id, f.membership));
    return map;
  }, [families]);

  const getMembershipFor = useCallback(
    (familyId: string) => membershipsByFamilyId.get(familyId) ?? null,
    [membershipsByFamilyId],
  );

  const switchFamilyMutation = useSwitchFamily({});

  const switchFamily = useCallback(
    (familyId: string) => {
      setActiveFamilyId(familyId);
      localStorage.setItem(ACTIVE_FAMILY_STORAGE_KEY, familyId);

      switchFamilyMutation.mutate({ familyId });
    },
    [switchFamilyMutation],
  );

  const activeFamily = families.find((f) => f.id === activeFamilyId) ?? null;
  const activeMembership = activeFamilyId
    ? getMembershipFor(activeFamilyId)
    : null;

  const value: FamilyContextValue = {
    families,
    activeFamily,
    activeMembership,
    isLoading: familiesQuery.isPending,
    isError: familiesQuery.isError,
    switchFamily,
    refetchFamilies: async () => {
      await familiesQuery.refetch();
    },
    getMembershipFor,
  };

  return (
    <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
  );
};
