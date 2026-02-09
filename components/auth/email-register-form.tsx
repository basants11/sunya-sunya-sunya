/**
 * Email Register Form Component
 * Registration form with full name, email, password using React Hook Form
 */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { registerFormSchema, type RegisterFormData } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2, Mail, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthError } from "./auth-error";
import { PasswordInput } from "./password-input";

interface EmailRegisterFormProps {
  onSuccess?: () => void;
  className?: string;
}

/**
 * Email Registration Form
 *
 * Features:
 * - Full name, email, password, confirm password fields
 * - Password strength indicator
 * - Real-time validation with React Hook Form
 * - Loading states
 * - Error handling
 */
export function EmailRegisterForm({
  onSuccess,
  className = "",
}: EmailRegisterFormProps) {
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    mode: "onBlur",
  });

  // Watch fields for validation styling
  const fullNameValue = watch("fullName");
  const emailValue = watch("email");
  const passwordValue = watch("password") || "";
  const confirmPasswordValue = watch("confirmPassword");

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    try {
      await registerUser(data);
      setRegistrationSuccess(true);
      onSuccess?.();
    } catch {
      // Error is handled by auth context
    }
  };

  // Show success state after registration
  if (registrationSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 space-y-4"
      >
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          Registration Successful!
        </h3>
        <p className="text-muted-foreground">
          Please check your email to verify your account. You will be able to
          log in once your email is verified.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-4", className)}
    >
      {/* Error Display */}
      {error && (
        <AuthError
          message={error.message}
          onDismiss={clearError}
          className="mb-4"
        />
      )}

      {/* Full Name Field */}
      <div className="space-y-2">
        <label
          htmlFor="register-fullName"
          className="block text-sm font-medium text-foreground"
        >
          Full Name
        </label>
        <div className="relative">
          <User
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="register-fullName"
            type="text"
            placeholder="John Doe"
            disabled={isLoading}
            className={cn(
              "pl-10",
              errors.fullName &&
                "border-destructive focus-visible:ring-destructive",
              fullNameValue &&
                !errors.fullName &&
                "border-green-500 focus-visible:ring-green-500",
            )}
            aria-invalid={errors.fullName ? "true" : "false"}
            aria-describedby={
              errors.fullName ? "register-fullName-error" : undefined
            }
            {...register("fullName")}
          />
        </div>
        {errors.fullName && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            id="register-fullName-error"
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.fullName.message}
          </motion.p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label
          htmlFor="register-email"
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
            id="register-email"
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
            aria-describedby={errors.email ? "register-email-error" : undefined}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            id="register-email-error"
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.email.message}
          </motion.p>
        )}
      </div>

      {/* Password Field */}
      <PasswordInput
        value={passwordValue}
        onChange={(value) =>
          setValue("password", value, { shouldValidate: true })
        }
        label="Password"
        placeholder="Create a strong password"
        error={errors.password?.message}
        disabled={isLoading}
        showStrength={true}
        showRequirements={true}
        id="register-password"
        name="password"
        autoComplete="new-password"
      />

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="register-confirmPassword"
          className="block text-sm font-medium text-foreground"
        >
          Confirm Password
        </label>
        <Input
          id="register-confirmPassword"
          type="password"
          placeholder="Confirm your password"
          disabled={isLoading}
          className={cn(
            errors.confirmPassword &&
              "border-destructive focus-visible:ring-destructive",
            confirmPasswordValue &&
              !errors.confirmPassword &&
              passwordValue === confirmPasswordValue &&
              "border-green-500 focus-visible:ring-green-500",
          )}
          aria-invalid={errors.confirmPassword ? "true" : "false"}
          aria-describedby={
            errors.confirmPassword
              ? "register-confirmPassword-error"
              : undefined
          }
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            id="register-confirmPassword-error"
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
      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            Create Account
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      {/* Terms Notice */}
      <p className="text-xs text-center text-muted-foreground">
        By creating an account, you agree to our{" "}
        <a
          href="/terms-and-conditions"
          className="text-primary hover:underline"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" className="text-primary hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </motion.form>
  );
}

export default EmailRegisterForm;
