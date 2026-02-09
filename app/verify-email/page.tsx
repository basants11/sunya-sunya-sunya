/**
 * Verify Email Page
 *
 * Handles email verification token from email links.
 * URL format: /verify-email?token=<verification_token>
 */

import { Suspense } from "react";
import { VerifyEmailForm } from "./verify-email-form";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailSkeleton />}>
      <VerifyEmailForm />
    </Suspense>
  );
}

function VerifyEmailSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md h-96 bg-muted/50 rounded-lg animate-pulse" />
    </div>
  );
}
