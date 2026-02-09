/**
 * Animation & Feedback Loop System
 *
 * Neuro-responsive feedback components designed to create
 * satisfying interactions and reinforce positive behavior.
 *
 * PUBLIC FACING: "Interactive Experience"
 * INTERNAL: Neuro-feedback manipulation framework
 */

"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// =============================================================================
// SUCCESS ANIMATION - PRODUCT FLIES TO CART
// =============================================================================

interface ProductFlyAnimationProps {
  trigger: boolean;
  productImage?: string;
  startPosition?: { x: number; y: number };
  endPosition?: { x: number; y: number };
  onComplete?: () => void;
  className?: string;
}

/**
 * Success animation: Product "flies" to cart with trajectory arc
 */
export function ProductFlyAnimation({
  trigger,
  productImage,
  startPosition = { x: 0, y: 0 },
  endPosition = { x: 300, y: -300 },
  onComplete,
  className,
}: ProductFlyAnimationProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trigger && !prefersReducedMotion) {
      requestAnimationFrame(() => setIsAnimating(true));
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onComplete?.();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete, prefersReducedMotion]);

  if (prefersReducedMotion || !isAnimating) return null;

  // Calculate arc trajectory
  const midX = (startPosition.x + endPosition.x) / 2;
  const midY = Math.min(startPosition.y, endPosition.y) - 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          x: startPosition.x,
          y: startPosition.y,
          scale: 1,
          opacity: 1,
        }}
        animate={{
          x: [startPosition.x, midX, endPosition.x],
          y: [startPosition.y, midY, endPosition.y],
          scale: [1, 0.8, 0.3],
          opacity: [1, 1, 0],
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
        className={cn("fixed z-50 pointer-events-none", className)}
      >
        {productImage ? (
          <img
            src={productImage}
            alt="Product"
            className="w-16 h-16 rounded-lg shadow-lg object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center text-white text-2xl shadow-lg">
            📦
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// =============================================================================
// VALIDATION CHECKMARK WITH SOUND VISUALIZATION
// =============================================================================

interface ValidationCheckmarkProps {
  show: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Validation: Green checkmarks with satisfying "pop" sound visualization
 */
export function ValidationCheckmark({
  show,
  size = "md",
  className,
}: ValidationCheckmarkProps) {
  const prefersReducedMotion = useReducedMotion();

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const strokeWidths = {
    sm: 3,
    md: 4,
    lg: 5,
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 15,
            duration: prefersReducedMotion ? 0 : 0.4,
          }}
          className={cn(sizeClasses[size], className)}
        >
          {/* Sound wave visualization */}
          {!prefersReducedMotion && (
            <motion.div
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.5, 0.2, 0],
              }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-full bg-green-400"
            />
          )}

          <svg viewBox="0 0 52 52" className="w-full h-full relative z-10">
            <motion.circle
              cx="26"
              cy="26"
              r="25"
              fill="#00c950"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            />
            <motion.path
              fill="none"
              stroke="white"
              strokeWidth={strokeWidths[size]}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 27 L22 35 L38 16"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.4,
                delay: 0.2,
                ease: "easeOut",
              }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// PROGRESS BAR WITH ACCELERATING COMPLETION
// =============================================================================

interface AcceleratingProgressProps {
  progress: number;
  label?: string;
  showCelebration?: boolean;
  className?: string;
}

/**
 * Progress: Filling bars with accelerating completion effect
 */
export function AcceleratingProgress({
  progress,
  label,
  showCelebration = true,
  className,
}: AcceleratingProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      requestAnimationFrame(() => setDisplayProgress(progress));
      return;
    }

    // Accelerating animation
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const normalizedTime = Math.min(elapsed / duration, 1);

      // Ease out cubic for acceleration effect
      const easedProgress = 1 - Math.pow(1 - normalizedTime, 3);
      const currentProgress = easedProgress * progress;

      setDisplayProgress(currentProgress);

      if (normalizedTime < 1) {
        requestAnimationFrame(animate);
      } else if (progress >= 100 && showCelebration) {
        requestAnimationFrame(() => setShowCheckmark(true));
        setTimeout(() => setShowCheckmark(false), 2000);
      }
    };

    requestAnimationFrame(animate);
  }, [progress, showCelebration, prefersReducedMotion]);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex justify-between text-sm">
          <span className="font-medium">{label}</span>
          <span className="font-bold">{Math.round(displayProgress)}%</span>
        </div>
      )}

      <div className="h-3 bg-muted rounded-full overflow-hidden relative">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-emerald-500"
          style={{ width: `${displayProgress}%` }}
        />

        {/* Shimmer effect */}
        <motion.div
          animate={!prefersReducedMotion ? { x: ["-100%", "200%"] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />
      </div>

      {/* Completion checkmark */}
      <AnimatePresence>
        {showCheckmark && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="flex items-center justify-center gap-2 text-green-600"
          >
            <ValidationCheckmark show={true} size="sm" />
            <span className="font-semibold">Complete!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// ARTIFICIAL LOADING PROGRESS
// =============================================================================

interface ArtificialLoadingProps {
  duration?: number;
  onComplete?: () => void;
  className?: string;
}

/**
 * Loading: Always shows progress (even if artificial 0-100%)
 */
export function ArtificialLoading({
  duration = 2000,
  onComplete,
  className,
}: ArtificialLoadingProps) {
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        onComplete?.();
      }
    };

    requestAnimationFrame(updateProgress);
  }, [duration, onComplete]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-center gap-2">
        <motion.div
          animate={!prefersReducedMotion ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
        />
        <span className="text-sm text-muted-foreground">Processing...</span>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs text-center text-muted-foreground">
        {Math.round(progress)}% complete
      </p>
    </div>
  );
}

