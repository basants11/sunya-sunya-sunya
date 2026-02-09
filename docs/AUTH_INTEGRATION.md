# Authentication Integration Guide

Complete guide for integrating the authentication system into your Next.js application.

## Table of Contents

1. [Quick Start](#quick-start)
2. [How to Protect Routes](#how-to-protect-routes)
3. [How to Access User Data](#how-to-access-user-data)
4. [How to Use the Login Modal](#how-to-use-the-login-modal)
5. [API Endpoint Reference](#api-endpoint-reference)
6. [Common Use Cases](#common-use-cases)
7. [TypeScript Types](#typescript-types)

---

## Quick Start

The authentication system is already integrated into the application. Here's what's already set up:

```tsx
// app/layout.tsx - AuthProvider wraps the app
<Providers>
  <Header /> {/* Contains ProfileButton */}
  {children}
  <Footer />
</Providers>

// components/providers.tsx - AuthProvider is included
<AuthProvider>
  {children}
  <LoginModal /> {/* Modal for auth */}
  <Toaster />
</AuthProvider>
```

### Basic Usage

```tsx
"use client";

import { useAuth } from "@/contexts/auth-context";

export function MyComponent() {
  const { user, isAuthenticated, login, logout, openLoginModal } = useAuth();

  if (!isAuthenticated) {
    return <button onClick={openLoginModal}>Login</button>;
  }

  return (
    <div>
      <p>Welcome, {user?.fullName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## How to Protect Routes

### Option 1: Middleware (Recommended for Pages)

The [`middleware.ts`](middleware.ts:1) file already handles route protection:

```typescript
// middleware.ts
const PROTECTED_PATHS = [
  "/account",
  "/orders",
  "/wishlist",
  "/checkout",
  "/subscription/manage",
];
```

**How it works:**

- Unauthenticated users accessing protected routes are redirected to `/` with `?login=true`
- The login modal automatically opens when `?login=true` is present
- After login, users are redirected back to the original page

**To add a new protected route:**

```typescript
// middleware.ts
const PROTECTED_PATHS = [
  "/account",
  "/orders",
  "/wishlist",
  "/checkout",
  "/subscription/manage",
  "/my-new-protected-page", // Add your route
];
```

### Option 2: Client-Side Protection

For components that need to check auth status:

```tsx
"use client";

import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ProtectedComponent() {
  const { isAuthenticated, isLoading, openLoginModal } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openLoginModal({
        redirectTo: "/desired-page",
        onSuccess: () => {
          // Optional callback after successful login
          console.log("User logged in!");
        },
      });
    }
  }, [isAuthenticated, isLoading, openLoginModal]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to continue</div>;
  }

  return <div>Protected content here</div>;
}
```

### Option 3: Higher-Order Component

```tsx
// components/auth/with-auth.tsx
"use client";

import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { ComponentType } from "react";

export function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated, isLoading, openLoginModal } = useAuth();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        openLoginModal();
      }
    }, [isAuthenticated, isLoading, openLoginModal]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p>Please log in to access this page</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

// Usage
import { withAuth } from "@/components/auth/with-auth";

function MyProtectedPage() {
  return <div>Protected content</div>;
}

export default withAuth(MyProtectedPage);
```

---

## How to Access User Data

### Using the useAuth Hook

```tsx
"use client";

import { useAuth } from "@/contexts/auth-context";

export function UserProfile() {
  const {
    user, // User object or null
    isAuthenticated, // boolean
    isLoading, // boolean - true during initialization
    isInitialized, // boolean - true after auth check completes
    error, // AuthError | null
  } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.fullName}</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <p>Subscription: {user?.subscriptionStatus}</p>
    </div>
  );
}
```

### User Object Structure

```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: "guest" | "user" | "admin";
  subscriptionStatus: "none" | "active" | "cancelled" | "expired";
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Server-Side User Access

```tsx
// app/api/some-route/route.ts
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyAccessToken(accessToken);
    const userId = payload.userId;

    // Fetch user data or perform actions
    return Response.json({ userId });
  } catch {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
}
```

---

## How to Use the Login Modal

### Automatic Triggering

The login modal automatically opens when:

1. User clicks the [`ProfileButton`](components/auth/profile-button.tsx:1) in the header
2. User is redirected to `?login=true` URL parameter
3. You programmatically call `openLoginModal()`

### Programmatic Control

```tsx
"use client";

import { useAuth } from "@/contexts/auth-context";

export function MyComponent() {
  const { openLoginModal, closeLoginModal, isLoginModalOpen } = useAuth();

  const handleProtectedAction = () => {
    openLoginModal({
      // Redirect after successful login
      redirectTo: "/checkout",

      // Callback after successful login
      onSuccess: () => {
        console.log("User logged in successfully!");
        // Perform additional actions
      },
    });
  };

  return <button onClick={handleProtectedAction}>Proceed to Checkout</button>;
}
```

