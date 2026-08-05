import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createAppRouter } from './router';
import { RouterProvider } from 'react-router-dom';

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
