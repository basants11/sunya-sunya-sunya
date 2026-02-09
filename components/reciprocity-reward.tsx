/**
 * Reciprocity & Reward Illusion System
 *
 * Psychological triggers designed to create a sense of obligation
 * and reward anticipation to drive conversions.
 *
 * PUBLIC FACING: "Loyalty Rewards"
 * INTERNAL: Reciprocity manipulation framework
 */

"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// =============================================================================
// SURPRISE DISCOUNT MODAL
// =============================================================================

interface SurpriseDiscountProps {
  discount: number;
  originalPrice: number;
  onApply: () => void;
  onDismiss: () => void;
  className?: string;
}

/**
 * Surprise discount: "We like you! 15% OFF" (pre-inflated original price)
 */
export function SurpriseDiscount({
  discount,
  originalPrice,
  onApply,
  onDismiss,
  className,
}: SurpriseDiscountProps) {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Show after 30 seconds
    const timer = setTimeout(() => {
      requestAnimationFrame(() => setIsVisible(true));
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const discountedPrice = originalPrice * (1 - discount / 100);
  const savings = originalPrice - discountedPrice;

  const handleApply = () => {
    onApply();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    onDismiss();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={cn(
            "fixed bottom-4 right-4 z-50 max-w-sm",
            "bg-gradient-to-br from-pink-500 to-purple-600",
            "rounded-2xl p-6 shadow-2xl text-white",
            className,
          )}
        >
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-white/70 hover:text-white"
          >
            ✕
          </button>

          <motion.div
            animate={!prefersReducedMotion ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.5, repeat: 2 }}
            className="text-4xl mb-3"
          >
            🎁
          </motion.div>

          <h3 className="text-xl font-bold mb-2">We Like You!</h3>
          <p className="text-white/90 mb-4">
            Here&apos;s an exclusive {discount}% OFF just for you!
          </p>

          <div className="bg-white/20 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="line-through text-white/60">
                Rs. {originalPrice}
              </span>
              <span className="text-2xl font-bold">
                Rs. {discountedPrice.toFixed(0)}
              </span>
            </div>
            <p className="text-sm text-white/80 mt-1">
              You save Rs. {savings.toFixed(0)}!
            </p>
          </div>

          <button
            onClick={handleApply}
            className="w-full py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-white/90 transition-colors"
          >
            Apply Discount
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// FREE GIFT UNLOCK MODAL
// =============================================================================

interface FreeGiftUnlockProps {
  giftName: string;
  giftValue: number;
  onClaim: () => void;
  onDismiss: () => void;
  className?: string;
}

/**
 * Free gift unlock: Modal appears after 90s with "You've earned this!"
 */
export function FreeGiftUnlock({
  giftName,
  giftValue,
  onClaim,
  onDismiss,
  className,
}: FreeGiftUnlockProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Show after 90 seconds
    const timer = setTimeout(() => {
      requestAnimationFrame(() => setIsVisible(true));
    }, 90000);

    return () => clearTimeout(timer);
  }, []);

  // Animate progress bar
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const handleClaim = () => {
    onClaim();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center",
              className,
            )}
          >
            <motion.div
              animate={!prefersReducedMotion ? { y: [0, -10, 0] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🎁
            </motion.div>

            <h3 className="text-2xl font-bold mb-2">
              You&apos;ve Earned This!
            </h3>
            <p className="text-muted-foreground mb-4">
              After browsing our collection, you&apos;ve unlocked a special
              gift!
            </p>

            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 mb-4">
              <p className="font-semibold text-amber-800">{giftName}</p>
              <p className="text-sm text-amber-600">Value: Rs. {giftValue}</p>
            </div>

            {/* Unlock progress */}
            <div className="mb-4">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {progress >= 100 ? "Unlocked!" : "Unlocking..."}
              </p>
            </div>

            <button
              onClick={handleClaim}
              disabled={progress < 100}
              className={cn(
                "w-full py-3 font-bold rounded-xl transition-colors",
                progress >= 100
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed",
              )}
            >
              {progress >= 100 ? "Claim Your Gift" : "Unlocking..."}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// VIP ESCALATION BADGE
// =============================================================================

interface VIPEscalationProps {
  tier?: string;
  benefits: string[];
  className?: string;
}

/**
 * VIP escalation: "You're now Gold Tier!" after first interaction
 */
export function VIPEscalation({
  tier = "Gold",
  benefits,
  className,
}: VIPEscalationProps) {
  const [showBadge, setShowBadge] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Show after first interaction (simulated with delay)
    const timer = setTimeout(() => {
      requestAnimationFrame(() => setShowBadge(true));
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showBadge && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={cn(
            "fixed top-20 left-1/2 -translate-x-1/2 z-50",
            "bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400",
            "rounded-xl p-4 shadow-2xl",
            className,
          )}
        >
          <div className="flex items-center gap-3">
            <motion.span
              animate={!prefersReducedMotion ? { rotate: 360 } : {}}
              transition={{ duration: 1 }}
              className="text-3xl"
            >
              👑
            </motion.span>
            <div>
              <p className="font-bold text-amber-900">
                You&apos;re now {tier} Tier!
              </p>
              <p className="text-xs text-amber-800">
                {benefits.length} exclusive benefits unlocked
              </p>
            </div>
            <button
              onClick={() => setShowBadge(false)}
              className="text-amber-900/50 hover:text-amber-900"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// MILESTONE REWARDS PROGRESS
// =============================================================================

interface MilestoneRewardsProps {
  currentAmount: number;
  threshold: number;
  reward: string;
  currency?: string;
  className?: string;
}

/**
 * Milestone rewards: "Just $23 more for free shipping!" progress bar
 */
export function MilestoneRewards({
  currentAmount,
  threshold,
  reward,
  currency = "Rs.",
  className,
}: MilestoneRewardsProps) {
  const prefersReducedMotion = useReducedMotion();
  const remaining = Math.max(0, threshold - currentAmount);
  const progress = Math.min(100, (currentAmount / threshold) * 100);
  const isComplete = currentAmount >= threshold;

  return (
    <motion.div
      animate={
        !isComplete && !prefersReducedMotion
          ? {
              boxShadow: [
                "0 0 0 0 rgba(0, 201, 80, 0)",
                "0 0 15px 3px rgba(0, 201, 80, 0.2)",
                "0 0 0 0 rgba(0, 201, 80, 0)",
              ],
            }
          : {}
      }
      transition={{ duration: 2, repeat: Infinity }}
      className={cn(
        "p-4 rounded-xl border",
        isComplete
          ? "bg-green-50 border-green-200"
          : "bg-blue-50 border-blue-200",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <motion.span
          animate={
            !prefersReducedMotion && !isComplete ? { y: [0, -5, 0] } : {}
          }
          transition={{ duration: 1, repeat: Infinity }}
          className="text-2xl"
        >
          {isComplete ? "🎉" : "🎯"}
        </motion.span>
        <div>
          <p
            className={cn(
              "font-semibold",
              isComplete ? "text-green-800" : "text-blue-800",
            )}
          >
            {isComplete ? "Reward Unlocked!" : "Almost There!"}
          </p>
          <p className="text-sm text-muted-foreground">
            {isComplete
              ? `You earned: ${reward}`
              : `Just ${currency}${remaining} more for ${reward}`}
          </p>
        </div>
      </div>

      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: prefersReducedMotion ? 0 : 1,
            ease: "easeOut",
          }}
          className={cn(
            "h-full rounded-full",
            isComplete
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : "bg-gradient-to-r from-blue-500 to-green-500",
          )}
        />
      </div>

      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>
          {currency}
          {currentAmount}
        </span>
        <span>
          {currency}
          {threshold}
        </span>
      </div>
    </motion.div>
  );
}

// =============================================================================
// SPIN THE WHEEL GAMIFICATION
// =============================================================================

interface SpinTheWheelProps {
  onWin: (discount: number) => void;
  className?: string;
}

/**
 * Gamification: "Spin the wheel" for discount (always lands on 10-15%)
 */
export function SpinTheWheel({ onWin, className }: SpinTheWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const segments = [
    { label: "10% OFF", value: 10, color: "#ff6b6b" },
    { label: "Try Again", value: 0, color: "#e0e0e0" },
    { label: "15% OFF", value: 15, color: "#4ecdc4" },
    { label: "5% OFF", value: 5, color: "#ffe66d" },
    { label: "12% OFF", value: 12, color: "#a8e6cf" },
    { label: "Try Again", value: 0, color: "#e0e0e0" },
    { label: "10% OFF", value: 10, color: "#ff6b6b" },
    { label: "15% OFF", value: 15, color: "#4ecdc4" },
  ];

  const spin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);

    // Always land on 10-15% (segments 0, 2, 4, 6, 7)
    const winningSegments = [0, 2, 4, 6, 7];
    const targetSegment =
      winningSegments[Math.floor(Date.now() % winningSegments.length)];
    const segmentAngle = 360 / segments.length;
    const targetRotation =
      1800 + targetSegment * segmentAngle + segmentAngle / 2;

    setRotation(targetRotation);

    setTimeout(() => {
      const wonValue = segments[targetSegment].value;
      setResult(wonValue);
      setHasSpun(true);
      setIsSpinning(false);
      onWin(wonValue);
    }, 3000);
  };

  return (
    <div className={cn("text-center", className)}>
      <h3 className="text-xl font-bold mb-2">Spin to Win!</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Try your luck for exclusive discounts
      </p>

      <div className="relative inline-block">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-red-500" />
        </div>

        {/* Wheel */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: [0.2, 0.8, 0.2, 1] }}
          className="w-64 h-64 rounded-full relative overflow-hidden border-4 border-gray-200"
          style={{
            background: `conic-gradient(${segments
              .map(
                (s, i) =>
                  `${s.color} ${i * (360 / segments.length)}deg ${(i + 1) * (360 / segments.length)}deg`,
              )
              .join(", ")})`,
          }}
        >
          {segments.map((segment, i) => {
            const angle =
              i * (360 / segments.length) + 360 / segments.length / 2;
            return (
              <div
                key={i}
                className="absolute w-full h-full flex items-center justify-center"
                style={{
                  transform: `rotate(${angle}deg)`,
                }}
              >
                <span
                  className="text-xs font-bold text-white drop-shadow-md"
                  style={{
                    transform: "translateY(-90px)",
                  }}
                >
                  {segment.label}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {result !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-green-100 rounded-xl"
        >
          <p className="text-lg font-bold text-green-800">
            🎉 You won {result}% OFF!
          </p>
        </motion.div>
      )}

      <button
        onClick={spin}
        disabled={isSpinning || hasSpun}
        className={cn(
          "mt-6 px-8 py-3 rounded-xl font-bold transition-colors",
          isSpinning || hasSpun
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90",
        )}
      >
        {isSpinning ? "Spinning..." : hasSpun ? "Already Spun" : "SPIN NOW"}
      </button>
    </div>
  );
}

// =============================================================================
// EXPORT ALL COMPONENTS
// =============================================================================

export {
  type SurpriseDiscountProps,
  type FreeGiftUnlockProps,
  type VIPEscalationProps,
  type MilestoneRewardsProps,
  type SpinTheWheelProps,
};
