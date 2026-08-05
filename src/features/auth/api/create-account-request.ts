import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import { AccountRequestKind, type AccountRequest } from '@/types/api';
import { getAccountRequestsQueryOptions } from './get-account-requests';

export const createAccountRequestInputSchema = z.object({
  kind: z.enum(AccountRequestKind),
});

export type CreateAccountRequestInput = z.infer<
  typeof createAccountRequestInputSchema
>;

export const createAccountRequest = ({
  data,
}: {
  data: CreateAccountRequestInput;
}): Promise<AccountRequest> => {
  return apiClient.post('/api/v1/account_requests', {
    ...data,
  });
};

type UseCreateAccountRequestOptions = {
  mutationConfig?: MutationConfig<typeof createAccountRequest>;
};

export const useCreateAccountRequest = ({
  mutationConfig,
}: UseCreateAccountRequestOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getAccountRequestsQueryOptions().queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: createAccountRequest,
  });
};
