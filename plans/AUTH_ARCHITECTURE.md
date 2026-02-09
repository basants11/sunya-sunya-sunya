# Complete FREE Authentication System Architecture

## Executive Summary

This document outlines a comprehensive, 100% FREE authentication system for the Sunya Next.js website. The system supports dual authentication methods:

1. **Firebase Auth** (existing) - Google OAuth, Apple Sign-In, Phone OTP
2. **JWT-based Auth** (new) - Email/Password with MongoDB

---

## System Architecture Overview

```mermaid
flowchart TB
    subgraph Client["Next.js Client"]
        UI["Auth UI Components"]
        Context["Auth Context"]
        Hooks["Auth Hooks"]
    end

    subgraph API["Next.js API Routes"]
        AuthAPI["/api/auth/*"]
        Middleware["Auth Middleware"]
    end

    subgraph Services["External Services"]
        Firebase["Firebase Auth"]
        MongoDB["MongoDB"]
        GmailSMTP["Gmail SMTP"]
    end

    subgraph Security["Security Layer"]
        RateLimit["Rate Limiting"]
        CSRF["CSRF Protection"]
        JWT["JWT Verification"]
        bcrypt["bcrypt Hashing"]
    end

    UI --> Context
    Context --> Hooks
    Hooks --> AuthAPI
    AuthAPI --> Middleware
    Middleware --> JWT
    Middleware --> RateLimit
    AuthAPI --> Firebase
    AuthAPI --> MongoDB
    AuthAPI --> GmailSMTP
    AuthAPI --> bcrypt
```

---

## 1. Database Schema Design (MongoDB)

### User Collection

```typescript
// models/User.ts
interface IUser {
  // Primary identifiers
  _id: ObjectId;
  email: string; // Unique, indexed
  authProvider: "jwt" | "firebase"; // Track auth method
  firebaseUid?: string; // For Firebase-linked accounts

  // Profile data
  fullName: string;
  avatar?: string;

  // Email/password auth (JWT)
  passwordHash?: string; // bcrypt hash
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;

  // Password reset
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  // Security
  failedLoginAttempts: number;
  lockoutUntil?: Date;
  lastLoginAt?: Date;
  lastLoginIp?: string;

  // Subscription (existing fields preserved)
  role: "guest" | "subscriber" | "admin";
  subscriptionStatus: "none" | "active" | "cancelled" | "expired";
  subscriptionPlan?: string;
  subscriptionExpiresAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

### Verification Token Collection

```typescript
// models/VerificationToken.ts
interface IVerificationToken {
  _id: ObjectId;
  userId: ObjectId;
  token: string; // Hashed token
  type: "email" | "password_reset";
  expiresAt: Date;
  createdAt: Date;
}
```

### Login Attempt Collection (for rate limiting)

```typescript
// models/LoginAttempt.ts
interface ILoginAttempt {
  _id: ObjectId;
  identifier: string; // email or IP
  attempts: number;
  lastAttemptAt: Date;
  blockedUntil?: Date;
}
```

---

## 2. API Endpoint Design

### Authentication Endpoints

| Method | Endpoint                        | Description                   | Auth Required       |
| ------ | ------------------------------- | ----------------------------- | ------------------- |
| POST   | `/api/auth/register`            | Register with email/password  | No                  |
| POST   | `/api/auth/login`               | Login with email/password     | No                  |
| POST   | `/api/auth/logout`              | Logout and clear cookies      | Yes                 |
| POST   | `/api/auth/verify-email`        | Verify email with token       | No                  |
| POST   | `/api/auth/resend-verification` | Resend verification email     | No                  |
| POST   | `/api/auth/forgot-password`     | Request password reset        | No                  |
| POST   | `/api/auth/reset-password`      | Reset password with token     | No                  |
| POST   | `/api/auth/refresh`             | Refresh access token          | Yes (refresh token) |
| GET    | `/api/auth/me`                  | Get current user data         | Yes                 |
| POST   | `/api/auth/google`              | Google OAuth callback handler | No                  |

### Request/Response Schemas

#### POST /api/auth/register

```typescript
// Request
interface RegisterRequest {
  fullName: string; // Min 2 chars, max 100
  email: string; // Valid email format
  password: string; // Min 8 chars, complexity required
  confirmPassword: string; // Must match password
}

