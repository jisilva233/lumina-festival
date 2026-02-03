/**
 * Registration Form Component
 * Lumina Festival
 */

import React, { useState } from 'react';
import { AuthService } from '../services/authService';
import { RegisterData } from '../types/auth';

interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Registration Form Component
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Validate form inputs
   */
  const validateForm = (): string | null => {
    const { email, password, confirmPassword, fullName } = formData;

    if (!email || !password || !confirmPassword || !fullName) {
      return 'All required fields must be filled';
    }

    if (!email.includes('@')) {
      return 'Please enter a valid email address';
    }

    if (password.length < 12) {
      return 'Password must be at least 12 characters';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    // Password strength check
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return 'Password must include uppercase, lowercase, numbers, and special characters (!@#$%^&*)';
    }

    if (!agreeTerms) {
      return 'You must agree to the terms and conditions';
    }

    return null;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validate
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      onError?.(validationError);
      return;
    }

    setLoading(true);

    try {
      const data: RegisterData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone || undefined,
      };

      const response = await AuthService.register(data);

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.user) {
        throw new Error('Registration failed: No user data returned');
      }

      // Success
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: '',
      });
      setAgreeTerms(false);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form-container">
      <div className="register-form">
        <h2>Create Lumina Festival Account</h2>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
              required
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
              autoComplete="email"
            />
          </div>

          {/* Phone (Optional) */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number (Optional)</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="+55 85 98765-4321"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              autoComplete="tel"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <div className="password-strength-info">
              <small>
                Minimum 12 characters, including uppercase, lowercase, numbers, and special characters (!@#$%^&*)
              </small>
            </div>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="••••••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
              autoComplete="new-password"
            />
          </div>

          {/* Terms Checkbox */}
          <div className="form-group checkbox">
            <input
              id="agreeTerms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              disabled={loading}
              required
            />
            <label htmlFor="agreeTerms">
              I agree to the{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms and Conditions
              </a>
              {' and '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Links */}
        <div className="form-links">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
