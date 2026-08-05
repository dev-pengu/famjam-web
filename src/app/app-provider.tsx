import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';

import {
  ColorSpinner,
  ColorSpinnerSize,
  SnackbarProvider,
  ThemeProvider,
} from '@famjam/ui';
import base from '@famjam/tokens/base';

import { env } from '@/config/env';
import { FamilyProvider } from '@/features/family/components/family-provider';
import { queryConfig } from '@/lib/react-query';
import { MainErrorFallback } from '@/components/error';
import { authStorage } from '@/lib/authStorage';
import { getUserQueryOptions } from '@/features/auth/api/get-user';
import { registerUnauthenticatedHandler } from '@/lib/api-client';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  const clearSession = useCallback(() => {
    authStorage.clear();
    queryClient.setQueryData(getUserQueryOptions().queryKey, null);
  }, [queryClient]);

  useEffect(() => {
    registerUnauthenticatedHandler(clearSession);
  }, [clearSession]);

  const spinnerFragment = useMemo(
    () => (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ColorSpinner size={ColorSpinnerSize.XLarge} />
      </div>
    ),
    [],
  );

  return (
    <Suspense fallback={spinnerFragment}>
      <ErrorBoundary fallbackRender={MainErrorFallback}>
        <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
          <HelmetProvider>
            {/* TODO add theme */}
            <ThemeProvider theme={base}>
              <QueryClientProvider client={queryClient}>
                <SnackbarProvider maxStack={3} autoHideDuration={4000}>
                  <FamilyProvider>{children}</FamilyProvider>
                </SnackbarProvider>
              </QueryClientProvider>
            </ThemeProvider>
          </HelmetProvider>
        </GoogleOAuthProvider>
      </ErrorBoundary>
    </Suspense>
  );
};
