# SUNYA Project - Complete Reverse-Engineering Prompt

**Project Type:** Next.js 16 E-Commerce Application
**Framework:** Next.js 16 with App Router (React 19)
**Language:** TypeScript
**Styling:** Tailwind CSS 4.x with custom luxury color palette
**Authentication:** Firebase Auth + Custom JWT + Supabase
**Database:** MongoDB with Mongoose
**Deployment:** Firebase Hosting + Vercel compatible

---

## 1. Project Structure

```
sunya/
├── .editorconfig                    # Editor configuration
├── .eslintrc.js                     # ESLint configuration
├── .prettierrc                      # Prettier configuration
├── .nvmrc                           # Node version (specify version)
├── next.config.mjs                  # Next.js configuration
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.mjs               # PostCSS configuration
├── vitest.config.ts                 # Vitest testing configuration
├── vitest.setup.ts                  # Vitest setup file
├── firebase.json                    # Firebase hosting configuration
├── firestore.rules                  # Firestore security rules
├── firestore.indexes.json           # Firestore indexes
├── storage.rules                    # Firebase storage rules
├── vercel.json                      # Vercel deployment config
├── .env.local                       # Environment variables (local)
├── .env.example                     # Environment variables template
├── service-account.json             # Firebase admin service account
├── proxy.ts                         # Proxy configuration
│
├── app/                             # Next.js App Router
│   ├── layout.tsx                   # Root layout with providers
│   ├── global-error.tsx             # Global error boundary
│   ├── error.tsx                    # Error page
│   ├── not-found.tsx                # 404 page
│   ├── page.tsx                     # Home page
│   ├── globals.css                  # Global styles
│   ├── robots.txt/route.ts          # Robots.txt handler
│   ├── sitemap.xml/route.ts         # Sitemap handler
│   │
│   ├── about/                       # About page
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── account/                     # User account
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   └── page.tsx
│   │
│   ├── api/                         # API routes
│   │   ├── auth/                    # Authentication endpoints
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── me/route.ts
│   │   │   ├── refresh/route.ts
│   │   │   ├── forgot-password/route.ts
│   │   │   ├── reset-password/route.ts
│   │   │   ├── verify/route.ts
│   │   │   ├── verify-email/route.ts
│   │   │   ├── resend-verification/route.ts
│   │   │   └── google/route.ts
│   │   │
│   │   ├── subscription/
│   │   │   └── create/route.ts
│   │   │
│   │   ├── cravings-care-cycle/route.ts
│   │   ├── watermark/route.ts
│   │   └── watermark/log/route.ts
│   │
│   ├── checkout/                    # Checkout flow
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── page.tsx
│   │   ├── checkout-page-wrapper.tsx
│   │   └── result/
│   │       ├── loading.tsx
│   │       ├── page.tsx
│   │       └── ResultClient.tsx
│   │
│   ├── contact/                     # Contact page
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── contact-page-wrapper.tsx
│   │   └── contact-page-client.tsx
│   │
│   ├── cravings-care-cycle/         # Cravings Care Cycle feature
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── page.tsx
│   │   └── cravings-care-cycle-wrapper.tsx
│   │
│   ├── dehydrated-fruits/           # Products page
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── faq/                         # FAQ page
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── gifting/                     # Gifting page
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── gifting-client.tsx
│   │
│   ├── health-quiz/                 # Health quiz
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── health-quiz-client.tsx
│   │
│   ├── nutrition/                   # Nutrition page
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── nutrition-search/            # Nutrition search demo
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── nutrition-search-demo-client.tsx
│   │
│   ├── privacy-policy/              # Privacy policy
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── products/                    # Products listing
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── products-client.tsx
│   │   └── products-client.test.tsx
│   │
│   ├── reset-password/              # Password reset
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── reset-password-form.tsx
│   │
│   ├── retailer/                    # Retailer page
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── reviews/                     # Reviews page
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── subscription/                # Subscription page
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── subscription-client.tsx
│   │
│   ├── terms-and-conditions/        # Terms page
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── verify-email/                # Email verification
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── verify-email-form.tsx
│   │
│   ├── vip/                         # VIP page
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── vip-client.tsx
│   │
│   └── why-us/                      # Why us page
│       ├── layout.tsx
│       └── page.tsx
│
├── components/                      # React components
│   ├── providers.tsx                # App providers wrapper
│   ├── footer.tsx                   # Footer component
│   ├── header.tsx                   # Header component
│   │
│   ├── animated-cart-icon.tsx       # Animated cart icon
│   ├── animated-add-to-cart-button.tsx
│   ├── animated-cta.tsx             # Animated CTA button
│   │
│   ├── cart-drawer.tsx              # Cart slide-out drawer
│   ├── cart-dropdown.tsx            # Cart dropdown
│   ├── cart-item-display.tsx        # Cart item display
│   ├── cart-notification.tsx        # Cart notifications
│   ├── cart-provider.tsx            # Cart state provider
│   ├── cart-toast.tsx               # Cart toast messages
│   │
│   ├── checkout-button.tsx          # Checkout button
│   ├── checkout-modal.tsx           # Checkout modal
│   │
│   ├── CravingsCareCycleModal.tsx   # Cravings care cycle modal
│   ├── CravingsCareCycleSection.tsx # Cravings care cycle section
│   │
│   ├── authority-trust.tsx          # Trust signals
│   ├── benefits.tsx                 # Benefits section
│   │
│   ├── comparison-table.tsx         # Product comparison
│   ├── commitment-escalation.tsx    # Commitment escalation
│   ├── cognitive-load-manipulator.tsx
│   ├── color-psychology.tsx         # Color psychology section
│   ├── conversion-optimizer.tsx     # Conversion optimization
│   │
│   ├── daily-package-subscription.tsx
│   ├── dopamine-engine.tsx          # Gamification engine
│   │
│   ├── enhanced-cart-section.tsx    # Enhanced cart section
│   ├── enhanced-nutrition-panel.tsx # Nutrition panel
│   ├── enhanced-product-card.tsx    # Enhanced product card
│   │
│   ├── EnhancedCalendarPicker.tsx   # Calendar date picker
│   │
│   ├── friction-reducer.tsx         # Friction reduction
│   │
│   ├── gamification.tsx             # Gamification features
│   │
│   ├── GiftBoxCard.tsx              # Gift box card
│   ├── GiftImage.tsx                # Gift image component
│   │
│   ├── DynamicWatermark.tsx         # Dynamic watermark
│   │
│   └── auth/                        # Authentication components
│       ├── login-modal.tsx
│       ├── profile-button.tsx
│       └── ...
│
├── contexts/                        # React contexts
│   └── auth-context.tsx             # Auth context provider
│
├── hooks/                           # Custom React hooks
│   └── use-currency.ts              # Currency hook
│
├── lib/                             # Core libraries
│   ├── firebase.ts                  # Firebase client config
│   ├── supabase.ts                  # Supabase client
│   ├── db.ts                        # MongoDB connection
│   ├── utils.ts                     # Utility functions
│   ├── currency.ts                  # Currency utilities
│   │
│   ├── auth/                        # Authentication module
│   │   ├── index.ts                 # Main exports
│   │   ├── types.ts                 # Auth types
│   │   ├── client.ts                # Client-side auth
│   │   ├── context.tsx              # Auth context
│   │   ├── csrf.ts                  # CSRF protection
│   │   ├── email.ts                 # Email sending
│   │   ├── jwt.ts                   # JWT utilities
│   │   ├── password.ts              # Password handling
│   │   ├── rate-limit.ts            # Rate limiting
│   │   └── validation.ts            # Input validation
│   │
│   ├── cart/                        # Cart module
│   │   ├── index.ts
│   │   ├── types.ts                 # Cart types
│   │   ├── store.ts                 # Cart store (class)
│   │   ├── events.ts                # Cart events
│   │   ├── persistence.ts           # Cart persistence
│   │   ├── selectors.ts             # Cart selectors
│   │   ├── use-cart.tsx             # Cart hook
│   │   ├── utils.ts                 # Cart utilities
│   │   ├── analytics.ts             # Cart analytics
│   │   └── cart-dropdown.tsx        # Cart dropdown component
│   │
│   ├── firebase/                    # Firebase module
│   │   ├── index.ts
│   │   ├── config.ts                # Firebase config
│   │   └── admin.ts                 # Firebase admin
│   │
│   ├── supabase/                    # Supabase module
│   │   ├── index.ts
│   │   ├── middleware.ts            # Supabase middleware
│   │   ├── types.ts                 # Supabase types
│   │   └── middleware.ts            # Middleware utilities
│   │
│   ├── seo/                         # SEO module
│   │   ├── index.ts
│   │   ├── config.ts                # SEO config
│   │   ├── meta.ts                  # Metadata generation
│   │   ├── schema.ts                # Structured data
│   │   ├── sitemap.ts               # Sitemap generation
│   │   ├── middleware.ts            # SEO middleware
│   │   ├── internal-links.ts        # Internal linking
│   │   └── internal-links.ts        # Internal links config
│   │
│   ├── search/                      # Search module
│   │   ├── products-search.ts       # Product search
│   │   ├── tolerant.ts              # Tolerant search
│   │   ├── products-search.test.ts
│   │   └── tolerant.test.ts
│   │
│   ├── models/                      # MongoDB models
│   │   ├── index.ts
│   │   ├── user.ts                  # User model
│   │   ├── login-attempt.ts         # Login attempt model
│   │   └── verification-token.ts    # Verification token model
│   │
│   ├── nutrition/                   # Nutrition module
│   │   ├── nutrition-data.ts        # Nutrition data
│   │   ├── nutrition-api.ts         # Nutrition API
│   │   ├── nutrition-cache.ts       # Nutrition cache
│   │   ├── nutrition-calculator.ts  # Nutrition calculator
│   │   ├── nutrition-intelligence.ts
│   │   ├── personalized-recommendation-engine.ts
│   │   ├── food-safety-engine.ts
│   │   ├── fruit-matcher.ts
│   │   ├── safety-validator.ts
│   │   ├── recommendation-engine.ts
│   │   └── cravings-data.json       # Cravings data
│   │
│   └── products.ts                  # Product definitions
│
├── public/                          # Static assets
│   └── images/                      # Images
│
├── styles/                          # Additional styles
│
├── docs/                            # Documentation
│
├── plans/                           # Plan definitions
│
└── types/                           # TypeScript types
```

