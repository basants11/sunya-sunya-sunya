/**
 * Google OAuth Button Component
 * Handles Google Sign-In with Firebase
 */

"use client";

import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Chrome } from "lucide-react";
import { useState } from "react";

interface GoogleButtonProps {
  className?: string;
  variant?: "default" | "outline" | "minimal";
  size?: "default" | "sm" | "lg";
  text?: string;
}

/**
 * Google Sign-In Button using Firebase Popup
 */
export function GoogleButton({
  className = "",
  variant = "outline",
  size = "default",
  text = "Continue with Google",
}: GoogleButtonProps) {
  const { loginWithGoogle, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    }
  };

  // Size classes
  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  // Variant classes
  const variantClasses = {
    default:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400",
    outline:
      "bg-transparent text-foreground border border-border hover:bg-muted",
    minimal: "bg-transparent text-foreground hover:bg-muted border-0",
  };

  return (
    <div className="w-full">
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          "w-full flex items-center justify-center gap-3 rounded-md font-medium transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Chrome className="w-5 h-5 text-[#4285F4]" />
        )}
        {text}
      </motion.button>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-500 text-center"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

export default GoogleButton;
