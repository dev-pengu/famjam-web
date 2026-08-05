import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';

import { getMembershipQueryOptions } from './get-memberships';

export const action = {
  grant: 'grant', // grant admin privileges
  revoke: 'revoke', // revoke admin privileges
  transfer: 'transfer', // transfer ownership
  ageUp: 'ageUp', // age a dependent account up to an adult
  reactivate: 'reactivate', // reactivate a deactivated user
} as const;

export type ActionType = keyof typeof action;

const actionToUrl: Record<
  ActionType,
  (familyId: string, membershipId: string) => string
> = {
  [action.grant]: (familyId, membershipId) =>
    `/api/v1/families/${familyId}/memberships/${membershipId}/grant_admin`,
  [action.revoke]: (familyId, membershipId) =>
    `/api/v1/families/${familyId}/memberships/${membershipId}/revoke_admin`,
  [action.transfer]: (familyId, membershipId) =>
    `/api/v1/families/${familyId}/memberships/${membershipId}/transfer_ownership`,
  [action.ageUp]: (familyId, membershipId) =>
    `/api/v1/families/${familyId}/memberships/${membershipId}/age_up`,
  [action.reactivate]: (familyId, membershipId) =>
    `/api/v1/families/${familyId}/memberships/${membershipId}/reactivate`,
};

export const updateMembership = ({
  familyId,
  membershipId,
  action,
}: {
  familyId: string;
  membershipId: string;
  action: ActionType;
}) => {
  return apiClient.post(actionToUrl[action](familyId, membershipId));
};

type UseUpdateMembershipOptions = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof updateMembership>;
};

export const useUpdateMembership = ({
  familyId,
  mutationConfig,
}: UseUpdateMembershipOptions) => {
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
    mutationFn: updateMembership,
  });
};
