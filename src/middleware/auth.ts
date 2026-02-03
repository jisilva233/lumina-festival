/**
 * Authentication Middleware
 * JWT Validation and Token Management
 * Lumina Festival
 */

import { AuthService } from '../services/authService';
import { JWTPayload } from '../types/auth';

/**
 * Decode JWT without verification (for client-side)
 * Note: Always verify on server-side
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const decoded = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    );

    return decoded as JWTPayload;
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
      return true;
    }

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true;
  }
}

/**
 * Get time until token expiry (in seconds)
 */
export function getTokenExpiryTime(token: string): number {
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
      return 0;
    }

    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, payload.exp - now);
  } catch {
    return 0;
  }
}

/**
 * Check if token should be refreshed
 * (Refresh if less than 5 minutes remaining)
 */
export function shouldRefreshToken(token: string): boolean {
  const expiryTime = getTokenExpiryTime(token);
  return expiryTime < 300; // 5 minutes in seconds
}

/**
 * Get JWT token from storage or session
 */
export function getAccessToken(): string | null {
  try {
    const { token } = AuthService.getStoredSession();
    return token;
  } catch {
    return null;
  }
}

/**
 * Add Authorization header to fetch requests
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getAccessToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Protected API fetch wrapper
 * Automatically handles token refresh on 401
 */
export async function protectedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Add auth headers
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers as Record<string, string>),
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    // Try to refresh token
    const newSession = await AuthService.refreshToken();

    if (newSession) {
      // Retry request with new token
      const retryHeaders = {
        ...getAuthHeaders(),
        ...(options.headers as Record<string, string>),
      };

      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
      });
    } else {
      // Refresh failed, logout user
      await AuthService.logout();
      // Redirect to login
      window.location.href = '/login';
    }
  }

  return response;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = getAccessToken();

  if (!token) {
    return false;
  }

  if (isTokenExpired(token)) {
    return false;
  }

  return true;
}

/**
 * Require authentication middleware
 * Use in protected routes
 */
export function requireAuth(callback: () => void | Promise<void>): void | Promise<void> {
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return;
  }

  return callback();
}

/**
 * Setup token refresh interval
 * Automatically refresh token before expiry
 */
let refreshIntervalId: NodeJS.Timeout | null = null;

export function setupTokenRefresh(): void {
  // Clear existing interval
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
  }

  // Check token every minute
  refreshIntervalId = setInterval(async () => {
    const token = getAccessToken();

    if (!token) {
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
        refreshIntervalId = null;
      }
      return;
    }

    if (shouldRefreshToken(token)) {
      try {
        await AuthService.refreshToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        await AuthService.logout();
        window.location.href = '/login';
      }
    }
  }, 60000); // Check every minute
}

/**
 * Clear token refresh interval
 */
export function clearTokenRefresh(): void {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
  }
}

/**
 * Auth guard for route protection
 */
export class AuthGuard {
  /**
   * Check if user can access resource
   */
  static canActivate(): boolean {
    return isAuthenticated();
  }

  /**
   * Check if user has specific role
   */
  static hasRole(role: string): boolean {
    const token = getAccessToken();
    if (!token) return false;

    const payload = decodeJWT(token);
    // Role check logic (if implemented)
    return true; // Placeholder
  }

  /**
   * Get current user ID from token
   */
  static getCurrentUserId(): string | null {
    const token = getAccessToken();
    if (!token) return null;

    const payload = decodeJWT(token);
    return payload?.sub || null;
  }
}
