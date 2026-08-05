import { useQuery, queryOptions } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { Membership } from '@/types/api';

export const getFormerMemberships = ({
  familyId,
}: {
  familyId: string | null;
}): Promise<Membership[]> => {
  if (familyId === null) return Promise.resolve([]);
  return apiClient.get<Membership[]>(
    `/api/v1/families/${familyId}/memberships/former`,
  );
};

export const getFormerMembershipQueryOptions = (familyId: string | null) => {
  return queryOptions({
    queryKey: ['memberships', familyId, 'former'],
    queryFn: () => getFormerMemberships({ familyId }),
  });
};

type UseFormerMembershipsOptions = {
  familyId: string | null;
  queryConfig?: QueryConfig<typeof getFormerMembershipQueryOptions>;
};

export const useFormerMemberships = ({
  familyId,
  queryConfig,
}: UseFormerMembershipsOptions) => {
  return useQuery({
    ...getFormerMembershipQueryOptions(familyId),
    ...queryConfig,
  });
};