### Modal Options

```typescript
interface LoginModalOptions {
  redirectTo?: string; // Path to redirect after login
  onSuccess?: () => void; // Callback function after successful login
}
```

### Using in Forms

```tsx
"use client";

import { useAuth } from "@/contexts/auth-context";

export function SubscribeButton() {
  const { isAuthenticated, openLoginModal, user } = useAuth();

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      openLoginModal({
        redirectTo: "/subscription",
        onSuccess: () => {
          // After login, continue with subscription
          window.location.href = "/subscription";
        },
      });
      return;
    }

    // User is authenticated, proceed with subscription
    window.location.href = "/subscription";
  };

  return (
    <button onClick={handleSubscribe}>
      {isAuthenticated ? "Subscribe Now" : "Login to Subscribe"}
    </button>
  );
}
```

---

## API Endpoint Reference

### Authentication Endpoints

| Method | Endpoint                        | Description               | Auth Required       |
| ------ | ------------------------------- | ------------------------- | ------------------- |
| POST   | `/api/auth/register`            | Register new user         | No                  |
| POST   | `/api/auth/login`               | Login with email/password | No                  |
| POST   | `/api/auth/logout`              | Logout and clear cookies  | Yes                 |
| GET    | `/api/auth/me`                  | Get current user data     | Yes                 |
| POST   | `/api/auth/refresh`             | Refresh access token      | Yes (refresh token) |
| POST   | `/api/auth/google`              | Google OAuth callback     | No                  |
| POST   | `/api/auth/forgot-password`     | Request password reset    | No                  |
| POST   | `/api/auth/reset-password`      | Reset password with token | No                  |
| POST   | `/api/auth/verify-email`        | Verify email with token   | No                  |
| POST   | `/api/auth/resend-verification` | Resend verification email | No                  |

### Request/Response Examples

#### Register

```typescript
// POST /api/auth/register
const response = await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    fullName: "John Doe",
    email: "john@example.com",
    password: "SecurePass123!",
    confirmPassword: "SecurePass123!",
  }),
});

// Success Response (201)
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": "...",
    "email": "john@example.com",
    "fullName": "John Doe",
    "emailVerified": false
  }
}

// Error Response (400/409)
{
  "success": false,
  "error": "Email already registered",
  "fieldErrors": [
    { "field": "email", "message": "This email is already in use" }
  ]
}
```

#### Login

```typescript
// POST /api/auth/login
const response = await fetch("/api/auth/login", {
  method: "POST",
  credentials: "include", // Important for cookies
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "john@example.com",
    password: "SecurePass123!",
  }),
});

// Success Response (200)
{
  "success": true,
  "user": {
    "id": "...",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "user",
    "subscriptionStatus": "none",
    "emailVerified": true
  }
}

// Error Response (401)
{
  "success": false,
  "error": "Invalid credentials"
}
```

#### Get Current User

```typescript
// GET /api/auth/me
const response = await fetch("/api/auth/me", {
  credentials: "include",
});

// Success Response (200)
{
  "success": true,
  "user": {
    "id": "...",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "user",
    "subscriptionStatus": "active",
    "emailVerified": true
  }
}
```

#### Forgot Password

```typescript
// POST /api/auth/forgot-password
const response = await fetch("/api/auth/forgot-password", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "john@example.com",
  }),
});

// Success Response (200)
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### Reset Password

```typescript
// POST /api/auth/reset-password
const response = await fetch("/api/auth/reset-password", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    token: "reset-token-from-email",
    password: "NewSecurePass123!",
    confirmPassword: "NewSecurePass123!",
  }),
});

// Success Response (200)
{
  "success": true,
  "message": "Password reset successful"
}
```

#### Verify Email

```typescript
// POST /api/auth/verify-email
const response = await fetch("/api/auth/verify-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    token: "verification-token-from-email",
  }),
});

// Success Response (200)
{
  "success": true,
  "message": "Email verified successfully",
  "user": { /* user data */ }
}
```

#### Google OAuth

```typescript
// POST /api/auth/google
const response = await fetch("/api/auth/google", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    code: "google-auth-code",
  }),
});

// Success Response (200)
{
  "success": true,
  "user": { /* user data */ }
}
```

---

## Common Use Cases

### Use Case 1: Add to Cart with Auth Check

```tsx
"use client";

import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/lib/cart/use-cart";