// Response (201 Created)
interface RegisterResponse {
  success: true;
  message: "Registration successful. Please verify your email.";
  user: {
    id: string;
    email: string;
    fullName: string;
    emailVerified: false;
  };
}

// Error Response (400/409/429)
interface RegisterError {
  success: false;
  error: string;
  fieldErrors?: {
    field: string;
    message: string;
  }[];
}
```

#### POST /api/auth/login

```typescript
// Request
interface LoginRequest {
  email: string;
  password: string;
}

// Response (200 OK)
interface LoginResponse {
  success: true;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    subscriptionStatus: string;
    emailVerified: boolean;
  };
}

// Error Response (401/403/429)
interface LoginError {
  success: false;
  error: string;
  lockoutMinutes?: number;
}
```

#### POST /api/auth/verify-email

```typescript
// Request
interface VerifyEmailRequest {
  token: string;
}

// Response (200 OK)
interface VerifyEmailResponse {
  success: true;
  message: "Email verified successfully";
}
```

---

## 3. Component Architecture

### File Organization

```
components/
├── auth/
│   ├── index.ts                    # Exports
│   ├── auth-modal.tsx              # Unified auth modal (refactored)
│   ├── email-login-form.tsx        # Email/password form
│   ├── email-register-form.tsx     # Registration form
│   ├── forgot-password-form.tsx    # Password reset request
│   ├── reset-password-form.tsx     # New password form
│   ├── verify-email-banner.tsx     # Email verification notice
│   ├── profile-button.tsx          # Existing (enhanced)
│   └── social-login-buttons.tsx    # Google OAuth button
├── providers.tsx                   # Auth providers wrapper
└── ui/                             # shadcn/ui components

lib/
├── auth/
│   ├── index.ts                    # Module exports
│   ├── types.ts                    # TypeScript interfaces
│   ├── context.tsx                 # React context (enhanced)
│   ├── jwt-client.ts               # JWT client utilities
│   └── hooks.ts                    # Custom auth hooks
├── db/
│   ├── index.ts                    # MongoDB connection
│   ├── models/
│   │   ├── User.ts                 # User model
│   │   ├── VerificationToken.ts    # Token model
│   │   └── LoginAttempt.ts         # Rate limiting model
│   └── utils.ts                    # DB utilities
├── email/
│   ├── index.ts                    # Email service
│   └── templates/
│       ├── verification.ts         # Verification email
│       └── password-reset.ts       # Reset email
├── middleware/
│   ├── auth.ts                     # API middleware
│   └── rate-limit.ts               # Rate limiting
├── security/
│   ├── csrf.ts                     # CSRF protection
│   ├── password.ts                 # Password validation
│   └── jwt.ts                      # JWT utilities
└── validation/
    └── auth.ts                     # Zod schemas

app/
├── api/
│   └── auth/
│       ├── register/route.ts
│       ├── login/route.ts
│       ├── logout/route.ts
│       ├── verify-email/route.ts
│       ├── resend-verification/route.ts
│       ├── forgot-password/route.ts
│       ├── reset-password/route.ts
│       ├── refresh/route.ts
│       ├── me/route.ts
│       └── google/route.ts
├── (protected)/
│   ├── vip/
│   │   └── page.tsx
│   └── subscription/
│       └── page.tsx
└── middleware.ts                   # Next.js middleware
```

### Component Hierarchy

```mermaid
flowchart TB
    subgraph AuthModal["AuthModal Component"]
        AM[Auth Modal Container]

        subgraph Tabs["Auth Tabs"]
            LoginTab[Login Tab]
            RegisterTab[Register Tab]
        end

        subgraph Forms["Form Components"]
            EmailForm[EmailLoginForm]
            RegForm[EmailRegisterForm]
            Social[SocialLoginButtons]
        end
    end

    subgraph Header["Header Integration"]
        PB[ProfileButton]
        VB[VerifyEmailBanner]
    end

    subgraph Context["Auth Context"]
        AC[AuthContext]
        JWT[JWT Client]
        FB[Firebase Auth]
    end

    AM --> Tabs
    LoginTab --> EmailForm
    LoginTab --> Social
    RegisterTab --> RegForm
    RegisterTab --> Social
    PB --> AC
    AC --> JWT
    AC --> FB
