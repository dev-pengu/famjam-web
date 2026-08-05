import { useQuery, queryOptions } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { AuthUser } from '@/types/api';

export const getUser = (): Promise<AuthUser | null> => {
  return apiClient.get<AuthUser>('/api/v1/profile');
};

export const getUserQueryOptions = () => {
  return queryOptions({
    queryKey: ['user'],
    queryFn: getUser,
  });
};

type UseUserOptions = {
  queryConfig?: QueryConfig<typeof getUserQueryOptions>;
};

export const useUser = ({ queryConfig }: UseUserOptions = {}) => {
  return useQuery({
    ...getUserQueryOptions(),
    retry: false,
    staleTime: Infinity,
    ...queryConfig,
  });
};
