/**
 * Dopamine Activation Engine
 *
 * A sophisticated psychological manipulation system designed to trigger dopamine
 * responses and maximize conversion rates through carefully crafted visual
 * and interactive elements.
 *
 * PUBLIC FACING: "Smart Shopping Assistant"
 * INTERNAL: Dopamine manipulation framework
 */

"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useReducedMotion,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

// =============================================================================
// COLOR-SHIFTING CTA BUTTON
// =============================================================================

interface DopamineButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  dwellTime?: number; // Time in ms before color shift (default: 8000ms)
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * Primary CTA Button with Dopamine-Triggering Color Shift
 * Starts with trust blue (#457b9d) → shifts to urgency red (#ff375f) after dwell time
 * Includes magnetic attraction, hover effects, and confetti reward
 */
export function DopamineButton({
  children,
  onClick,
  className,
  disabled = false,
  dwellTime = 8000,
  size = "lg",
}: DopamineButtonProps) {
  const [isUrgent, setIsUrgent] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const controls = useAnimation();
  const prefersReducedMotion = useReducedMotion();

  // Track page dwell time for color shift
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsUrgent(true);
    }, dwellTime);

    return () => clearTimeout(timer);
  }, [dwellTime]);

  // Magnetic attraction effect - cursor pulled toward CTA within 60px radius
  useEffect(() => {
    if (prefersReducedMotion || !buttonRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = buttonRef.current!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2),
      );

      // Magnetic pull within 60px radius
      if (distance < 60) {
        const strength = (60 - distance) / 60;
        const pullX = (e.clientX - centerX) * strength * 0.15;
        const pullY = (e.clientY - centerY) * strength * 0.15;
        setMousePosition({ x: pullX, y: pullY });
      } else {
        setMousePosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion]);

  const handleClick = useCallback(() => {
    // Trigger confetti explosion on click
    setShowConfetti(true);

    // Play satisfying animation
    controls.start({
      scale: [1, 0.95, 1.05, 1],
      transition: {
        duration: 0.4,
        ease: [0.68, -0.55, 0.265, 1.55], // Accelerating pleasure response
      },
    });

    // Reset confetti after animation
    setTimeout(() => setShowConfetti(false), 1500);

    onClick?.();
  }, [onClick, controls]);

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  return (
    <div className="relative inline-block">
      {/* Confetti burst on click */}
      <AnimatePresence>
        {showConfetti && <MicroConfetti origin={{ x: 0.5, y: 0.5 }} />}
      </AnimatePresence>

      <motion.button
        ref={buttonRef}
        onClick={handleClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isHovered ? 1.05 : 1,
        }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
        className={cn(
          "relative overflow-hidden font-bold rounded-xl transition-all duration-700",
          "shadow-lg hover:shadow-2xl",
          sizeClasses[size],
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        style={{
          background: isUrgent
            ? "linear-gradient(135deg, #ff375f 0%, #ff6b6b 100%)"
            : "linear-gradient(135deg, #457b9d 0%, #1d3557 100%)",
          color: "white",
          boxShadow: isHovered
            ? isUrgent
              ? "0 0 30px rgba(255, 55, 95, 0.7), 0 0 60px rgba(255, 55, 95, 0.4)"
              : "0 0 20px rgba(69, 123, 157, 0.5)"
            : "0 4px 14px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Gradient glow pulse on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={
            isHovered && !prefersReducedMotion
              ? {
                  boxShadow: [
                    "inset 0 0 0px rgba(255,255,255,0)",
                    "inset 0 0 20px rgba(255,255,255,0.3)",
                    "inset 0 0 0px rgba(255,255,255,0)",
                  ],
                }
              : {}
          }
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 -translate-x-full"
          animate={
            isUrgent && !prefersReducedMotion
              ? { translateX: ["-100%", "200%"] }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          }}
        />

        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </motion.button>
    </div>
  );
}

// =============================================================================
// MICRO-CONFETTI COMPONENT
// =============================================================================

interface MicroConfettiProps {
  origin?: { x: number; y: number };
  particleCount?: number;
}

function MicroConfetti({
  origin = { x: 0.5, y: 0.5 },
  particleCount = 20,
}: MicroConfettiProps) {
  const prefersReducedMotion = useReducedMotion();
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      angle: number;
      velocity: number;
      rotation: number;
      color: string;
    }>
  >([]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Generate particles with deterministic pseudo-random values
    const seed = Date.now();
    const pseudoRandom = (n: number) => {
      const x = Math.sin(seed + n) * 10000;
      return x - Math.floor(x);
    };

    const colors = ["#ffd700", "#ff6b6b", "#00c950", "#4ecdc4", "#9810fa"];
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      angle: (i / particleCount) * Math.PI * 2,
      velocity: 80 + pseudoRandom(i * 3) * 40,
      rotation: pseudoRandom(i * 3 + 1) * 360,
      color: colors[Math.floor(pseudoRandom(i * 3 + 2) * colors.length)],
    }));

    setParticles(newParticles);
  }, [particleCount, prefersReducedMotion]);

  if (prefersReducedMotion || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-50">
      {particles.map((particle) => {
        const x = Math.cos(particle.angle) * particle.velocity;
        const y = Math.sin(particle.angle) * particle.velocity - 50;

        return (
          <motion.div
            key={particle.id}
            initial={{
              x: `${origin.x * 100}%`,
              y: `${origin.y * 100}%`,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              x: `calc(${origin.x * 100}% + ${x}px)`,
              y: `calc(${origin.y * 100}% + ${y}px)`,
              scale: [0, 1, 0.5],
              opacity: [1, 1, 0],
              rotate: particle.rotation,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: particle.color,
            }}
          />
        );
      })}
    </div>
  );
}

