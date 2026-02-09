/**
 * Conversion Optimizer Components
 *
 * A collection of components designed to increase conversion rates through
 * psychological triggers and persuasive design patterns.
 */

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  Package,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

// =============================================================================
// URGENCY COMPONENTS
// =============================================================================

/**
 * Flash Sale Banner
 * Creates urgency with countdown and limited availability
 */
interface FlashSaleBannerProps {
  endTime: Date;
  discount: string;
  className?: string;
}

export function FlashSaleBanner({
  endTime,
  discount,
  className,
}: FlashSaleBannerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = endTime.getTime() - Date.now();
      if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    const update = () => setTimeLeft(calculateTimeLeft());
    requestAnimationFrame(update);
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className={cn(
        "relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-orange-500",
        "text-white px-4 py-3",
        className,
      )}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{ x: ["0%", "100%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')]"
        />
      </div>

      <div className="relative flex items-center justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 animate-pulse" />
          <span className="font-bold text-lg">FLASH SALE</span>
          <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-bold">
            {discount} OFF
          </span>
        </div>

        <div className="flex items-center gap-2 bg-black/20 px-4 py-1.5 rounded-full">
          <Clock className="w-4 h-4" />
          <span className="font-mono font-bold">
            {String(timeLeft.hours).padStart(2, "0")}:
            {String(timeLeft.minutes).padStart(2, "0")}:
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Limited Stock Indicator
 * Shows remaining stock with visual urgency
 */
interface LimitedStockProps {
  stock: number;
  total: number;
  className?: string;
}

export function LimitedStock({ stock, total, className }: LimitedStockProps) {
  const percentage = (stock / total) * 100;
  const isLow = percentage <= 20;
  const isCritical = percentage <= 10;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span
          className={cn(
            "flex items-center gap-1.5 font-medium",
            isCritical
              ? "text-red-600"
              : isLow
                ? "text-orange-600"
                : "text-foreground",
          )}
        >
          <Package className="w-4 h-4" />
          {isCritical ? "Only" : ""} {stock} left in stock
        </span>
        {isLow && (
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-red-600 font-semibold text-xs"
          >
            Selling fast!
          </motion.span>
        )}
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full transition-colors duration-300",
            isCritical
              ? "bg-red-500"
              : isLow
                ? "bg-orange-500"
                : "bg-green-500",
          )}
        />
      </div>
    </div>
  );
}

// =============================================================================
// SOCIAL PROOF COMPONENTS
// =============================================================================

/**
 * Trust Badge Strip
 * Displays trust indicators in a scrolling marquee
 */
interface TrustBadgeStripProps {
  className?: string;
}

const TRUST_BADGES = [
  { icon: Shield, text: "Secure Checkout" },
  { icon: Award, text: "Premium Quality" },
  { icon: TrendingUp, text: "10,000+ Happy Customers" },
  { icon: Star, text: "4.9/5 Rating" },
  { icon: CheckCircle2, text: "100% Natural" },
];

