import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';

export const invitationRedemptionInputSchema = z.object({
  code: z.string(),
});

export type InvitationRedemptionInput = z.infer<
  typeof invitationRedemptionInputSchema
>;

export const redeemInvite = ({
  data,
}: {
  data: InvitationRedemptionInput;
}): Promise<void> => {
  return apiClient.post('/api/v1/invitation_redemption', {
    code: data.code,
  });
};

type UseRedeemInviteOptions = {
  mutationConfig?: MutationConfig<typeof redeemInvite>;
};

export const useRedeemInvite = ({ mutationConfig }: UseRedeemInviteOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: redeemInvite,
  });
};
