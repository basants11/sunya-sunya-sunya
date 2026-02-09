# Comprehensive Code Review Report

## Executive Summary

This report documents a thorough code review of the Sunya e-commerce application. The review covers security vulnerabilities, bugs, performance issues, code quality concerns, and CI/CD pipeline analysis. Multiple issues have been identified and categorized by severity with recommended fixes.

---

## 1. Critical Security Vulnerabilities

### 1.1 Hardcoded Sensitive Data in Watermark API

**File:** [`app/api/watermark/route.ts`](app/api/watermark/route.ts:10-14)

**Issue:** The watermark API contains hardcoded email and phone number:

```typescript
const payload = {
  email: "pokhrelbasant00@gmail.com", // ⚠️ HARDCODED SENSITIVE DATA
  phone: "+977-986-733-3080",          // ⚠️ HARDCODED SENSITIVE DATA
  sessionId: sessionId,
  timestamp: new Date().toISOString(),
};
```

**Severity:** 🔴 CRITICAL

**Root Cause:** Developer convenience during development was accidentally committed to production code.

**Impact:**
- Privacy violation of personal data
- Potential misuse of personal information
- Violation of data protection regulations

**Fix:**
```typescript
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    const sessionId = crypto.randomUUID();

    const payload = {
      email: session?.user?.email || "guest@example.com",
      phone: "", // Only include if user has provided phone
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
    };

    // Sign payload with HMAC-SHA256 for security
    const secret = process.env.WATERMARK_SECRET;
    const signature = secret
      ? crypto.createHmac("sha256", secret).update(JSON.stringify(payload)).digest("hex")
      : "demo-signature";

    return NextResponse.json({
      payload: JSON.stringify(payload),
      signature,
    });
  } catch (error) {
    console.error("Error generating watermark:", error);
    return NextResponse.json(
      { error: "Failed to generate watermark" },
      { status: 500 },
    );
  }
}
```

---

### 1.2 Missing Firebase Token Verification

**File:** [`app/api/subscription/create/route.ts`](app/api/subscription/create/route.ts:41-53)

**Issue:** The subscription creation endpoint has commented-out Firebase token verification:

```typescript
// Verify Firebase token (in production, use Firebase Admin SDK)
// const decodedToken = await getAuth().verifyIdToken(idToken);

// For now, do basic validation
if (idToken.length < 100) {  // ⚠️ WEAK VALIDATION
  return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
}
```

**Severity:** 🔴 CRITICAL

**Root Cause:** Incomplete implementation where security verification was disabled for development.

**Impact:**
- Anyone can create subscriptions without proper authentication
- Potential unauthorized access to paid features
- Revenue loss from fraudulent subscriptions

**Fix:**
```typescript
import { getAuth } from "firebase-admin/auth";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Authorization token required" },
        { status: 401 },
      );
    }

    const idToken = authHeader.split("Bearer ")[1];

    if (!idToken) {
      return NextResponse.json(
        { success: false, error: "Invalid authorization format" },
        { status: 401 },
      );
    }

    // Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(idToken);
    } catch (authError) {
      console.error("Firebase token verification failed:", authError);
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const body: SubscriptionActionRequest & { planName?: string } = await request.json();
    const { planId, planName } = body;

    if (!planId) {
      return NextResponse.json(
        { success: false, error: "Plan ID is required" },
        { status: 400 },
      );
    }

    // Get user from database using decodedToken.uid
    const user = await getUserByFirebaseUid(decodedToken.uid);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Check for existing active subscription
    const existingSubscription = await getActiveSubscription(user.id);
    if (existingSubscription) {
      return NextResponse.json(
        { success: false, error: "User already has an active subscription" },
        { status: 409 },
      );
    }

    // Create subscription record
    const subscription = await createSubscription({
      userId: user.id,
      planId,
      status: "pending_payment",
    });

    // Create payment session
    const paymentSession = await createPaymentSession({
      subscriptionId: subscription.id,
      planId,
      amount: getPlanAmount(planId),
      currency: "NPR",
    });

    return NextResponse.json({
      success: true,
      message: "Subscription initiated",
      subscriptionId: subscription.id,
      checkoutUrl: paymentSession.url,
      planId,
      planName: planName || planId,
      status: "pending_payment",
    });
  } catch (error) {
    console.error("Subscription creation error:", error);
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
```