```

---

## 4. Security Implementation

### 4.1 JWT Token Strategy

```typescript
// Token Types
interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  type: "access" | "refresh";
}

// Token Configuration
const JWT_CONFIG = {
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET!,
    expiresIn: "15m", // Short-lived
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET!,
    expiresIn: "7d", // Long-lived
  },
};

// Cookie Configuration
const COOKIE_CONFIG = {
  accessToken: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: "/",
  },
  refreshToken: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/api/auth/refresh", // Only sent to refresh endpoint
  },
};
```

### 4.2 CSRF Protection

```typescript
// lib/security/csrf.ts
import { cookies } from "next/headers";

const CSRF_TOKEN_COOKIE = "csrf_token";
const CSRF_HEADER = "X-CSRF-Token";

export function generateCSRFToken(): string {
  return crypto.randomUUID();
}

export async function setCSRFToken() {
  const token = generateCSRFToken();
  const cookieStore = await cookies();
  cookieStore.set(CSRF_TOKEN_COOKIE, token, {
    httpOnly: false, // Must be accessible by JS
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  return token;
}

export async function validateCSRFToken(request: Request): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_TOKEN_COOKIE)?.value;
  const headerToken = request.headers.get(CSRF_HEADER);

  return cookieToken === headerToken && !!cookieToken;
}
```

### 4.3 Rate Limiting

```typescript
// lib/middleware/rate-limit.ts
import { LoginAttempt } from "@/lib/db/models/LoginAttempt";

const RATE_LIMIT = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 30 * 60 * 1000, // 30 minutes lockout
};

export async function checkRateLimit(identifier: string): Promise<{
  allowed: boolean;
  remainingAttempts: number;
  lockoutMinutes?: number;
}> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT.windowMs);

  let attempt = await LoginAttempt.findOne({ identifier });

  if (!attempt) {
    attempt = new LoginAttempt({ identifier, attempts: 0, lastAttemptAt: now });
  }

  // Reset if outside window
  if (attempt.lastAttemptAt < windowStart) {
    attempt.attempts = 0;
  }

  // Check if blocked
  if (attempt.blockedUntil && attempt.blockedUntil > now) {
    const lockoutMinutes = Math.ceil(
      (attempt.blockedUntil.getTime() - now.getTime()) / 60000,
    );
    return { allowed: false, remainingAttempts: 0, lockoutMinutes };
  }

  // Check attempt limit
  if (attempt.attempts >= RATE_LIMIT.maxAttempts) {
    attempt.blockedUntil = new Date(now.getTime() + RATE_LIMIT.blockDurationMs);
    await attempt.save();
    return { allowed: false, remainingAttempts: 0, lockoutMinutes: 30 };
  }

  return {
    allowed: true,
    remainingAttempts: RATE_LIMIT.maxAttempts - attempt.attempts,
  };
}

export async function recordFailedAttempt(identifier: string) {
  const now = new Date();
  await LoginAttempt.findOneAndUpdate(
    { identifier },
    {
      $inc: { attempts: 1 },
      $set: { lastAttemptAt: now },
    },
    { upsert: true },
  );
}
```

### 4.4 Password Security

```typescript
// lib/security/password.ts
import bcrypt from "bcryptjs";
import { z } from "zod";

const SALT_ROUNDS = 12;

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be less than 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

---

## 5. Email Verification Flow

### Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant API as API Route
    participant DB as MongoDB
    participant SMTP as Gmail SMTP

    U->>C: Fill registration form
    C->>API: POST /api/auth/register
    API->>API: Validate input (Zod)
    API->>API: Hash password (bcrypt)
    API->>API: Generate verification token
    API->>DB: Create user (emailVerified: false)
    API->>DB: Store verification token
    API->>SMTP: Send verification email
    SMTP-->>U: Email with verification link
    API-->>C: { success: true, message: "Check your email" }

    U->>C: Click verification link
    C->>API: POST /api/auth/verify-email { token }
    API->>DB: Find token & check expiry
    API->>DB: Update user (emailVerified: true)
    API->>DB: Delete used token
    API-->>C: { success: true }
    C-->>U: Redirect to login
```

### Email Template

```typescript
// lib/email/templates/verification.ts
export function generateVerificationEmail(
  fullName: string,
  verificationUrl: string,
): { subject: string; html: string; text: string } {
  return {
    subject: "Verify your email - Sunya",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Sunya, ${fullName}!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; padding: 12px 24px; background: #22c55e; 
                  color: white; text-decoration: none; border-radius: 6px;">
          Verify Email
        </a>
        <p style="color: #666; font-size: 14px;">
          This link expires in 24 hours. If you didn't create an account, please ignore this email.
        </p>
      </div>
    `,
    text: `Welcome to Sunya, ${fullName}!\n\nPlease verify your email by visiting: ${verificationUrl}\n\nThis link expires in 24 hours.`,
  };
}
```

---

## 6. Environment Variables

### Required Variables

```bash
# ============================================
# MongoDB Configuration
# ============================================
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sunya?retryWrites=true&w=majority

# ============================================
# JWT Secrets (Generate strong random strings)
# ============================================
# Use: openssl rand -base64 32
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# ============================================
# Gmail SMTP Configuration (FREE - 500/day)
# ============================================
# 1. Enable 2FA on Gmail account
# 2. Generate App Password at: myaccount.google.com/apppasswords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@sunya.com.np

# ============================================
# Google OAuth Configuration (FREE)
# ============================================
# Create at: console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ============================================
# Firebase Configuration (Existing)
# ============================================
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="your_private_key"

# ============================================
# Application Configuration
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 7. Third-Party Dependencies

### Required Packages

```bash
# Core dependencies
npm install mongoose bcryptjs jsonwebtoken nodemailer

# Validation
npm install zod @hookform/resolvers

# Types
npm install --save-dev @types/bcryptjs @types/jsonwebtoken @types/nodemailer
```

### Package Summary

| Package             | Version | Purpose                     |
| ------------------- | ------- | --------------------------- |
| mongoose            | ^8.x    | MongoDB ODM                 |
| bcryptjs            | ^2.x    | Password hashing            |
| jsonwebtoken        | ^9.x    | JWT signing/verification    |
| nodemailer          | ^6.x    | SMTP email sending          |
| zod                 | ^3.x    | Input validation            |
| @hookform/resolvers | ^3.x    | Form validation integration |

---

## 8. Protected Routes Middleware

### Next.js Middleware

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/security/jwt";

const PROTECTED_ROUTES = ["/vip", "/subscription"];
const AUTH_ROUTES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Get access token from cookie
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    // Redirect to login with return URL
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("auth", "login");
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  try {
    const payload = await verifyJWT(accessToken);

    // Check subscription for VIP routes
    if (pathname.startsWith("/vip") && payload.role !== "subscriber") {
      return NextResponse.redirect(new URL("/subscription", request.url));
    }

    // Add user info to headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-role", payload.role);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (error) {
    // Token invalid or expired
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("auth", "login");
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/vip/:path*", "/subscription/:path*"],
};
```

---

## 9. Implementation Roadmap

### Phase 1: Database & Infrastructure

- [ ] Set up MongoDB connection
- [ ] Create User, VerificationToken, LoginAttempt models
- [ ] Set up Gmail SMTP configuration
- [ ] Add environment variables

### Phase 2: Backend API

- [ ] Implement JWT utilities (sign, verify, refresh)
- [ ] Create /api/auth/register endpoint
- [ ] Create /api/auth/login endpoint
- [ ] Create /api/auth/verify-email endpoint
- [ ] Create /api/auth/resend-verification endpoint
- [ ] Create /api/auth/forgot-password endpoint
- [ ] Create /api/auth/reset-password endpoint
- [ ] Create /api/auth/refresh endpoint
- [ ] Create /api/auth/me endpoint
- [ ] Implement rate limiting middleware
- [ ] Implement CSRF protection

### Phase 3: Frontend Components

- [ ] Create unified AuthModal component
- [ ] Create EmailLoginForm component
- [ ] Create EmailRegisterForm component
- [ ] Create ForgotPasswordForm component
- [ ] Create ResetPasswordForm component
- [ ] Create VerifyEmailBanner component
- [ ] Enhance ProfileButton for JWT auth
- [ ] Update AuthContext to support both Firebase and JWT

### Phase 4: Integration & Security

- [ ] Implement Next.js middleware for protected routes
- [ ] Add password strength indicator
- [ ] Add form validation with Zod
- [ ] Add loading states and error handling
- [ ] Test all auth flows

### Phase 5: Testing & Polish

- [ ] Unit tests for API routes
- [ ] Integration tests for auth flows
- [ ] Security audit
- [ ] Documentation updates

---

## 10. Key Design Decisions

### 1. Dual Auth Strategy

- **Firebase**: Handles OAuth (Google, Apple) and Phone OTP
- **JWT/MongoDB**: Handles email/password with full control over data
- **Benefits**: Best of both worlds - easy OAuth + custom auth logic

### 2. Token Storage

- **Access Token**: httpOnly cookie (15 min expiry)
- **Refresh Token**: httpOnly cookie (7 day expiry, path-restricted)
- **CSRF Token**: JS-accessible cookie + header validation
- **Benefits**: XSS-resistant, automatic refresh, CSRF protection

### 3. Rate Limiting Strategy

- **Identifier**: Email or IP address
- **Window**: 15 minutes
- **Max Attempts**: 5
- **Lockout**: 30 minutes after exceeded
- **Benefits**: Prevents brute force while allowing legitimate retries

### 4. Email Service

- **Gmail SMTP**: 500 emails/day free, easy setup
- **Alternative**: Can upgrade to Resend/SendGrid later
- **Benefits**: Zero cost, reliable deliverability

---

## 11. Security Checklist

- [ ] All passwords hashed with bcrypt (12 rounds)
- [ ] JWT secrets are strong random strings
- [ ] httpOnly cookies for tokens
- [ ] CSRF protection on state-changing requests
- [ ] Rate limiting on login endpoints
- [ ] Input validation with Zod on all inputs
- [ ] Email verification required before login
- [ ] Secure password reset flow
- [ ] Account lockout after failed attempts
- [ ] HTTPS in production
- [ ] Security headers (HSTS, CSP, etc.)
- [ ] No sensitive data in JWT payload
- [ ] Tokens have short expiry
- [ ] Refresh token rotation

---

## 12. Cost Analysis (100% FREE)

| Service       | Free Tier      | Limitations                     |
| ------------- | -------------- | ------------------------------- |
| MongoDB Atlas | 512MB storage  | Shared cluster                  |
| Gmail SMTP    | 500 emails/day | Personal accounts only          |
| Google OAuth  | Unlimited      | Standard limits                 |
| JWT           | Free           | Self-implemented                |
| bcrypt        | Free           | Self-implemented                |
| Next.js       | Free           | Self-hosted or Vercel free tier |

**Total Monthly Cost: $0**

---

## Appendix: Quick Start Commands

```bash
# Install dependencies
npm install mongoose bcryptjs jsonwebtoken nodemailer zod
npm install --save-dev @types/bcryptjs @types/jsonwebtoken @types/nodemailer

# Generate JWT secrets
openssl rand -base64 32  # Access secret
openssl rand -base64 32  # Refresh secret

# Start development
npm run dev
```
