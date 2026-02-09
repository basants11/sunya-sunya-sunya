/**
 * Artificial Scarcity & Urgency Matrix
 *
 * A comprehensive system for creating artificial scarcity and urgency
 * to drive immediate purchasing decisions.
 *
 * PUBLIC FACING: "Dynamic Inventory System"
 * INTERNAL: Artificial scarcity manipulation framework
 */

"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// =============================================================================
// DYNAMIC COUNTDOWN TIMER
// =============================================================================

interface UrgencyTimerProps {
  initialMinutes?: number; // Random 5-15 minutes if not specified
  onExpire?: () => void;
  className?: string;
  showHeartbeat?: boolean;
}

/**
 * Countdown timer with heartbeat pulse animation
 * Creates urgency with random 5-15 minute limits
 */
export function UrgencyTimer({
  initialMinutes,
  onExpire,
  className,
  showHeartbeat = true,
}: UrgencyTimerProps) {
  const prefersReducedMotion = useReducedMotion();

  // Generate random time between 5-15 minutes if not specified
  const [minutes, setMinutes] = useState(() => {
    if (initialMinutes) return initialMinutes;
    return 5 + Math.floor(((Date.now() % 1000) / 1000) * 10);
  });

  const [seconds, setSeconds] = useState(0);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 0) {
          if (minutes === 0) {
            clearInterval(timer);
            onExpire?.();
            return 0;
          }
          setMinutes((m) => m - 1);
          return 59;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, onExpire]);

  useEffect(() => {
    setIsUrgent(minutes < 2);
  }, [minutes]);

  const formatTime = (m: number, s: number) => {
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <motion.div
      animate={
        isUrgent && showHeartbeat && !prefersReducedMotion
          ? {
              scale: [1, 1.02, 1],
            }
          : {}
      }
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold",
        isUrgent
          ? "bg-red-100 text-red-700 border-2 border-red-300"
          : "bg-amber-100 text-amber-700 border border-amber-200",
        className,
      )}
    >
      {/* Heartbeat pulse dot */}
      {showHeartbeat && (
        <span className="relative flex h-2.5 w-2.5">
          <motion.span
            animate={
              !prefersReducedMotion
                ? { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }
                : {}
            }
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
          />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
        </span>
      )}

      <span className={isUrgent ? "animate-pulse" : ""}>
        {formatTime(minutes, seconds)}
      </span>

      {isUrgent && (
        <motion.span
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs uppercase tracking-wider"
        >
          Hurry!
        </motion.span>
      )}
    </motion.div>
  );
}

// =============================================================================
// ARTIFICIAL STOCK INDICATOR
// =============================================================================

interface ArtificialStockProps {
  actualStock?: number;
  maxDisplay?: number;
  className?: string;
}

/**
 * Stock indicator that always shows ≤5 units
 * Even if 1000+ in inventory
 */
export function ArtificialStock({
  actualStock = 100,
  maxDisplay = 5,
  className,
}: ArtificialStockProps) {
  const prefersReducedMotion = useReducedMotion();

  // Always show low stock (max 5)
  const displayStock = Math.min(actualStock, maxDisplay);
  const isCritical = displayStock <= 2;
  const isLow = displayStock <= 5;

  return (
    <motion.div
      animate={
        isLow && !prefersReducedMotion
          ? {
              boxShadow: [
                "0 0 0 0 rgba(239, 68, 68, 0)",
                "0 0 10px 2px rgba(239, 68, 68, 0.2)",
                "0 0 0 0 rgba(239, 68, 68, 0)",
              ],
            }
          : {}
      }
      transition={{ duration: 2, repeat: Infinity }}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold",
        isCritical
          ? "bg-red-100 text-red-700 border border-red-200"
          : isLow
            ? "bg-orange-100 text-orange-700 border border-orange-200"
            : "bg-green-100 text-green-700 border border-green-200",
        className,
      )}
    >
      <span
        className={cn(
          "w-2 h-2 rounded-full",
          isCritical
            ? "bg-red-500 animate-pulse"
            : isLow
              ? "bg-orange-500"
              : "bg-green-500",
        )}
      />
      <span>
        {isCritical
          ? `Only ${displayStock} left!`
          : `${displayStock} remaining`}
      </span>
    </motion.div>
  );
}

// =============================================================================
// FAKE ACTIVITY BUBBLES
// =============================================================================

interface FakeActivityProps {
  activities?: string[];
  interval?: number;
  className?: string;
}

/**
 * Shows fake "3 people viewing this" bubbles
 * That appear and disappear randomly
 */
export function FakeActivityBubbles({
  activities = ["3 people viewing", "5 in cart", "2 purchased today"],
  interval = 3000,
  className,
}: FakeActivityProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const cycleTimer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 500);
    }, interval);

    return () => clearInterval(cycleTimer);
  }, [activities.length, interval]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
            "bg-blue-50 text-blue-700 border border-blue-100",
            className,
          )}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          {activities[currentIndex]}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// PRICE INCREASE COUNTDOWN
// =============================================================================

