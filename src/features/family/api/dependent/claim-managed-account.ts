import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { AuthUser } from '@/types/api';
import { getMembershipQueryOptions } from '../membership/get-memberships';

export const claimManagedAccountInputSchema = z.object({
  email: z.email().min(1, 'Required'),
  password: z.string().min(10, 'Required'),
  familyId: z.string().min(1, 'Required'),
  dependentId: z.string().min(1, 'Required'),
});

export type ClaimManagedaccountInput = z.infer<
  typeof claimManagedAccountInputSchema
>;

export const claimManagedAccount = ({
  data,
}: {
  data: ClaimManagedaccountInput;
}): Promise<AuthUser> => {
  return apiClient.post(
    `/api/v1/families/${data.familyId}/dependents/${data.dependentId}/claim`,
    {
      email: data.email,
      password: data.password,
    },
  );
};

type UseClaimManagedAccountOptions = {
  familyId: string;
  mutationConfig?: MutationConfig<typeof claimManagedAccount>;
};

export const useClaimManagedAccount = ({
  familyId,
  mutationConfig,
}: UseClaimManagedAccountOptions) => {
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
    mutationFn: claimManagedAccount,
  });
};
