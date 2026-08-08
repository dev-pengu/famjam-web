import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { NotificationPreference, NotificationType } from '@/types/api';
import { getNotificationPreferencesQueryOptions } from './get-preferences';

export const updateNotificationPreferences = ({
  preferences,
}: {
  preferences: { notificationType: NotificationType; enabled: boolean }[];
}): Promise<NotificationPreference[]> => {
  return apiClient.patch<NotificationPreference[]>('/api/v1/notification_preferences', {
    preferences: preferences.map((p) => ({ notification_type: p.notificationType, enabled: p.enabled })),
  });
};

type UseUpdateNotificationPreferencesOptions = {
  mutationConfig?: MutationConfig<typeof updateNotificationPreferences>;
};

export const useUpdateNotificationPreferences = ({
  mutationConfig,
}: UseUpdateNotificationPreferencesOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: getNotificationPreferencesQueryOptions().queryKey });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateNotificationPreferences,
  });
};
