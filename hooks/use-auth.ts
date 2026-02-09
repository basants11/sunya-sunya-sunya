/**
 * useAuth Hook
 * Re-export of useAuth from contexts/auth-context for convenience
 * Also provides additional utility hooks for common auth patterns
 */

export { useAuth, useAuthSafe } from "@/contexts/auth-context";

// Additional utility hooks for common auth patterns
import { useAuth as useAuthBase } from "@/contexts/auth-context";
import { useCallback } from "react";

/**
 * Hook to check if user has specific role
 */
export function useHasRole(role: "user" | "admin"): boolean {
  const { user, isAuthenticated } = useAuthBase();
  return isAuthenticated && user?.role === role;
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin(): boolean {
  return useHasRole("admin");
}

/**
 * Hook to get user's display name
 */
export function useDisplayName(): string {
  const { user } = useAuthBase();
  return user?.fullName || user?.email?.split("@")[0] || "Guest";
}

/**
 * Hook to check if user has active subscription
 */
export function useHasSubscription(): boolean {
  const { user, isAuthenticated } = useAuthBase();
  return isAuthenticated && user?.subscriptionStatus === "active";
}

/**
 * Hook to require auth for an action
 * Returns a wrapper function that opens login modal if not authenticated
 */
export function useRequireAuth() {
  const { isAuthenticated, openLoginModal } = useAuthBase();

  const requireAuth = useCallback(
    (callback: () => void, options?: { redirectTo?: string }) => {
      if (isAuthenticated) {
        callback();
      } else {
        openLoginModal({
          redirectTo: options?.redirectTo,
          onSuccess: callback,
        });
      }
    },
    [isAuthenticated, openLoginModal],
  );

  return requireAuth;
}

/**
 * Hook to get user initials for avatar
 */
export function useUserInitials(): string {
  const { user } = useAuthBase();

  if (!user?.fullName) {
    return user?.email?.[0]?.toUpperCase() || "U";
  }

  return user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Hook to check if email is verified
 */
export function useIsEmailVerified(): boolean {
  const { user, isAuthenticated } = useAuthBase();
  return isAuthenticated && user?.emailVerified === true;
}
