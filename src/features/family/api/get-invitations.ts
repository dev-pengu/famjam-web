import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { Invitation } from '@/types/api';

export const getInvitations = (familyId: string): Promise<Invitation[]> => {
  return apiClient.get<Invitation[]>(
    `/api/v1/families/${familyId}/invitations`,
  );
};

export const getInvitationsQueryOptions = ({
  familyId,
}: {
  familyId: string;
}) => {
  return queryOptions({
    queryKey: ['invitations'],
    queryFn: () => getInvitations(familyId),
  });
};

type UseGetInvitationsOptions = {
  queryConfig?: QueryConfig<typeof getInvitationsQueryOptions>;
  familyId: string;
};

export const useGetInvitations = ({
  queryConfig,
  familyId,
}: UseGetInvitationsOptions) => {
  return useQuery({
    ...getInvitationsQueryOptions({ familyId }),
    ...queryConfig,
  });
};
