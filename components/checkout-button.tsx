/**
 * Checkout Button Component
 * Full checkout flow integration with analytics and state management
 */

"use client";

import { useCart } from "@/lib/cart/use-cart";
import { formatPriceSimple, FREE_SHIPPING_THRESHOLD } from "@/lib/cart/utils";
import { products } from "@/lib/products";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CreditCard,
  Loader2,
  Lock,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useCartToast } from "./cart-toast";

/**
 * Checkout Button Props
 */
export interface CheckoutButtonProps {
  className?: string;
  variant?: "default" | "large" | "full-width";
  showIcon?: boolean;
  showSummary?: boolean;
}

/**
 * Get product by ID
 */
function getProductById(id: number) {
  return products.find((p) => p.id === id);
}

/**
 * Calculate cart totals
 */
function useCartTotals() {
  const { items } = useCart();

  const subtotal = React.useMemo(() => {
    return items.reduce((total, item) => {
      const product = getProductById(item.id);
      if (!product) return total;
      return total + (product.nrsPrice || 0) * item.quantity;
    }, 0);
  }, [items]);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50;
  const tax = Math.round(subtotal * 0.13);
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
}

/**
 * Checkout Button Component
 */
export function CheckoutButton({
  className,
  variant = "default",
  showIcon = true,
  showSummary = false,
}: CheckoutButtonProps) {
  const router = useRouter();
  const { items } = useCart();
  const { showError } = useCartToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);

  const { subtotal, shipping, tax, total } = useCartTotals();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isEmpty = items.length === 0;

  const handleCheckout = async () => {
    if (isEmpty) {
      showError("Cart Empty", "Please add items to your cart first");
      return;
    }

    setIsLoading(true);

    try {
      // Navigate to checkout page (modal will auto-open)
      router.push("/checkout");
    } catch (error) {
      showError("Navigation Error", "Failed to navigate to checkout");
      console.error("Checkout navigation error:", error);
    } finally {
      // Keep loading state briefly for visual feedback
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  // Auto-hide complete state
  React.useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => setIsComplete(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  const sizeStyles = {
    default: "px-6 py-3 text-sm",
    large: "px-8 py-4 text-base",
    "full-width": "w-full px-6 py-4 text-base",
  };

  const iconSize = variant === "large" ? 20 : 16;

  return (
    <div
      className={cn("space-y-3", showSummary && "bg-muted/30 rounded-lg p-4")}
    >
      {/* Summary (optional) */}
      {showSummary && !isEmpty && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>NPR {formatPriceSimple(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className={shipping === 0 ? "text-green-600" : ""}>
              {shipping === 0 ? "FREE" : `NPR ${formatPriceSimple(shipping)}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>NPR {formatPriceSimple(tax)}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total</span>
            <span>NPR {formatPriceSimple(total)}</span>
          </div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={handleCheckout}
        disabled={isEmpty || isLoading}
        className={cn(
          "relative flex items-center justify-center gap-2",
          "font-semibold rounded-lg transition-all",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "bg-foreground text-background",
          "hover:bg-foreground/90 hover:shadow-lg",
          "active:scale-[0.98]",
          sizeStyles[variant],
          className,
        )}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2
                className="animate-spin"
                style={{ width: iconSize, height: iconSize }}
              />
            </motion.div>
          ) : isComplete ? (
            <motion.div
              key="complete"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-1"
            >
              <Check style={{ width: iconSize, height: iconSize }} />
              <span>Redirecting...</span>
            </motion.div>
          ) : (
            <motion.div
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              {showIcon && (
                <CreditCard style={{ width: iconSize, height: iconSize }} />
              )}
              <span>
                {variant === "full-width"
                  ? `Checkout - NPR ${formatPriceSimple(total)}`
                  : "Checkout"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Trust Indicators */}
      {variant !== "default" && (
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <Truck className="w-3 h-3" />
            <span>Fast Delivery</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Quality</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Cart Summary Card Component
 * Displays full cart summary with checkout button
 */
export function CartSummaryCard({ className }: { className?: string }) {
  const { items } = useCart();
  const { subtotal, shipping, tax, total } = useCartTotals();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingProgress = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
  );
  const amountForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className={cn("bg-muted/30 rounded-xl p-6 space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Order Summary</h3>
        <span className="text-sm text-muted-foreground">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Free Shipping Progress */}
      {subtotal < FREE_SHIPPING_THRESHOLD && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Add {formatPriceSimple(amountForFreeShipping)} more for free
              shipping
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${freeShippingProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Totals */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>NPR {formatPriceSimple(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className={shipping === 0 ? "text-green-600" : ""}>
            {shipping === 0 ? "FREE" : `NPR ${formatPriceSimple(shipping)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (13% VAT)</span>
          <span>NPR {formatPriceSimple(tax)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-3 border-t">
          <span>Total</span>
          <span>NPR {formatPriceSimple(total)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <CheckoutButton variant="full-width" showSummary={false} />

      {/* Continue Shopping */}
      <Link
        href="/products"
        className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        Continue Shopping →
      </Link>
    </div>
  );
}

/**
 * Quick Checkout Button
 * Compact version for use in cart drawer
 */
export function QuickCheckoutButton({ className }: { className?: string }) {
  const { items } = useCart();
  const { total } = useCartTotals();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) return null;

  return (
    <Link
      href="/checkout"
      className={cn(
        "flex items-center justify-center gap-2",
        "px-6 py-3 rounded-lg font-semibold",
        "bg-foreground text-background",
        "hover:bg-foreground/90 transition-colors",
        className,
      )}
    >
      <span>Checkout</span>
      <span className="text-sm opacity-75">({itemCount})</span>
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
}
