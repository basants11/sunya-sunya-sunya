/**
 * Neuro-Psychological Animation Components
 *
 * A collection of animation components designed to trigger positive psychological responses
 * and increase conversion rates through ethical micro-interactions.
 *
 * Neuro-psychological principles applied:
 * - Dopamine triggers: Reward feedback, celebration effects
 * - Scarcity/urgency: Visual cues that create FOMO without manipulation
 * - Social proof: Animated indicators of activity
 * - Progress indication: Visual feedback for actions
 * - Micro-delights: Small moments of joy in interactions
 */

"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useReducedMotion,
} from "framer-motion";
import { useCallback, useEffect, useState } from "react";

// =============================================================================
// DOPAMINE TRIGGER ANIMATIONS
// =============================================================================

/**
 * Confetti Burst Effect
 * Triggers dopamine release through celebration animation
 */
interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  isCircle: boolean;
}

interface ConfettiBurstProps {
  trigger: boolean;
  onComplete?: () => void;
  particleCount?: number;
  origin?: { x: number; y: number };
}

const CONFETTI_COLORS = [
  "#00c950",
  "#ffd700",
  "#ff6900",
  "#4ecdc4",
  "#ff6b6b",
  "#9810fa",
];

export function ConfettiBurst({
  trigger,
  onComplete,
  particleCount = 30,
  origin = { x: 0.5, y: 0.5 },
}: ConfettiBurstProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (trigger && !prefersReducedMotion) {
      // Use a seeded random approach to avoid impure function calls during render
      const seed = Date.now();
      const pseudoRandom = (n: number) => {
        const x = Math.sin(seed + n) * 10000;
        return x - Math.floor(x);
      };
      const newPieces: ConfettiPiece[] = Array.from(
        { length: particleCount },
        (_, i) => ({
          id: i,
          x: (pseudoRandom(i * 6 + 1) - 0.5) * 400,
          y: -(pseudoRandom(i * 6 + 2) * 300 + 100),
          rotation: pseudoRandom(i * 6 + 3) * 720 - 360,
          color:
            CONFETTI_COLORS[
              Math.floor(pseudoRandom(i * 6 + 4) * CONFETTI_COLORS.length)
            ],
          size: pseudoRandom(i * 6 + 5) * 8 + 4,
          isCircle: pseudoRandom(i * 6 + 6) > 0.5,
        }),
      );
      // Use requestAnimationFrame to avoid sync setState
      requestAnimationFrame(() => setPieces(newPieces));

      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [trigger, particleCount, onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-visible"
      style={{ zIndex: 100 }}
    >
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{
              x: `${origin.x * 100}%`,
              y: `${origin.y * 100}%`,
              scale: 0,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              x: `calc(${origin.x * 100}% + ${piece.x}px)`,
              y: `calc(${origin.y * 100}% + ${piece.y}px)`,
              scale: [0, 1.2, 0.8],
              rotate: piece.rotation,
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="absolute"
            style={{
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              borderRadius: piece.isCircle ? "50%" : "2px",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Success Checkmark Animation
 * Provides immediate positive feedback for completed actions
 */
interface SuccessCheckmarkProps {
  show: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SuccessCheckmark({
  show,
  size = "md",
  className,
}: SuccessCheckmarkProps) {
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

  if (!show) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 15,
        duration: prefersReducedMotion ? 0 : 0.4,
      }}
      className={cn(sizeClasses[size], className)}
    >
      <svg viewBox="0 0 52 52" className="w-full h-full">
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
  );
}

/**
 * Ripple Effect on Click
 * Creates satisfying tactile feedback sensation
 */
interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  rippleColor?: string;
}

export function RippleButton({
  children,
  onClick,
  className,
  disabled = false,
  rippleColor = "rgba(255, 255, 255, 0.4)",
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<
    { x: number; y: number; id: number }[]
  >([]);
  const prefersReducedMotion = useReducedMotion();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (!prefersReducedMotion) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();

      setRipples((prev) => [...prev, { x, y, id }]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }

    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn("relative overflow-hidden", className)}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
            backgroundColor: rippleColor,
          }}
        />
      ))}
      {children}
    </button>
  );
}

// =============================================================================
// SCARCITY & URGENCY ANIMATIONS
// =============================================================================

/**
 * Pulsing Badge for Limited Stock
 * Creates subtle urgency without being aggressive
 */
interface StockBadgeProps {
  stock: number;
  threshold?: number;
  className?: string;
}

