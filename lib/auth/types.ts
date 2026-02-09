/**
 * Authentication Types
 * Type definitions for auth state, user data, and auth operations
 */

// Auth provider types
export type AuthProvider = "google" | "apple" | "phone";

// User role types
export type UserRole = "guest" | "subscriber" | "admin";

// Subscription status
export type SubscriptionStatus = "none" | "active" | "cancelled" | "expired";

// Extended user data
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

// Auth state
export interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: AuthError | null;
}

// Auth error
export interface AuthError {
  code: string;
  message: string;
}

// Login modal state
export interface LoginModalState {
  isOpen: boolean;
  redirectAfterLogin: string | null;
  onSuccessCallback: (() => void) | null;
}

// Phone verification state
export interface PhoneVerificationState {
  step: "phone" | "otp" | "success";
  phoneNumber: string;
  confirmationResult: unknown | null;
  verificationId: string | null;
  error: string | null;
  isLoading: boolean;
}

// Auth context value
export interface AuthContextValue extends AuthState {
  // Actions
  login: (provider: AuthProvider) => Promise<void>;
  loginWithPhone: (phoneNumber: string) => Promise<void>;
  verifyPhoneOTP: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;

  // Modal control
  openLoginModal: (options?: {
    redirectTo?: string;
    onSuccess?: () => void;
  }) => void;
  closeLoginModal: () => void;
  loginModalState: LoginModalState;

  // Phone verification
  phoneVerification: PhoneVerificationState;
  resetPhoneVerification: () => void;
}

// Backend token verification response
export interface TokenVerificationResponse {
  valid: boolean;
  uid: string | null;
  email: string | null;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  error?: string;
}

// Subscription action request
export interface SubscriptionActionRequest {
  idToken: string;
  planId: string;
  action: "subscribe" | "cancel" | "upgrade";
}
