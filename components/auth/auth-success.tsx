/**
 * Auth Success Component
 * Displays authentication success messages with animations
 */

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

interface AuthSuccessProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
  showIcon?: boolean;
}

/**
 * Auth Success Message Component
 * Displays success messages with checkmark icon and dismiss option
 */
export function AuthSuccess({
  message,
  onDismiss,
  className = "",
  showIcon = true,
}: AuthSuccessProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className={`
          relative flex items-start gap-3 p-4 rounded-lg
          bg-green-500/10 border border-green-500/20
          text-green-700 dark:text-green-400 text-sm
          ${className}
        `}
        role="status"
        aria-live="polite"
      >
        {showIcon && (
          <CheckCircle
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
        )}
        <div className="flex-1">
          <p className="font-medium">Success</p>
          <p className="mt-1 opacity-90">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 rounded-md hover:bg-green-500/20 transition-colors"
            aria-label="Dismiss success message"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Inline Auth Success Component
 * Smaller success display for inline form feedback
 */
interface InlineAuthSuccessProps {
  message: string;
  className?: string;
}

export function InlineAuthSuccess({
  message,
  className = "",
}: InlineAuthSuccessProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className={`text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5 ${className}`}
      role="status"
    >
      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {message}
    </motion.p>
  );
}

/**
 * Auth Success with Action Component
 * Success message with optional action button
 */
interface AuthSuccessWithActionProps extends AuthSuccessProps {
  actionLabel: string;
  onAction: () => void;
}

export function AuthSuccessWithAction({
  message,
  actionLabel,
  onAction,
  onDismiss,
  className = "",
}: AuthSuccessWithActionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={`
        relative flex flex-col gap-3 p-4 rounded-lg
        bg-green-500/10 border border-green-500/20
        text-green-700 dark:text-green-400 text-sm
        ${className}
      `}
      role="status"
    >
      <div className="flex items-start gap-3">
        <CheckCircle
          className="w-5 h-5 flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="flex-1">
          <p className="font-medium">Success</p>
          <p className="mt-1 opacity-90">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 rounded-md hover:bg-green-500/20 transition-colors"
            aria-label="Dismiss success message"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <button
        onClick={onAction}
        className="self-start px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
      >
        {actionLabel}
      </button>
    </motion.div>
  );
}

export default AuthSuccess;