---

## 2. Dependencies & Versions

### Core Dependencies

```json
{
  "next": "16.0.10",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "typescript": "^5.9.3"
}
```

### UI & Styling

```json
{
  "tailwindcss": "^4.1.9",
  "tailwindcss-animate": "^1.0.7",
  "tw-animate-css": "1.3.3",
  "autoprefixer": "^10.4.20",
  "postcss": "^8.5",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.3.1",
  "class-variance-authority": "^0.7.1"
}
```

### Animation

```json
{
  "framer-motion": "^12.29.2"
}
```

### Database & Auth

```json
{
  "firebase": "^12.8.0",
  "firebase-admin": "^13.6.0",
  "@supabase/ssr": "^0.8.0",
  "@supabase/supabase-js": "^2.93.2",
  "mongoose": "^8.9.5"
}
```

### Forms & Validation

```json
{
  "react-hook-form": "^7.60.0",
  "@hookform/resolvers": "^3.10.0",
  "zod": "^3.25.76"
}
```

### UI Components (Radix)

```json
{
  "@radix-ui/react-accordion": "1.2.2",
  "@radix-ui/react-alert-dialog": "1.1.4",
  "@radix-ui/react-aspect-ratio": "1.1.1",
  "@radix-ui/react-avatar": "1.1.2",
  "@radix-ui/react-checkbox": "1.1.3",
  "@radix-ui/react-collapsible": "1.1.2",
  "@radix-ui/react-dialog": "1.1.4",
  "@radix-ui/react-dropdown-menu": "2.1.4",
  "@radix-ui/react-hover-card": "1.1.4",
  "@radix-ui/react-label": "2.1.1",
  "@radix-ui/react-navigation-menu": "1.2.3",
  "@radix-ui/react-popover": "1.1.4",
  "@radix-ui/react-progress": "1.1.1",
  "@radix-ui/react-radio-group": "1.2.2",
  "@radix-ui/react-scroll-area": "1.2.2",
  "@radix-ui/react-select": "2.1.4",
  "@radix-ui/react-separator": "1.1.1",
  "@radix-ui/react-slider": "1.2.2",
  "@radix-ui/react-slot": "1.1.1",
  "@radix-ui/react-switch": "1.1.2",
  "@radix-ui/react-tabs": "1.1.2",
  "@radix-ui/react-toast": "1.2.4",
  "@radix-ui/react-toggle": "1.1.1",
  "@radix-ui/react-toggle-group": "1.1.1",
  "@radix-ui/react-tooltip": "1.1.6"
}
```

