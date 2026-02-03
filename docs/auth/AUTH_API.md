# Authentication API Documentation

**API Version:** 1.0.0
**Last Updated:** 2025-01-31
**Status:** Complete

---

## Overview

Complete authentication system using Supabase Auth with JWT tokens. Supports registration, login, logout, password reset, and session management.

---

## Authentication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ├──> Register (email + password)
       │    └──> Supabase Auth
       │         └──> Create user profile (trigger)
       │
       ├──> Login (email + password)
       │    └──> Supabase Auth returns JWT
       │         └──> Store tokens (localStorage)
       │
       ├──> API Request (include JWT)
       │    └──> Validate JWT middleware
       │         └──> Protected resource
       │
       └──> Token Expiry
            └──> Refresh token
                 └──> Get new access token
```

---

## Endpoints

### 1. Register (Sign Up)

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!@#",
  "fullName": "John Doe",
  "phone": "+5585987654321" // Optional
}
```

**Password Requirements:**
- Minimum 12 characters
- Must include uppercase letters (A-Z)
- Must include lowercase letters (a-z)
- Must include numbers (0-9)
- Must include special characters (!@#$%^&*)

**Success Response (201):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+5585987654321",
    "is_active": true,
    "is_admin": false,
    "created_at": "2025-01-31T12:00:00Z",
    "updated_at": "2025-01-31T12:00:00Z"
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

**Error Response (400/422):**
```json
{
  "error": {
    "code": "validation_error",
    "message": "Email already registered"
  }
}
```

**Errors:**
- `400` - Invalid input (missing/invalid fields)
- `422` - Validation failed (weak password, invalid email)
- `409` - Email already registered
- `500` - Server error

---

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!@#"
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_active": true,
    "is_admin": false,
    "created_at": "2025-01-31T12:00:00Z",
    "updated_at": "2025-01-31T12:00:00Z"
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

**Error Response (401):**
```json
{
  "error": {
    "code": "invalid_credentials",
    "message": "Invalid email or password"
  }
}
```

**Errors:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `429` - Too many login attempts (rate limited)
- `500` - Server error

---

### 3. Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Error Response (401):**
```json
{
  "error": {
    "code": "unauthorized",
    "message": "Invalid or missing token"
  }
}
```

**Errors:**
- `401` - Invalid/missing token
- `500` - Server error

---

### 4. Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Request Body:**
```json
{
  "refresh_token": "refresh-token-string"
}
```

**Success Response (200):**
```json
{
  "access_token": "new-jwt-token",
  "refresh_token": "new-refresh-token",
  "token_type": "bearer",
  "expires_in": 3600
}
```

**Error Response (401):**
```json
{
  "error": {
    "code": "invalid_refresh_token",
    "message": "Refresh token is invalid or expired"
  }
}
```

**Errors:**
- `401` - Invalid/expired refresh token
- `500` - Server error

---

### 5. Password Reset Request

**Endpoint:** `POST /api/auth/password-reset`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset email sent",
  "email": "user@example.com"
}
```

**Note:** Response is the same whether email exists or not (security best practice)

---

### 6. Password Reset Confirm

**Endpoint:** `POST /api/auth/password-reset/confirm`

**Request Body:**
```json
{
  "email": "user@example.com",
  "token": "reset-token-from-email",
  "password": "NewPass123!@#"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

**Error Response (400/401):**
```json
{
  "error": {
    "code": "invalid_token",
    "message": "Reset token is invalid or expired"
  }
}
```

**Errors:**
- `400` - Invalid input
- `401` - Invalid/expired token
- `422` - Weak password
- `500` - Server error

---

### 7. Get User Profile

**Endpoint:** `GET /api/auth/profile`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone": "+5585987654321",
  "avatar_url": "https://...",
  "bio": "User bio",
  "is_active": true,
  "is_admin": false,
  "created_at": "2025-01-31T12:00:00Z",
  "updated_at": "2025-01-31T12:00:00Z"
}
```

**Error Response (401):**
```json
{
  "error": {
    "code": "unauthorized",
    "message": "Invalid or missing token"
  }
}
```

---

### 8. Update Profile

**Endpoint:** `PUT /api/auth/profile`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "full_name": "Jane Doe",
  "phone": "+5585987654321",
  "avatar_url": "https://example.com/avatar.jpg",
  "bio": "Updated bio"
}
```

