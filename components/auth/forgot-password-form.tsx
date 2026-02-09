/**
 * Forgot Password Form Component
 * Form to request password reset email
 */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Loader2, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthError } from "./auth-error";

interface ForgotPasswordFormProps {
  onBack?: () => void;
  className?: string;
}

/**
 * Forgot Password Form
 *
 * Features:
 * - Email input with validation
 * - Success state after email sent
 * - Back to login option
 * - Loading states
 */
export function ForgotPasswordForm({
  onBack,
  className = "",
}: ForgotPasswordFormProps) {
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const emailValue = watch("email");

  const onSubmit = async (data: ForgotPasswordFormData) => {
    clearError();
    try {
      await forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setEmailSent(true);
    } catch {
      // Error is handled by auth context
    }
  };

  // Success state
  if (emailSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("text-center py-6 space-y-6", className)}
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto"
        >
          <Send className="w-10 h-10 text-green-600 dark:text-green-400" />
        </motion.div>

        {/* Success Message */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            Check Your Email
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            We have sent password reset instructions to{" "}
            <span className="font-medium text-foreground">
              {submittedEmail}
            </span>
            . Please check your inbox and follow the link to reset your
            password.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground max-w-sm mx-auto">
          <ul className="space-y-2 text-left">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>The link will expire in 1 hour</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Check your spam folder if you do not see the email</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Use a strong, unique password</span>
            </li>
          </ul>
        </div>

        {/* Back Button */}
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Forgot Password?
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your email address and we will send you instructions to reset
          your password.
        </p>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <AuthError message={error.message} onDismiss={clearError} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="forgot-email"
            className="block text-sm font-medium text-foreground"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="forgot-email"
              type="email"
              placeholder="you@example.com"
              disabled={isLoading}
              className={cn(
                "pl-10",
                errors.email &&
                  "border-destructive focus-visible:ring-destructive",
                emailValue &&
                  !errors.email &&
                  "border-green-500 focus-visible:ring-green-500",
              )}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "forgot-email-error" : undefined}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              id="forgot-email-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Reset Instructions
              <Send className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        {/* Back Link */}
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={isLoading}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        )}
      </form>
    </motion.div>
  );
}

export default ForgotPasswordForm;