export function TrustBadgeStrip({ className }: TrustBadgeStripProps) {
  return (
    <div className={cn("bg-muted/50 py-3 overflow-hidden", className)}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex gap-8 whitespace-nowrap"
      >
        {[...TRUST_BADGES, ...TRUST_BADGES].map((badge, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <badge.icon className="w-4 h-4 text-primary" />
            <span>{badge.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * Recent Activity Feed
 * Shows real-time purchase activity
 */
interface ActivityFeedProps {
  activities: Array<{
    name: string;
    action: string;
    time: string;
    location?: string;
  }>;
  className?: string;
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activities.length]);

  return (
    <div
      className={cn(
        "bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
        </div>
        <span className="text-sm font-semibold text-green-800">
          Live Activity
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
            {activities[currentIndex].name.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-sm text-foreground">
              <span className="font-semibold">
                {activities[currentIndex].name}
              </span>{" "}
              {activities[currentIndex].action}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activities[currentIndex].time}
              {activities[currentIndex].location &&
                ` • ${activities[currentIndex].location}`}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// SCARCITY COMPONENTS
// =============================================================================

/**
 * Cart Abandonment Recovery
 * Shows when items are in cart but not checked out
 */
interface CartRecoveryProps {
  itemCount: number;
  onCheckout: () => void;
  onDismiss: () => void;
  className?: string;
}

export function CartRecovery({
  itemCount,
  onCheckout,
  onDismiss,
  className,
}: CartRecoveryProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || itemCount === 0) return null;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className={cn(
        "fixed bottom-4 right-4 z-50 max-w-sm",
        "bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-border",
        "p-4",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">
            Don&apos;t miss out!
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            You have {itemCount} item{itemCount > 1 ? "s" : ""} in your cart.
            Complete your order now!
          </p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={onCheckout} className="flex-1">
              Checkout Now
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsVisible(false);
                onDismiss();
              }}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Exit Intent Popup
 * Shows offer when user tries to leave
 */
interface ExitIntentProps {
  offer: string;
  code: string;
  onApply: () => void;
  className?: string;
}

export function ExitIntent({
  offer,
  code,
  onApply,
  className,
}: ExitIntentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !isVisible) {
        setIsVisible(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={() => setIsVisible(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full",
            "shadow-2xl text-center",
            className,
          )}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Wait! Don&apos;t Go!</h3>
          <p className="text-muted-foreground mb-4">
            Get <span className="font-bold text-foreground">{offer}</span> off
            your order
          </p>
          <div className="bg-muted rounded-lg p-3 mb-4 flex items-center justify-between">
            <code className="text-lg font-mono font-bold text-primary">
              {code}
            </code>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigator.clipboard.writeText(code)}
            >
              Copy
            </Button>
          </div>
          <Button
            onClick={() => {
              onApply();
              setIsVisible(false);
            }}
            className="w-full"
          >
            Apply Discount
          </Button>
          <button
            onClick={() => setIsVisible(false)}
            className="mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            No thanks, I&apos;ll pay full price
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// =============================================================================
// PROGRESS COMPONENTS
// =============================================================================

/**
 * Free Shipping Progress
 * Shows progress towards free shipping threshold
 */
interface FreeShippingProgressProps {
  current: number;
  threshold: number;
  currency?: string;
  className?: string;
}

export function FreeShippingProgress({
  current,
  threshold,
  currency = "Rs.",
  className,
}: FreeShippingProgressProps) {
  const remaining = Math.max(0, threshold - current);
  const percentage = Math.min(100, (current / threshold) * 100);
  const isComplete = current >= threshold;

  return (
    <div
      className={cn(
        "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-blue-900">
          {isComplete ? "🎉 Free shipping unlocked!" : "Free shipping progress"}
        </span>
        <span className="text-sm text-blue-700">
          {currency}
          {current} / {currency}
          {threshold}
        </span>
      </div>

      <div className="h-3 bg-blue-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full transition-colors duration-300",
            isComplete ? "bg-green-500" : "bg-blue-500",
          )}
        />
      </div>

      {!isComplete && (
        <p className="text-xs text-blue-700 mt-2">
          Add{" "}
          <span className="font-bold">
            {currency}
            {remaining}
          </span>{" "}
          more for free shipping!
        </p>
      )}
    </div>
  );
}

/**
 * Bundle Savings Calculator
 * Shows savings when buying in bulk
 */
interface BundleSavingsProps {
  quantity: number;
  unitPrice: number;
  tiers: Array<{ quantity: number; discount: number; label: string }>;
  className?: string;
}

export function BundleSavings({
  quantity,
  unitPrice,
  tiers,
  className,
}: BundleSavingsProps) {
  const currentTier = tiers.findLast((t) => quantity >= t.quantity) || tiers[0];
  const nextTier = tiers.find((t) => quantity < t.quantity);

  const originalPrice = quantity * unitPrice;
  const discountedPrice = originalPrice * (1 - currentTier.discount / 100);
  const savings = originalPrice - discountedPrice;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Tier Progress */}
      <div className="flex gap-1">
        {tiers.map((tier, i) => (
          <div key={i} className="flex-1">
            <div
              className={cn(
                "h-2 rounded-full transition-colors duration-300",
                quantity >= tier.quantity ? "bg-green-500" : "bg-muted",
              )}
            />
            <p className="text-xs text-center mt-1 text-muted-foreground">
              {tier.label}
            </p>
          </div>
        ))}
      </div>

      {/* Savings Display */}
      {savings > 0 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-green-800">
              {currentTier.label} Applied!
            </p>
            <p className="text-xs text-green-600">
              You save Rs.{savings.toFixed(0)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-green-600" />
          </div>
        </motion.div>
      )}

      {/* Next Tier Teaser */}
      {nextTier && (
        <p className="text-xs text-muted-foreground text-center">
          Buy {nextTier.quantity - quantity} more for {nextTier.label}
        </p>
      )}
    </div>
  );
}

// =============================================================================
// EXPORT ALL COMPONENTS
// =============================================================================

export {
  type FlashSaleBannerProps,
  type LimitedStockProps,
  type TrustBadgeStripProps,
  type ActivityFeedProps,
  type CartRecoveryProps,
  type ExitIntentProps,
  type FreeShippingProgressProps,
  type BundleSavingsProps,
};
