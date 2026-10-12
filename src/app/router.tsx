import { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router-dom';

import { paths } from '@/config/paths';
import { ProtectedRoute } from '../components/protected-route';

import {
  default as AppRoot,
  ErrorBoundary as AppRootErrorBoundary,
} from './pages/app/Root';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import('./pages/Home').then(convert(queryClient)),
    },
    {
      path: paths.resetPassword.path,
      lazy: () =>
        import('./pages/auth/PasswordReset').then(convert(queryClient)),
    },
    {
      path: paths.auth.register.path,
      lazy: () => import('./pages/auth/Signup').then(convert(queryClient)),
    },
    {
      path: paths.auth.login.path,
      lazy: () => import('./pages/auth/Login').then(convert(queryClient)),
    },
    {
      path: paths.auth.forgotPassword.path,
      lazy: () =>
        import('./pages/auth/ForgotPassword').then(convert(queryClient)),
    },
    {
      path: paths.emailVerification.path,
      lazy: () =>
        import('./pages/auth/EmailVerification').then(convert(queryClient)),
    },
    {
      path: paths.app.root.path,
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          path: paths.app.settings.path,
          lazy: () => import('./pages/app/Settings').then(convert(queryClient)),
        },
        {
          path: paths.app.dashboard.path,
          lazy: () =>
            import('./pages/app/Dashboard').then(convert(queryClient)),
        },
        {
          path: paths.app.calendar.path,
          lazy: () => import('./pages/app/Calendar').then(convert(queryClient)),
        },
        {
          path: paths.app.chores.path,
          lazy: () => import('./pages/app/Chores').then(convert(queryClient)),
        },
      ],
    },
    {
      path: '*',
      lazy: () => import('./pages/NotFound').then(convert(queryClient)),
    },
  ]);
