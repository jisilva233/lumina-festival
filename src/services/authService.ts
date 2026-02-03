/**
 * Authentication Service
 * Handles user authentication with Supabase
 * Lumina Festival
 */

import { createClient } from '@supabase/supabase-js';
import {
  AuthCredentials,
  RegisterData,
  AuthResponse,
  Session,
  User,
  UserProfile,
  PasswordResetRequest,
  PasswordResetConfirm,
  AUTH_STORAGE_KEYS,
} from '../types/auth';

/**
 * Initialize Supabase Client
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Check environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Authentication Service Class
 */
export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const { email, password, fullName, phone } = data;

      // Step 1: Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
          },
        },
      });

      if (authError) {
        return {
          user: null,
          session: null,
          error: {
            message: authError.message,
            code: authError.name,
          },
        };
      }

      // Step 2: Fetch user profile (created by trigger)
      const userProfile = await this.getUserProfile(authData.user?.id || '');

      return {
        user: userProfile,
        session: authData.session || null,
        error: undefined,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: {
          message: error instanceof Error ? error.message : 'Registration failed',
        },
      };
    }
  }

  /**
   * Login user
   */
  static async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;

      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          user: null,
          session: null,
          error: {
            message: error.message,
            code: error.name,
          },
        };
      }

      // Fetch user profile
      const userProfile = await this.getUserProfile(data.user?.id || '');

      // Store session
      if (data.session) {
        this.storeSession(data.session, userProfile);
      }

      return {
        user: userProfile,
        session: data.session || null,
        error: undefined,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: {
          message: error instanceof Error ? error.message : 'Login failed',
        },
      };
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();

      // Clear local storage
      this.clearSession();
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage anyway
      this.clearSession();
    }
  }

  /**
   * Get current user session
   */
  static async getCurrentSession(): Promise<Session | null> {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session || null;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Token refresh error:', error);
        return null;
      }

      if (data.session) {
        this.storeSession(data.session, null);
        return data.session;
      }

      return null;
    } catch (error) {
      console.error('Refresh token error:', error);
      return null;
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(data: PasswordResetRequest): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset request failed',
      };
    }
  }

  /**
   * Confirm password reset
   */
  static async confirmPasswordReset(data: PasswordResetConfirm): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset failed',
      };
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, profile: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
          bio: profile.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profile update failed',
      };
    }
  }

  /**
   * Get user profile from database
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Get user profile error:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  /**
   * Store session in local storage
   */
  private static storeSession(session: Session, user: UserProfile | null): void {
    try {
      localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, session.access_token);
      localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, session.refresh_token);

      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
      }
    } catch (error) {
      console.error('Store session error:', error);
    }
  }

  /**
   * Clear session from local storage
   */
  private static clearSession(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
      localStorage.removeItem(AUTH_STORAGE_KEYS.SESSION);
    } catch (error) {
      console.error('Clear session error:', error);
    }
  }

  /**
   * Get stored session
   */
  static getStoredSession(): { user: UserProfile | null; token: string | null } {
    try {
      const user = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
      const token = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);

      return {
        user: user ? JSON.parse(user) : null,
        token,
      };
    } catch (error) {
      console.error('Get stored session error:', error);
      return { user: null, token: null };
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    try {
      const token = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      return !!token;
    } catch {
      return false;
    }
  }
}
