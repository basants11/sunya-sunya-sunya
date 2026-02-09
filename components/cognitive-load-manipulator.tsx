/**
 * Cognitive Load Manipulation
 *
 * Visual hierarchy override system designed to guide user attention
 * and reduce decision friction through strategic visual manipulation.
 *
 * PUBLIC FACING: "Personalized Experience"
 * INTERNAL: Cognitive load manipulation framework
 */

"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// =============================================================================
// PRICE ANCHORING DISPLAY
// =============================================================================

interface PriceAnchoringProps {
  originalPrice: number;
  currentPrice: number;
  currency?: string;
  className?: string;
}

/**
 * Price anchoring: "Was $199" crossed out → "Now $99" in dopamine red
 */
export function PriceAnchoring({
  originalPrice,
  currentPrice,
  currency = "Rs.",
  className,
}: PriceAnchoringProps) {
  const prefersReducedMotion = useReducedMotion();
  const savings = originalPrice - currentPrice;
  const savingsPercent = Math.round((savings / originalPrice) * 100);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline gap-3">
        {/* Original price - crossed out */}
        <span className="text-lg text-muted-foreground line-through decoration-red-500 decoration-2">
          {currency}
          {originalPrice}
        </span>

        {/* Current price - dopamine red */}
        <motion.span
          animate={
            !prefersReducedMotion
              ? {
                  scale: [1, 1.02, 1],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity }}
          className="text-3xl font-bold text-red-600"
        >
          {currency}
          {currentPrice}
        </motion.span>
      </div>

      {/* Savings badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold"
      >
        <span>💰</span>
        <span>
          You save {currency}
          {savings} ({savingsPercent}%)
        </span>
      </motion.div>
    </div>
  );
}

// =============================================================================
// DECOY PRICING SELECTOR
// =============================================================================

interface PricingOption {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  features: string[];
  isBestValue?: boolean;
  isRecommended?: boolean;
}

interface DecoyPricingProps {
  options: PricingOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  currency?: string;
  className?: string;
}

/**
 * Decoy pricing: Middle option highlighted "BEST VALUE" (highest margin)
 * Premium options pre-checked (opt-out in small text)
 */
export function DecoyPricing({
  options,
  selectedId,
  onSelect,
  currency = "Rs.",
  className,
}: DecoyPricingProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn("grid gap-4 md:grid-cols-3", className)}>
      {options.map((option, index) => {
        const isSelected = selectedId === option.id;
        const isMiddle = index === 1;

        return (
          <motion.div
            key={option.id}
            onClick={() => onSelect(option.id)}
            animate={
              isSelected && !prefersReducedMotion
                ? {
                    scale: 1.02,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  }
                : {
                    scale: 1,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  }
            }
            whileHover={!prefersReducedMotion ? { scale: 1.03 } : {}}
            className={cn(
              "relative p-6 rounded-xl border-2 cursor-pointer transition-colors",
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/50",
            )}
          >
            {/* Best Value badge - always on middle option */}
            {isMiddle && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                  BEST VALUE
                </span>
              </div>
            )}

            {/* Recommended badge */}
            {option.isRecommended && !isMiddle && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                  RECOMMENDED
                </span>
              </div>
            )}

            <div className="text-center mb-4">
              <h3 className="font-semibold text-lg">{option.name}</h3>
              <div className="mt-2">
                {option.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through mr-2">
                    {currency}
                    {option.originalPrice}
                  </span>
                )}
                <span className="text-3xl font-bold">
                  {currency}
                  {option.price}
                </span>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              {option.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Selection indicator */}
            <div
              className={cn(
                "w-6 h-6 rounded-full border-2 mx-auto flex items-center justify-center",
                isSelected
                  ? "border-primary bg-primary"
                  : "border-muted-foreground",
              )}
            >
              {isSelected && <span className="text-white text-sm">✓</span>}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// =============================================================================
// PROGRESSIVE CHECKMARKS
// =============================================================================

interface BenefitCheckmarksProps {
  benefits: string[];
  className?: string;
}

/**
 * Benefit sequence: Animated checkmarks appearing one-by-one (builds agreement)
 */
export function BenefitCheckmarks({
  benefits,
  className,
}: BenefitCheckmarksProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const showNext = () => {
      setVisibleCount((prev) => {
        if (prev < benefits.length) {
          return prev + 1;
        }
        return prev;
      });
    };

    const timer = setInterval(showNext, 800);
    return () => clearInterval(timer);
  }, [benefits.length]);

  return (
    <div className={cn("space-y-3", className)}>
      {benefits.map((benefit, index) => (
        <AnimatePresence key={index}>
          {index < visibleCount && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.4,
                delay: index * 0.1,
              }}
              className="flex items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                  delay: prefersReducedMotion ? 0 : index * 0.1 + 0.2,
                }}
                className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <span className="text-foreground">{benefit}</span>
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
}

// =============================================================================
// URGENCY PROGRESS BAR
// =============================================================================

interface UrgencyProgressProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
}

/**
 * Progress bar always 80%+ filled (creates completion urge)
 */
export function UrgencyProgress({
  current,
  total,
  label = "Progress",
  className,
}: UrgencyProgressProps) {
  const prefersReducedMotion = useReducedMotion();

  // Always show at least 80% progress
  const displayProgress = Math.max(80, (current / total) * 100);
  const isComplete = current >= total;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <motion.span
          key={current}
          initial={{ scale: 1.5, color: "#00c950" }}
          animate={{ scale: 1, color: "inherit" }}
          className="font-bold"
        >
          {Math.round(displayProgress)}%
        </motion.span>
      </div>

      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${displayProgress}%` }}
          transition={{
            duration: prefersReducedMotion ? 0 : 1.2,
            ease: [0.68, -0.55, 0.265, 1.55],
          }}
          className={cn(
            "h-full rounded-full transition-colors",
            isComplete
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : "bg-gradient-to-r from-blue-500 to-green-500",
          )}
        />
      </div>

      {isComplete && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-green-600 font-semibold text-center"
        >
          🎉 Complete! You&apos;re all set!
        </motion.p>
      )}
    </div>
  );
}

// =============================================================================
// SMART DEFAULTS SELECTOR
// =============================================================================

interface SmartDefaultOption {
  id: string;
  label: string;
  description?: string;
  isPremium?: boolean;
}

interface SmartDefaultsProps {
  options: SmartDefaultOption[];
  defaultSelected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

/**
 * Premium options pre-checked (opt-out in small text)
 */
export function SmartDefaults({
  options,
  defaultSelected,
  onChange,
  className,
}: SmartDefaultsProps) {
  const [selected, setSelected] = useState<string[]>(defaultSelected);
  const prefersReducedMotion = useReducedMotion();

  const toggleOption = (id: string) => {
    setSelected((prev) => {
      const newSelected = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      onChange(newSelected);
      return newSelected;
    });
  };

  return (
    <div className={cn("space-y-3", className)}>
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        const isPremium = option.isPremium;

        return (
          <motion.div
            key={option.id}
            onClick={() => toggleOption(option.id)}
            animate={
              isSelected && !prefersReducedMotion
                ? { scale: 1.01, x: 4 }
                : { scale: 1, x: 0 }
            }
            className={cn(
              "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30",
            )}
          >
            {/* Checkbox - pre-checked for premium */}
            <div
              className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                isSelected
                  ? "border-primary bg-primary"
                  : "border-muted-foreground",
              )}
            >
              {isSelected && <span className="text-white text-xs">✓</span>}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{option.label}</span>
                {isPremium && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                    PREMIUM
                  </span>
                )}
              </div>
              {option.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {option.description}
                </p>
              )}
              {isPremium && (
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-amber-600">*</span> Pre-selected for
                  best experience
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// =============================================================================
// VISUAL HIERARCHY CTA
// =============================================================================

interface VisualHierarchyCTAProps {
  children: React.ReactNode;
  className?: string;
  persistOnScroll?: boolean;
}

/**
 * Primary CTA: 30% larger, always above fold, persistent on scroll
 */
export function VisualHierarchyCTA({
  children,
  className,
  persistOnScroll = true,
}: VisualHierarchyCTAProps) {
  const [isSticky, setIsSticky] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!persistOnScroll) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [persistOnScroll]);

  return (
    <motion.div
      animate={
        isSticky && !prefersReducedMotion
          ? {
              position: "fixed",
              bottom: 20,
              left: "50%",
              x: "-50%",
              zIndex: 50,
            }
          : {}
      }
      className={cn(
        "transition-all duration-300",
        isSticky && "shadow-2xl",
        className,
      )}
    >
      <div className={cn("transform scale-130", isSticky && "scale-110")}>
        {children}
      </div>
    </motion.div>
  );
}

// =============================================================================
// EXPORT ALL COMPONENTS
// =============================================================================

export {
  type PriceAnchoringProps,
  type DecoyPricingProps,
  type BenefitCheckmarksProps,
  type UrgencyProgressProps,
  type SmartDefaultsProps,
  type VisualHierarchyCTAProps,
  type PricingOption,
  type SmartDefaultOption,
};
