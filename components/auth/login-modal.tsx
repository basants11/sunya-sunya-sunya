/**
 * Login Modal Component
 * Full authentication modal with tabs for login, register, and password reset
 */

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Shield, User, X } from "lucide-react";
import { useState } from "react";
import { EmailLoginForm } from "./email-login-form";
import { EmailRegisterForm } from "./email-register-form";
import { ForgotPasswordForm } from "./forgot-password-form";
import { GoogleButton } from "./google-button";

type AuthView = "login" | "register" | "forgot-password";

interface LoginModalProps {
  className?: string;
}

/**
 * Login Modal
 *
 * Features:
 * - Tabbed interface for Login/Register
 * - Google OAuth integration
 * - Forgot password flow
 * - Smooth animations
 * - Accessible modal with focus trapping
 */
export function LoginModal({ className = "" }: LoginModalProps) {
  const { isLoginModalOpen, closeLoginModal, isLoading } = useAuth();
  const [activeView, setActiveView] = useState<AuthView>("login");

  // Handle modal close
  const handleClose = () => {
    closeLoginModal();
    // Reset to login view after animation
    setTimeout(() => setActiveView("login"), 300);
  };

  // Handle view changes
  const handleViewChange = (view: AuthView) => {
    setActiveView(view);
  };

  if (!isLoginModalOpen) return null;

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              "relative w-full max-w-md bg-background rounded-2xl shadow-2xl overflow-hidden",
              className,
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 border-b border-border">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Title */}
              <div className="text-center pr-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    {activeView === "forgot-password" ? (
                      <Shield className="w-5 h-5 text-primary" />
                    ) : (
                      <User className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </div>
                <h2
                  id="auth-modal-title"
                  className="text-xl font-semibold text-foreground"
                >
                  {activeView === "login" && "Welcome Back"}
                  {activeView === "register" && "Create Account"}
                  {activeView === "forgot-password" && "Reset Password"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeView === "login" && "Sign in to access your account"}
                  {activeView === "register" &&
                    "Join us for a healthier lifestyle"}
                  {activeView === "forgot-password" &&
                    "We'll help you recover your account"}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {/* Forgot Password View */}
                {activeView === "forgot-password" && (
                  <motion.div
                    key="forgot-password"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ForgotPasswordForm
                      onBack={() => handleViewChange("login")}
                    />
                  </motion.div>
                )}

                {/* Login/Register Views */}
                {(activeView === "login" || activeView === "register") && (
                  <motion.div
                    key="auth-forms"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Google Sign In */}
                    <GoogleButton
                      text="Continue with Google"
                      className="w-full"
                    />

                    {/* Divider */}
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-background px-2 text-xs text-muted-foreground uppercase">
                          or continue with email
                        </span>
                      </div>
                    </div>

                    {/* Tabs for Login/Register */}
                    <Tabs
                      value={activeView}
                      onValueChange={(value: string) =>
                        handleViewChange(value as AuthView)
                      }
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="login" disabled={isLoading}>
                          Login
                        </TabsTrigger>
                        <TabsTrigger value="register" disabled={isLoading}>
                          Register
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="login" className="mt-0">
                        <EmailLoginForm
                          onSuccess={handleClose}
                          onForgotPassword={() =>
                            handleViewChange("forgot-password")
                          }
                        />
                      </TabsContent>

                      <TabsContent value="register" className="mt-0">
                        <EmailRegisterForm
                          onSuccess={() => {
                            // Switch to login after successful registration
                            handleViewChange("login");
                          }}
                        />
                      </TabsContent>
                    </Tabs>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-muted/30 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our{" "}
                <a
                  href="/terms-and-conditions"
                  className="text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    handleClose();
                    window.location.href = "/terms-and-conditions";
                  }}
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  className="text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    handleClose();
                    window.location.href = "/privacy-policy";
                  }}
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default LoginModal;
