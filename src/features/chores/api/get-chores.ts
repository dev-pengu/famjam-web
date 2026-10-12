import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { ChoreOccurrence } from '@/types/api';

export const getChores = (familyId: string): Promise<ChoreOccurrence[]> => {
  return apiClient.get<ChoreOccurrence[]>(
    `/api/v1/families/${familyId}/chores`,
  );
};

export const getChoresQueryOptions = ({ familyId }: { familyId: string }) => {
  return queryOptions({
    queryKey: ['chores', familyId],
    queryFn: () => getChores(familyId),
  });
};

type UseChoresOptions = {
  familyId: string;
  queryConfig?: QueryConfig<typeof getChoresQueryOptions>;
};

export const useChores = ({ familyId, queryConfig }: UseChoresOptions) => {
  return useQuery({
    ...getChoresQueryOptions({ familyId }),
    ...queryConfig,
  });
};
