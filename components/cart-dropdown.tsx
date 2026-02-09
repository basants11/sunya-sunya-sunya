/**
 * Cart Dropdown Component
 * Displays cart contents in a dropdown panel with options to:
 * - View cart items with images, names, quantities
 * - Update quantities
 * - Remove items
 * - View cart and checkout buttons
 * - Total price display
 */

"use client";

import { useCart } from "@/lib/cart/use-cart";
import { products, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

export interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Get product details by ID
 */
function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

/**
 * Calculate item total price
 */
function calculateItemTotal(
  item: { id: number; quantity: number },
  product: Product,
): number {
  // Use base price for now - can be extended for gram-based pricing
  return (product.nrsPrice || 0) * item.quantity;
}

/**
 * Calculate cart total
 */
function calculateCartTotal(items: { id: number; quantity: number }[]): number {
  return items.reduce((total, item) => {
    const product = getProductById(item.id);
    if (!product) return total;
    return total + calculateItemTotal(item, product);
  }, 0);
}

/**
 * Cart Dropdown Component
 */
export function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const { items, removeItem, updateQuantity } = useCart();
  const [mounted, setMounted] = React.useState(false);

  // Handle hydration to avoid mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const total = React.useMemo(() => calculateCartTotal(items), [items]);
  const itemCount = React.useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  // Close dropdown on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

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
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Dropdown Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "fixed top-16 right-4 z-50",
              "w-full max-w-md",
              "bg-background rounded-xl shadow-2xl border border-border",
              "overflow-hidden",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">
                  Your Cart ({itemCount})
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-muted rounded-md transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="max-h-80 overflow-y-auto">
              {items.length === 0 ? (
                <div className="py-12 px-4 text-center">
                  <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <Link
                    href="/products"
                    onClick={onClose}
                    className="inline-block mt-4 text-primary hover:underline font-medium"
                  >
                    Continue Shopping →
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((item) => {
                    const product = getProductById(item.id);
                    if (!product) return null;

                    const itemTotal = calculateItemTotal(item, product);

                    return (
                      <li key={item.id} className="px-4 py-3">
                        <div className="flex gap-3">
                          {/* Product Image */}
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">
                              {product.name}
                            </h4>
                            <p className="text-sm font-semibold text-primary mt-1">
                              NPR {itemTotal.toLocaleString()}
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1 bg-muted rounded-md">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="p-1 hover:bg-muted-foreground/10 rounded transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="p-1 hover:bg-muted-foreground/10 rounded transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-4 space-y-3">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    NPR {total.toLocaleString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-center gap-2",
                      "px-4 py-2.5 rounded-lg font-medium",
                      "bg-primary text-primary-foreground",
                      "hover:bg-primary/90 transition-colors",
                    )}
                  >
                    View Cart
                  </Link>
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
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