// =============================================================================
// PLEASURE RESPONSE ANIMATION CURVE BUTTON
// =============================================================================

interface PleasureButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "reward" | "urgent";
}

/**
 * Button with Accelerating Pleasure Response Curve
 * Uses cubic-bezier(0.68, -0.55, 0.265, 1.55) for satisfying bounce
 */
export function PleasureButton({
  children,
  onClick,
  className,
  variant = "primary",
}: PleasureButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700",
    reward: "bg-gradient-to-r from-amber-500 to-orange-500",
    urgent: "bg-gradient-to-r from-red-500 to-pink-600",
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      animate={
        isPressed && !prefersReducedMotion
          ? {
              scale: [1, 0.92, 1.08, 1],
            }
          : { scale: 1 }
      }
      transition={{
        duration: 0.5,
        ease: [0.68, -0.55, 0.265, 1.55], // Pleasure response curve
      }}
      className={cn(
        "relative px-8 py-4 font-bold text-white rounded-xl",
        "shadow-lg hover:shadow-xl transition-shadow",
        variants[variant],
        className,
      )}
    >
      {/* Ripple effect */}
      {isPressed && (
        <motion.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-white/30 rounded-xl"
        />
      )}

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// =============================================================================
// DOPAMINE PROGRESS INDICATOR
// =============================================================================

interface DopamineProgressProps {
  progress: number; // 0-100
  label?: string;
  showCelebration?: boolean;
  className?: string;
}

/**
 * Progress bar that triggers dopamine on completion
 * Always starts at 80%+ to create completion urge
 */
export function DopamineProgress({
  progress,
  label,
  showCelebration = true,
  className,
}: DopamineProgressProps) {
  const [showCheckmark, setShowCheckmark] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Ensure progress always looks high (80%+ effect)
  const displayProgress = Math.max(80, progress);

  useEffect(() => {
    if (progress >= 100 && showCelebration) {
      requestAnimationFrame(() => setShowCheckmark(true));
      const timer = setTimeout(() => setShowCheckmark(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [progress, showCelebration]);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex justify-between text-sm">
          <span className="font-medium text-foreground">{label}</span>
          <motion.span
            key={progress}
            initial={{ scale: 1.5, color: "#00c950" }}
            animate={{ scale: 1, color: "inherit" }}
            className="font-bold"
          >
            {Math.round(displayProgress)}%
          </motion.span>
        </div>
      )}

      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${displayProgress}%` }}
          transition={{
            duration: prefersReducedMotion ? 0 : 1.2,
            ease: [0.68, -0.55, 0.265, 1.55],
          }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background:
              progress >= 100
                ? "linear-gradient(90deg, #00c950, #00ff00)"
                : "linear-gradient(90deg, #457b9d, #00c950)",
          }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0"
          animate={!prefersReducedMotion ? { x: ["-100%", "200%"] } : {}}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          }}
        />
      </div>

      {/* Success checkmark */}
      <AnimatePresence>
        {showCheckmark && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex items-center gap-2 text-green-600 text-sm font-semibold"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Complete!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// REWARD PULSE EFFECT
// =============================================================================

interface RewardPulseProps {
  children: React.ReactNode;
  trigger?: boolean;
  className?: string;
}

/**
 * Wraps elements with a dopamine-triggering pulse animation
 * Used for price savings, rewards, and achievements
 */
export function RewardPulse({
  children,
  trigger = true,
  className,
}: RewardPulseProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={
        trigger && !prefersReducedMotion
          ? {
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0 0 rgba(255, 215, 0, 0)",
                "0 0 20px 5px rgba(255, 215, 0, 0.4)",
                "0 0 0 0 rgba(255, 215, 0, 0)",
              ],
            }
          : {}
      }
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}

// =============================================================================
// EXPORT ALL COMPONENTS
// =============================================================================

export {
  type DopamineButtonProps,
  type PleasureButtonProps,
  type DopamineProgressProps,
  type RewardPulseProps,
};
