const STORAGE_KEY = "katalyst_auth_token";

const isBrowser = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const storeAuthToken = (token: string) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, token);
};

export const readAuthToken = (): string | null => {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(STORAGE_KEY);
};

export const clearAuthToken = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
};

export const AUTH_TOKEN_STORAGE_KEY = STORAGE_KEY;