### Utilities

```json
{
  "lucide-react": "^0.454.0",
  "date-fns": "^4.1.0",
  "embla-carousel-react": "8.5.1",
  "input-otp": "1.4.1",
  "react-day-picker": "9.8.0",
  "react-resizable-panels": "2.1.7",
  "sonner": "^1.7.4",
  "vaul": "^1.1.2",
  "cmdk": "1.0.4",
  "recharts": "2.15.4",
  "react-confetti": "^6.4.0"
}
```

### Auth & Security

```json
{
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "nodemailer": "^6.10.0"
}
```

### Analytics & Monitoring

```json
{
  "@vercel/analytics": "1.3.1"
}
```

### Testing

```json
{
  "vitest": "^2.1.9",
  "@testing-library/react": "^16.1.0",
  "@testing-library/jest-dom": "^6.8.0",
  "@testing-library/user-event": "^14.6.1",
  "jsdom": "^26.1.0"
}
```

---

## 3. Tailwind Color Palette

```javascript
// Luxury color palette
{
  'luxury-dark-green': '#0A2F1E',
  'luxury-dark-green-light': '#1A3C2E',
  'luxury-burnt-orange': '#CC5500',
  'luxury-gold': '#D4AF37',
  'luxury-off-white': '#F5F0E6',
  'luxury-charcoal': '#1F1F1F',
  'luxury-beige': '#EDE4D9',

  // Warm tones
  'warm-beige': '#F5F5DC',
  'warm-cream': '#FFFDD0',
  'warm-amber': '#FFBF00',
  'warm-peach': '#FFDAB9',

  // Soft tones
  'soft-ivory': '#FAF9F6',
  'muted-rose': '#E6B8C3',
  'gentle-green': '#B2D8B8',
  'vibrant-orange': '#FF6B35',
  'soft-lavender': '#C8A2C8',
  'deep-burgundy': '#722F37'
}

// Background gradients
{
  'luxury-dark-gradient': 'linear-gradient(135deg, #0A2F1E 0%, #1A3C2E 100%)',
  'luxury-gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #BFAF7A 100%)',
  'luxury-neutral-gradient': 'linear-gradient(135deg, #F5F0E6 0%, #EDE4D9 100%)'
}
```

