import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';

import { getInvitationsQueryOptions } from './get-invitations';

export const deleteInvitation = ({
  invitationId,
  familyId,
}: {
  invitationId: string;
  familyId: string;
}) => {
  return apiClient.delete(
    `/api/v1/families/${familyId}/invitations/${invitationId}`,
  );
};

type UseDeleteInvitationOptions = {
  mutationConfig?: MutationConfig<typeof deleteInvitation>;
  familyId: string;
};

export const useDeleteInvitation = ({
  mutationConfig,
  familyId,
}: UseDeleteInvitationOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getInvitationsQueryOptions({ familyId }).queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteInvitation,
  });
};
