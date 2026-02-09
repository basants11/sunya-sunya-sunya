/**
 * Color Psychology Protocol
 *
 * Contextual color manipulation system designed to trigger
 * specific psychological responses through strategic color usage.
 *
 * PUBLIC FACING: "Dynamic Theme System"
 * INTERNAL: Color psychology manipulation framework
 */

"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// =============================================================================
// URGENT RED GRADIENT
// =============================================================================

interface UrgentRedProps {
  children: React.ReactNode;
  pulseInterval?: number;
  className?: string;
}

/**
 * Urgent: Red gradients with white pulsating border (3s interval)
 */
export function UrgentRed({
  children,
  pulseInterval = 3,
  className,
}: UrgentRedProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={
        !prefersReducedMotion
          ? {
              boxShadow: [
                "0 0 0 0 rgba(239, 68, 68, 0)",
                "0 0 0 4px rgba(239, 68, 68, 0.3)",
                "0 0 0 0 rgba(239, 68, 68, 0)",
              ],
            }
          : {}
      }
      transition={{ duration: pulseInterval, repeat: Infinity }}
      className={cn(
        "relative overflow-hidden rounded-xl",
        "bg-gradient-to-r from-red-500 via-red-600 to-pink-600",
        "text-white p-4",
        className,
      )}
    >
      {/* White pulsating border */}
      <motion.div
        animate={
          !prefersReducedMotion
            ? {
                opacity: [0.3, 0.6, 0.3],
              }
            : {}
        }
        transition={{ duration: pulseInterval, repeat: Infinity }}
        className="absolute inset-0 rounded-xl border-2 border-white/30"
      />

      {/* Shine effect */}
      <motion.div
        animate={!prefersReducedMotion ? { x: ["-100%", "200%"] } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: pulseInterval,
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// =============================================================================
// TRUST BLUE TO GREEN TRANSITION
// =============================================================================

interface TrustTransitionProps {
  children: React.ReactNode;
  isVerified?: boolean;
  className?: string;
}

/**
 * Trust: Blue → green transition on verification completion
 */
export function TrustTransition({
  children,
  isVerified = false,
  className,
}: TrustTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={{
        background: isVerified
          ? "linear-gradient(135deg, #00c950 0%, #00a040 100%)"
          : "linear-gradient(135deg, #457b9d 0%, #1d3557 100%)",
      }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
      className={cn("rounded-xl p-4 text-white transition-all", className)}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={
            isVerified && !prefersReducedMotion
              ? { scale: [1, 1.2, 1], rotate: [0, 360] }
              : {}
          }
          transition={{ duration: 0.5 }}
          className="text-2xl"
        >
          {isVerified ? "✓" : "🔒"}
        </motion.div>
        <div className="flex-1">{children}</div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// REWARD GOLD SPARKLES
// =============================================================================

interface RewardGoldProps {
  children: React.ReactNode;
  amount: number;
  currency?: string;
  className?: string;
}

/**
 * Reward: Gold sparkles on price savings display
 */
export function RewardGold({
  children,
  amount,
  currency = "Rs.",
  className,
}: RewardGoldProps) {
  const prefersReducedMotion = useReducedMotion();
  const [sparkles, setSparkles] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Generate sparkles
    const newSparkles = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: 20 + i * 15,
      y: 10 + (i % 2) * 20,
    }));

    requestAnimationFrame(() => setSparkles(newSparkles));
  }, [prefersReducedMotion]);

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Gold sparkles */}
      {!prefersReducedMotion &&
        sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: sparkle.id * 0.3,
            }}
            className="absolute text-yellow-400 pointer-events-none"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
            }}
          >
            ✨
          </motion.div>
        ))}

      <motion.div
        animate={
          !prefersReducedMotion
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(255, 215, 0, 0)",
                  "0 0 20px 5px rgba(255, 215, 0, 0.3)",
                  "0 0 0 0 rgba(255, 215, 0, 0)",
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity }}
        className={cn(
          "relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-xl",
          "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500",
          "text-amber-900 font-bold",
          className,
        )}
      >
        <span>💰</span>
        <span>
          Save {currency}
          {amount}
        </span>
      </motion.div>

      {children}
    </div>
  );
}

