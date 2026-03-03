import { getSession, setSession, clearSession } from "./auth";
import { ApiError } from "./types";
import { API_URL } from "./constants";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { skipAuth = false, ...init } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  // Attach access token once; re-used after refresh
  let accessToken: string | undefined;
  if (!skipAuth) {
    const session = await getSession();
    accessToken = session.accessToken;
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  let res = await fetch(`${API_URL}${path}`, { ...init, headers });

  // Silent token refresh on 401
  if (res.status === 401 && !skipAuth) {
    const newToken = await tryRefreshToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_URL}${path}`, { ...init, headers });
    } else {
      await clearSession();
      throw { message: "Session expired", statusCode: 401 } satisfies ApiError;
    }
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {
      // ignore parse error
    }
    throw { message, statusCode: res.status } satisfies ApiError;
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

/**
 * Calls the refresh endpoint (httpOnly refresh cookie sent automatically),
 * persists the new access token in the session, and returns it.
 * Returns null if refresh fails.
 */
async function tryRefreshToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) return null;

    const data = await res.json();
    const newAccessToken: string = data.access_token;

    // Read existing session data (role/userId/email) once, then update only the token
    const session = await getSession();
    await setSession({
      accessToken: newAccessToken,
      role: session.role,
      userId: session.userId,
      email: session.email,
    });

    return newAccessToken;
  } catch {
    return null;
  }
}

export const api = {
  get: <T>(path: string, options?: FetchOptions) =>
    apiFetch<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body: unknown, options?: FetchOptions) =>
    apiFetch<T>(path, { ...options, method: "POST", body: JSON.stringify(body) }),

  patch: <T>(path: string, body: unknown, options?: FetchOptions) =>
    apiFetch<T>(path, { ...options, method: "PATCH", body: JSON.stringify(body) }),

  put: <T>(path: string, body: unknown, options?: FetchOptions) =>
    apiFetch<T>(path, { ...options, method: "PUT", body: JSON.stringify(body) }),

  delete: <T>(path: string, options?: FetchOptions) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),
};
