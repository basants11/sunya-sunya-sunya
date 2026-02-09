/**
 * Reset Password Page
 *
 * Handles password reset token from email links.
 * URL format: /reset-password?token=<reset_token>
 */

import { Suspense } from "react";
import { ResetPasswordForm } from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md h-96 bg-muted/50 rounded-lg animate-pulse" />
    </div>
  );
}
