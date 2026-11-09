import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ACCESS_COOKIE = 'ums_access_token';
const REFRESH_COOKIE = 'ums_refresh_token';

const COOKIE_PATH = '/';

const TOKEN_ISSUING_PATHS = new Set([
  'auth/login',
  'auth/verify-email',
  'auth/google',
]);

const PUBLIC_AUTH_PATHS = new Set([
  'auth/register',
  'auth/login',
  'auth/verify-email',
  'auth/google',
  'auth/forgot-password',
  'auth/reset-password',
]);

type TokenResponse = {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type CookieStore = Awaited<ReturnType<typeof cookies>>;

function getBackendBaseUrl() {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!value) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured.');
  }

  return value.replace(/\/+$/, '');
}

function getTokenExpiration(token: string): Date | null {
  try {
    const payload = token.split('.')[1];

    if (!payload) return null;

    const decoded: unknown = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    );

    if (!isRecord(decoded) || typeof decoded.exp !== 'number') {
      return null;
    }

    const expiration = new Date(decoded.exp * 1000);

    if (expiration.getTime() <= Date.now()) return null;

    return expiration;
  } catch {
    return null;
  }
}

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: COOKIE_PATH,
    expires,
    maxAge: Math.max(0, Math.floor((expires.getTime() - Date.now()) / 1000)),
  };
}

function setAuthCookies(
  store: CookieStore,
  accessToken: string,
  refreshToken: string,
) {
  const accessExpiration = getTokenExpiration(accessToken);
  const refreshExpiration = getTokenExpiration(refreshToken);

  if (!accessExpiration || !refreshExpiration) {
    throw new Error('Received invalid authentication tokens.');
  }

  store.set(ACCESS_COOKIE, accessToken, cookieOptions(accessExpiration));

  store.set(REFRESH_COOKIE, refreshToken, cookieOptions(refreshExpiration));
}

function clearAuthCookies(store: CookieStore) {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: COOKIE_PATH,
    expires: new Date(0),
    maxAge: 0,
  };

  store.set(ACCESS_COOKIE, '', options);
  store.set(REFRESH_COOKIE, '', options);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getResponseHeaders(response: Response) {
  const headers = new Headers();

  for (const [name, value] of response.headers.entries()) {
    const lowerName = name.toLowerCase();

    if (
      lowerName === 'content-type' ||
      lowerName === 'cache-control' ||
      lowerName === 'retry-after' ||
      lowerName.startsWith('x-ratelimit-')
    ) {
      headers.set(name, value);
    }
  }

  return headers;
}

