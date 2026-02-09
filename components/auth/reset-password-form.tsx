/**
 * Reset Password Form Component
 * Form to set new password using reset token
 */

"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2, Lock, Shield } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthError } from "./auth-error";
import { PasswordInput } from "./password-input";

interface ResetPasswordFormProps {
  token: string;
  onSuccess?: () => void;
  className?: string;
}

/**
 * Reset Password Form
 *
 * Features:
 * - New password and confirm password fields
 * - Password strength indicator
 * - Token validation
 * - Success state after reset
 * - Auto-redirect option
 */
export function ResetPasswordForm({
  token,
  onSuccess,
  className = "",
}: ResetPasswordFormProps) {
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  const passwordValue = watch("password") || "";
  const confirmPasswordValue = watch("confirmPassword") || "";

  const onSubmit = async (data: ResetPasswordFormData) => {
    clearError();
    try {
      await resetPassword(token, data.password);
      setResetSuccess(true);
      onSuccess?.();
    } catch {
      // Error is handled by auth context
    }
  };

  // Success state
  if (resetSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("text-center py-8 space-y-6", className)}
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto"
        >
          <Shield className="w-10 h-10 text-green-600 dark:text-green-400" />
        </motion.div>

        {/* Success Message */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            Password Reset Successful!
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Your password has been reset successfully. You can now log in with
            your new password.
          </p>
        </div>

        {/* Security Tips */}
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground max-w-sm mx-auto text-left">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Security Tips
          </h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Use a unique password for each account</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Enable two-factor authentication when available</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Never share your password with anyone</span>
            </li>
          </ul>
        </div>
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
          Reset Your Password
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new strong password for your account.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <AuthError
          message={error.message}
          onDismiss={clearError}
          className="mb-4"
        />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* New Password Field */}
        <PasswordInput
          value={passwordValue}
          onChange={(value) =>
            setValue("password", value, { shouldValidate: true })
          }
          label="New Password"
          placeholder="Create a strong password"
          error={errors.password?.message}
          disabled={isLoading}
          showStrength={true}
          showRequirements={true}
          id="reset-password"
          name="password"
          autoComplete="new-password"
        />

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="reset-confirmPassword"
            className="block text-sm font-medium text-foreground"
          >
            Confirm New Password
          </label>
          <input
            id="reset-confirmPassword"
            type="password"
            disabled={isLoading}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              errors.confirmPassword &&
                "border-destructive focus-visible:ring-destructive",
              confirmPasswordValue &&
                !errors.confirmPassword &&
                passwordValue === confirmPasswordValue &&
                "border-green-500 focus-visible:ring-green-500",
            )}
            placeholder="Confirm your new password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.confirmPassword.message}
            </motion.p>
          )}
          {confirmPasswordValue &&
            passwordValue === confirmPasswordValue &&
            !errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Passwords match
              </motion.p>
            )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={
            isLoading ||
            !passwordValue ||
            passwordValue !== confirmPasswordValue
          }
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Resetting...
            </>
          ) : (
            <>
              Reset Password
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}

export default ResetPasswordForm;
