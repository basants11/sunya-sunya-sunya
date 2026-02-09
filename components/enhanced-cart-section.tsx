/**
 * Enhanced Shopping Cart Section
 * A comprehensive cart section for the main page with all cart features
 * including product display, quantity controls, totals, discount codes,
 * delivery estimates, trust badges, recommendations, and more.
 */

"use client";



import { CheckoutModal } from "@/components/checkout-modal";
import { useCart } from "@/lib/cart/use-cart";
import { products, type Product } from "@/lib/products";
import { getNewProductsToTry } from "@/lib/recommendation-engine";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookmarkPlus,
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  Heart,
  Minus,
  Plus,
  RefreshCcw,
  ShieldCheck,
  ShoppingCart,
  Tag,
  Truck,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// Constants
const TAX_RATE = 0.13;
const SHIPPING_RATES: Record<string, { rate: number; label: string }> = {
  kathmandu: { rate: 100, label: "Kathmandu Valley" },
  lalitpur: { rate: 100, label: "Lalitpur" },
  bhaktapur: { rate: 100, label: "Bhaktapur" },
  pokhara: { rate: 150, label: "Pokhara" },
  other: { rate: 200, label: "Other Locations" },
};

const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  SUNYA10: { discount: 0.1, label: "10% Off" },
  WELCOME20: { discount: 0.2, label: "20% Off New Customers" },
  SUMMER15: { discount: 0.15, label: "15% Off Summer Sale" },
};

// Get product by ID
function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

// Calculate item total
function calculateItemTotal(
  item: { id: number; quantity: number },
  product: Product,
): number {
  const basePrice = product.nrsPrice || 0;
  const gramPrice = product.gramPricing
    ? product.gramPricing.reduce(
        (min, g) => (g.price < min ? g.price : min),
        Infinity,
      )
    : null;
  return (gramPrice || basePrice) * item.quantity;
}

// Calculate estimated delivery date
function getEstimatedDelivery(): { date: string; timeframe: string } {
  const now = new Date();
  const deliveryDate = new Date(now);
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  return {
    date: deliveryDate.toLocaleDateString("en-NP", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    timeframe: "2-4 business days",
  };
}

// Get stock status
function getStockStatus(stock: number): { label: string; color: string } {
  if (stock > 50) return { label: "In Stock", color: "text-green-600" };
  if (stock > 10) return { label: "Low Stock", color: "text-yellow-600" };
  return { label: "Only Few Left", color: "text-red-600" };
}

// Stock levels for demo (in production, this would come from inventory)
const STOCK_LEVELS: Record<number, number> = {
  1: 45,
  2: 32,
  3: 67,
  4: 28,
  5: 89,
  6: 56,
  7: 23,
  8: 12,
};

interface CartItemRowProps {
  item: { id: number; quantity: number };
  product: Product;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  onSaveForLater: (id: number) => void;
}

function CartItemRow({
  item,
  product,
  onUpdateQuantity,
  onRemove,
  onSaveForLater,
}: CartItemRowProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const itemTotal = calculateItemTotal(item, product);
  const stock = STOCK_LEVELS[product.id] || 50;
  const stockStatus = getStockStatus(stock);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(item.id), 300);
  };

  return (
    <AnimatePresence mode="wait">
      {!isRemoving && (
        <motion.tr
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -100, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group border-b border-border/50 hover:bg-muted/30 transition-colors"
        >
          {/* Product Image */}
          <td className="py-4 px-2 sm:px-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground/30" />
                </div>
              )}
              {/* Stock Badge */}
              {stock <= 20 && (
                <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                  Low Stock
                </div>
              )}
            </div>
          </td>

          {/* Product Info */}
          <td className="py-4 px-2 sm:px-4">
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground text-sm sm:text-base line-clamp-2">
                {product.name}
              </h4>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                <span className={cn("font-medium", stockStatus.color)}>
                  {stockStatus.label}
                </span>
                <span>•</span>
                <span>{product.badge}</span>
              </div>
              {/* Price per unit */}
              <p className="text-xs text-muted-foreground">
                NPR {itemTotal.toLocaleString()} total
              </p>
            </div>
          </td>

          {/* Quantity Controls */}
          <td className="py-4 px-2 sm:px-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-1 sm:gap-2 bg-muted rounded-lg p-1">
                <button
                  onClick={() =>
                    onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }
                  className="p-1.5 sm:p-2 hover:bg-muted-foreground/10 rounded-md transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <span className="w-8 sm:w-10 text-center text-sm sm:text-base font-semibold">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="p-1.5 sm:p-2 hover:bg-muted-foreground/10 rounded-md transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Save for Later / Wishlist */}
              <button
                onClick={() => onSaveForLater(item.id)}
                className="p-1.5 sm:p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Save for later"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </td>

          {/* Subtotal */}
          <td className="py-4 px-2 sm:px-4 text-right">
            <span className="font-bold text-foreground text-sm sm:text-base">
              NPR {itemTotal.toLocaleString()}
            </span>
          </td>

          {/* Remove Button */}
          <td className="py-4 px-2 sm:px-4 text-center">
            <button
              onClick={handleRemove}
              className={cn(
                "p-1.5 sm:p-2 rounded-lg transition-all duration-200",
                "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                isHovered ? "opacity-100" : "opacity-0",
              )}
              aria-label="Remove item"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </td>
        </motion.tr>
      )}
    </AnimatePresence>
  );
}

