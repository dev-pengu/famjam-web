import { env } from '@/config/env';
import { authStorage } from './authStorage';
import type { TokenPair } from '@/types/api';
import { getDeviceName } from '@/utils/device-info';

const API_BASE_URL = env.API_URL ?? '/api/v1';

export class ApiError extends Error {
  status: number;
  errors: string[];

  constructor(status: number, errors: string[]) {
    super(errors.join(', ') || `Request failed with status ${status}`);
    this.status = status;
    this.errors = errors;
  }
}

export class OAuthLinkError extends Error {
  user_id: string;
  provider_uid: string;
  error: string;
  status: number;

  constructor(status: number, error: string, provider_uid: string, user_id: string) {
    super(error);
    this.status = status;
    this.error = error;
    this.provider_uid = provider_uid;
    this.user_id = user_id;
  }
}

type FamilyIdGetter = () => string | null;
let getActiveFamilyId: FamilyIdGetter = () => null;
export const registerActiveFamilyIdGetter = (getter: FamilyIdGetter): void => {
  getActiveFamilyId = getter;
};

type UnauthenticatedHandler = () => void;
let onUnauthenticated: UnauthenticatedHandler = () => {};
export const registerUnauthenticatedHandler = (
  handler: UnauthenticatedHandler,
): void => {
  onUnauthenticated = handler;
};

let refreshPromise: Promise<boolean> | null = null;

const refreshTokens = async (): Promise<boolean> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/token_refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refresh_token: refreshToken,
          device_name: getDeviceName(),
        }),
      });
      if (!response.ok) return false;

      const tokens: TokenPair = await response.json();
      authStorage.setAccessToken(tokens.access_token);
      authStorage.setRefreshToken(tokens.refresh_token);
      return true;
    } catch {
      return false;
    }
  })();

  const result = await refreshPromise;
  refreshPromise = null;
  return result;
};

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  skipFamilyContext?: boolean;
  isRetry?: boolean;
}

const request = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const {
    method = 'GET',
    body,
    skipFamilyContext = false,
    isRetry = false,
  } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const accessToken = authStorage.getAccessToken();
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  if (!skipFamilyContext) {
    const familyId = getActiveFamilyId();
    if (familyId) headers['X-Family-Id'] = familyId;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && !isRetry) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      return request<T>(path, { ...options, isRetry: true });
    }
    authStorage.clear();
    onUnauthenticated();
    throw new ApiError(401, ['session expired']);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 409 && data.error === 'linking_required') {
      throw new OAuthLinkError(409, data.error, data.provider_uid, data.user_id);
    }
    const errors: string[] = Array.isArray(data.errors)
      ? data.errors
      : [data.error ?? 'request failed'];
    throw new ApiError(response.status, errors);
  }

  return data as T;
};

export const apiClient = {
  get: <T>(path: string, skipFamilyContext: boolean = false) =>
    request<T>(path, { skipFamilyContext }),
  post: <T>(path: string, body?: unknown, skipFamilyContext: boolean = false) =>
    request<T>(path, { method: 'POST', body, skipFamilyContext }),
  patch: <T>(
    path: string,
    body?: unknown,
    skipFamilyContext: boolean = false,
  ) => request<T>(path, { method: 'PATCH', body, skipFamilyContext }),
  delete: <T>(path: string, skipFamilyContext: boolean = false) =>
    request<T>(path, { method: 'DELETE', skipFamilyContext }),
};