**Success Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "full_name": "Jane Doe",
    "phone": "+5585987654321",
    "avatar_url": "https://example.com/avatar.jpg",
    "bio": "Updated bio",
    "updated_at": "2025-01-31T12:30:00Z"
  }
}
```

**Errors:**
- `400` - Invalid input
- `401` - Unauthorized
- `422` - Validation error
- `500` - Server error

---

## JWT Token Format

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "iss": "https://supabase-project.supabase.co",
  "aud": "authenticated",
  "iat": 1675000000,
  "exp": 1675003600,
  "session_id": "session-uuid"
}
```

**Signature:**
```
HMAC-SHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

---

## Token Management

### Access Token
- **Validity:** 1 hour (3600 seconds)
- **Usage:** Include in `Authorization: Bearer` header
- **Refresh:** Use refresh token when expired

### Refresh Token
- **Validity:** 30 days
- **Usage:** Use to obtain new access token
- **Storage:** Secure HTTP-only cookie (preferred) or secure localStorage

---

## Security Best Practices

### Client-Side
1. **Never log tokens** - Don't include tokens in console logs
2. **Secure storage** - Use HTTP-only cookies or secure storage
3. **HTTPS only** - Always use HTTPS in production
4. **Clear on logout** - Clear all tokens and session data

### Server-Side
1. **Verify JWT** - Always verify token signature and expiry
2. **Rate limiting** - Limit login/password reset attempts
3. **HTTPS enforced** - Use HTTPS for all auth endpoints
4. **CORS configured** - Whitelist allowed origins
5. **Audit logging** - Log all auth events

### Password Policy
1. **Minimum length:** 12 characters
2. **Complexity:** Mix of uppercase, lowercase, numbers, special chars
3. **No reuse:** Don't allow reusing recent passwords
4. **Regular updates:** Encourage password changes periodically

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `validation_error` | 400 | Invalid input format |
| `invalid_credentials` | 401 | Wrong email/password |
| `unauthorized` | 401 | Missing/invalid token |
| `insufficient_permissions` | 403 | User doesn't have required role |
| `not_found` | 404 | User/resource not found |
| `conflict` | 409 | Email already registered |
| `rate_limited` | 429 | Too many requests |
| `server_error` | 500 | Internal server error |

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/login` | 5 attempts | 15 minutes |
| `/api/auth/register` | 10 attempts | 1 hour |
| `/api/auth/password-reset` | 3 attempts | 1 hour |
| `/api/auth/refresh` | 10 attempts | 1 hour |

---

## Example Usage

### JavaScript/TypeScript
```typescript
import { AuthService } from '../services/authService';

// Register
const registerResult = await AuthService.register({
  email: 'user@example.com',
  password: 'SecurePass123!@#',
  fullName: 'John Doe'
});

// Login
const loginResult = await AuthService.login({
  email: 'user@example.com',
  password: 'SecurePass123!@#'
});

// Logout
await AuthService.logout();

// Refresh token
const newSession = await AuthService.refreshToken();
```

### CURL
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!@#",
    "fullName": "John Doe"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!@#"
  }'

# Protected request
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <access_token>"
```

---

## Troubleshooting

### "Invalid credentials" on login
- Verify email spelling
- Check password (case-sensitive)
- Confirm user is registered

### "Token expired" errors
- Call refresh endpoint to get new token
- Automatic refresh implemented in middleware

### "Too many attempts" (rate limited)
- Wait for rate limit window to reset
- Default: 15 minutes for login

---

## Related Documentation

- [Database Schema](../database/SCHEMA.md)
- [Auth Middleware](../../src/middleware/auth.ts)
- [Auth Service](../../src/services/authService.ts)
- [Components](../../src/components/)

---

**Last Updated:** 2025-01-31
**Status:** COMPLETE
