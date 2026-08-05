export interface AuthStorage {
  getAccessToken(): string | null;
  setAccessToken(token: string | null): void;
  getRefreshToken(): string | null;
  setRefreshToken(token: string | null): void;
  clear(): void;
}

// Access token lives in memory only
let inMemoryAccessToken: string | null = null;

const REFRESH_TOKEN_KEY = 'family_app.refresh_token';

// TODO: Worth considering moving rereshToken to a httpOnly, secure, SameSite cookie and adding a parallel
// implementation for the app in the future.
export const authStorage: AuthStorage = {
  getAccessToken: () => inMemoryAccessToken,
  setAccessToken: (token) => {
    inMemoryAccessToken = token;
  },
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token) => {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },
  clear: () => {
    inMemoryAccessToken = null;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};