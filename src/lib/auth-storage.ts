const ACCESS_TOKEN_KEY = 'ums_access_token';
const REFRESH_TOKEN_KEY = 'ums_refresh_token';

// GetAccessToken
export function getAccessToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

// GetRefreshToken
export function getRefreshToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// SetAuthTokens
export function setAuthTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

// ClearAuthTokens
export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