---

### 1.3 Insecure Firestore Rules

**File:** [`firestore.rules`](firestore.rules:7)

**Issue:** Product collection allows write access to any authenticated user:

```javascript
match /products/{productId} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.uid == userId;  // ⚠️ WRONG FIELD NAME
}
```

**Severity:** 🟠 HIGH

**Root Cause:** The rule checks `userId` but Firestore documents use different field names.

**Impact:**
- Incorrect authorization logic
- Potential unauthorized writes if document structure differs
- Rule never evaluates to true as expected

**Fix:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - public read, admin-only write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == "admin";
    }

    // User data - only owner can read/write
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Cart data - only owner can access
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Orders - owner can read, admins can write
    match /orders/{orderId} {
      allow read: if request.auth != null && (request.auth.uid == resource.data.userId || request.auth.uid == resource.data.createdBy);
      allow create: if request.auth != null;
      allow update: if request.auth != null && (request.auth.uid == resource.data.userId || request.auth.uid == resource.data.createdBy);
    }
  }
}
```

---

### 1.4 Insecure Storage Rules

**File:** [`storage.rules`](storage.rules:7)

**Issue:** Product images allow write access without size validation and no content type validation:

```javascript
match /products/{productId}/{allPaths=**} {
  allow read: if true;
  allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024;  // ⚠️ MISSING CONTENT TYPE VALIDATION
}
```

**Severity:** 🟠 HIGH

**Root Cause:** Missing content type validation allows upload of potentially malicious files.

**Fix:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Product images - public read, admin-only write
    match /products/{productId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
        && request.auth.token.role == "admin"
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }

    // User avatars - only owner can access
    match /users/{userId}/avatar/{allPaths=**} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId
        && request.resource.size < 2 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }

    // User uploads - only owner can access
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 2. Authentication & Authorization Issues

### 2.1 JWT Secret Not Validated at Startup

**File:** [`lib/auth/jwt.ts`](lib/auth/jwt.ts:45-46)

**Issue:** JWT secrets are accessed with non-null assertion without runtime validation:

```typescript
const JWT_CONFIG = {
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET!,  // ⚠️ CRASHES IF NOT SET
    expiresIn: "15m",
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET!,  // ⚠️ CRASHES IF NOT SET
    expiresIn: "7d",
  },
};
```

**Severity:** 🟠 HIGH

**Root Cause:** Using TypeScript non-null assertion `!` without runtime validation.

**Impact:**
- Application crashes at runtime if environment variables are missing
- No early error detection during startup

**Fix:**
```typescript
// Validate required environment variables at module load time
function validateEnvVars() {
  const requiredVars = ["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];
  const missing = requiredVars.filter(v => !process.env[v]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

// Call validation immediately
try {
  validateEnvVars();
} catch (error) {
  console.error("Failed to start application:", error);
  process.exit(1);
}

const JWT_CONFIG = {
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET!,
    expiresIn: "15m",
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET!,
    expiresIn: "7d",
  },
} as const;
```

---

### 2.2 Missing CSRF Protection on Public Endpoints

**File:** [`app/api/auth/register/route.ts`](app/api/auth/register/route.ts)

**Issue:** The registration endpoint doesn't require CSRF protection but returns user data:

```typescript
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-CSRF-Token",
    },
  });
}
```

**Severity:** 🟡 MEDIUM

**Root Cause:** CSRF protection header is declared but not enforced on the POST handler.

**Fix:**
```typescript
import { validateCSRFTokenWithError, requiresCSRFProtection } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Check if CSRF protection is required
  if (requiresCSRFProtection("POST", "/api/auth/register")) {
    const csrfError = await validateCSRFTokenWithError(request);
    if (csrfError) {
      return csrfError;
    }
  }

  // ... rest of the handler
}
```

---

## 3. Code Quality Issues

### 3.1 TypeScript Non-Null Assertion Abuse

**Multiple Files**

**Issue:** Extensive use of TypeScript non-null assertion operator (`!`) without proper null checks.

**Examples:**
- [`app/account/page.tsx`](app/account/page.tsx:106): `user.fullName` - no null check before `.split()`
- [`lib/auth/jwt.ts`](lib/auth/jwt.ts:45): `process.env.JWT_ACCESS_SECRET!`
- [`components/cart-provider.tsx`](components/cart-provider.tsx:29): `useCart()` might return undefined

**Severity:** 🟡 MEDIUM

**Fix - Account Page Example:**
```typescript
// Get user initials for avatar fallback
const initials = user.fullName
  ?.split(" ")
  .map((n) => n[0])
  .join("")
  .toUpperCase()
  .slice(0, 2) || "??";
