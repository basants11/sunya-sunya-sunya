/**
 * Verify Email Form Component
 *
 * Client component that handles the email verification logic.
 * Separated from page to allow Suspense wrapping.
 */

"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Home,
  Loader2,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmail, isLoading: authLoading } = useAuth();

  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      queueMicrotask(() => {
        setStatus("error");
        setError(
          "Invalid or missing verification token. Please request a new verification email.",
        );
      });
      return;
    }

    // Auto-verify on page load
    const doVerification = async () => {
      if (isVerifying) return;
      setIsVerifying(true);

      try {
        await verifyEmail(token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setError(
          err instanceof Error
            ? err.message
            : "Failed to verify email. The token may be expired or invalid.",
        );
      } finally {
        setIsVerifying(false);
      }
    };

    doVerification();
  }, [token, verifyEmail, isVerifying]);

  // Loading state
  if (status === "loading" || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <CardTitle className="text-2xl mb-2">Verifying Email...</CardTitle>
            <CardDescription>
              Please wait while we verify your email address.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (status === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl mb-2">Email Verified!</CardTitle>
            <CardDescription className="mb-6">
              Your email has been successfully verified. You can now access all
              features of your account.
            </CardDescription>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/account")}
                className="w-full"
              >
                Go to My Account
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="w-full"
              >
                <Home className="mr-2 w-4 h-4" />
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Verification Failed</CardTitle>
          <CardDescription>
            We couldn&apos;t verify your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">
                  Need a new verification email?
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  You can request a new verification email from your account
                  settings or during login.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Button
              onClick={() => router.push("/?login=true")}
              className="w-full"
            >
              Sign In to Resend
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full"
            >
              <Home className="mr-2 w-4 h-4" />
              Go Home
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
