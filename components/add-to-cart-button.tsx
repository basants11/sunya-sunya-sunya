/**
 * Add to Cart Button with Quantity Controls
 * Complete add-to-cart functionality with stock validation, loading states, and toast notifications
 */

"use client";

import { useCart } from "@/lib/cart/use-cart";
import {
  canAddToCart,
  formatPriceSimple,
  getStockStatus,
} from "@/lib/cart/utils";
import { type Product } from "@/lib/products";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useCartToast } from "./cart-toast";

/**
 * Add to Cart Button Props
 */
export interface AddToCartButtonProps {
  product: Product;
  className?: string;
  showQuantitySelector?: boolean;
  defaultQuantity?: number;
  maxQuantity?: number;
  variant?: "default" | "icon-only" | "compact";
}

/**
 * Add to Cart Button Component
 */
export function AddToCartButton({
  product,
  className,
  showQuantitySelector = true,
  defaultQuantity = 1,
  maxQuantity = 99,
  variant = "default",
}: AddToCartButtonProps) {
  const router = useRouter();
  const { addItem, hasItem, updateQuantity, getItem } = useCart();
  const { showAddedToCart, showStockWarning, showOutOfStock } = useCartToast();
  const [mounted, setMounted] = React.useState(false);
  const [quantity, setQuantity] = React.useState(defaultQuantity);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isAdded, setIsAdded] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const existingItem = getItem(product.id);
  const currentQuantity = existingItem?.quantity ?? 0;
  const totalQuantity = currentQuantity + quantity;
  const stockStatus = getStockStatus(100); // Default high stock since Product doesn't have stock field

  // Handle hydration
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Reset added state after animation
  React.useEffect(() => {
    if (isAdded) {
      const timer = setTimeout(() => setIsAdded(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAdded]);

  // Validate quantity on change
  React.useEffect(() => {
    if (quantity > maxQuantity) {
      setQuantity(maxQuantity);
    }
    if (quantity < 1) {
      setQuantity(1);
    }
  }, [quantity, maxQuantity]);

  const handleQuantityChange = (delta: number) => {
    setError(null);
    const newQuantity = quantity + delta;

    if (newQuantity < 1) {
      setQuantity(1);
      return;
    }

    if (newQuantity > maxQuantity) {
      setError(`Maximum quantity is ${maxQuantity}`);
      return;
    }

    // Check stock availability
    const { canAdd, remaining } = canAddToCart(
      currentQuantity,
      newQuantity,
      maxQuantity,
    );

    if (!canAdd && newQuantity > currentQuantity) {
      if (remaining <= 0) {
        setError("Out of stock");
        showOutOfStock(product.name);
      } else {
        setError(`Only ${remaining} available`);
        showStockWarning(product.name, remaining);
      }
      return;
    }

    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    setError(null);
    setIsAdding(true);

    try {
      // Simulate network delay for loading animation
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Add to cart
      addItem(product.id, quantity);

      // Show success
      const itemTotal = product.nrsPrice * quantity;
      showAddedToCart(product.name, quantity, itemTotal);
      setIsAdded(true);

      // Reset quantity to default
      if (!hasItem(product.id)) {
        setQuantity(defaultQuantity);
      }
    } catch (err) {
      setError("Failed to add to cart. Please try again.");
      console.error("Add to cart error:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDirectCheckout = async () => {
    setError(null);
    setIsAdding(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      addItem(product.id, quantity);
      // Navigate to checkout page (modal will auto-open)
      router.push("/checkout");
    } catch (err) {
      setError("Failed to proceed. Please try again.");
    } finally {
      // Keep loading state briefly for visual feedback
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  if (!mounted) return null;

  const isOutOfStock = stockStatus === "out_of_stock";

  return (
    <div className={cn("space-y-3", className)}>
      {/* Quantity Selector */}
      {showQuantitySelector && !isOutOfStock && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            Qty:
          </span>
          <div className="flex items-center gap-1 bg-muted rounded-lg px-2 py-1">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1 || isAdding}
              className="p-1.5 hover:bg-muted-foreground/10 rounded transition-colors disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={isAdding}
              className="p-1.5 hover:bg-muted-foreground/10 rounded transition-colors disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {variant === "default" && (
            <span className="text-sm text-muted-foreground">
              Total:{" "}
              <span className="font-semibold text-foreground">
                NPR {formatPriceSimple(product.nrsPrice * quantity)}
              </span>
            </span>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-2 text-sm text-red-500"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div
        className={cn(
          "flex gap-2",
          variant === "icon-only" && "justify-center",
        )}
      >
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding || isOutOfStock}
          className={cn(
            "flex items-center justify-center gap-2",
            "font-semibold rounded-lg transition-all",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            variant === "default" && [
              "flex-1 px-6 py-3",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90 hover:shadow-lg",
              "active:scale-[0.98]",
            ],
            variant === "compact" && [
              "px-4 py-2",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90",
            ],
            variant === "icon-only" && [
              "w-12 h-12 rounded-full",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90",
            ],
            isAdded && [
              "bg-green-600 hover:bg-green-600",
              "focus:ring-green-500",
            ],
          )}
          aria-label={
            isOutOfStock
              ? "Out of stock"
              : `Add ${quantity} ${product.name} to cart`
          }
        >
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="w-5 h-5 animate-spin" />
              </motion.div>
            ) : isAdded ? (
              <motion.div
                key="success"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1"
              >
                <Check className="w-5 h-5" />
                {variant !== "icon-only" && <span>Added!</span>}
              </motion.div>
            ) : (
              <motion.div
                key="cart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1"
              >
                <ShoppingCart className="w-5 h-5" />
                {variant !== "icon-only" && <span>Add to Cart</span>}
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Buy Now Button (only for default variant) */}
        {variant === "default" && (
          <button
            onClick={handleDirectCheckout}
            disabled={isAdding || isOutOfStock}
            className={cn(
              "flex items-center justify-center gap-2",
              "px-6 py-3 font-semibold rounded-lg",
              "bg-foreground text-background",
              "hover:bg-foreground/90 hover:shadow-lg",
              "transition-all active:scale-[0.98]",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            aria-label={`Buy ${quantity} ${product.name} now`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Buy Now</span>
          </button>
        )}
      </div>

      {/* Stock Status */}
      {variant === "default" && (
        <p
          className={cn(
            "text-xs text-center",
            isOutOfStock
              ? "text-red-500"
              : stockStatus === "low_stock"
                ? "text-amber-500"
                : "text-green-600",
          )}
        >
          {isOutOfStock
            ? "Out of Stock"
            : stockStatus === "low_stock"
              ? "Limited stock available"
              : "In Stock"}
        </p>
      )}
    </div>
  );
}

/**
 * Mini Add to Cart Button
 * Compact version for cards and grids
 */
export function MiniAddToCartButton({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  return (
    <AddToCartButton
      product={product}
      className={className}
      variant="compact"
      showQuantitySelector={false}
    />
  );
}

/**
 * Icon Only Add to Cart Button
 * For use in navigation and compact layouts
 */
export function IconAddToCartButton({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  return (
    <AddToCartButton
      product={product}
      className={className}
      variant="icon-only"
      showQuantitySelector={false}
    />
  );
}

/**
 * Quantity Stepper Component
 * Standalone quantity control with plus/minus buttons
 */
export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  disabled?: boolean;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
  disabled = false,
}: QuantityStepperProps) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 bg-muted rounded-lg px-2 py-1",
        disabled && "opacity-50",
        className,
      )}
    >
      <button
        onClick={handleDecrement}
        disabled={value <= min || disabled}
        className="p-1.5 hover:bg-muted-foreground/10 rounded transition-colors disabled:opacity-50"
        aria-label="Decrease"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-8 text-center font-semibold">{value}</span>
      <button
        onClick={handleIncrement}
        disabled={value >= max || disabled}
        className="p-1.5 hover:bg-muted-foreground/10 rounded transition-colors disabled:opacity-50"
        aria-label="Increase"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