```

---

### 3.2 Incomplete Error Handling

**File:** [`app/api/auth/refresh/route.ts`](app/api/auth/refresh/route.ts:131-141)

**Issue:** Generic error handling that swallows detailed error information:

```typescript
} catch (error) {
  console.error("Token refresh error:", error);

  return NextResponse.json(
    {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    },
    { status: 500 },
  );
}
```

**Severity:** 🟡 MEDIUM

**Impact:**
- Difficult to debug production issues
- Potential information leakage through error messages
- Poor user experience with generic error messages

**Fix:**
```typescript
} catch (error) {
  console.error("Token refresh error:", error);

  // Log full error details server-side
  const errorId = crypto.randomUUID();
  console.error(`Error ID: ${errorId}`, {
    error: error instanceof Error ? error.message : "Unknown error",
    stack: error instanceof Error ? error.stack : undefined,
  });

  // Return sanitized error to client
  return NextResponse.json(
    {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
      errorId, // For support reference
    },
    { status: 500 },
  );
}
```

---

### 3.3 Missing Input Validation on Quantity Fields

**File:** [`components/ProductCard.tsx`](components/ProductCard.tsx:83-90)

**Issue:** No proper validation on the quantity input field:

```typescript
<Input
  type="number"
  min="1"
  value={quantity}
  onChange={(e) =>
    onQuantityChange(product.id, parseInt(e.target.value) || 1)  // ⚠️ No max validation
  }
  className="w-12 h-8 text-center text-sm"
/>
```

**Severity:** 🟡 MEDIUM

**Fix:**
```typescript
<Input
  type="number"
  min="1"
  max={99}
  value={quantity}
  onChange={(e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      onQuantityChange(product.id, 1);
    } else if (value > 99) {
      onQuantityChange(product.id, 99);
    } else {
      onQuantityChange(product.id, value);
    }
  }}
  className="w-12 h-8 text-center text-sm"
/>
```

---

### 3.4 Unused Dependencies

**File:** [`package.json`](package.json:72)

**Issue:** Some dependencies may be unused or have security vulnerabilities:

```json
"dependencies": {
  // ...
  "jsonwebtoken": "^9.0.2",  // ⚠️ Using jsonwebtoken alongside firebase-admin
  "bcryptjs": "^2.4.3",      // ⚠️ Might be redundant with Firebase Auth
  "nodemailer": "^6.10.0",   // ⚠️ Email sending setup unclear
}
```

**Severity:** 🟢 LOW

**Recommendation:** Audit and remove unused dependencies to reduce attack surface and bundle size.

---

## 4. Performance Issues

### 4.1 Unoptimized Image Loading

**File:** [`components/ProductCard.tsx`](components/ProductCard.tsx:38-42)

**Issue:** Using standard `<img>` tag instead of Next.js Image optimization:

```typescript
<img
  src={product.image || "/placeholder.svg"}
  alt={`${product.name} - Premium Dehydrated Fruit, Healthy Snack from Nepal`}
  className="h-full w-full object-cover object-center transition-transform duration-200 ease-out will-change-transform group-hover:scale-[1.02]"
/>
```

**Severity:** 🟠 HIGH

**Impact:**
- No automatic image optimization
- Larger bandwidth usage
- Poor Core Web Vitals scores
- No lazy loading by default

**Fix:**
```typescript
import Image from "next/image";

