/**
 * Auth Context
 * React context for authentication state management
 * Provides auth state and methods to all components
 */

"use client";

import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

// Types
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

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: AuthError | null;
}

export interface LoginModalOptions {
  redirectTo?: string;
  onSuccess?: () => void;
}

export interface AuthContextValue extends AuthState {
  // Auth actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;

  // Password reset
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;

  // Email verification
  resendVerification: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;

  // Modal control
  isLoginModalOpen: boolean;
  openLoginModal: (options?: LoginModalOptions) => void;
  closeLoginModal: () => void;
  loginModalOptions: LoginModalOptions;

  // Token management
  refreshToken: () => Promise<boolean>;

  // Clear error
  clearError: () => void;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  error: null,
};

// Create context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// API response types
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Array<{ field: string; message: string }>;
  code?: string;
}

interface UserResponse {
  user: User;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>(initialState);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalOptions, setLoginModalOptions] = useState<LoginModalOptions>(
    {},
  );

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = (await response.json()) as ApiResponse<UserResponse>;
        if (data.success && data.data?.user) {
          setState({
            user: data.data.user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
            error: null,
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    }
  }, []);

  // Close login modal
  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    setLoginModalOptions({});
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to get current user from API
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = (await response.json()) as ApiResponse<UserResponse>;
          if (data.success && data.data?.user) {
            setState({
              user: data.data.user,
              isAuthenticated: true,
              isLoading: false,
              isInitialized: true,
              error: null,
            });
          } else {
            setState({
              ...initialState,
              isLoading: false,
              isInitialized: true,
            });
          }
        } else if (response.status === 401) {
          // Try to refresh token
          const refreshed = await refreshToken();
          if (!refreshed) {
            setState({
              ...initialState,
              isLoading: false,
              isInitialized: true,
            });
          }
        } else {
          setState({
            ...initialState,
            isLoading: false,
            isInitialized: true,
          });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setState({
          ...initialState,
          isLoading: false,
          isInitialized: true,
        });
      }
    };

    initializeAuth();
  }, [refreshToken]);

  // Login with email/password
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        const data = (await response.json()) as ApiResponse<UserResponse>;

        if (!response.ok) {
          const error: AuthError = {
            code: data.code || "auth/login-failed",
            message: data.error || "Login failed. Please try again.",
          };
          setState((prev) => ({ ...prev, isLoading: false, error }));
          throw new Error(error.message);
        }

        if (data.success && data.data?.user) {
          setState({
            user: data.data.user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
            error: null,
          });

          // Close modal and execute callback if provided
          closeLoginModal();

          if (loginModalOptions.onSuccess) {
            loginModalOptions.onSuccess();
          }

          // Redirect if specified
          if (loginModalOptions.redirectTo) {
            router.push(loginModalOptions.redirectTo);
          }

          toast.success("Successfully logged in!");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: { code: "auth/login-failed", message },
        }));
        throw error;
      }
    },
    [loginModalOptions, router, closeLoginModal],
  );

  // Register new user
  const register = useCallback(async (registerData: RegisterData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = (await response.json()) as ApiResponse<{
        message: string;
        userId: string;
      }>;

      if (!response.ok) {
        const error: AuthError = {
          code: data.code || "auth/register-failed",
          message: data.error || "Registration failed. Please try again.",
        };

        // Handle field-specific errors
        if (data.fieldErrors && data.fieldErrors.length > 0) {
          error.message = data.fieldErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ");
        }

        setState((prev) => ({ ...prev, isLoading: false, error }));
        throw new Error(error.message);
      }

      setState((prev) => ({ ...prev, isLoading: false }));
      toast.success(
        "Registration successful! Please check your email to verify your account.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: { code: "auth/register-failed", message },
      }));
      throw error;
    }
  }, []);

  // Login with Google - removed Firebase dependency, use backend implementation
  const loginWithGoogle = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = (await response.json()) as ApiResponse<UserResponse>;

      if (!response.ok) {
        const error: AuthError = {
          code: data.code || "auth/google-failed",
          message: data.error || "Google login failed. Please try again.",
        };
        setState((prev) => ({ ...prev, isLoading: false, error }));
        throw new Error(error.message);
      }

      if (data.success && data.data?.user) {
        setState({
          user: data.data.user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
          error: null,
        });

        closeLoginModal();

        if (loginModalOptions.onSuccess) {
          loginModalOptions.onSuccess();
        }

        if (loginModalOptions.redirectTo) {
          router.push(loginModalOptions.redirectTo);
        }

        toast.success("Successfully logged in with Google!");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Google login failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: { code: "auth/google-failed", message },
      }));
      throw error;
    }
  }, [loginModalOptions, router, closeLoginModal]);

  // Logout
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
        toast.success("Successfully logged out!");
        router.push("/");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [router]);

  // Forgot password
  const forgotPassword = useCallback(async (email: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as ApiResponse<{ message: string }>;

      if (!response.ok) {
        const error: AuthError = {
          code: data.code || "auth/forgot-password-failed",
          message:
            data.error || "Failed to send reset email. Please try again.",
        };
        setState((prev) => ({ ...prev, isLoading: false, error }));
        throw new Error(error.message);
      }

      setState((prev) => ({ ...prev, isLoading: false }));
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send reset email";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: { code: "auth/forgot-password-failed", message },
      }));
      throw error;
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (token: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password, confirmPassword: password }),
      });

      const data = (await response.json()) as ApiResponse<{ message: string }>;

      if (!response.ok) {
        const error: AuthError = {
          code: data.code || "auth/reset-password-failed",
          message: data.error || "Failed to reset password. Please try again.",
        };
        setState((prev) => ({ ...prev, isLoading: false, error }));
        throw new Error(error.message);
      }

      setState((prev) => ({ ...prev, isLoading: false }));
      toast.success(
        "Password reset successful! Please login with your new password.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to reset password";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: { code: "auth/reset-password-failed", message },
      }));
      throw error;
    }
  }, []);

  // Resend verification email
  const resendVerification = useCallback(async (email: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as ApiResponse<{ message: string }>;

      if (!response.ok) {
        const error: AuthError = {
          code: data.code || "auth/resend-verification-failed",
          message:
            data.error ||
            "Failed to resend verification email. Please try again.",
        };
        setState((prev) => ({ ...prev, isLoading: false, error }));
        throw new Error(error.message);
      }

      setState((prev) => ({ ...prev, isLoading: false }));
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to resend verification email";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: { code: "auth/resend-verification-failed", message },
      }));
      throw error;
    }
  }, []);

  // Verify email
  const verifyEmail = useCallback(async (token: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = (await response.json()) as ApiResponse<{
        message: string;
        user?: User;
      }>;

      if (!response.ok) {
        const error: AuthError = {
          code: data.code || "auth/verify-email-failed",
          message: data.error || "Failed to verify email. Please try again.",
        };
        setState((prev) => ({ ...prev, isLoading: false, error }));
        throw new Error(error.message);
      }

      // Update user if returned
      if (data.data?.user) {
        setState({
          user: data.data.user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }

      toast.success("Email verified successfully!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to verify email";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: { code: "auth/verify-email-failed", message },
      }));
      throw error;
    }
  }, []);

  // Open login modal
  const openLoginModal = useCallback((options?: LoginModalOptions) => {
    setLoginModalOptions(options || {});
    setIsLoginModalOpen(true);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    loginWithGoogle,
    forgotPassword,
    resetPassword,
    resendVerification,
    verifyEmail,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    loginModalOptions,
    refreshToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Safe hook that returns null if not in provider
export function useAuthSafe(): AuthContextValue | null {
  const context = useContext(AuthContext);
  return context || null;
}
