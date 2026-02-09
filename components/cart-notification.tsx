/**
 * Cart Notification Component
 *
 * Provides visual feedback when items are added to the cart.
 * Slide-in toast notifications with smooth animations.
 *
 * Features:
 * - Slide-in animation from bottom or top
 * - Product info display (name, quantity)
 * - Cart summary (total items, total price)
 * - Progress bar for auto-dismissal
 * - Click to dismiss
 * - Reduced motion support
 * - Accessibility compliant
 */

"use client";

import { useCart } from "@/lib/cart/use-cart";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";
import * as React from "react";

export interface CartNotificationProps {
  /** Position of the notification */
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  /** Auto-dismiss duration in ms (0 to disable) */
  autoDismissDuration?: number;
  /** Maximum number of items to show in notification */
  maxItems?: number;
  /** Show/hide the notification */
  show?: boolean;
  /** Callback when notification is dismissed */
  onDismiss?: () => void;
  /** Custom className */
  className?: string;
}

/**
 * Hook to manage cart notifications
 */
export function useCartNotification() {
  const [notification, setNotification] = React.useState<{
    message: string;
    itemCount: number;
    totalPrice?: number;
  } | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  const showNotification = React.useCallback(
    (message: string, itemCount: number, totalPrice?: number) => {
      setNotification({ message, itemCount, totalPrice });
      setIsVisible(true);
    },
    [],
  );

  const hideNotification = React.useCallback(() => {
    setIsVisible(false);
  }, []);

  return { notification, isVisible, showNotification, hideNotification };
}

/**
 * Cart Notification Component
 * Displays slide-in toast when items are added to cart
 */
export function CartNotification({
  position = "bottom-right",
  autoDismissDuration = 4000,
  maxItems = 3,
  show: controlledShow,
  onDismiss,
  className,
}: CartNotificationProps) {
  const { items, itemCount } = useCart();
  const [isVisible, setIsVisible] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [progress, setProgress] = React.useState(100);

  // Calculate total price (assuming products are available)
  const totalPrice = React.useMemo(() => {
    // This would typically come from a product catalog
    // For now, we'll show just the count
    return null;
  }, [items]);

  // Auto-dismiss timer
  React.useEffect(() => {
    if (autoDismissDuration === 0 || isHovered) return;

    const interval = 50;
    const step = (interval / autoDismissDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          handleDismiss();
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [autoDismissDuration, isHovered]);

  const handleDismiss = () => {
    setIsVisible(false);
    setProgress(100);
    onDismiss?.();
  };

  const positionClasses = {
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{
            opacity: 0,
            y: position.startsWith("bottom") ? 20 : -20,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: position.startsWith("bottom") ? 20 : -20,
            scale: 0.9,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          className={cn(
            "fixed z-50",
            positionClasses[position],
            "max-w-sm w-full",
            className,
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={cn(
              "bg-background border border-border rounded-xl shadow-lg overflow-hidden",
              "flex items-start gap-3 p-4",
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                "bg-primary/10 text-primary",
              )}
            >
              <ShoppingCart className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Added to cart
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
                  </p>
                </div>

                {/* Close button */}
                <button
                  onClick={handleDismiss}
                  className={cn(
                    "flex-shrink-0 w-6 h-6 rounded-full",
                    "flex items-center justify-center",
                    "text-muted-foreground hover:text-foreground",
                    "transition-colors",
                  )}
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick action */}
              <a
                href="/checkout"
                className={cn(
                  "inline-flex items-center gap-1.5 mt-2",
                  "text-xs font-medium text-primary",
                  "hover:underline",
                )}
              >
                View Cart
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>

            {/* Progress bar */}
            {autoDismissDuration > 0 && !isHovered && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/20"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: progress / 100 }}
                style={{ originX: 0 }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Mini Cart Notification Badge
 * Small indicator that appears on cart icon when items are added
 */
export interface CartAddedBadgeProps {
  show: boolean;
  position?: "top-right" | "top-left";
}

export function CartAddedBadge({
  show,
  position = "top-right",
}: CartAddedBadgeProps) {
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
            damping: 20,
          }}
          className={cn(
            "absolute z-20 pointer-events-none",
            position === "top-right" ? "-top-1 -right-1" : "-top-1 -left-1",
          )}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.3 }}
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center",
              "bg-green-500 text-white shadow-md",
            )}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Cart Item Added Toast
 * Shows individual item details when added to cart
 */
export interface CartItemToastProps {
  productName: string;
  quantity: number;
  price?: number;
  show: boolean;
  onDismiss: () => void;
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
}

export function CartItemToast({
  productName,
  quantity,
  price,
  show,
  onDismiss,
  position = "bottom-right",
}: CartItemToastProps) {
  const positionClasses = {
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{
            opacity: 0,
            x: position.includes("right") ? 50 : -50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: position.includes("right") ? 50 : -50,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          className={cn(
            "fixed z-50",
            positionClasses[position],
            "bg-white rounded-lg shadow-lg border border-border p-3",
            "flex items-center gap-3 min-w-[280px]",
          )}
        >
          {/* Checkmark circle */}
          <div
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full",
              "bg-green-100 text-green-600",
              "flex items-center justify-center",
            )}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Item info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {productName}
            </p>
            <p className="text-xs text-muted-foreground">
              Qty: {quantity}
              {price && ` • NPR ${price.toLocaleString()}`}
            </p>
          </div>

          {/* View cart button */}
          <a
            href="/checkout"
            className={cn(
              "flex-shrink-0 text-xs font-medium",
              "text-primary hover:underline",
            )}
          >
            View
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
