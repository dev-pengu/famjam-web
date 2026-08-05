import { useQuery, queryOptions } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { Membership } from '@/types/api';

export const getMemberships = ({
  familyId,
}: {
  familyId: string | null;
}): Promise<Membership[]> => {
  if (familyId === null) return Promise.resolve([]);
  return apiClient.get<Membership[]>(
    `/api/v1/families/${familyId}/memberships`,
  );
};

export const getMembershipQueryOptions = (familyId: string | null) => {
  return queryOptions({
    queryKey: ['memberships', familyId],
    queryFn: () => getMemberships({ familyId }),
  });
};

type UseMembershipOptions = {
  familyId: string | null;
  queryConfig?: QueryConfig<typeof getMembershipQueryOptions>;
};

export const useMemberships = ({
  familyId,
  queryConfig,
}: UseMembershipOptions) => {
  return useQuery({
    ...getMembershipQueryOptions(familyId),
    ...queryConfig,
  });
};
