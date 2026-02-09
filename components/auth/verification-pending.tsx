/**
 * Verification Pending Component
 * Shows email verification pending state with resend option
 */

"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Mail, RefreshCw } from "lucide-react";
import { useState } from "react";

interface VerificationPendingProps {
  email: string;
  onBack?: () => void;
  className?: string;
}

/**
 * Verification Pending Screen
 *
 * Features:
 * - Shows verification email sent state
 * - Resend verification email functionality
 * - Back to login option
 * - Success animation on resend
 */
export function VerificationPending({
  email,
  onBack,
  className = "",
}: VerificationPendingProps) {
  const { resendVerification, isLoading } = useAuth();
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleResend = async () => {
    if (resendTimer > 0) return;

    try {
      await resendVerification(email);
      setResendSuccess(true);
      setResendTimer(60); // 60 second cooldown

      // Reset success message after 3 seconds
      setTimeout(() => setResendSuccess(false), 3000);

      // Countdown timer
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Failed to resend verification:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("text-center py-6 space-y-6", className)}
    >
      {/* Icon */}
      <div className="relative mx-auto w-20 h-20">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center"
        >
          <Mail className="w-10 h-10 text-primary" />
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-background"
        >
          <CheckCircle className="w-4 h-4 text-white" />
        </motion.div>
      </div>

      {/* Text Content */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">
          Verify Your Email
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          We have sent a verification email to{" "}
          <span className="font-medium text-foreground">{email}</span>. Please
          check your inbox and click the verification link to complete your
          registration.
        </p>
      </div>

      {/* Resend Section */}
      <div className="space-y-3">
        {resendSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Verification email resent successfully!
          </motion.div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Did not receive the email?
          </p>
        )}

        <Button
          variant="outline"
          onClick={handleResend}
          disabled={isLoading || resendTimer > 0}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : resendTimer > 0 ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Resend in {resendTimer}s
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Resend Verification Email
            </>
          )}
        </Button>
      </div>

      {/* Back Button */}
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
      )}

      {/* Help Text */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Make sure to check your spam folder. If you still do not see the
          email, try resending or contact support.
        </p>
      </div>
    </motion.div>
  );
}

export default VerificationPending;
