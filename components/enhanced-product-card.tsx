/**
 * Enhanced Product Card with Rolls Royce-Style Premium Animations
 *
 * A luxury product card with sophisticated, elegant hover effects
 * inspired by premium automotive brand experiences.
 */

"use client";

import { AnimatedAddToCartButton } from "@/components/animated-add-to-cart-button";
import { GramQuantitySelector } from "@/components/gram-quantity-selector";
import {
  ConfettiBurst,
  FloatingHeart,
  StockBadge,
  TiltCard,
} from "@/components/neuro-animations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";

interface Product {
  id: number;
  name: string;
  nrsPrice: number;
  description: string;
  features: string[];
  image: string;
  badge: string;
  stock?: number;
  originalPrice?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  /** Price per 100g for gram-based pricing */
  pricePer100g?: number;
}

interface EnhancedProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (id: number, newQuantity: number) => void;
  onAddToCart: (id: number, quantity: number, grams?: number) => void;
  onBuyNow: (
    product: Product & {
      quantity: number;
      grams?: number;
      calculatedPrice?: number;
    },
  ) => void;
  onAddToWishlist?: (id: number) => void;
  className?: string;
  /** Enable gram-based quantity selector */
  enableGramSelector?: boolean;
}

// Premium easing curve for Rolls Royce-style smooth animations
const luxuryEasing: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export function EnhancedProductCard({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  onAddToWishlist,
  className,
  enableGramSelector = true,
}: EnhancedProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);
  const [addToCartError, setAddToCartError] = useState(false);

  // Gram-based pricing state
  const [selectedGrams, setSelectedGrams] = useState(100);
  const [calculatedPrice, setCalculatedPrice] = useState(product.nrsPrice);

  // Calculate base price per 100g from product price (assuming 500g as base)
  const basePricePer100g =
    product.pricePer100g || Math.round(product.nrsPrice / 5);

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.nrsPrice;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.nrsPrice) / product.originalPrice!) *
          100,
      )
    : 0;

  const handleWishlistClick = useCallback(() => {
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      setShowHeartAnimation(true);
      onAddToWishlist?.(product.id);
    }
  }, [isWishlisted, product.id, onAddToWishlist]);

  const handleAddToCart = useCallback(async () => {
    setIsAddingToCart(true);
    setAddToCartError(false);

    try {
      setShowConfetti(true);

      // Simulate async operation for smooth UX
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (enableGramSelector) {
        await onAddToCart(product.id, quantity, selectedGrams);
      } else {
        await onAddToCart(product.id, quantity);
      }

      // Show success state
      setAddToCartSuccess(true);
      setTimeout(() => setAddToCartSuccess(false), 2000);
    } catch (error) {
      setAddToCartError(true);
      setTimeout(() => setAddToCartError(false), 3000);
    } finally {
      setIsAddingToCart(false);
    }
  }, [onAddToCart, product.id, quantity, selectedGrams, enableGramSelector]);

  const handleGramQuantityChange = useCallback(
    (grams: number, price: number) => {
      setSelectedGrams(grams);
      setCalculatedPrice(price);
    },
    [],
  );

  const handleBuyNow = useCallback(() => {
    if (enableGramSelector) {
      onBuyNow({
        ...product,
        quantity,
        grams: selectedGrams,
        calculatedPrice,
      });
    } else {
      onBuyNow({ ...product, quantity });
    }
  }, [
    onBuyNow,
    product,
    quantity,
    selectedGrams,
    calculatedPrice,
    enableGramSelector,
  ]);

  return (
    <TiltCard tiltAmount={3}>
      <Card
        className={cn(
          "group h-full overflow-hidden rounded-2xl border border-border/40",
          "bg-card/95 p-0 gap-0",
          "shadow-[0_1px_1px_rgba(0,0,0,0.04),0_8px_20px_-16px_rgba(17,24,39,0.35)]",
          "transition-[transform,box-shadow] duration-500 ease-out",
          "hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(0,0,0,0.05),0_20px_50px_-30px_rgba(17,24,39,0.6)]",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted/40 ring-1 ring-inset ring-border/20">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}

          <motion.img
            src={product.image || "/placeholder.svg"}
            alt={`${product.name} - Premium Dehydrated Fruit, Healthy Snack from Nepal`}
            className="h-full w-full object-cover object-center"
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 1.2, ease: luxuryEasing }}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Luxury Dark Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: luxuryEasing }}
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              />
            )}
          </AnimatePresence>

          {/* Badges - Fade out on hover for cleaner look */}
          <motion.div
            className="absolute top-3 left-3 flex flex-col gap-2 z-10"
            animate={{ opacity: isHovered ? 0.5 : 1 }}
            transition={{ duration: 0.4 }}
          >
            {product.isNew && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg"
              >
                New
              </motion.div>
            )}
            {product.isBestseller && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Bestseller
              </motion.div>
            )}
            {hasDiscount && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              >
                -{discountPercent}%
              </motion.div>
            )}
          </motion.div>

          {/* Top Right Badge */}
          <motion.div
            className="absolute top-3 right-3 z-10"
            animate={{ opacity: isHovered ? 0.5 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-primary/90 text-primary-foreground px-2.5 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wide shadow-sm backdrop-blur">
              {product.badge}
            </div>
          </motion.div>

          {/* Wishlist Button - Elegant transform on hover */}
          <motion.button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg z-20"
            initial={{ scale: 1, opacity: 0.9 }}
            animate={{
              scale: isHovered ? 1.1 : 1,
              opacity: isHovered ? 1 : 0.9,
            }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: luxuryEasing }}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <FloatingHeart
              trigger={showHeartAnimation}
              onComplete={() => setShowHeartAnimation(false)}
            />
            <Heart
              className={cn(
                "w-5 h-5 transition-colors duration-300",
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700",
              )}
            />
          </motion.button>

          {/* Rolls Royce-Style Discover Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: luxuryEasing }}
                className="absolute inset-0 flex flex-col items-center justify-end pb-8 z-10"
              >
                {/* Elegant Discover Button */}
                <motion.button
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: luxuryEasing }}
                  className="bg-white text-gray-900 px-8 py-3 rounded-full font-medium shadow-2xl flex items-center gap-3 hover:bg-gray-50 transition-colors duration-300"
                >
                  <span className="text-sm uppercase tracking-widest font-semibold">
                    Discover
                  </span>
                  <motion.span
                    animate={{ x: isHovered ? 4 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </motion.button>

                {/* Product Name Overlay */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.05,
                    ease: luxuryEasing,
                  }}
                  className="absolute top-1/2 left-0 right-0 -translate-y-1/2 text-center px-4"
                >
                  <h3 className="text-white text-2xl font-light tracking-wide drop-shadow-lg">
                    {product.name}
                  </h3>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4 sm:p-5 gap-3">
          {/* Title & Price */}
          <div>
            <h3
              className="text-lg sm:text-xl font-semibold leading-tight tracking-tight text-foreground"
              data-product-id={product.id}
            >
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2 mt-1">
              {!enableGramSelector && (
                <>
                  <p className="text-primary font-bold text-2xl">
                    NPR {product.nrsPrice.toLocaleString()}
                  </p>
                  {hasDiscount && (
                    <p className="text-muted-foreground line-through text-sm">
                      NPR {product.originalPrice!.toLocaleString()}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {product.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {product.features.slice(0, 2).map((feature, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="text-[10px] bg-primary/8 text-foreground/80 px-2.5 py-1 rounded-full font-medium"
              >
                {feature}
              </motion.span>
            ))}
          </div>

          {/* Stock Badge */}
          {product.stock !== undefined && (
            <StockBadge stock={product.stock} className="self-start" />
          )}

          {/* Gram Quantity Selector */}
          {enableGramSelector ? (
            <GramQuantitySelector
              basePricePer100g={basePricePer100g}
              initialGrams={100}
              minGrams={100}
              stepSize={100}
              onQuantityChange={handleGramQuantityChange}
              className="mt-auto pt-3"
            />
          ) : (
            /* Legacy Quantity Selector */
            <div className="mt-auto flex items-center justify-center gap-2 pt-3">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-lg"
                onClick={() =>
                  onQuantityChange(product.id, Math.max(1, quantity - 1))
                }
              >
                <span className="sr-only">Decrease quantity</span>
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
                    d="M20 12H4"
                  />
                </svg>
              </Button>
              <span className="w-14 h-9 flex items-center justify-center text-center text-sm font-semibold rounded-lg border border-input bg-background">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-lg"
                onClick={() => onQuantityChange(product.id, quantity + 1)}
              >
                <span className="sr-only">Increase quantity</span>
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2 relative">
            <ConfettiBurst
              trigger={showConfetti}
              onComplete={() => setShowConfetti(false)}
            />
            <AnimatedAddToCartButton
              onClick={handleAddToCart}
              showPlusOne={true}
              variant="cart"
              size="touch"
              stockCount={product.stock}
              isLoading={isAddingToCart}
              showSuccess={addToCartSuccess}
              isError={addToCartError}
              errorMessage="Failed to add to cart"
              successDuration={2000}
              className="flex-1"
            >
              Add to Cart
            </AnimatedAddToCartButton>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                onClick={handleBuyNow}
                className="w-full min-h-[48px] h-auto px-5 py-3 text-base font-bold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 border-2 border-red-800/40 focus-visible:ring-[3px] focus-visible:ring-red-500/50 focus-visible:ring-offset-2"
                style={{
                  background:
                    "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                  color: "white",
                  boxShadow:
                    "0 10px 28px -10px rgba(220, 38, 38, 0.6), 0 4px 12px -4px rgba(0,0,0,0.15)",
                }}
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Buy Now
                </span>
              </Button>
            </motion.div>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3 mt-1 text-xs"
          >
            <span className="text-green-600 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              In Stock
            </span>
            <span className="text-blue-600 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              Free Shipping
            </span>
          </motion.div>
        </div>
      </Card>
    </TiltCard>
  );
}