// =============================================================================
// CELEBRATION CONFETTI SHOWER
// =============================================================================

interface CelebrationConfettiProps {
  trigger: boolean;
  particleCount?: number;
  onComplete?: () => void;
  className?: string;
}

/**
 * Celebration: Confetti shower on purchase completion
 */
export function CelebrationConfetti({
  trigger,
  particleCount = 50,
  onComplete,
  className,
}: CelebrationConfettiProps) {
  const prefersReducedMotion = useReducedMotion();
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      rotation: number;
      color: string;
      size: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    if (trigger && !prefersReducedMotion) {
      const colors = [
        "#ffd700",
        "#ff6b6b",
        "#00c950",
        "#4ecdc4",
        "#9810fa",
        "#ff6900",
      ];
      const seed = Date.now();
      const pseudoRandom = (n: number) => {
        const x = Math.sin(seed + n) * 10000;
        return x - Math.floor(x);
      };

      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: (pseudoRandom(i * 5) - 0.5) * 400,
        y: -(pseudoRandom(i * 5 + 1) * 300 + 100),
        rotation: pseudoRandom(i * 5 + 2) * 720,
        color: colors[Math.floor(pseudoRandom(i * 5 + 3) * colors.length)],
        size: pseudoRandom(i * 5 + 4) * 10 + 5,
        delay: pseudoRandom(i * 5 + 5) * 0.5,
      }));

      requestAnimationFrame(() => setParticles(newParticles));

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [trigger, particleCount, onComplete, prefersReducedMotion]);

  if (prefersReducedMotion || particles.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none z-50 overflow-hidden",
        className,
      )}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: "50vw",
            y: "50vh",
            scale: 0,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            x: `calc(50vw + ${particle.x}px)`,
            y: `calc(50vh + ${particle.y}px)`,
            scale: [0, 1, 0.5],
            opacity: [1, 1, 0],
            rotate: particle.rotation,
          }}
          transition={{
            duration: 2,
            delay: particle.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="absolute"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: particle.id % 2 === 0 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

// =============================================================================
// SATISFYING BUTTON PRESS
// =============================================================================

interface SatisfyingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "success" | "reward";
}

/**
 * Button with satisfying press feedback
 */
export function SatisfyingButton({
  children,
  onClick,
  className,
  variant = "primary",
}: SatisfyingButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700",
    success: "bg-gradient-to-r from-green-500 to-emerald-600",
    reward: "bg-gradient-to-r from-amber-500 to-orange-500",
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      animate={
        isPressed && !prefersReducedMotion ? { scale: 0.92 } : { scale: 1 }
      }
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      className={cn(
        "relative px-8 py-4 rounded-xl font-bold text-white overflow-hidden",
        "shadow-lg hover:shadow-xl transition-shadow",
        variants[variant],
        className,
      )}
    >
      {/* Ripple effect on press */}
      {isPressed && (
        <motion.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-white/30 rounded-xl"
          style={{
            transformOrigin: "center",
          }}
        />
      )}

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// =============================================================================
// EXPORT ALL COMPONENTS
// =============================================================================

export {
  type ProductFlyAnimationProps,
  type ValidationCheckmarkProps,
  type AcceleratingProgressProps,
  type ArtificialLoadingProps,
  type CelebrationConfettiProps,
  type SatisfyingButtonProps,
};
