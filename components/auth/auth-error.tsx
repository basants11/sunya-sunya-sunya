/**
 * Auth Error Component
 * Displays authentication error messages with appropriate styling
 */

"use client";

import { useAuth } from "@/contexts/auth-context";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface AuthErrorProps {
  message?: string;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Auth Error Message Component
 * Displays error messages with alert styling and dismiss button
 */
export function AuthError({
  message,
  onDismiss,
  className = "",
}: AuthErrorProps) {
  const { error, clearError } = useAuth();

  const errorMessage = message || error?.message;

  if (!errorMessage) return null;

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    } else {
      clearError();
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className={`
          relative flex items-start gap-3 p-4 rounded-lg
          bg-destructive/10 border border-destructive/20
          text-destructive text-sm
          ${className}
        `}
        role="alert"
        aria-live="polite"
      >
        <AlertCircle
          className="w-5 h-5 flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="flex-1">
          <p className="font-medium">Error</p>
          <p className="mt-1 opacity-90">{errorMessage}</p>
        </div>
        {onDismiss && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-md hover:bg-destructive/20 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Inline Auth Error Component
 * Smaller error display for inline form field errors
 */
interface InlineAuthErrorProps {
  message: string;
  className?: string;
}

export function InlineAuthError({
  message,
  className = "",
}: InlineAuthErrorProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className={`text-sm text-destructive flex items-center gap-1.5 ${className}`}
      role="alert"
    >
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {message}
    </motion.p>
  );
}

export default AuthError;