---

## 4. Next.js Configuration

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
```

### Root Layout Configuration

```tsx
// app/layout.tsx
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";

// Force dynamic rendering to avoid static generation issues
export const dynamic = "force-dynamic";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sunya | Premium Dehydrated Fruits Nepal",
  description:
    "Premium dehydrated fruits with zero sugar, zero preservatives. Hand-selected, slow-dehydrated, export-grade quality from Nepal.",
  keywords: [
    "dehydrated fruits Nepal",
    "dried fruits Nepal",
    "premium dehydrated fruits",
    "healthy snacks Nepal",
    "no added sugar dried fruits",
  ].join(", "),
  authors: [{ name: "SUNYA", url: "https://sunya.com.np" }],
  creator: "SUNYA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
```

---

## 5. TypeScript Configuration

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "target": "ES6",
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

---

## 6. Authentication System

### Auth Types

```typescript
// lib/auth/types.ts
export type AuthProvider = "google" | "apple" | "phone";
export type UserRole = "guest" | "subscriber" | "admin";
export type SubscriptionStatus = "none" | "active" | "cancelled" | "expired";

export interface UserData {
  uid: string;
  email: string | null;
  phoneNumber: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan: string | null;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface AuthState {
  user: UserData | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: AuthError | null;
}
```

### Auth Context

```typescript
// contexts/auth-context.tsx
export type UserRole = "guest" | "user" | "admin";
export type SubscriptionStatus = "none" | "active" | "cancelled" | "expired";

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: AuthError | null;
}
```

### JWT Configuration

```typescript
// lib/auth/jwt.ts
export const COOKIE_CONFIG = {
  accessToken: {
    name: "sunya_access_token",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 15, // 15 minutes
    },
  },
  refreshToken: {
    name: "sunya_refresh_token",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
};
```

---

## 7. Cart System

### Cart Types

```typescript
// lib/cart/types.ts
export interface CartItem {
  id: number;
  quantity: number;
  addedAt?: number;
}