export function StockBadge({
  stock,
  threshold = 10,
  className,
}: StockBadgeProps) {
  const prefersReducedMotion = useReducedMotion();
  const isLow = stock <= threshold;
  const isCritical = stock <= 3;

  return (
    <motion.div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
        isCritical
          ? "bg-red-100 text-red-700 border border-red-200"
          : isLow
            ? "bg-orange-100 text-orange-700 border border-orange-200"
            : "bg-green-100 text-green-700 border border-green-200",
        className,
      )}
      animate={
        isLow && !prefersReducedMotion
          ? {
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0 0 rgba(239, 68, 68, 0)",
                "0 0 0 4px rgba(239, 68, 68, 0.1)",
                "0 0 0 0 rgba(239, 68, 68, 0)",
              ],
            }
          : {}
      }
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <span
        className={cn(
          "w-2 h-2 rounded-full",
          isCritical ? "bg-red-500" : isLow ? "bg-orange-500" : "bg-green-500",
        )}
      />
      {isCritical
        ? `Only ${stock} left!`
        : isLow
          ? `${stock} remaining`
          : "In Stock"}
    </motion.div>
  );
}

/**
 * Countdown Timer with Visual Urgency
 */
interface CountdownTimerProps {
  endTime: Date;
  className?: string;
  onComplete?: () => void;
}

export function CountdownTimer({
  endTime,
  className,
  onComplete,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isUrgent, setIsUrgent] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      const diff = end - now;

      if (diff <= 0) {
        onComplete?.();
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const urgent = diff < 5 * 60 * 1000; // Less than 5 minutes
      return { hours, minutes, seconds, urgent };
    };

    const updateTime = () => {
      const result = calculateTimeLeft();
      setTimeLeft({
        hours: result.hours,
        minutes: result.minutes,
        seconds: result.seconds,
      });
      setIsUrgent(result.urgent ?? false);
    };

    // Use requestAnimationFrame for initial calculation to avoid sync setState
    requestAnimationFrame(updateTime);

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [endTime, onComplete]);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <motion.div
        animate={
          isUrgent && !prefersReducedMotion
            ? {
                scale: [1, 1.02, 1],
              }
            : {}
        }
        transition={{ duration: 0.5, repeat: Infinity }}
        className={cn(
          "flex items-center gap-1 px-3 py-2 rounded-lg font-mono font-bold",
          isUrgent
            ? "bg-red-100 text-red-700 border-2 border-red-300"
            : "bg-amber-100 text-amber-700 border border-amber-200",
        )}
      >
        <span>{formatNumber(timeLeft.hours)}</span>
        <span className="text-xs">:</span>
        <span>{formatNumber(timeLeft.minutes)}</span>
        <span className="text-xs">:</span>
        <motion.span
          animate={!prefersReducedMotion ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {formatNumber(timeLeft.seconds)}
        </motion.span>
      </motion.div>
      {isUrgent && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-red-600 text-sm font-semibold"
        >
          Hurry!
        </motion.span>
      )}
    </div>
  );
}

// =============================================================================
// SOCIAL PROOF ANIMATIONS
// =============================================================================

/**
 * Live Activity Indicator
 * Shows real-time activity to build trust
 */
interface LiveActivityProps {
  activities: string[];
  interval?: number;
  className?: string;
}

export function LiveActivity({
  activities,
  interval = 4000,
  className,
}: LiveActivityProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, interval);

    return () => clearInterval(timer);
  }, [activities.length, interval]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground",
        className,
      )}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
          transition={{ duration: 0.3 }}
          className="text-foreground/80"
        >
          {activities[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/**
 * Recent Purchase Notification
 * Shows recent purchases to create social proof
 */
interface PurchaseNotificationProps {
  purchases: Array<{
    name: string;
    location: string;
    time: string;
    product: string;
  }>;
  className?: string;
}

export function PurchaseNotification({
  purchases,
  className,
}: PurchaseNotificationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 2000);

    const cycleTimer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % purchases.length);
        setIsVisible(true);
      }, 500);
    }, 6000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(cycleTimer);
    };
  }, [purchases.length]);

  const current = purchases[currentIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{
            opacity: 0,
            x: prefersReducedMotion ? 0 : -100,
            scale: 0.9,
          }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={cn(
            "bg-white dark:bg-slate-800 border border-border rounded-lg shadow-lg p-3 max-w-xs",
            className,
          )}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
              {current.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                <span className="font-semibold">{current.name}</span> from{" "}
                {current.location}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Purchased {current.product}
              </p>
              <p className="text-xs text-green-600 mt-1">{current.time}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// PROGRESS & FEEDBACK ANIMATIONS
// =============================================================================

/**
 * Animated Progress Ring
 * Shows progress with satisfying animation
 */
interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  progress,
  size = 60,
  strokeWidth = 4,
  className,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-primary"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: prefersReducedMotion ? 0 : 1,
            ease: "easeOut",
          }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Streak Counter Animation
 * Gamification element for engagement
 */
interface StreakCounterProps {
  count: number;
  label?: string;
  className?: string;
}

export function StreakCounter({
  count,
  label = "day streak",
  className,
}: StreakCounterProps) {
  const controls = useAnimation();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!prefersReducedMotion) {
      controls.start({
        scale: [1, 1.2, 1],
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.5 },
      });
    }
  }, [count, controls, prefersReducedMotion]);

  return (
    <motion.div
      animate={controls}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-gradient-to-r from-orange-100 to-amber-100",
        "border border-orange-200",
        className,
      )}
    >
      <motion.span
        animate={
          !prefersReducedMotion
            ? {
                rotate: [0, 15, -15, 0],
              }
            : {}
        }
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xl"
      >
        🔥
      </motion.span>
      <div className="flex flex-col">
        <span className="font-bold text-orange-700 leading-none">{count}</span>
        <span className="text-xs text-orange-600">{label}</span>
      </div>
    </motion.div>
  );
}

