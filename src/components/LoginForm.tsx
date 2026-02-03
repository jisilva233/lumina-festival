/**
 * Login Form Component
 * Lumina Festival
 */

import React, { useState } from 'react';
import { AuthService } from '../services/authService';
import { AuthCredentials } from '../types/auth';

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Login Form Component
 */
export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Login
      const credentials: AuthCredentials = { email, password };
      const response = await AuthService.login(credentials);

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.user || !response.session) {
        throw new Error('Login failed: No user data returned');
      }

      // Success
      setEmail('');
      setPassword('');
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form">
        <h2>Login to Lumina Festival</h2>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              autoComplete="email"
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '🙈 Hide' : '👁️ Show'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Links */}
        <div className="form-links">
          <a href="/forgot-password">Forgot password?</a>
          <span>|</span>
          <a href="/register">Create account</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
