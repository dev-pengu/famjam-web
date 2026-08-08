import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { Membership, MembershipColor } from '@/types/api';
import { getMembershipQueryOptions } from './get-memberships';

export const updateMembershipColor = ({
  familyId,
  membershipId,
  color,
}: {
  familyId: string;
  membershipId: string;
  color: MembershipColor;
}): Promise<Membership> => {
  return apiClient.patch<Membership>(
    `/api/v1/families/${familyId}/memberships/${membershipId}/set_color`,
    {
      color,
    },
  );
};

type UseUpdateMembershipColorOptions = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof updateMembershipColor>;
};

export const useUpdateMembershipColor = ({
  familyId,
  mutationConfig,
}: UseUpdateMembershipColorOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getMembershipQueryOptions(familyId).queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateMembershipColor,
  });
};
