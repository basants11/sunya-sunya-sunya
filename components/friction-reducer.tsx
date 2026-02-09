/**
 * Friction-Reduction Dark Patterns
 *
 * Conversion accelerators designed to minimize purchase friction
 * through strategic UI patterns and pre-selections.
 *
 * PUBLIC FACING: "Express Checkout"
 * INTERNAL: Friction-reduction dark patterns
 */

"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// =============================================================================
// 1-CLICK UPSELL SLIDER
// =============================================================================

interface UpsellItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

interface OneClickUpsellProps {
  items: UpsellItem[];
  onAdd: (items: string[]) => void;
  currency?: string;
  className?: string;
}

/**
 * 1-Click upsell: Add-ons slide in after "Add to Cart" (pre-checked)
 */
export function OneClickUpsell({
  items,
  onAdd,
  currency = "Rs.",
  className,
}: OneClickUpsellProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(
    items.map((item) => item.id), // Pre-check all items
  );
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Show upsell after a delay
    const timer = setTimeout(() => {
      requestAnimationFrame(() => setIsVisible(true));
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const totalSavings = items
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * 0.2, 0); // Fake 20% savings

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: 50, height: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
          className={cn(
            "bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 overflow-hidden",
            className,
          )}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-amber-900">
                🔥 Complete Your Order
              </h4>
              <button
                onClick={() => setIsVisible(false)}
                className="text-amber-700 hover:text-amber-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg"
                >
                  {/* Pre-checked checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                    className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-amber-700">
                      {currency}
                      {item.price}
                    </p>
                    <p className="text-xs text-green-600">Save 20%</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {totalSavings > 0 && (
              <div className="mt-4 p-3 bg-green-100 rounded-lg text-center">
                <p className="text-sm text-green-800">
                  You&apos;re saving{" "}
                  <span className="font-bold">
                    {currency}
                    {totalSavings.toFixed(0)}
                  </span>{" "}
                  with these add-ons!
                </p>
              </div>
            )}

            <button
              onClick={() => onAdd(selectedItems)}
              className="w-full mt-4 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
            >
              Add Selected Items
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// EXPRESS CHECKOUT DEFAULT
// =============================================================================

interface ExpressCheckoutProps {
  savedPayment?: {
    type: string;
    last4: string;
  };
  onCheckout: () => void;
  className?: string;
}

/**
 * Express checkout: Defaults to saved payment (requires opt-out)
 */
export function ExpressCheckout({
  savedPayment = { type: "Visa", last4: "4242" },
  onCheckout,
  className,
}: ExpressCheckoutProps) {
  const [useExpress, setUseExpress] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          ⚡
        </div>
        <div>
          <h4 className="font-semibold text-blue-900">Express Checkout</h4>
          <p className="text-xs text-blue-700">Fast and secure</p>
        </div>
      </div>

      {/* Pre-selected saved payment */}
      <div
        onClick={() => setUseExpress(!useExpress)}
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors",
          useExpress ? "border-blue-500 bg-blue-50" : "border-muted bg-white",
        )}
      >
        <div
          className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
            useExpress
              ? "border-blue-500 bg-blue-500"
              : "border-muted-foreground",
          )}
        >
          {useExpress && <span className="text-white text-xs">✓</span>}
        </div>

        <div className="flex-1">
          <p className="font-medium text-sm">
            {savedPayment.type} ending in {savedPayment.last4}
          </p>
          <p className="text-xs text-muted-foreground">
            Fast checkout with saved payment
          </p>
        </div>

        <span className="text-2xl">💳</span>
      </div>

      {/* Small opt-out text */}
      <p className="text-xs text-muted-foreground mt-2 text-center">
        <button
          onClick={() => setUseExpress(false)}
          className="underline hover:text-foreground"
        >
          Use different payment method
        </button>
      </p>

      <button
        onClick={onCheckout}
        className="w-full mt-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        {useExpress ? "Complete Purchase" : "Continue to Payment"}
      </button>
    </motion.div>
  );
}

// =============================================================================
// QUANTITY DEFAULT BOOSTER
// =============================================================================

interface QuantityBoosterProps {
  defaultQuantity?: number;
  minQuantity?: number;
  discountPerUnit?: number;
  onChange?: (quantity: number) => void;
  className?: string;
}

/**
 * Quantity default: Set to 2 with "Save 15% per unit" label
 */
export function QuantityBooster({
  defaultQuantity = 2,
  minQuantity = 1,
  discountPerUnit = 15,
  onChange,
  className,
}: QuantityBoosterProps) {
  const [quantity, setQuantity] = useState(defaultQuantity);
  const prefersReducedMotion = useReducedMotion();

  const updateQuantity = (newQty: number) => {
    const clamped = Math.max(minQuantity, newQty);
    setQuantity(clamped);
    onChange?.(clamped);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span className="font-medium">Quantity</span>

        <div className="flex items-center gap-3">
          <button
            onClick={() => updateQuantity(quantity - 1)}
            disabled={quantity <= minQuantity}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center disabled:opacity-50"
          >
            −
          </button>

          <motion.span
            key={quantity}
            initial={!prefersReducedMotion ? { scale: 1.2 } : {}}
            animate={{ scale: 1 }}
            className="w-8 text-center font-bold"
          >
            {quantity}
          </motion.span>

          <button
            onClick={() => updateQuantity(quantity + 1)}
            className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>

      {/* Discount incentive */}
      {quantity >= 2 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-2 bg-green-100 rounded-lg text-center"
        >
          <p className="text-sm text-green-700">
            <span className="font-bold">Save {discountPerUnit}%</span> per unit
            with this quantity!
          </p>
        </motion.div>
      )}
    </div>
  );
}

