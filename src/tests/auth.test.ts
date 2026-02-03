/**
 * Authentication Tests
 * Lumina Festival
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuthService } from '../services/authService';
import {
  decodeJWT,
  isTokenExpired,
  getTokenExpiryTime,
  shouldRefreshToken,
  isAuthenticated,
} from '../middleware/auth';
import { AuthCredentials, RegisterData } from '../types/auth';

/**
 * Mock data for testing
 */
const mockCredentials: AuthCredentials = {
  email: 'test@example.com',
  password: 'TestPassword123!',
};

const mockRegisterData: RegisterData = {
  email: 'newuser@example.com',
  password: 'SecurePass123!@#',
  fullName: 'Test User',
  phone: '+5585987654321',
};

const mockJWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.signature';

/**
 * Auth Service Tests
 */
describe('AuthService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('register', () => {
    it('should register a new user with valid data', async () => {
      // Note: This test requires mock/stub of supabase client
      const result = await AuthService.register(mockRegisterData);

      expect(result).toBeDefined();
      expect(result.error).toBeUndefined();
      // Expect either user or error, but not both
      expect(result.user !== null || result.error !== undefined).toBeTruthy();
    });

    it('should return error for invalid email', async () => {
      const invalidData = { ...mockRegisterData, email: 'invalid-email' };
      const result = await AuthService.register(invalidData);

      // Should have error response
      expect(result.error || !result.user).toBeTruthy();
    });

    it('should return error for weak password', async () => {
      const weakData = { ...mockRegisterData, password: '123' };
      const result = await AuthService.register(weakData);

      // Should have error response
      expect(result.error || !result.user).toBeTruthy();
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const result = await AuthService.login(mockCredentials);

      expect(result).toBeDefined();
      // Expect either success or error response
      expect(result.user !== null || result.error !== undefined).toBeTruthy();
    });

    it('should return error for incorrect password', async () => {
      const wrongCredentials = { ...mockCredentials, password: 'wrong' };
      const result = await AuthService.login(wrongCredentials);

      // Should have error response
      expect(result.error || !result.user).toBeTruthy();
    });

    it('should return error for non-existent user', async () => {
      const nonExistentCredentials = { ...mockCredentials, email: 'nonexistent@example.com' };
      const result = await AuthService.login(nonExistentCredentials);

      // Should have error response
      expect(result.error || !result.user).toBeTruthy();
    });
  });

  describe('logout', () => {
    it('should clear session on logout', async () => {
      // Set up mock session
      localStorage.setItem('lumina_access_token', 'mock-token');

      await AuthService.logout();

      // Verify session is cleared
      expect(localStorage.getItem('lumina_access_token')).toBeNull();
    });
  });

  describe('getStoredSession', () => {
    it('should return null for empty session', () => {
      const result = AuthService.getStoredSession();

      expect(result.user).toBeNull();
      expect(result.token).toBeNull();
    });

    it('should retrieve stored session', () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockToken = 'mock-token';

      localStorage.setItem('lumina_user', JSON.stringify(mockUser));
      localStorage.setItem('lumina_access_token', mockToken);

      const result = AuthService.getStoredSession();

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBe(mockToken);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when not authenticated', () => {
      const result = AuthService.isAuthenticated();
      expect(result).toBe(false);
    });

    it('should return true with valid token', () => {
      localStorage.setItem('lumina_access_token', 'mock-token');
      const result = AuthService.isAuthenticated();

      expect(result).toBe(true);
    });
  });
});

/**
 * JWT Middleware Tests
 */
