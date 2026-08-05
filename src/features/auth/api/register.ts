import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/api-client';
import type { MutationConfig } from '@/lib/react-query';
import type { AuthUser } from '@/types/api';

export const registerInputSchema = z.object({
  email: z.email().min(1, 'Required'),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  password: z.string().min(10, 'Required'),
  nickname: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const registerWithPassword = ({
  data,
}: {
  data: RegisterInput;
}): Promise<AuthUser> => {
  return apiClient.post<AuthUser>('/api/v1/registration', {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    password: data.password,
    nickname: data.nickname,
  });
};

type UseRegisterWithPasswordOptions = {
  mutationConfig?: MutationConfig<typeof registerWithPassword>;
};

export const useRegisterWithPassword = ({
  mutationConfig,
}: UseRegisterWithPasswordOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: registerWithPassword,
  });
};

export type UseRegisterWithPasswordReturn = typeof useRegisterWithPassword;