// =============================================================================
// MICRO-DELIGHT ANIMATIONS
// =============================================================================

/**
 * Floating Heart Animation
 * For wishlist/favorite interactions
 */
interface FloatingHeartProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function FloatingHeart({ trigger, onComplete }: FloatingHeartProps) {
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (trigger && !prefersReducedMotion) {
      const id = Date.now();
      const x =
        (Math.sin(id) * 10000 - Math.floor(Math.sin(id) * 10000) - 0.5) * 40;

      // Use requestAnimationFrame to avoid sync setState
      requestAnimationFrame(() => {
        setHearts((prev) => [...prev, { id, x }]);
      });

      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
        onComplete?.();
      }, 1000);
    }
  }, [trigger, onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: 0, opacity: 1, scale: 0.5 }}
            animate={{
              y: -60,
              opacity: 0,
              scale: 1.2,
              x: heart.x,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 text-2xl"
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Magnetic Button Effect
 * Button that subtly follows cursor for engagement
 */
interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  strength?: number;
}

export function MagneticButton({
  children,
  onClick,
  className,
  strength = 0.3,
}: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (prefersReducedMotion) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (e.clientX - centerX) * strength;
      const y = (e.clientY - centerY) * strength;

      setPosition({ x, y });
    },
    [strength, prefersReducedMotion],
  );

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/**
 * Text Scramble Effect
 * Creates curiosity and engagement
 */
interface ScrambleTextProps {
  text: string;
  className?: string;
  trigger?: boolean;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function ScrambleText({
  text,
  className,
  trigger = true,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!trigger || prefersReducedMotion) {
      // Use requestAnimationFrame to avoid sync setState warning
      requestAnimationFrame(() => setDisplayText(text));
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(""),
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text, trigger, prefersReducedMotion]);

  return <span className={className}>{displayText}</span>;
}

// =============================================================================
// HOVER EFFECTS
// =============================================================================

/**
 * 3D Tilt Card Effect
 * Adds depth and interactivity to cards
 */
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
}

export function TiltCard({
  children,
  className,
  tiltAmount = 10,
}: TiltCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      setRotateX((-mouseY / (rect.height / 2)) * tiltAmount);
      setRotateY((mouseX / (rect.width / 2)) * tiltAmount);
    },
    [tiltAmount, prefersReducedMotion],
  );

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Glow Effect on Hover
 * Adds premium feel to interactive elements
 */
interface GlowEffectProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowEffect({
  children,
  className,
  glowColor = "rgba(0, 201, 80, 0.5)",
}: GlowEffectProps) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={
        isHovered && !prefersReducedMotion
          ? {
              boxShadow: `0 0 30px ${glowColor}, 0 0 60px ${glowColor.replace("0.5", "0.3")}`,
            }
          : {
              boxShadow: "0 0 0px transparent",
            }
      }
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// =============================================================================
// LOADING & SKELETON ANIMATIONS
// =============================================================================

/**
 * Shimmer Loading Effect
 * Premium loading state
 */
interface ShimmerProps {
  className?: string;
  children?: React.ReactNode;
}

export function Shimmer({ className, children }: ShimmerProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="animate-premium-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      {children}
    </div>
  );
}

/**
 * Skeleton Loading with Wave Effect
 */
interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
          }}
          className={cn("bg-muted rounded-lg", className)}
        />
      ))}
    </>
  );
}

// =============================================================================
// EXPORT ALL COMPONENTS
// =============================================================================

export {
  type ConfettiBurstProps,
  type SuccessCheckmarkProps,
  type RippleButtonProps,
  type StockBadgeProps,
  type CountdownTimerProps,
  type LiveActivityProps,
  type PurchaseNotificationProps,
  type ProgressRingProps,
  type StreakCounterProps,
  type FloatingHeartProps,
  type MagneticButtonProps,
  type ScrambleTextProps,
  type TiltCardProps,
  type GlowEffectProps,
  type ShimmerProps,
  type SkeletonProps,
};