export interface CartState {
  items: Map<number, CartItem>;
  reducedMotion: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  lastInteractionTime: number;
  isIdle: boolean;
  isAddBurst: boolean;
  toggleCount: number;
  toggleWindowStart: number;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { id: number; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_REDUCED_MOTION'; payload: boolean }
  | { type: 'SET_SOUND_ENABLED'; payload: boolean }
  | { type: 'SET_HAPTICS_ENABLED'; payload: boolean }
  | { type: 'RECORD_INTERACTION' }
  | { type: 'SET_IDLE'; payload: boolean }
  | { type: 'START_ADD_BURST' }
  | { type: 'END_ADD_BURST' }
  | { type: 'RECORD_TOGGLE' }
  | { type: 'RESET_TOGGLE_WINDOW' }
  | { type: 'HYDRATE_STATE'; payload: Partial<CartState> };
```

### Cart Store

```typescript
// lib/cart/store.ts
export const DEFAULT_CART_CONFIG: CartStoreConfig = {
  storageKey: 'sunya.cart',
  legacyStorageKey: 'cart',
  saveDebounceMs: 500,
  idleThresholdMs: 15000,
  idleRandomWindowMs: 10000,
  toggleWindowMs: 20000,
  burstThresholdMs: 2000,
};

export class CartStore {
  private state: CartState;
  private listeners = new Set<() => void>();
  private eventBus = new CartEventBus();
  private config: CartStoreConfig;
  // ... implementation
}
```

---

## 8. Product System

### Product Types

```typescript
// lib/products.ts
export type GramOption = 100 | 200 | 300 | 400 | 500 | 1000;

export interface GramPricing {
  grams: GramOption;
  price: number;
  pricePerGram: number;
}

export interface Product {
  id: number;
  name: string;
  nrsPrice: number;
  description: string;
  features: string[];
  image: string;
  badge: string;
  gramPricing?: GramPricing[];
  pricePerGram?: number;
}

export const calculatePriceByGrams = (
  product: Product,
  grams: GramOption,
): number => {
  if (product.gramPricing) {
    const pricing = product.gramPricing.find((p) => p.grams === grams);
    if (pricing) return pricing.price;
  }
  if (product.pricePerGram) {
    return product.pricePerGram * grams;
  }
  const standardGrams = 500;
  const pricePerGram = product.nrsPrice / standardGrams;
  return Math.round(pricePerGram * grams);
};
```

---

## 9. API Routes

### Login API

```typescript
// app/api/auth/login/route.ts
/**
 * POST /api/auth/login
 * - Validates credentials
 * - Checks rate limiting
 * - Verifies email is verified
 * - Generates JWT tokens
 * - Sets httpOnly cookies
 *
 * Rate limiting: 5 attempts per 15 minutes, 30 min lockout
 */

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    const validation = validateData(loginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          fieldErrors: validation.errors,
        },
        { status: 400 },
      );
    }
    // ... continue authentication
  }
}
```

---

## 10. Firebase Configuration

```typescript
// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

---

## 11. MongoDB Models

```typescript
// lib/models/user.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  fullName: string;
  password: string;
  avatar?: string;
  role: "guest" | "user" | "admin";
  subscriptionStatus: "none" | "active" | "cancelled" | "expired";
  subscriptionPlan?: string;
  emailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    avatar: String,
    role: {
      type: String,
      enum: ["guest", "user", "admin"],
      default: "user",
    },
    subscriptionStatus: {
      type: String,
      enum: ["none", "active", "cancelled", "expired"],
      default: "none",
    },
    subscriptionPlan: String,
    emailVerified: { type: Boolean, default: false },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
```

---

## 12. Components Implementation

### Animated Cart Icon