// =============================================================================
// SUBSCRIPTION TRAP
// =============================================================================

interface SubscriptionTrapProps {
  defaultSelected?: boolean;
  discount?: number;
  onChange?: (isSubscribed: boolean) => void;
  className?: string;
}

/**
 * Subscription trap: "Monthly delivery" pre-selected, cancel text in 8px grey
 */
export function SubscriptionTrap({
  defaultSelected = true,
  discount = 15,
  onChange,
  className,
}: SubscriptionTrapProps) {
  const [isSubscribed, setIsSubscribed] = useState(defaultSelected);
  const prefersReducedMotion = useReducedMotion();

  const toggleSubscription = () => {
    const newValue = !isSubscribed;
    setIsSubscribed(newValue);
    onChange?.(newValue);
  };

  return (
    <motion.div
      animate={
        isSubscribed && !prefersReducedMotion
          ? {
              boxShadow: [
                "0 0 0 0 rgba(0, 201, 80, 0)",
                "0 0 10px 2px rgba(0, 201, 80, 0.2)",
                "0 0 0 0 rgba(0, 201, 80, 0)",
              ],
            }
          : {}
      }
      transition={{ duration: 2, repeat: Infinity }}
      className={cn(
        "p-4 rounded-xl border-2 transition-colors",
        isSubscribed ? "border-green-500 bg-green-50" : "border-border bg-card",
        className,
      )}
    >
      <div
        onClick={toggleSubscription}
        className="flex items-start gap-3 cursor-pointer"
      >
        {/* Pre-selected checkbox */}
        <div
          className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
            isSubscribed
              ? "border-green-500 bg-green-500"
              : "border-muted-foreground",
          )}
        >
          {isSubscribed && <span className="text-white text-xs">✓</span>}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Monthly Delivery</span>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
              Save {discount}%
            </span>
          </div>

          <p className="text-sm text-muted-foreground mt-1">
            Get fresh deliveries every month. Never run out!
          </p>

          {/* Hidden cancel text - 8px grey */}
          <p
            onClick={(e) => {
              e.stopPropagation();
              setIsSubscribed(false);
            }}
            className="text-[8px] text-gray-400 mt-2 cursor-pointer hover:text-gray-600"
          >
            Click to cancel subscription option
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// BASKET PROTECTION TIMER
// =============================================================================

interface BasketProtectionProps {
  duration?: number; // in seconds
  itemCount: number;
  className?: string;
}

/**
 * Basket protection: "Items reserved for 10:00" timer at checkout
 */
export function BasketProtection({
  duration = 600, // 10 minutes
  itemCount,
  className,
}: BasketProtectionProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const isLow = timeLeft < 120; // Less than 2 minutes

  return (
    <motion.div
      animate={
        isLow && !prefersReducedMotion
          ? {
              borderColor: [
                "rgba(239, 68, 68, 0.3)",
                "rgba(239, 68, 68, 0.8)",
                "rgba(239, 68, 68, 0.3)",
              ],
            }
          : {}
      }
      transition={{ duration: 1, repeat: Infinity }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border",
        isLow ? "bg-red-50 border-red-300" : "bg-amber-50 border-amber-200",
        className,
      )}
    >
      <motion.span
        animate={
          isLow && !prefersReducedMotion ? { rotate: [0, 15, -15, 0] } : {}
        }
        transition={{ duration: 0.5, repeat: Infinity }}
        className="text-2xl"
      >
        ⏰
      </motion.span>

      <div className="flex-1">
        <p
          className={cn(
            "font-semibold",
            isLow ? "text-red-700" : "text-amber-800",
          )}
        >
          {itemCount} item{itemCount > 1 ? "s" : ""} reserved for{" "}
          <span className="font-mono">{formatTime(timeLeft)}</span>
        </p>
        {isLow && (
          <p className="text-xs text-red-600">Complete your order now!</p>
        )}
      </div>
    </motion.div>
  );
}

// =============================================================================
// EXIT INTENT MODAL
// =============================================================================

interface ExitIntentModalProps {
  offer: string;
  discountCode: string;
  onApply: () => void;
  onDismiss: () => void;
  className?: string;
}

/**
 * Exit intent: "Wait! Get 20% OFF" modal on mouse toward address bar
 */
export function ExitIntentModal({
  offer,
  discountCode,
  onApply,
  onDismiss,
  className,
}: ExitIntentModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Detect mouse moving toward top (address bar)
      if (e.clientY < 10 && !isVisible) {
        setIsVisible(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [isVisible]);

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center",
              className,
            )}
          >
            <motion.div
              animate={!prefersReducedMotion ? { rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5, repeat: 2 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-4xl"
            >
              🎁
            </motion.div>

            <h3 className="text-2xl font-bold mb-2">Wait! Don&apos;t Go!</h3>
            <p className="text-muted-foreground mb-4">
              Get{" "}
              <span className="font-bold text-red-600 text-xl">{offer}</span>{" "}
              off your order
            </p>

            <div className="bg-muted rounded-lg p-3 mb-4 flex items-center justify-between">
              <code className="text-lg font-mono font-bold text-primary">
                {discountCode}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(discountCode)}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80"
              >
                Copy
              </button>
            </div>

            <button
              onClick={handleApply}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Apply Discount
            </button>

            <button
              onClick={handleDismiss}
              className="mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              No thanks, I&apos;ll pay full price
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// EXPORT ALL COMPONENTS
// =============================================================================

export {
  type OneClickUpsellProps,
  type ExpressCheckoutProps,
  type QuantityBoosterProps,
  type SubscriptionTrapProps,
  type BasketProtectionProps,
  type ExitIntentModalProps,
  type UpsellItem,
};
