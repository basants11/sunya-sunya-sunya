/**
 * Cart Drawer Component
 * Slide-out cart panel with full functionality
 */

"use client";

import { useCart } from "@/lib/cart/use-cart";
import {
  FREE_SHIPPING_THRESHOLD,
  applyPromoCode,
  formatPriceSimple,
} from "@/lib/cart/utils";
import { products, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useCartToast } from "./cart-toast";

/**
 * Cart Drawer Props
 */
export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Get product by ID
 */
function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

/**
 * Cart Drawer Component
 */
export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const {
    showAddedToCart,
    showRemovedFromCart,
    showFreeShipping,
    showPromoApplied,
    showPromoInvalid,
  } = useCartToast();
  const [mounted, setMounted] = React.useState(false);
  const [promoCode, setPromoCode] = React.useState("");
  const [appliedPromo, setAppliedPromo] = React.useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = React.useState(false);
  const [promoError, setPromoError] = React.useState<string | null>(null);

  // Handle hydration
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Handle body scroll lock
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Calculate totals
  const subtotal = React.useMemo(() => {
    return items.reduce((total, item) => {
      const product = getProductById(item.id);
      if (!product) return total;
      return total + (product.nrsPrice || 0) * item.quantity;
    }, 0);
  }, [items]);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50;
  const tax = Math.round(subtotal * 0.13);
  const discount = appliedPromo?.discount ?? 0;
  const total = subtotal + shipping + tax - discount;
  const amountForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
  );

  // Handle promo code application
  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) return;

    setIsApplyingPromo(true);
    setPromoError(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = applyPromoCode(promoCode, subtotal);

    if (result.isValid && result.discount > 0) {
      setAppliedPromo({ code: result.code!, discount: result.discount });
      setPromoCode("");
      showPromoApplied(result.code!, result.discount);
    } else {
      setPromoError(result.message || "Invalid promo code");
      showPromoInvalid(result.message || "Invalid promo code");
    }

    setIsApplyingPromo(false);
  };

  // Remove promo code
  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError(null);
  };

  // Handle quantity change
  const handleQuantityChange = (
    id: number,
    currentQuantity: number,
    delta: number,
  ) => {
    const newQuantity = currentQuantity + delta;

    if (newQuantity <= 0) {
      removeItem(id);
      const product = getProductById(id);
      if (product) {
        showRemovedFromCart(product.name);
      }
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "fixed top-0 right-0 z-50",
              "w-full max-w-md h-full",
              "bg-background shadow-2xl",
              "flex flex-col",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <span className="font-semibold text-lg">
                  Your Cart ({items.reduce((sum, i) => sum + i.quantity, 0)})
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-md transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {items.length > 0 && (
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Free shipping unlocked!</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Add {formatPriceSimple(amountForFreeShipping)} more for
                        free shipping
                      </span>
                      <Truck className="w-4 h-4 text-muted-foreground" />
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
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4"
                  >
                    <ShoppingCart className="w-10 h-10 text-muted-foreground/50" />
                  </motion.div>
                  <h3 className="font-semibold text-lg mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Looks like you have not added anything yet
                  </p>
                  <Link
                    href="/products"
                    onClick={onClose}
                    className={cn(
                      "inline-flex items-center gap-2",
                      "px-6 py-3 rounded-lg font-medium",
                      "bg-primary text-primary-foreground",
                      "hover:bg-primary/90 transition-colors",
                    )}
                  >
                    Start Shopping
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((item) => {
                    const product = getProductById(item.id);
                    if (!product) return null;

                    const itemTotal = (product.nrsPrice || 0) * item.quantity;

                    return (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="px-4 py-4"
                      >
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingCart className="w-8 h-8 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">
                              {product.name}
                            </h4>
                            <p className="text-sm font-semibold text-primary mt-1">
                              NPR {formatPriceSimple(itemTotal)}
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 mt-3">
                              <div className="flex items-center gap-1 bg-muted rounded-md">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      item.quantity,
                                      -1,
                                    )
                                  }
                                  className="p-1.5 hover:bg-muted-foreground/10 rounded transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      item.quantity,
                                      1,
                                    )
                                  }
                                  className="p-1.5 hover:bg-muted-foreground/10 rounded transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => {
                                  const name = product.name;
                                  removeItem(item.id);
                                  showRemovedFromCart(name);
                                }}
                                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-4 space-y-4 bg-background">
                {/* Promo Code Input */}
                {!appliedPromo && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Promo Code</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code"
                          className={cn(
                            "w-full pl-9 pr-4 py-2",
                            "bg-muted border border-input rounded-md",
                            "text-sm focus:outline-none focus:ring-2 focus:ring-primary",
                            promoError && "border-red-500",
                          )}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleApplyPromoCode();
                            }
                          }}
                        />
                      </div>
                      <button
                        onClick={handleApplyPromoCode}
                        disabled={isApplyingPromo || !promoCode.trim()}
                        className={cn(
                          "px-4 py-2 rounded-md font-medium",
                          "bg-primary text-primary-foreground",
                          "hover:bg-primary/90 transition-colors",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                        )}
                      >
                        {isApplyingPromo ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-xs text-red-500">{promoError}</p>
                    )}
                  </div>
                )}

                {/* Applied Promo */}
                {appliedPromo && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">
                          {appliedPromo.code}
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          -NPR {formatPriceSimple(appliedPromo.discount)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {/* Order Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>NPR {formatPriceSimple(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-between text-green-600"
                    >
                      <span>Discount</span>
                      <span>-NPR {formatPriceSimple(discount)}</span>
                    </motion.div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `NPR ${formatPriceSimple(shipping)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (13% VAT)</span>
                    <span>NPR {formatPriceSimple(tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>NPR {formatPriceSimple(total)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={clearCart}
                    className={cn(
                      "px-4 py-2.5 rounded-lg font-medium",
                      "bg-muted text-foreground",
                      "hover:bg-muted/80 transition-colors",
                    )}
                  >
                    Clear Cart
                  </button>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-center gap-2",
                      "px-4 py-2.5 rounded-lg font-medium",
                      "bg-foreground text-background",
                      "hover:bg-foreground/90 transition-colors",
                    )}
                  >
                    Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Continue Shopping Link */}
                <Link
                  href="/products"
                  onClick={onClose}
                  className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Continue Shopping →
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Cart drawer hook for managing drawer state
 */
export function useCartDrawer() {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}