function errorResponse(message: string, status: number) {
  return Response.json(
    {
      success: false,
      message,
      errors: [],
    },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}

function buildBackendUrl(request: NextRequest, path: string[]) {
  const baseUrl = getBackendBaseUrl();

  const encodedPath = path
    .map(segment => encodeURIComponent(segment))
    .join('/');

  const requestUrl = new URL(request.url);

  return `${baseUrl}/${encodedPath}${requestUrl.search}`;
}

function getRequestHeaders(request: NextRequest, accessToken?: string) {
  const headers = new Headers();

  const accept = request.headers.get('accept');
  const contentType = request.headers.get('content-type');

  if (accept) {
    headers.set('accept', accept);
  }

  if (contentType) {
    headers.set('content-type', contentType);
  }

  if (accessToken) {
    headers.set('authorization', `Bearer ${accessToken}`);
  }

  return headers;
}

async function sendBackendRequest(
  url: string,
  method: string,
  headers: Headers,
  body?: ArrayBuffer,
) {
  return fetch(url, {
    method,
    headers,
    body: method === 'GET' || method === 'HEAD' ? undefined : body,
    cache: 'no-store',
    redirect: 'manual',
  });
}

async function refreshTokens(
  store: CookieStore,
  refreshToken: string,
): Promise<string | null> {
  try {
    const response = await fetch(`${getBackendBaseUrl()}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const result: TokenResponse = await response.json();

    const accessToken = result.data?.accessToken;
    const newRefreshToken = result.data?.refreshToken;

    if (
      typeof accessToken !== 'string' ||
      typeof newRefreshToken !== 'string'
    ) {
      return null;
    }

    setAuthCookies(store, accessToken, newRefreshToken);

    return accessToken;
  } catch {
    return null;
  }
}

async function forwardResponse(response: Response) {
  const headers = getResponseHeaders(response);

  if ([204, 205, 304].includes(response.status)) {
    return new Response(null, {
      status: response.status,
      headers,
    });
  }

  return new Response(await response.arrayBuffer(), {
    status: response.status,
    headers,
  });
}

async function handleTokenIssuingResponse(
  response: Response,
  store: CookieStore,
) {
  let result: TokenResponse;

  try {
    result = (await response.clone().json()) as TokenResponse;
  } catch {
    if (response.ok) {
      return errorResponse(
        'Invalid authentication response from backend.',
        502,
      );
    }

    return forwardResponse(response);
  }

  if (!isRecord(result.data)) {
    if (response.ok) {
      return errorResponse(
        'Authentication response did not contain valid session data.',
        502,
      );
    }

    return forwardResponse(response);
  }

  const accessToken = result.data.accessToken;
  const refreshToken = result.data.refreshToken;

  const hasTokens =
    typeof accessToken === 'string' && typeof refreshToken === 'string';

  if (response.ok && !hasTokens) {
    return errorResponse(
      'Authentication response did not contain valid tokens.',
      502,
    );
  }

  if (response.ok && hasTokens) {
    try {
      setAuthCookies(store, accessToken, refreshToken);
    } catch {
      return errorResponse('Unable to establish a secure session.', 502);
    }
  }

  // RemoveJWTsFromBrowserFacingResponse
  const safeData = { ...result.data };

  delete safeData.accessToken;
  delete safeData.refreshToken;

  const headers = getResponseHeaders(response);
  headers.set('Cache-Control', 'no-store');

  return Response.json(
    {
      ...result,
      data: safeData,
    },
    {
      status: response.status,
      headers,
    },
  );
}

async function handleRequest(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  },
) {
  const method = request.method.toUpperCase();

  if (!['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return errorResponse('Method not allowed.', 405);
  }

  // ValidateOriginForStateChangingRequests
  const origin = request.headers.get('origin');

  if (
    !['GET', 'HEAD'].includes(method) &&
    (!origin || origin !== new URL(request.url).origin)
  ) {
    return errorResponse('Invalid request origin.', 403);
  }

  const { path } = await context.params;
  const apiPath = path.join('/');

  if (!apiPath) {
    return errorResponse('API path is required.', 400);
  }

  // RefreshingIsAnInternalBFFOperationOnly
  if (apiPath === 'auth/refresh-token') {
    return errorResponse('Refresh endpoint is not publicly accessible.', 404);
  }

  const store = await cookies();

  const isTokenIssuingPath = TOKEN_ISSUING_PATHS.has(apiPath);
  const isPublicAuthPath = PUBLIC_AUTH_PATHS.has(apiPath);
  const isLogout = apiPath === 'auth/logout' && method === 'POST';

  const refreshToken = store.get(REFRESH_COOKIE)?.value;
  const accessToken = store.get(ACCESS_COOKIE)?.value;

  try {
    // BuildTheBackendUrlInsideTheErrorHandler
    const backendUrl = buildBackendUrl(request, path);

    let body: ArrayBuffer | undefined;

    if (!['GET', 'HEAD'].includes(method)) {
      body = await request.arrayBuffer();
    }

    // ForwardTheRequestUsingTheExistingAccessCookie
    let response = await sendBackendRequest(
      backendUrl,
      method,
      getRequestHeaders(request, accessToken),
      body,
    );

    // InterceptLoginEmailVerificationAndGoogleLogin
    if (isTokenIssuingPath) {
      return handleTokenIssuingResponse(response, store);
    }

    // RefreshAnExpiredOrMissingAccessTokenOnlyAfter401
    // RetryTheOriginalRequestAtMostOnce
    if (response.status === 401 && refreshToken && !isPublicAuthPath) {
      const newAccessToken = await refreshTokens(store, refreshToken);

      if (newAccessToken) {
        response = await sendBackendRequest(
          backendUrl,
          method,
          getRequestHeaders(request, newAccessToken),
          body,
        );
      } else {
        clearAuthCookies(store);
      }
    }

    // LogoutMustEndTheBrowserSessionEvenIfTheBackend
    // ReportsThatTheSessionIsAlreadyInvalid
    if (isLogout) {
      clearAuthCookies(store);

      if (response.status === 401) {
        return Response.json(
          {
            success: true,
            message: 'Logged out successfully.',
            data: null,
          },
          {
            headers: {
              'Cache-Control': 'no-store',
            },
          },
        );
      }
    }

    return forwardResponse(response);
  } catch {
    if (isLogout) {
      clearAuthCookies(store);
    }

    return errorResponse('Unable to communicate with the backend.', 502);
  }
}

export const GET = handleRequest;
export const HEAD = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