```tsx
// components/animated-cart-icon.tsx
"use client";

import { useCart, useCartUI } from "@/lib/cart/use-cart";
import type { UseCartReturn, UseCartUIReturn } from "@/lib/cart/types";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export interface AnimatedCartIconProps {
  className?: string;
  showBadge?: boolean;
  badgeClassName?: string;
  iconClassName?: string;
  onClick?: () => void;
  href?: string;
  showRipple?: boolean;
  badgeColor?: string;
}

// Default cart state when provider is not available
const defaultCartState: UseCartReturn = {
  items: [],
  itemCount: 0,
  isEmpty: true,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getItem: () => undefined,
  hasItem: () => false,
};

export function AnimatedCartIcon({ className, href = "/checkout", ...props }: AnimatedCartIconProps) {
  const cart = useCart();
  const cartUI = useCartUI();

  return (
    <Link href={href} className={cn("relative", className)}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ShoppingCart />
      </motion.div>
      {/* Badge with animation */}
    </Link>
  );
}
```

### Cart Provider

```tsx
// components/cart-provider.tsx
"use client";

import {
  getSystemReducedMotion,
  loadLegacyCart,
  loadPersistedCart,
} from "@/lib/cart/persistence";
import { getCartStore } from "@/lib/cart/store";
import { useCart, useCartEvent } from "@/lib/cart/use-cart";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useCartToast } from "./cart-toast";

export function CartProvider({ children }: { children: ReactNode }) {
  const store = getCartStore();

  return (
    <>
      <CartProviderInitializer />
      {children}
    </>
  );
}

function CartProviderInitializer() {
  const [isMounted, setIsMounted] = useState(false);
  const store = getCartStore();
  const { items, itemCount } = useCart();
  const { showAddedToCart, showRemovedFromCart } = useCartToast();

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === "undefined") return;

    const persisted = loadPersistedCart();
    const legacy = loadLegacyCart();

    if (persisted) {
      store.dispatch({
        type: "HYDRATE_STATE",
        payload: {
          items: new Map(persisted.items.map((item) => [item.id, item])),
          reducedMotion: persisted.ui.reducedMotion,
          soundEnabled: persisted.ui.soundEnabled,
          hapticsEnabled: persisted.ui.hapticsEnabled,
        },
      });
    } else if (legacy && legacy.length > 0) {
      store.dispatch({
        type: "HYDRATE_STATE",
        payload: {
          items: new Map(legacy.map((item) => [item.id, item])),
          reducedMotion: getSystemReducedMotion(),
          soundEnabled: true,
          hapticsEnabled: true,
        },
      });
    } else {
      store.dispatch({
        type: "SET_REDUCED_MOTION",
        payload: getSystemReducedMotion(),
      });
    }
  }, [store]);

  if (!isMounted) return null;

  return null;
}
```

### Providers Component

```tsx
// components/providers.tsx
"use client";

import { LoginModal } from "@/components/auth";
import { ToastProvider } from "@/components/cart-toast";
import { AuthProvider } from "@/contexts/auth-context";
import {
  createReducedMotionListener,
  getSystemReducedMotion,
  loadLegacyCart,
  loadPersistedCart,
} from "@/lib/cart/persistence";
import { CartStore } from "@/lib/cart/store";
import type { CartItem } from "@/lib/cart/types";
import { CartProvider } from "@/lib/cart/use-cart";
import * as React from "react";
import { Toaster } from "sonner";

function computeRandomIdleMs(): number {
  return 15000 + Math.floor(Math.random() * 10000);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = React.useState(false);
  const storeRef = React.useRef<CartStore | null>(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted && !storeRef.current) {
    storeRef.current = new CartStore();
  }
  const store = storeRef.current;

  React.useEffect(() => {
    if (!store) return;

    // Hydration logic
    const persisted = loadPersistedCart();
    if (persisted) {
      const itemsMap = new Map<number, CartItem>();
      for (const item of persisted.items) {
        itemsMap.set(item.id, {
          id: item.id,
          quantity: item.quantity,
          addedAt: item.addedAt,
        });
      }
      store.dispatch({
        type: "HYDRATE_STATE",
        payload: {
          items: itemsMap,
          reducedMotion: persisted.ui.reducedMotion,
          soundEnabled: persisted.ui.soundEnabled,
          hapticsEnabled: persisted.ui.hapticsEnabled,
        },
      });
    }
  }, [store]);

  return (
    <AuthProvider>
      <CartProvider store={store}>
        <ToastProvider>
          {children}
          <Toaster position="bottom-right" />
          <LoginModal />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
```

### Header Component

