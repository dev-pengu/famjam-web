import { useQuery, queryOptions } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { Family } from '@/types/api';

export const getFamily = ({
  familyId,
}: {
  familyId: string;
}): Promise<Family> => {
  return apiClient.get<Family>(`/api/v1/families/${familyId}`);
};

export const getFamilyQueryOptions = (familyId: string) => {
  return queryOptions({
    queryKey: ['families', familyId],
    queryFn: () => getFamily({ familyId }),
  });
};

type UseFamilyOptions = {
  familyId: string;
  queryConfig?: QueryConfig<typeof getFamilyQueryOptions>;
};

export const useFamily = ({ familyId, queryConfig }: UseFamilyOptions) => {
  return useQuery({
    ...getFamilyQueryOptions(familyId),
    ...queryConfig,
  });
};
