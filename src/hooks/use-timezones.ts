import { useQuery, queryOptions } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { Timezone } from '@/types/api';

export const getTimezones = (): Promise<Timezone[]> => {
  return apiClient.get<Timezone[]>('/api/v1/timezones');
};

export const getTimezonesQueryOptions = () => {
  return queryOptions({
    queryKey: ['timezones'],
    queryFn: getTimezones,
    staleTime: Infinity,
  });
};

type UseTimezonesOptions = {
  queryConfig?: QueryConfig<typeof getTimezonesQueryOptions>;
};

export const useTimezones = ({ queryConfig }: UseTimezonesOptions = {}) => {
  return useQuery({
    ...getTimezonesQueryOptions(),
    ...queryConfig,
  });
};

export const toTimezoneComboboxOptions = (timezones: Timezone[] | undefined) => {
  return (timezones ?? []).map((tz) => ({ label: `${tz.label} - ${tz.value}`, value: tz.value }));
};
