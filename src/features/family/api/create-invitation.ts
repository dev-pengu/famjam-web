import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { Invitation } from '@/types/api';
import { getInvitationsQueryOptions } from './get-invitations';

export const InvitationRole = {
  adult: 'adult',
  admin: 'admin',
  child: 'child'
} as const;

export const invitationInputSchema = z.object({
  role: z.enum(InvitationRole),
  email: z.string().min(10, 'Required'),
  familyId: z.string(),
  ttlOverride: z.int().optional(),
});

export type CreateInvitationInput = z.infer<typeof invitationInputSchema>;

export const createInvitation = ({
  data,
}: {
  data: CreateInvitationInput;
}): Promise<Invitation> => {
  return apiClient.post<Invitation>(
    `/api/v1/families/${data.familyId}/invitations`,
    {
      role: data.role,
      email: data.email,
      ...((data.ttlOverride ?? 0) > 0 && { ttl_hours: data.ttlOverride }),
    },
  );
};

type UseCreateInvitationOptions = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof createInvitation>;
};

export const useCreateInvitation = ({
  familyId,
  mutationConfig,
}: UseCreateInvitationOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getInvitationsQueryOptions({ familyId }).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: createInvitation,
  });
};