interface PriceIncreaseTimerProps {
  increaseTime?: Date;
  currentPrice: number;
  futurePrice: number;
  className?: string;
}

/**
 * Shows subtle countdown "Price goes up in 04:32"
 * Creates urgency to buy now
 */
export function PriceIncreaseTimer({
  increaseTime,
  currentPrice,
  futurePrice,
  className,
}: PriceIncreaseTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 4,
    seconds: 32,
  });
  const prefersReducedMotion = useReducedMotion();

  // Generate deterministic time based on mount
  useEffect(() => {
    if (increaseTime) {
      const diff = increaseTime.getTime() - Date.now();
      if (diff > 0) {
        requestAnimationFrame(() => {
          setTimeLeft({
            hours: Math.floor(diff / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000),
          });
        });
      }
    }
  }, [increaseTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const savings = futurePrice - currentPrice;

  return (
    <motion.div
      animate={
        !prefersReducedMotion
          ? {
              borderColor: [
                "rgba(239, 68, 68, 0.2)",
                "rgba(239, 68, 68, 0.5)",
                "rgba(239, 68, 68, 0.2)",
              ],
            }
          : {}
      }
      transition={{ duration: 2, repeat: Infinity }}
      className={cn("p-3 rounded-lg border bg-red-50", className)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.span
            animate={!prefersReducedMotion ? { rotate: [0, 15, -15, 0] } : {}}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            ⏰
          </motion.span>
          <span className="text-sm font-semibold text-red-700">
            Price goes up in{" "}
            <span className="font-mono">
              {String(timeLeft.hours).padStart(2, "0")}:
              {String(timeLeft.minutes).padStart(2, "0")}:
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-red-600">Save Rs. {savings}</p>
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// LIMITED BADGE WITH ROTATING SHINE
// =============================================================================

interface LimitedBadgeProps {
  text?: string;
  className?: string;
}

/**
 * Gold border badge with clockwise rotating shine effect
 * Updates every 30 seconds
 */
export function LimitedBadge({
  text = "Limited Edition",
  className,
}: LimitedBadgeProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-2 px-4 py-2 rounded-lg",
        "bg-gradient-to-r from-amber-100 to-yellow-100",
        "border-2 border-amber-400",
        className,
      )}
    >
      {/* Rotating shine effect */}
      <motion.div
        className="absolute inset-0 rounded-lg overflow-hidden"
        animate={
          !prefersReducedMotion
            ? { backgroundPosition: ["0% 0%", "200% 200%"] }
            : {}
        }
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)",
          backgroundSize: "200% 200%",
        }}
      />

      <span className="relative z-10 text-lg">⭐</span>
      <span className="relative z-10 font-bold text-amber-800">{text}</span>
    </div>
  );
}

// =============================================================================
// FAKE CART WATCHERS
// =============================================================================

interface CartWatcher {
  id: number;
  name: string;
  avatar: string;
  action: string;
}

interface FakeCartWatchersProps {
  className?: string;
}

/**
 * Shows fake user avatars "adding to cart" every 2-5 minutes
 */
export function FakeCartWatchers({ className }: FakeCartWatchersProps) {
  const [watchers, setWatchers] = useState<CartWatcher[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const names = ["Priya", "Rajesh", "Anita", "Vikram", "Sneha", "Arjun"];
  const actions = ["added to cart", "is viewing", "purchased"];
  const avatars = ["👤", "👩", "👨", "🧑", "👱", "🧔"];

  useEffect(() => {
    // Initial watchers
    requestAnimationFrame(() => {
      setWatchers([
        { id: 1, name: names[0], avatar: avatars[0], action: actions[0] },
        { id: 2, name: names[1], avatar: avatars[1], action: actions[1] },
      ]);
    });

    // Add new watcher every 2-5 minutes
    const interval = setInterval(
      () => {
        const randomName = names[Math.floor(Date.now() % names.length)];
        const randomAvatar =
          avatars[Math.floor((Date.now() / 1000) % avatars.length)];
        const randomAction =
          actions[Math.floor((Date.now() / 100) % actions.length)];

        setWatchers((prev) => {
          const newWatcher = {
            id: Date.now(),
            name: randomName,
            avatar: randomAvatar,
            action: randomAction,
          };
          return [newWatcher, ...prev].slice(0, 3);
        });
      },
      120000 + (Date.now() % 180000), // 2-5 minutes
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs text-muted-foreground font-medium">
        Recent activity
      </p>
      <div className="flex items-center gap-2">
        <AnimatePresence mode="popLayout">
          {watchers.map((watcher, index) => (
            <motion.div
              key={watcher.id}
              initial={{ opacity: 0, scale: 0, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-full text-xs"
            >
              <span>{watcher.avatar}</span>
              <span className="font-medium">{watcher.name}</span>
              <span className="text-muted-foreground">{watcher.action}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// =============================================================================
// EXPORT ALL COMPONENTS
// =============================================================================

export {
  type UrgencyTimerProps,
  type ArtificialStockProps,
  type FakeActivityProps,
  type PriceIncreaseTimerProps,
  type LimitedBadgeProps,
  type FakeCartWatchersProps,
};
