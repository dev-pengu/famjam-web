import { Combobox, LabelVariant, useSnackbar } from '@famjam/ui';

import { useTimezones, toTimezoneComboboxOptions } from '@/hooks/use-timezones';
import { useUpdateTimezone } from '@/features/settings/api/update-timezone';
import type { AuthUser } from '@/types/api';

export const UpdateTimezone = ({ user }: { user: AuthUser }) => {
  const { addToast } = useSnackbar();
  const { data: timezones } = useTimezones();
  const updateTimezoneMutation = useUpdateTimezone({
    mutationConfig: {
      onSuccess: () => addToast({ message: 'Timezone updated' }),
    },
  });

  const options = toTimezoneComboboxOptions(timezones);

  return (
    <Combobox
      options={options}
      value={user.timezone ?? undefined}
      onChange={(value: unknown) => {
        if (typeof value === 'string' && value) {
          updateTimezoneMutation.mutate({ data: { timezone: value } });
        }
      }}
      label="Timezone"
      labelVariant={LabelVariant.Float}
      placeholder={`Using family default (${user.resolved_timezone})`}
      helperMessage="Used for displaying event times. Leave unset to follow your family's default timezone."
    />
  );
};