```tsx
// components/header.tsx
"use client";

import { AnimatedCartIcon } from "@/components/animated-cart-icon";
import { LoginModal } from "@/components/auth/login-modal";
import { ProfileButton } from "@/components/auth/profile-button";
import { CartDrawer, useCartDrawer } from "@/components/cart-drawer";
import { SunyaColoredText } from "@/components/sunya-colored-text";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const cartDrawer = useCartDrawer();
  const router = useRouter();

  const runSearch = () => {
    if (!searchValue.trim()) {
      router.push("/products");
      return;
    }
    router.push(`/products?q=${encodeURIComponent(searchValue.trim())}`);
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <SunyaColoredText size="5xl" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search & Cart */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runSearch();
                }}
                className="flex items-center"
              >
                <input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="search"
                  placeholder="Search..."
                  aria-label="Search products"
                  className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-muted border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
              </form>
            </div>

            <AnimatedCartIcon />
          </div>
        </div>
      </div>

      {/* Mobile menu, cart drawer, etc. */}
    </header>
  );
}
```

---

## 13. Utility Functions

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 14. Environment Variables

```bash
# .env.example

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# MongoDB
MONGODB_URI=

# JWT
JWT_SECRET=
JWT_REFRESH_SECRET=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=Sunya
```

---

## 15. ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    "next/core-web-vitals",
  ],
  rules: {
    // Add custom rules
  },
};
```

---

## 16. Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 100
}
```

---

## 17. Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"]
}
```

---

## 18. Firebase Hosting Configuration

```json
// firebase.json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "source": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**", "**/.next/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "X-Frame-Options", "value": "DENY" },
          { "key": "X-XSS-Protection", "value": "1; mode=block" },
          {
            "key": "Cache-Control",
            "value": "public, max-age=0, s-maxage=1, stale-while-revalidate=1"
          }
        ]
      },
      {
        "source": "/_next/static/**",
        "headers": [
          { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
        ]
      }
    ]
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

---

## 19. SEO Configuration

```typescript
// lib/seo/config.ts
export const BRAND_CONFIG = {
  name: "Sunya",
  tagline: "Premium Dehydrated Fruits Nepal",
  description:
    "Premium dehydrated fruits with zero sugar, zero preservatives. Hand-selected, slow-dehydrated, export-grade quality from Nepal.",
  url: "https://sunya.com.np",
  logo: "https://sunya.com.np/logo.png",
  social: {
    facebook: "https://facebook.com/sunya",
    instagram: "https://instagram.com/sunya",
    twitter: "https://twitter.com/sunya",
  },
};

export const GEO_TARGETING = {
  defaultCountry: "NP",
  alternateCountries: ["US", "IN"],
  location: "Kathmandu, Nepal",
};
```

---

## 20. Testing Setup

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    aliases: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

---

## 21. Naming Conventions

### Components
- Use PascalCase for component files: `AnimatedCartIcon.tsx`
- Use camelCase for component functions: `export function AnimatedCartIcon()`
- Props interfaces use PascalCase: `AnimatedCartIconProps`

### Hooks
- Use camelCase starting with "use": `useCart`, `CartProvider`

### Contexts
- Use PascalCase: `AuthContext`, `CartContext`

### Utilities
- Use camelCase: `cn()`, `calculatePriceByGrams()`

### Classes
- Use PascalCase: `CartStore`, `UserModel`

### Constants
- Use SCREAMING_SNAKE_CASE for config: `COOKIE_CONFIG`, `DEFAULT_CART_CONFIG`

### File Structure
- Pages in `app/` directory
- Components in `components/` directory
- Libraries in `lib/` directory
- Types in `types/` directory
- Contexts in `contexts/` directory
- Hooks in `hooks/` directory

---

## 22. Key Implementation Patterns

### Client Components
```tsx
"use client";

import { useState, useEffect } from "react";
// Component implementation
```

### Server Components
```tsx
import { Suspense } from "react";
// Component implementation
```

### API Routes
```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Handler implementation
}
```

### Custom Hooks
```typescript
export function useCart() {
  const store = getCartStore();
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(setState);
    return unsubscribe;
  }, [store]);

  return state;
}
```

### Event Bus Pattern
```typescript
class CartEventBus {
  private listeners = new Map<string, Set<Function>>();

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }
}
```

---

