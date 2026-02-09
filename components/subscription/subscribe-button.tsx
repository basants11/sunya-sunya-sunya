/**
 * Subscribe Button Component
 * Handles subscription flow with auth check
 * Shows login modal if user is not authenticated
 */

"use client";

import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Crown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface SubscribeButtonProps {
  planId: string;
  planName: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  onSubscribeStart?: () => void;
  onSubscribeSuccess?: () => void;
}

export function SubscribeButton({
  planId,
  planName,
  className = "",
  variant = "primary",
  size = "md",
  fullWidth = false,
  onSubscribeStart,
  onSubscribeSuccess,
}: SubscribeButtonProps) {
  const {
    isAuthenticated,
    isLoading: authLoading,
    openLoginModal,
    user,
    refreshToken,
  } = useAuth();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const router = useRouter();

  // Size classes
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Variant classes
  const variantClasses = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
  };

  // Handle subscription action
  const handleSubscribe = async () => {
    // If not authenticated, show login modal first
    if (!isAuthenticated) {
      openLoginModal({
        redirectTo: "/subscription",
        onSuccess: () => {
          // After successful login, continue with subscription
          handleSubscribeAfterAuth();
        },
      });
      return;
    }

    // User is authenticated, proceed with subscription
    await handleSubscribeAfterAuth();
  };

  // Handle subscription after authentication is confirmed
  const handleSubscribeAfterAuth = async () => {
    setIsSubscribing(true);
    onSubscribeStart?.();

    try {
      // Get fresh ID token for backend verification
      const idToken = await refreshToken();

      if (!idToken) {
        throw new Error("Failed to get authentication token");
      }

      // Call backend API to initiate subscription
      const response = await fetch("/api/subscription/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          planId,
          planName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create subscription");
      }

      const data = await response.json();

      // Handle different response types
      if (data.checkoutUrl) {
        // Redirect to payment gateway
        window.location.href = data.checkoutUrl;
      } else if (data.success) {
        // Direct success (e.g., free trial)
        toast.success(`Successfully subscribed to ${planName}!`);
        onSubscribeSuccess?.();
        router.push("/subscription/success");
      }
    } catch (error) {
      const err = error as Error;
      console.error("Subscription error:", err);
      toast.error(
        err.message || "Failed to process subscription. Please try again.",
      );
    } finally {
      setIsSubscribing(false);
    }
  };

  // Check if user already has this subscription
  const isAlreadySubscribed =
    user?.subscriptionStatus === "active" && user?.subscriptionPlan === planId;

  if (isAlreadySubscribed) {
    return (
      <motion.button
        disabled
        className={`
          inline-flex items-center justify-center gap-2
          rounded-xl font-medium
          bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400
          cursor-default
          ${sizeClasses[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
      >
        <Crown className="w-5 h-5" />
        Already Subscribed
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleSubscribe}
      disabled={isSubscribing || authLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl font-semibold
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {isSubscribing || authLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          {isSubscribing ? "Processing..." : "Loading..."}
        </>
      ) : (
        <>
          <Crown className="w-5 h-5" />
          Subscribe Now
        </>
      )}
    </motion.button>
  );
}

/**
 * Hook to check if user can access subscription features
 * Returns { canAccess: boolean, reason: string | null }
 */
export function useSubscriptionAccess() {
  const { isAuthenticated, isLoading, user, openLoginModal } = useAuth();

  const checkAccess = (
    action: string,
  ): { canAccess: boolean; reason: string | null } => {
    if (isLoading) {
      return { canAccess: false, reason: "Loading..." };
    }

    if (!isAuthenticated) {
      return {
        canAccess: false,
        reason: "Please login to access this feature",
      };
    }

    if (user?.subscriptionStatus !== "active") {
      return {
        canAccess: false,
        reason: "Active subscription required",
      };
    }

    return { canAccess: true, reason: null };
  };

  const requireAuth = (onAuthSuccess?: () => void) => {
    if (!isAuthenticated) {
      openLoginModal({ onSuccess: onAuthSuccess });
      return false;
    }
    return true;
  };

  return {
    isAuthenticated,
    isLoading,
    subscriptionStatus: user?.subscriptionStatus,
    subscriptionPlan: user?.subscriptionPlan,
    checkAccess,
    requireAuth,
  };
}
