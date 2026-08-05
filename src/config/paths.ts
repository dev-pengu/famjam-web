export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  emailVerification: {
    path: '/verify-email',
    getHref: () => '/verify-email',
  },
  resetPassword: {
    path: '/reset-password',
    getHref: () => '/reset-password',
  },
  auth: {
    register: {
      path: '/auth/register',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    forgotPassword: {
      path: '/auth/forgot-password',
      getHref: (redirecTo?: string | null | undefined) =>
        `/auth/forgot-password${redirecTo ? `?redirectTo=${encodeURIComponent(redirecTo)}` : ''}`,
    },
  },

  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
    dashboard: {
      path: '',
      getHref: () => '/app',
    },
    settings: {
      path: 'settings',
      getHref: () => '/app/settings',
    },
    family: {
      path: 'family',
      getHref: () => '/app/family',
    },
  },
} as const;
