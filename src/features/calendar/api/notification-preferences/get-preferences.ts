import { useQuery, queryOptions } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import type { QueryConfig } from '@/lib/react-query';
import type { NotificationPreference } from '@/types/api';

export const getNotificationPreferences = (): Promise<NotificationPreference[]> => {
  return apiClient.get<NotificationPreference[]>('/api/v1/notification_preferences');
};

export const getNotificationPreferencesQueryOptions = () => {
  return queryOptions({
    queryKey: ['notification-preferences'],
    queryFn: getNotificationPreferences,
  });
};

type UseNotificationPreferencesOptions = {
  queryConfig?: QueryConfig<typeof getNotificationPreferencesQueryOptions>;
};

export const useNotificationPreferences = ({ queryConfig }: UseNotificationPreferencesOptions = {}) => {
  return useQuery({
    ...getNotificationPreferencesQueryOptions(),
    ...queryConfig,
  });
};
