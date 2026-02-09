/**
 * Gram Quantity Selector
 *
 * A premium quantity selector for gram-based products with:
 * - +/- buttons for 100g increments
 * - Dynamic price calculation with smooth animations
 * - Micro-interactions for satisfying UX
 * - Mobile-first responsive design
 */

"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface GramQuantitySelectorProps {
  /** Base price per 100 grams */
  basePricePer100g: number;
  /** Initial quantity in grams (default: 100) */
  initialGrams?: number;
  /** Minimum quantity in grams (default: 100) */
  minGrams?: number;
  /** Step size for increment/decrement (default: 100) */
  stepSize?: number;
  /** Callback when quantity changes */
  onQuantityChange?: (grams: number, totalPrice: number) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether the selector is disabled */
  disabled?: boolean;
}

/**
 * Animated price display with count-up/count-down effect
 */
function AnimatedPrice({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const isAnimatingRef = useRef(false);
  const previousValue = useRef(value);

  useEffect(() => {
    if (previousValue.current !== value) {
      isAnimatingRef.current = true;
      const startValue = previousValue.current;
      const endValue = value;
      const duration = 300; // ms
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        const currentValue = Math.round(
          startValue + (endValue - startValue) * easeOutQuart,
        );

        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isAnimatingRef.current = false;
          previousValue.current = value;
        }
      };

      requestAnimationFrame(animate);
    }
  }, [value]);

  return (
    <motion.span
      className={cn("tabular-nums transition-colors duration-200", className)}
      key={value}
      initial={{ scale: 1.02, color: "var(--primary)" }}
      animate={{ scale: 1, color: "currentColor" }}
      transition={{ duration: 0.3 }}
    >
      NPR {displayValue.toLocaleString()}
    </motion.span>
  );
}

/**
 * Ripple effect for button clicks
 */
function RippleEffect({
  x,
  y,
  onComplete,
}: {
  x: number;
  y: number;
  onComplete: () => void;
}) {
  return (
    <motion.span
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onAnimationComplete={onComplete}
    >
      <motion.span
        className="absolute bg-white/30 rounded-full"
        style={{
          left: x,
          top: y,
          width: 10,
          height: 10,
          marginLeft: -5,
          marginTop: -5,
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 8, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </motion.span>
  );
}

/**
 * Gram Quantity Selector Component
 */
export function GramQuantitySelector({
  basePricePer100g,
  initialGrams = 100,
  minGrams = 100,
  stepSize = 100,
  onQuantityChange,
  className,
  disabled = false,
}: GramQuantitySelectorProps) {
  const [grams, setGrams] = useState(initialGrams);
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number; type: "inc" | "dec" }[]
  >([]);

  // Calculate total price based on current grams
  const totalPrice = Math.round((grams / 100) * basePricePer100g);

  // Notify parent of changes
  useEffect(() => {
    onQuantityChange?.(grams, totalPrice);
  }, [grams, totalPrice, onQuantityChange]);

  // Add ripple effect
  const addRipple = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, type: "inc" | "dec") => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x, y, type }]);
    },
    [],
  );

  // Remove ripple effect
  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Handle increment
  const handleIncrement = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      addRipple(e, "inc");
      setGrams((prev) => prev + stepSize);
    },
    [stepSize, addRipple],
  );

  // Handle decrement
  const handleDecrement = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      addRipple(e, "dec");
      setGrams((prev) => Math.max(minGrams, prev - stepSize));
    },
    [minGrams, stepSize, addRipple],
  );

  // Format grams display
  const formatGrams = useCallback((g: number): string => {
    if (g >= 1000) {
      return `${g / 1000}kg`;
    }
    return `${g}g`;
  }, []);

  const isAtMin = grams <= minGrams;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Quantity Selector */}
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {/* Minus Button */}
        <motion.button
          onClick={handleDecrement}
          disabled={disabled || isAtMin}
          className={cn(
            "relative h-10 w-10 sm:h-11 sm:w-11 rounded-full flex items-center justify-center",
            "transition-colors duration-200 overflow-hidden",
            "touch-manipulation active:scale-95",
            isAtMin
              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
              : "bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/30",
          )}
          whileTap={!isAtMin ? { scale: 0.9 } : undefined}
          whileHover={!isAtMin ? { scale: 1.05 } : undefined}
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
          {ripples
            .filter((r) => r.type === "dec")
            .map((ripple) => (
              <RippleEffect
                key={ripple.id}
                x={ripple.x}
                y={ripple.y}
                onComplete={() => removeRipple(ripple.id)}
              />
            ))}
        </motion.button>

        {/* Quantity Display */}
        <div className="min-w-[80px] sm:min-w-[100px] text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={grams}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="text-lg sm:text-xl font-bold text-foreground"
            >
              {formatGrams(grams)}
            </motion.div>
          </AnimatePresence>
          <motion.div
            className="text-[10px] sm:text-xs text-muted-foreground font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Quantity
          </motion.div>
        </div>

        {/* Plus Button */}
        <motion.button
          onClick={handleIncrement}
          disabled={disabled}
          className={cn(
            "relative h-10 w-10 sm:h-11 sm:w-11 rounded-full flex items-center justify-center",
            "bg-primary text-primary-foreground",
            "transition-colors duration-200 overflow-hidden",
            "hover:bg-primary/90 active:bg-primary/80",
            "touch-manipulation active:scale-95",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
          {ripples
            .filter((r) => r.type === "inc")
            .map((ripple) => (
              <RippleEffect
                key={ripple.id}
                x={ripple.x}
                y={ripple.y}
                onComplete={() => removeRipple(ripple.id)}
              />
            ))}
        </motion.button>
      </div>

      {/* Price Display */}
      <div className="text-center">
        <div className="flex items-baseline justify-center gap-1.5">
          <span className="text-sm text-muted-foreground">Total:</span>
          <AnimatedPrice
            value={totalPrice}
            className="text-xl sm:text-2xl font-bold text-primary"
          />
        </div>
        <motion.div
          className="text-[10px] sm:text-xs text-muted-foreground mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          NPR {basePricePer100g} per 100g
        </motion.div>
      </div>

      {/* Progress Indicator (subtle visual cue) */}
      <div className="relative h-1 bg-gray-100 rounded-full overflow-hidden mx-4 sm:mx-8">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/60 to-primary rounded-full"
          initial={{ width: "10%" }}
          animate={{ width: `${Math.min((grams / 1000) * 100, 100)}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
}

export default GramQuantitySelector;
