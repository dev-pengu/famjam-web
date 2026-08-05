import { useQuery, queryOptions } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { AccountRequest } from '@/types/api';

export const getAccountRequests = (): Promise<AccountRequest[]> => {
  return apiClient.get<AccountRequest[]>('/api/v1/account_requests');
};

export const getAccountRequestsQueryOptions = () => {
  return queryOptions({
    queryKey: ['account-requests'],
    queryFn: getAccountRequests,
  });
};

type UseAccountRequestsrOptions = {
  queryConfig?: QueryConfig<typeof getAccountRequests>;
};

export const useUser = ({ queryConfig }: UseAccountRequestsrOptions = {}) => {
  return useQuery({
    ...getAccountRequestsQueryOptions(),
    ...queryConfig,
  });
};
