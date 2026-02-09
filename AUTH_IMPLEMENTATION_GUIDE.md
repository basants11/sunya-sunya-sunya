# Authentication & Subscription System Implementation Guide

## Overview

This implementation adds a complete authentication and subscription system to the Sunya website using Firebase Authentication.

## Features Implemented

### 1. Profile Button (Top-Right Corner)

- **Location**: [`components/auth/profile-button.tsx`](components/auth/profile-button.tsx)
- **Behavior**:
  - Shows user avatar/initials when logged in
  - Shows generic user icon when logged out
  - Click opens dropdown menu (logged in) or login modal (logged out)
  - Displays subscription status badge for active subscribers

### 2. Login Modal

- **Location**: [`components/auth/login-modal.tsx`](components/auth/login-modal.tsx)
- **Authentication Methods**:
  - Google Sign-In (OAuth)
  - Apple Sign-In (OAuth)
  - Phone OTP (Nepal format: +977)
- **Features**:
  - Smooth animations using Framer Motion
  - Multi-step phone verification flow
  - Trust indicators (secure login, encrypted)
  - Error handling with toast notifications

### 3. Auth Context & State Management

- **Location**: [`lib/auth/context.tsx`](lib/auth/context.tsx)
- **Features**:
  - Firebase auth state listener
  - Automatic token refresh
  - Backend user data synchronization
  - Modal state management
  - Phone verification state management

### 4. Subscription Integration

- **Location**: [`components/subscription/subscribe-button.tsx`](components/subscription/subscribe-button.tsx)
- **Features**:
  - Auth-guarded subscription flow
  - Automatic login modal trigger for non-authenticated users
  - Post-login subscription continuation
  - Backend token verification before processing

### 5. Backend Security

- **Token Verification**: [`app/api/auth/verify/route.ts`](app/api/auth/verify/route.ts)
- **Subscription API**: [`app/api/subscription/create/route.ts`](app/api/subscription/create/route.ts)
- **Middleware**: [`lib/middleware/auth.ts`](lib/middleware/auth.ts)
- **Features**:
  - Firebase ID token verification
  - Protected API routes
  - Subscription access control
  - Admin route protection

## File Structure

```
lib/
├── auth/
│   ├── types.ts          # TypeScript interfaces
│   ├── context.tsx       # Auth provider & hooks
│   └── index.ts          # Module exports
├── firebase/
│   └── config.ts         # Firebase initialization
└── middleware/
    └── auth.ts           # API route protection

components/
├── auth/
│   ├── profile-button.tsx    # Profile icon & dropdown
│   ├── login-modal.tsx       # Login UI
│   └── index.ts              # Module exports
└── subscription/
    └── subscribe-button.tsx  # Subscription CTA

app/
└── api/
    ├── auth/
    │   └── verify/
    │       └── route.ts      # Token verification endpoint
    └── subscription/
        └── create/
            └── route.ts      # Subscription creation endpoint
```

## Environment Variables

Create a `.env.local` file with your Firebase configuration:

```bash
# Firebase Client SDK (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Private - Server Only)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="your_private_key"
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install firebase
```

### 2. Configure Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Enable Authentication:
   - Google Sign-In
   - Apple Sign-In (requires Apple Developer account)
   - Phone Authentication
4. Add web app to get configuration
5. Copy config to `.env.local`

### 3. Enable Firebase Admin SDK (Backend)

1. Go to Project Settings > Service Accounts
2. Generate new private key
3. Copy credentials to `.env.local`

### 4. Update Security Rules

```javascript
// Firestore rules (if using Firestore for user data)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Usage Examples

### Using Auth Hook

```tsx
import { useAuth } from "@/lib/auth";

function MyComponent() {
  const { user, isAuthenticated, isLoading, openLoginModal, logout } =
    useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.displayName}</p>
      ) : (
        <button onClick={() => openLoginModal()}>Login</button>
      )}
    </div>
  );
}
```

### Protected Subscription Button

```tsx
import { SubscribeButton } from "@/components/subscription/subscribe-button";

function PricingPage() {
  return (
    <SubscribeButton
      planId="premium"
      planName="Premium Plan"
      variant="primary"
      size="lg"
      fullWidth
    />
  );
}
```

### Using Subscription Access Hook

```tsx
import { useSubscriptionAccess } from "@/components/subscription/subscribe-button";

function PremiumContent() {
  const { canAccess, requireAuth, subscriptionStatus } =
    useSubscriptionAccess();

  const handleAccess = () => {
    if (
      !requireAuth(() => {
        // Callback after successful login
        console.log("User logged in, continue to premium content");
      })
    ) {
      return; // Login modal was shown
    }

    // User is authenticated, check subscription
    if (!canAccess("premium").canAccess) {
      alert("Please subscribe to access this feature");
      return;
    }

    // Access granted
  };

  return <button onClick={handleAccess}>Access Premium</button>;
}
```

## Security Considerations

1. **Never Trust Frontend Auth State**: Always verify tokens on backend
2. **Use HTTPS**: Firebase requires HTTPS for OAuth redirects
3. **Token Expiration**: Tokens auto-refresh, but verify on each API call
4. **Phone OTP**: Rate limited by Firebase (default: 5 attempts per hour)
5. **Environment Variables**: Never commit `.env.local` to git

## Mobile Responsiveness

- Profile button adapts to all screen sizes
- Login modal is centered and responsive
- Touch-friendly tap targets (min 44px)
- Dropdown closes on outside click

## Testing

### Manual Testing Checklist

- [ ] Profile button shows login modal when not authenticated
- [ ] Profile dropdown shows when authenticated
- [ ] Google login works
- [ ] Apple login works (requires Apple Developer account)
- [ ] Phone OTP flow works
- [ ] Subscribe button triggers login when not authenticated
- [ ] Subscribe button proceeds when authenticated
- [ ] Logout clears auth state
- [ ] Token refresh works automatically

### API Testing

```bash
# Test auth verification
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"idToken": "your_firebase_id_token"}'

# Test subscription creation (requires valid token)
curl -X POST http://localhost:3000/api/subscription/create \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{"planId": "premium", "planName": "Premium Plan"}'
```

## Next Steps

1. **Database Integration**: Connect to your database to store user subscriptions
2. **Payment Gateway**: Integrate with Khalti, eSewa, or Stripe
3. **Email Verification**: Add email verification for email/password users
4. **Password Reset**: Implement forgot password flow
5. **Social Providers**: Add more OAuth providers (Facebook, Twitter)

## Troubleshooting

### Common Issues

**Firebase not initialized**

- Check environment variables are set correctly
- Ensure `.env.local` is in project root

**Module not found errors**

- Run `npm install` to install Firebase
- Check import paths match file structure

**Phone OTP not working**

- Verify Phone Authentication is enabled in Firebase Console
- Check reCAPTCHA configuration
- Test with real phone number (not emulator)

**Apple Sign-In fails**

- Requires Apple Developer account
- Must configure Apple Developer Portal
- Add return URLs in Firebase Console

## Support

For Firebase-specific issues, refer to:

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

For implementation-specific questions, check the code comments in each file.