// =============================================================================
// SECURITY SHIELD ANIMATION
// =============================================================================

interface SecurityShieldProps {
  isSecure?: boolean;
  className?: string;
}

/**
 * Security: Shield icons with green fill animation
 */
export function SecurityShield({
  isSecure = true,
  className,
}: SecurityShieldProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn("relative inline-flex items-center gap-2", className)}>
      <div className="relative w-12 h-12">
        {/* Shield background */}
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            className="text-muted"
          />
        </svg>

        {/* Animated fill */}
        <motion.div
          initial={{ height: "0%" }}
          animate={{ height: isSecure ? "100%" : "0%" }}
          transition={{
            duration: prefersReducedMotion ? 0 : 1,
            ease: "easeOut",
          }}
          className="absolute bottom-0 left-0 right-0 overflow-hidden"
          style={{ clipPath: "url(#shield-clip)" }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-12 h-12 absolute bottom-0"
            fill="#00c950"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </motion.div>

        {/* Checkmark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={
            isSecure ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
          }
          transition={{ delay: prefersReducedMotion ? 0 : 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      </div>

      <span
        className={cn(
          "font-semibold",
          isSecure ? "text-green-600" : "text-muted-foreground",
        )}
      >
        {isSecure ? "Secure" : "Checking..."}
      </span>
    </div>
  );
}

// =============================================================================
// EXCLUSIVE PURPLE GRADIENT
// =============================================================================

interface ExclusivePurpleProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Exclusive: Purple gradients with star particle effects
 */
export function ExclusivePurple({ children, className }: ExclusivePurpleProps) {
  const prefersReducedMotion = useReducedMotion();
  const [stars, setStars] = useState<
    Array<{ id: number; x: number; delay: number }>
  >([]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const newStars = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 10 + i * 12,
      delay: i * 0.2,
    }));

    requestAnimationFrame(() => setStars(newStars));
  }, [prefersReducedMotion]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Star particles */}
      {!prefersReducedMotion &&
        stars.map((star) => (
          <motion.div
            key={star.id}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: star.delay,
            }}
            className="absolute text-yellow-300 text-lg pointer-events-none"
            style={{
              left: `${star.x}%`,
              bottom: "10%",
            }}
          >
            ⭐
          </motion.div>
        ))}

      <div
        className={cn(
          "relative z-10 rounded-xl p-6",
          "bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800",
          "text-white",
        )}
      >
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// DOPAMINE COLOR BUTTON
// =============================================================================

type ButtonVariant = "trust" | "urgent" | "reward" | "security" | "exclusive";

interface DopamineColorButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
}

/**
 * Contextual color manipulation button
 */
export function DopamineColorButton({
  children,
  onClick,
  variant = "trust",
  className,
  disabled = false,
}: DopamineColorButtonProps) {
  const prefersReducedMotion = useReducedMotion();

  const variants: Record<ButtonVariant, string> = {
    trust:
      "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
    urgent:
      "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 animate-pulse",
    reward:
      "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:via-yellow-500 hover:to-amber-600 text-amber-900",
    security:
      "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
    exclusive:
      "bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!prefersReducedMotion && !disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={cn(
        "relative px-8 py-4 rounded-xl font-bold text-white",
        "shadow-lg hover:shadow-xl transition-shadow",
        "overflow-hidden",
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {/* Shine effect */}
      <motion.div
        animate={!prefersReducedMotion ? { x: ["-100%", "200%"] } : {}}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// =============================================================================
// EXPORT ALL COMPONENTS
// =============================================================================

export {
  type UrgentRedProps,
  type TrustTransitionProps,
  type RewardGoldProps,
  type SecurityShieldProps,
  type ExclusivePurpleProps,
  type DopamineColorButtonProps,
  type ButtonVariant,
};