// ... in component
<Image
  src={product.image || "/placeholder.svg"}
  alt={`${product.name} - Premium Dehydrated Fruit, Healthy Snack from Nepal`}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="h-full w-full object-cover object-center transition-transform duration-200 ease-out will-change-transform group-hover:scale-[1.02]"
  placeholder="blur"
  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
/>
```

**Note:** Requires configuring `images` in `next.config.mjs` to allow external domains if needed.

---

### 4.2 Missing React.memo for Product Cards

**File:** [`components/ProductCard.tsx`](components/ProductCard.tsx:28-147)

**Issue:** ProductCard component re-renders unnecessarily when parent re-renders.

**Severity:** 🟡 MEDIUM

**Fix:**
```typescript
export function ProductCard({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
}: ProductCardProps) {
  // Component implementation
}

export const MemoizedProductCard = React.memo(ProductCard);
```

---

### 4.3 Synchronous State Updates in Cart Store

**File:** [`lib/cart/store.ts`](lib/cart/store.ts:65-74)

**Issue:** Dynamic import in save function may cause race conditions:

```typescript
this.saveFn = () => {
  if (typeof window !== 'undefined') {
    import('./persistence').then(({ saveCartState }) => {
      saveCartState(this.state);
    }).catch((error) => {
      console.error('Failed to save cart state:', error);
    });
  }
};
```

**Severity:** 🟡 MEDIUM

**Fix:**
```typescript
this.saveFn = () => {
  if (typeof window !== 'undefined') {
    // Use top-level await pattern with dynamic import
    (async () => {
      try {
        const { saveCartState } = await import('./persistence');
        saveCartState(this.state);
      } catch (error) {
        console.error('Failed to save cart state:', error);
      }
    })();
  }
};
```

---

## 5. CI/CD Pipeline Issues

### 5.1 Missing Test Step in GitHub Actions

**File:** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml:34-38)

**Issue:** The workflow runs lint but doesn't run tests:

```yaml
- name: Lint
  run: pnpm lint

- name: Build
  run: pnpm build
```

**Severity:** 🟡 MEDIUM

**Impact:**
- No automated test verification before deployment
- Risk of deploying broken code

**Fix:**
```yaml
- name: Lint
  run: pnpm lint

- name: Run Tests
  run: pnpm test

- name: Build
  run: pnpm build
```

---

### 5.2 Missing Cache Validation

**File:** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml:19-28)

**Issue:** Node.js setup uses pnpm cache but there's no verification that cache is being used correctly.

**Severity:** 🟢 LOW

**Fix:**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: "pnpm"
    cache-dependency-path: "pnpm-lock.yaml"
```

---

### 5.3 Missing Build Failure Notifications

**File:** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

**Issue:** No notification mechanism on build or deployment failures.

**Severity:** 🟢 LOW

