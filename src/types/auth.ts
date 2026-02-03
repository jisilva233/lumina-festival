/**
 * Authentication Types & Interfaces
 * Lumina Festival
 */

/**
 * User Authentication Credentials
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * User Registration Data
 */
export interface RegisterData extends AuthCredentials {
  fullName: string;
  phone?: string;
}

/**
 * JWT Token Payload
 */
export interface JWTPayload {
  sub: string; // User ID (subject)
  email: string;
  iss: string; // Issuer
  aud: string; // Audience
  iat: number; // Issued at
  exp: number; // Expiration time
  aud_claim?: string;
  session_id?: string;
}

/**
 * Supabase Auth Response
 */
export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error?: AuthError;
}

/**
 * User Object (from Supabase)
 */
export interface User {
  id: string;
  email: string;
  email_confirmed_at?: string;
  phone?: string;
  full_name?: string;
  user_metadata?: Record<string, unknown>;
  aud?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Auth Session
 */
export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in?: number;
  token_type: string;
  user: User;
}

/**
 * User Profile (Database)
 */
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Auth Error
 */
export interface AuthError {
  code?: string;
  message: string;
  status?: number;
}

/**
 * Password Reset Request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password Reset Confirmation
 */
export interface PasswordResetConfirm {
  email: string;
  token: string;
  password: string;
}

/**
 * Auth Context State
 */
export interface AuthContextState {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (data: PasswordResetConfirm) => Promise<void>;
  refreshToken: () => Promise<Session | null>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

/**
 * Auth Event Types
 */
export enum AuthEventType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  REGISTER = 'register',
  PASSWORD_CHANGE = 'password_change',
  PASSWORD_RESET = 'password_reset',
  SESSION_REFRESH = 'session_refresh',
  AUTH_ERROR = 'auth_error',
}

/**
 * Auth Event Status
 */
export enum AuthEventStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
}

/**
 * Authentication Endpoints
 */
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
  PASSWORD_RESET: '/api/auth/password-reset',
  PASSWORD_RESET_CONFIRM: '/api/auth/password-reset/confirm',
  USER_PROFILE: '/api/auth/profile',
} as const;

/**
 * Storage Keys for Auth Data
 */
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'lumina_access_token',
  REFRESH_TOKEN: 'lumina_refresh_token',
  USER: 'lumina_user',
  SESSION: 'lumina_session',
} as const;

/**
 * Token Expiry Times (in seconds)
 */
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: 3600, // 1 hour
  REFRESH_TOKEN: 2592000, // 30 days
} as const;