## 23. Page Routes Summary

| Route                   | File                                | Description        |
| ----------------------- | ----------------------------------- | ------------------ |
| `/`                     | `app/page.tsx`                      | Home page          |
| `/about`                | `app/about/page.tsx`                | About page         |
| `/account`              | `app/account/page.tsx`              | User account       |
| `/checkout`             | `app/checkout/page.tsx`             | Checkout           |
| `/checkout/result`      | `app/checkout/result/page.tsx`      | Checkout result    |
| `/contact`              | `app/contact/page.tsx`              | Contact page       |
| `/cravings-care-cycle`  | `app/cravings-care-cycle/page.tsx`  | Cravings feature   |
| `/dehydrated-fruits`    | `app/dehydrated-fruits/page.tsx`    | Products           |
| `/faq`                  | `app/faq/page.tsx`                  | FAQ                |
| `/gifting`              | `app/gifting/page.tsx`              | Gifting options    |
| `/health-quiz`          | `app/health-quiz/page.tsx`          | Health quiz        |
| `/nutrition`            | `app/nutrition/page.tsx`            | Nutrition info     |
| `/nutrition-search`     | `app/nutrition-search/page.tsx`     | Nutrition search   |
| `/privacy-policy`       | `app/privacy-policy/page.tsx`       | Privacy policy     |
| `/products`             | `app/products/page.tsx`             | Products listing   |
| `/reset-password`       | `app/reset-password/page.tsx`       | Password reset     |
| `/retailer`             | `app/retailer/page.tsx`             | Retailer info      |
| `/reviews`              | `app/reviews/page.tsx`              | Reviews            |
| `/subscription`         | `app/subscription/page.tsx`         | Subscription       |
| `/terms-and-conditions` | `app/terms-and-conditions/page.tsx` | Terms              |
| `/verify-email`         | `app/verify-email/page.tsx`         | Email verification |
| `/vip`                  | `app/vip/page.tsx`                  | VIP page           |
| `/why-us`               | `app/why-us/page.tsx`               | Why choose us      |

---

## 24. API Routes Summary

| Method | Route                           | Description             |
| ------ | ------------------------------- | ----------------------- |
| POST   | `/api/auth/login`               | User login              |
| POST   | `/api/auth/logout`              | User logout             |
| POST   | `/api/auth/register`            | User registration       |
| GET    | `/api/auth/me`                  | Get current user        |
| POST   | `/api/auth/refresh`             | Refresh tokens          |
| POST   | `/api/auth/forgot-password`     | Forgot password         |
| POST   | `/api/auth/reset-password`      | Reset password          |
| POST   | `/api/auth/verify`              | Verify token            |
| POST   | `/api/auth/verify-email`        | Send verification email |
| POST   | `/api/auth/resend-verification` | Resend verification     |
| POST   | `/api/auth/google`              | Google OAuth            |
| POST   | `/api/subscription/create`      | Create subscription     |
| POST   | `/api/cravings-care-cycle`      | Cravings API            |
| POST   | `/api/watermark`                | Watermark API           |
| GET    | `/api/watermark/log`            | Watermark logs          |

---

## 25. Build & Deploy Instructions

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

---

## 26. Notes for Reconstruction

1. **Next.js 16**: This project uses Next.js 16 which is in preview/beta. Ensure you have the correct version installed.

2. **React 19**: The project uses React 19.2.0 which is also relatively new.

3. **Tailwind CSS 4**: Uses the latest Tailwind CSS v4 with `@tailwindcss/postcss` plugin.

4. **Firebase Hosting**: Configuration is set up for Firebase Hosting with rewrites to `index.html`.

5. **Vercel Compatible**: The project is also configured for Vercel deployment with `vercel.json`.

6. **Dynamic Rendering**: All pages use `export const dynamic = "force-dynamic"` to avoid static generation issues.

7. **MongoDB Connection**: Uses Mongoose with connection pooling.

8. **Authentication**: Multiple auth methods (Firebase, JWT, Supabase) are integrated.

9. **Cart System**: Custom cart store with event bus, idle detection, and burst detection.

10. **SEO**: Comprehensive SEO middleware with structured data and metadata.

11. **Testing**: Vitest setup with React Testing Library.

---

This document provides complete information for reconstructing the SUNYA project with full fidelity.