interface RecommendationCardProps {
  product: Product;
  onAddToCart: (id: number) => void;
}

function RecommendationCard({ product, onAddToCart }: RecommendationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-muted/50 rounded-xl p-3 sm:p-4 border border-border/50 hover:border-primary/30 transition-colors"
    >
      <div className="flex gap-3 sm:gap-4">
        {/* Product Image */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-background flex-shrink-0">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground text-sm sm:text-base truncate">
            {product.name}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-primary text-sm sm:text-base">
              NPR {product.nrsPrice.toLocaleString()}
            </span>
            <button
              onClick={() => onAddToCart(product.id)}
              className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-md hover:bg-primary/90 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function EnhancedCartSection() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [savedItems, setSavedItems] = useState<number[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Handle hydration - use state initialization pattern
  useEffect(() => {
    // Small delay to ensure hydration
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Calculate totals
  const { subtotal, tax, shipping, discount, grandTotal, itemCount } =
    useMemo(() => {
      const subtotal = items.reduce((total, item) => {
        const product = getProductById(item.id);
        if (!product) return total;
        return total + calculateItemTotal(item, product);
      }, 0);

      const tax = Math.round(subtotal * TAX_RATE);
      const shipping = subtotal > 1000 ? 0 : SHIPPING_RATES.other.rate;
      const discount = appliedPromo
        ? PROMO_CODES[appliedPromo]
          ? Math.round(subtotal * PROMO_CODES[appliedPromo].discount)
          : 0
        : 0;
      const grandTotal = subtotal + tax + shipping - discount;
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

      return { subtotal, tax, shipping, discount, grandTotal, itemCount };
    }, [items, appliedPromo]);

  // Get delivery estimate
  const delivery = getEstimatedDelivery();

  // Get recommendations based on cart contents
  const recommendations = useMemo(() => {
    const cartProductIds = items.map((item) => item.id);
    return getNewProductsToTry(cartProductIds, 3);
  }, [items]);

  // Handle promo code application
  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) return;

    setIsApplyingPromo(true);
    setPromoError(null);

    // Simulate API call delay
    setTimeout(() => {
      const code = promoCode.toUpperCase().trim();
      if (PROMO_CODES[code]) {
        setAppliedPromo(code);
        setPromoCode("");
      } else {
        setPromoError(
          "Invalid promo code. Try: SUNYA10, WELCOME20, or SUMMER15",
        );
      }
      setIsApplyingPromo(false);
    }, 500);
  };

  // Handle remove promo code
  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  // Handle save for later
  const handleSaveForLater = (id: number) => {
    setSavedItems((prev) => [...prev, id]);
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear all items from your cart?")) {
      clearCart();
    }
  };

  if (!mounted) return null;

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 sm:mb-8"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Shopping Cart
            </h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {items.length > 0
                ? `${itemCount} item${itemCount !== 1 ? "s" : ""} in your cart`
                : "Your cart is empty"}
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Clear Cart
            </button>
          )}
        </motion.div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted mb-6">
              <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
              Your cart is empty
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start
              shopping to fill it up!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Shopping
              <ChevronRight className="w-4 h-4" />
            </Link>

            {/* Recommendations for empty cart */}
            {recommendations.length > 0 && (
              <div className="mt-12 text-left">
                <h4 className="text-lg font-semibold text-foreground mb-4">
                  Popular Products
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map((product) => (
                    <RecommendationCard
                      key={product.id}
                      product={product}
                      onAddToCart={() => {}}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items Table */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-background rounded-xl border border-border overflow-hidden"
              >
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    {/* Table Header */}
                    <thead>
                      <tr className="hidden sm:table-row bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <th className="col-span-2 text-left px-4 py-3">Product</th>
                        <th className="text-left px-4 py-3">Quantity</th>
                        <th className="text-right px-4 py-3">Subtotal</th>
                        <th className="text-center px-4 py-3">Remove</th>
                      </tr>
                    </thead>
                    
                    {/* Table Body */}
                    <tbody className="divide-y divide-border">
                      {items.map((item) => {
                        const product = getProductById(item.id);
                        if (!product) return null;
                        if (savedItems.includes(item.id)) return null;

                        return (
                          <CartItemRow
                            key={item.id}
                            item={item}
                            product={product}
                            onUpdateQuantity={updateQuantity}
                            onRemove={removeItem}
                            onSaveForLater={handleSaveForLater}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Saved Items */}
                {savedItems.length > 0 && (
                  <div className="border-t border-border p-4 bg-muted/30">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                      <BookmarkPlus className="w-4 h-4" />
                      Saved for Later ({savedItems.length})
                    </h4>
                    <div className="text-xs text-muted-foreground">
                      {savedItems.length} item
                      {savedItems.length !== 1 ? "s" : ""} saved for later
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 sm:mt-8"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    You Might Also Like
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.map((product) => (
                      <RecommendationCard
                        key={product.id}
                        product={product}
                        onAddToCart={() => {}}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-background rounded-xl border border-border sticky top-20"
              >
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Header */}
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">
                    Order Summary
                  </h3>

                  {/* Promo Code */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">
                      Promo Code
                    </label>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700 dark:text-green-400">
                            {PROMO_CODES[appliedPromo]?.label}
                          </span>
                        </div>
                        <button
                          onClick={handleRemovePromo}
                          className="text-green-600 hover:text-green-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => {
                            setPromoCode(e.target.value);
                            setPromoError(null);
                          }}
                          placeholder="Enter code"
                          className="flex-1 px-3 py-2 bg-muted border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          onClick={handleApplyPromoCode}
                          disabled={isApplyingPromo || !promoCode.trim()}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isApplyingPromo ? "..." : "Apply"}
                        </button>
                      </div>
                    )}
                    {promoError && (
                      <p className="text-xs text-destructive">{promoError}</p>
                    )}
                    {/* Available Promo Codes */}
                    {!appliedPromo && (
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(PROMO_CODES).map((code) => (
                          <button
                            key={code}
                            onClick={() => setPromoCode(code)}
                            className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded-md transition-colors"
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cost Breakdown */}
                  <div className="space-y-3 border-t border-border pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">
                        NPR {subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Tax (13% VAT)
                      </span>
                      <span className="font-medium">
                        NPR {tax.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `NPR ${shipping.toLocaleString()}`
                        )}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="font-medium text-green-600">
                          -NPR {discount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {subtotal < 1000 && (
                      <div className="text-xs text-muted-foreground">
                        Add NPR {(1000 - subtotal).toLocaleString()} more for
                        free shipping!
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold border-t border-border pt-3">
                      <span>Total</span>
                      <span>NPR {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Delivery Estimate */}
                  <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Truck className="w-4 h-4 text-primary" />
                      Estimated Delivery
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {delivery.date}
                      </span>
                      <span className="text-muted-foreground">
                        {delivery.timeframe}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Order within 2 hours for same-day dispatch
                    </div>
                  </div>

                  {/* Warranty & Returns */}
                  <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      SUNYA Care
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-green-600" />
                        30-day return policy
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-green-600" />
                        Quality guarantee
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-green-600" />
                        Freshness assured
                      </li>
                    </ul>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="flex items-center justify-center gap-2 w-full py-3 sm:py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    Proceed to Checkout
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      Secure
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      Khalti/eSewa
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <RefreshCcw className="w-4 h-4 text-orange-600" />
                      Easy Returns
                    </div>
                  </div>

                  {/* Continue Shopping */}
                  <Link
                    href="/products"
                    className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Continue Shopping →
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal for Main Page */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={items.map((item) => {
          const product = products.find((p) => p.id === item.id);
          return {
            id: item.id,
            name: product?.name || "Unknown Product",
            price: product?.nrsPrice || 0,
            image: product?.image || "",
            quantity: item.quantity,
            calculatedPrice: product?.nrsPrice || 0,
          };
        })}
        total={grandTotal}
      />
    </section>
  );
}
