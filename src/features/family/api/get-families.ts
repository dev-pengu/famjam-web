import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { FamilyWithMembership } from '@/types/api';

export const getFamilies = (): Promise<FamilyWithMembership[]> => {
  return apiClient.get<FamilyWithMembership[]>('/api/v1/families');
};

export const getFamiliesQueryOptions = () => {
  return queryOptions({
    queryKey: ['families'],
    queryFn: () => getFamilies(),
  });
};

type UseFamiliesOptions = {
  queryConfig?: QueryConfig<typeof getFamiliesQueryOptions>;
};

export const useFamilies = ({ queryConfig }: UseFamiliesOptions = {}) => {
  return useQuery({
    ...getFamiliesQueryOptions(),
    ...queryConfig,
  });
};