**Fix:**
```yaml
- name: Deploy to Vercel (Production)
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    vercel-args: "--prod"

- name: Notify on Failure
  if: failure()
  uses: slackapi/slack-github-action@v1.25.0
  with:
    payload: |
      {
        "text": "🚨 Deployment Failed",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Deployment Failed*\nRepository: ${{ github.repository }}\nWorkflow: ${{ github.workflow }}\nURL: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 6. Additional Issues Found

### 6.1 Potential Memory Leak in Cart Store

**File:** [`lib/cart/store.ts`](lib/cart/store.ts:94-100)

**Issue:** Subscribers are removed but event listeners might accumulate:

```typescript
subscribe(listener: () => void): () => void {
  this.listeners.add(listener);
  return () => {
    this.listeners.delete(listener);  // ⚠️ What if listener was already removed?
  };
}
```

**Severity:** 🟢 LOW

**Fix:**
```typescript
subscribe(listener: () => void): () => void {
  this.listeners.add(listener);
  return () => {
    this.listeners.delete(listener);
  };
}
```

---

### 6.2 Missing Rate Limit Headers

**File:** [`app/api/auth/login/route.ts`](app/api/auth/login/route.ts:67-77)

**Issue:** Rate-limited responses don't include standard rate limit headers:

```typescript
return NextResponse.json(
  {
    success: false,
    error: rateLimitCheck.reason,
    lockoutMinutes: rateLimitCheck.lockoutMinutes,
    retryAfter: rateLimitCheck.lockoutMinutes
      ? rateLimitCheck.lockoutMinutes * 60
      : 1800,
  },
  { status: 429 },
);
```

**Severity:** 🟢 LOW

**Fix:**
```typescript
return NextResponse.json(
  {
    success: false,
    error: rateLimitCheck.reason,
    lockoutMinutes: rateLimitCheck.lockoutMinutes,
    retryAfter: rateLimitCheck.lockoutMinutes
      ? rateLimitCheck.lockoutMinutes * 60
      : 1800,
  },
  {
    status: 429,
    headers: {
      "Retry-After": rateLimitCheck.lockoutMinutes
        ? String(rateLimitCheck.lockoutMinutes * 60)
        : "1800",
      "X-RateLimit-Limit": "5",
      "X-RateLimit-Remaining": "0",
    },
  },
);
```

---

## 7. Recommendations

### 7.1 Security Hardening

1. **Implement Content Security Policy (CSP)**
   - Add CSP headers to `next.config.mjs`
   - Prevent XSS attacks

2. **Enable Database Auditing**
   - Enable Firestore audit logging
   - Monitor for unauthorized access

3. **Implement Proper Session Management**
   - Add session rotation on privilege change
   - Implement concurrent session limiting

### 7.2 Testing Improvements

1. **Add Unit Tests**
   - Test all authentication flows
   - Test cart operations
   - Test API endpoints

2. **Add Integration Tests**
   - Test complete user flows
   - Test checkout process

3. **Add E2E Tests**
   - Test critical paths
   - Use Playwright or Cypress

### 7.3 Monitoring & Observability

1. **Add Application Performance Monitoring**
   - Integrate Sentry or similar
   - Track error rates and performance

2. **Implement Health Checks**
   - Add `/api/health` endpoint
   - Monitor database connectivity

3. **Add Structured Logging**
   - Use JSON logging format
   - Include correlation IDs

### 7.4 Documentation Improvements

1. **API Documentation**
   - Add OpenAPI/Swagger documentation
   - Document authentication requirements

2. **Security Documentation**
   - Document security policies
   - Include incident response procedures

---

## 8. Summary of Critical Fixes Required

| Priority | Issue                                 | File                                   | Status    |
| -------- | ------------------------------------- | -------------------------------------- | --------- |
| P0       | Remove hardcoded sensitive data       | `app/api/watermark/route.ts`           | Needs Fix |
| P0       | Implement Firebase token verification | `app/api/subscription/create/route.ts` | Needs Fix |
| P1       | Fix Firestore security rules          | `firestore.rules`                      | Needs Fix |
| P1       | Fix Storage security rules            | `storage.rules`                        | Needs Fix |
| P1       | Add JWT environment validation        | `lib/auth/jwt.ts`                      | Needs Fix |
| P2       | Optimize image loading                | `components/ProductCard.tsx`           | Needs Fix |
| P2       | Add tests to CI/CD                    | `.github/workflows/deploy.yml`         | Needs Fix |
| P2       | Add input validation                  | `components/ProductCard.tsx`           | Needs Fix |

---

## 9. Verification Plan

After applying fixes:

1. **Security Testing**
   - Run OWASP ZAP scan
   - Verify Firestore rules with Firebase rules tester
   - Test authentication bypass scenarios

2. **Functional Testing**
   - Test all authentication flows
   - Test cart operations
   - Test checkout process
   - Test subscription creation

3. **Performance Testing**
   - Run Lighthouse audits
   - Test with WebPageTest
   - Verify Core Web Vitals scores

4. **CI/CD Verification**
   - Verify workflow runs successfully
   - Confirm tests run before deployment
   - Verify deployment completes

---

*Report Generated: 2024-01-31*
*Reviewer: AI Code Review System*