export function AddToCartButton({ productId }: { productId: number }) {
  const { isAuthenticated, openLoginModal } = useAuth();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      openLoginModal({
        onSuccess: () => {
          // Add to cart after login
          addItem(productId);
        },
      });
      return;
    }

    addItem(productId);
  };

  return <button onClick={handleAddToCart}>Add to Cart</button>;
}
```

### Use Case 2: Show User Avatar in Header

```tsx
"use client";

import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  const initials = user?.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Avatar>
      <AvatarImage src={user?.avatar} alt={user?.fullName} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
```

### Use Case 3: Conditional Navigation Based on Role

```tsx
"use client";

import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

export function Navigation() {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/products">Products</Link>

      {isAuthenticated && (
        <>
          <Link href="/account">My Account</Link>
          <Link href="/orders">Orders</Link>
        </>
      )}

      {user?.role === "admin" && <Link href="/admin">Admin Panel</Link>}

      {user?.subscriptionStatus === "active" && (
        <Link href="/vip">VIP Area</Link>
      )}
    </nav>
  );
}
```

### Use Case 4: Form Submission with Auth

```tsx
"use client";

import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";

export function ReviewForm({ productId }: { productId: number }) {
  const { isAuthenticated, openLoginModal, user } = useAuth();
  const [review, setReview] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      openLoginModal({
        onSuccess: () => {
          // Retry submission after login
          submitReview();
        },
      });
      return;
    }

    await submitReview();
  };

  const submitReview = async () => {
    const response = await fetch("/api/reviews", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        review,
        userId: user?.id,
      }),
    });

    if (response.ok) {
      setReview("");
      alert("Review submitted!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder={
          isAuthenticated ? "Write a review..." : "Login to write a review"
        }
      />
      <button type="submit">
        {isAuthenticated ? "Submit Review" : "Login to Review"}
      </button>
    </form>
  );
}
```

### Use Case 5: Show Email Verification Banner

```tsx
"use client";

import { useAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function EmailVerificationBanner() {
  const { user, isAuthenticated, resendVerification } = useAuth();

  if (!isAuthenticated || user?.emailVerified) {
    return null;
  }

  const handleResend = async () => {
    try {
      await resendVerification(user!.email);
    } catch (error) {
      console.error("Failed to resend:", error);
    }
  };

  return (
    <Alert variant="warning">
      <AlertTitle>Email Not Verified</AlertTitle>
      <AlertDescription>
        Please verify your email to access all features.
        <Button variant="outline" size="sm" onClick={handleResend}>
          Resend Email
        </Button>
      </AlertDescription>
    </Alert>
  );
}
```

---

## TypeScript Types

### Import Types from Auth Context

```typescript
import {
  User,
  UserRole,
  SubscriptionStatus,
  AuthError,
  LoginCredentials,
  RegisterData,
  AuthState,
  AuthContextValue,
  LoginModalOptions,
} from "@/contexts/auth-context";
```

### Using Types in Components

```typescript
"use client";

import { User, useAuth } from "@/contexts/auth-context";

interface UserCardProps {
  user: User;
  showEmail?: boolean;
}

export function UserCard({ user, showEmail = true }: UserCardProps) {
  return (
    <div>
      <h3>{user.fullName}</h3>
      {showEmail && <p>{user.email}</p>}
      <span>{user.role}</span>
    </div>
  );
}

// Using in a component
export function UserList() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return <UserCard user={user} />;
}
```

### Custom Hook with Auth

```typescript
// hooks/use-require-auth.ts
"use client";

import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";

export function useRequireAuth(redirectTo?: string) {
  const { isAuthenticated, isLoading, openLoginModal } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openLoginModal({ redirectTo });
    }
  }, [isAuthenticated, isLoading, openLoginModal, redirectTo]);

  return { isAuthenticated, isLoading };
}

// Usage
export function ProtectedFeature() {
  const { isAuthenticated, isLoading } = useRequireAuth("/protected-page");

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return <div>Protected feature</div>;
}
```

---

## Error Handling

### Handling Auth Errors

```tsx
"use client";

import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";

export function LoginForm() {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({ email, password });
    } catch (error) {
      // Error is already set in context
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-500">{error.message}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Best Practices

1. **Always use `credentials: "include"`** when making API calls to auth endpoints
2. **Check `isLoading`** before checking `isAuthenticated` to avoid flash of unauthenticated content
3. **Use `openLoginModal`** instead of redirecting to a login page for better UX
4. **Handle errors gracefully** with try-catch blocks and user-friendly messages
5. **Use TypeScript** to catch type errors early
6. **Test auth flows** thoroughly, especially edge cases like token expiration

---

**Last Updated**: 2026-01-29  
**Version**: 1.0.0