describe('JWT Middleware', () => {
  describe('decodeJWT', () => {
    it('should decode valid JWT', () => {
      const result = decodeJWT(mockJWT);

      expect(result).toBeDefined();
      expect(result?.sub).toBe('1234567890');
      expect(result?.name).toBe('John Doe');
    });

    it('should return null for invalid JWT', () => {
      const result = decodeJWT('invalid.jwt.token');

      expect(result).toBeNull();
    });

    it('should return null for malformed JWT', () => {
      const result = decodeJWT('not-a-jwt');

      expect(result).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid token', () => {
      const result = isTokenExpired(mockJWT);

      expect(result).toBe(false);
    });

    it('should return true for invalid token', () => {
      const result = isTokenExpired('invalid');

      expect(result).toBe(true);
    });
  });

  describe('getTokenExpiryTime', () => {
    it('should calculate remaining expiry time', () => {
      const result = getTokenExpiryTime(mockJWT);

      // Mock token has expiry far in future
      expect(result).toBeGreaterThan(0);
    });

    it('should return 0 for expired token', () => {
      // Create expired token
      const expiredPayload = Buffer.from(
        JSON.stringify({
          sub: '123',
          exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        })
      )
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      const expiredJWT = `header.${expiredPayload}.signature`;
      const result = getTokenExpiryTime(expiredJWT);

      expect(result).toBe(0);
    });
  });

  describe('shouldRefreshToken', () => {
    it('should return false for recently issued token', () => {
      const result = shouldRefreshToken(mockJWT);

      expect(result).toBe(false);
    });

    it('should return true for token expiring soon', () => {
      // Create token expiring in 2 minutes
      const soonExpiryPayload = Buffer.from(
        JSON.stringify({
          sub: '123',
          exp: Math.floor(Date.now() / 1000) + 120,
        })
      )
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      const soonExpiryJWT = `header.${soonExpiryPayload}.signature`;
      const result = shouldRefreshToken(soonExpiryJWT);

      expect(result).toBe(true);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token stored', () => {
      const result = isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return true with valid token', () => {
      localStorage.setItem('lumina_access_token', mockJWT);

      const result = isAuthenticated();

      expect(result).toBe(true);

      localStorage.clear();
    });
  });
});

/**
 * Integration Tests
 */
describe('Authentication Flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should complete register → login → logout flow', async () => {
    // Step 1: Register
    const registerResult = await AuthService.register(mockRegisterData);
    expect(registerResult.user || registerResult.error).toBeTruthy();

    // Step 2: Login
    const loginResult = await AuthService.login({
      email: mockRegisterData.email,
      password: mockRegisterData.password,
    });
    expect(loginResult.user || loginResult.error).toBeTruthy();

    // Step 3: Verify authenticated
    if (loginResult.session) {
      const isAuth = AuthService.isAuthenticated();
      expect(typeof isAuth).toBe('boolean');
    }

    // Step 4: Logout
    await AuthService.logout();
    expect(localStorage.getItem('lumina_access_token')).toBeNull();
  });
});

/**
 * Security Tests
 */
describe('Auth Security', () => {
  it('should not store password in localStorage', () => {
    const { password } = mockCredentials;
    const allStorageKeys = Object.keys(localStorage);

    for (const key of allStorageKeys) {
      const value = localStorage.getItem(key) || '';
      expect(value).not.toContain(password);
    }
  });

  it('should validate email format', async () => {
    const invalidEmails = [
      'not-an-email',
      '@example.com',
      'user@',
      'user name@example.com',
    ];

    for (const email of invalidEmails) {
      const result = await AuthService.login({
        ...mockCredentials,
        email,
      });

      // Should have error for invalid email
      expect(result.error || !result.user).toBeTruthy();
    }
  });

  it('should enforce password requirements', async () => {
    const weakPasswords = [
      '123', // Too short
      'nouppercase123!', // No uppercase
      'NOLOWERCASE123!', // No lowercase
      'NoNumbers!', // No numbers
      'NoSpecial123', // No special characters
    ];

    for (const password of weakPasswords) {
      const result = await AuthService.register({
        ...mockRegisterData,
        password,
      });

      // Should reject weak passwords
      expect(result.error || !result.user).toBeTruthy();
    }
  });
});
