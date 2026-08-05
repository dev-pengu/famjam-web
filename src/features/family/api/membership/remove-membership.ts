import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';

import { getMembershipQueryOptions } from './get-memberships';
import { getFamiliesQueryOptions } from '../get-families';

type BaseProps = {
  familyId: string;
};

type LeaveProps = BaseProps & {
  membershipId?: never;
  isCurrentUser: true;
};

type RemoveProps = BaseProps & {
  membershipId: string;
  isCurrentUser: false;
};

export const removeMembership = ({
  familyId,
  membershipId,
  isCurrentUser,
}: RemoveProps | LeaveProps) => {
  return isCurrentUser
    ? apiClient.post(`/api/v1/families/${familyId}/memberships/leave`)
    : apiClient.delete(
        `/api/v1/families/${familyId}/memberships/${membershipId}`,
      );
};

type UseRemoveMembershipOptions = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof removeMembership>;
};

export const useRemoveMembership = ({
  familyId,
  mutationConfig,
}: UseRemoveMembershipOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getMembershipQueryOptions(familyId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: getFamiliesQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: removeMembership,
  });
};
