import { useQuery, queryOptions } from '@tanstack/react-query';

import { apiClient, ApiError } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { IcalFeedToken } from '@/types/api';

export const getIcalFeedToken = (): Promise<IcalFeedToken | null> => {
  return apiClient.get<IcalFeedToken>('/api/v1/ical_feed_token').catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  });
};

export const getIcalFeedTokenQueryOptions = () => {
  return queryOptions({
    queryKey: ['ical-feed-token'],
    queryFn: getIcalFeedToken,
  });
};

type UseIcalFeedTokenOptions = {
  queryConfig?: QueryConfig<typeof getIcalFeedTokenQueryOptions>;
};

export const useIcalFeedToken = ({ queryConfig }: UseIcalFeedTokenOptions = {}) => {
  return useQuery({
    ...getIcalFeedTokenQueryOptions(),
    ...queryConfig,
  });
};
