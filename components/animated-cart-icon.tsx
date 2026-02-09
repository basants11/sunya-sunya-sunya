/**
 * Animated Cart Icon Component
 * Cart icon with smooth animations when items are added, removed, or updated.
 *
 * Features:
 * - Smooth bounce animation when items are added
 * - Animated count badge with spring physics
 * - Visual ripple/confirmation effect on addition
 * - Shake animation on removal
 * - Hover and tap feedback
 * - Reduced motion support
 * - Accessibility compliant
 */

"use client";

import { useCart, useCartUI } from "@/lib/cart/use-cart";
import type { UseCartReturn, UseCartUIReturn } from "@/lib/cart/types";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export interface AnimatedCartIconProps {
  className?: string;
  showBadge?: boolean;
  badgeClassName?: string;
  iconClassName?: string;
  onClick?: () => void;
  href?: string;
  /** Show ripple effect on cart add */
  showRipple?: boolean;
  /** Custom color for the badge */
  badgeColor?: string;
}

// Default cart state when provider is not available
const defaultCartState: UseCartReturn = {
  items: [],
  itemCount: 0,
  isEmpty: true,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getItem: () => undefined,
  hasItem: () => false,
};

const defaultCartUIState: UseCartUIReturn = {
  reducedMotion: false,
  soundEnabled: true,
  hapticsEnabled: true,
  toggleReducedMotion: () => {},
  toggleSound: () => {},
  toggleHaptics: () => {},
  isIdle: false,
  isAddBurst: false,
  toggleCount: 0,
  registerHoverIntent: () => {},
};

/**
 * Animated cart icon content - renders cart icon with animations
 */
function AnimatedCartIconContent({
  className = "",
  showBadge = true,
  badgeClassName = "",
  iconClassName = "",
  onClick,
  href = "/checkout",
  showRipple = true,
  badgeColor = "#FF6900",
  cart = defaultCartState,
  cartUI = defaultCartUIState,
}: AnimatedCartIconProps & { cart?: UseCartReturn; cartUI?: UseCartUIReturn }) {
  const { itemCount } = cart;
  const { reducedMotion } = cartUI;

  const controls = useAnimation();
  const rippleControls = useAnimation();
  const scale = useMotionValue(1);
  const [prevItemCount, setPrevItemCount] = React.useState(itemCount);
  const [justAdded, setJustAdded] = React.useState(false);
  const [showRippleEffect, setShowRippleEffect] = React.useState(false);

  // Smooth spring animation for count changes
  const countSpring = useSpring(itemCount, {
    stiffness: 300,
    damping: 25,
    restDelta: 0.1,
  });

  // Animate when item count changes
  React.useEffect(() => {
    if (itemCount > prevItemCount) {
      // Item added - celebratory bounce animation
      setJustAdded(true);

      controls.start({
        scale: [1, 1.3, 1.1, 1],
        rotate: [0, -8, 8, -5, 5, 0],
        y: [0, -8, 0],
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      });

      // Trigger ripple effect
      if (showRipple) {
        setShowRippleEffect(true);
        rippleControls
          .start({
            scale: [1, 2],
            opacity: [0.6, 0],
            transition: {
              duration: 0.4,
              ease: "easeOut",
            },
          })
          .then(() => {
            setShowRippleEffect(false);
            rippleControls.set({ scale: 1, opacity: 0 });
          });
      }

      // Reset justAdded state after animation
      setTimeout(() => setJustAdded(false), 500);
    } else if (itemCount < prevItemCount && itemCount > 0) {
      // Item removed - subtle shake
      controls.start({
        x: [0, -6, 6, -4, 4, 0],
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      });
    } else if (itemCount === 0 && prevItemCount > 0) {
      // Cart emptied - fade out badge
      controls.start({
        scale: [1, 0.8],
        opacity: [1, 0],
        transition: {
          duration: 0.2,
        },
      });
    }

    setPrevItemCount(itemCount);
  }, [itemCount, prevItemCount, controls, rippleControls, showRipple]);

  // Hover animation
  const handleHoverStart = () => {
    if (!reducedMotion) {
      controls.start({
        scale: 1.1,
        y: -2,
        transition: { duration: 0.2 },
      });
    }
  };

  const handleHoverEnd = () => {
    if (!reducedMotion) {
      controls.start({
        scale: 1,
        y: 0,
        transition: { duration: 0.2 },
      });
    }
  };

  // Tap animation
  const handleTap = () => {
    if (!reducedMotion) {
      controls.start({
        scale: 0.95,
        transition: { duration: 0.1 },
      });
    }
  };

  const handleTapEnd = () => {
    if (!reducedMotion) {
      controls.start({
        scale: 1,
        transition: { duration: 0.1 },
      });
    }
  };

  const cartContent = (
    <motion.button
      className={cn(
        "relative p-2 rounded-full transition-colors",
        "hover:bg-muted/80",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className,
      )}
      onClick={onClick}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onTap={handleTap}
      animate={controls}
      style={{ scale }}
      aria-label={`Shopping cart with ${itemCount} items`}
      data-cart-icon
    >
      {/* Ripple effect circle */}
      <AnimatePresence>
        {showRippleEffect && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: badgeColor, opacity: 0.2 }}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={rippleControls}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Cart Icon */}
      <motion.div
        className={cn("relative z-10", iconClassName)}
        whileHover={!reducedMotion ? { rotate: [-3, 3, -3, 3, 0] } : undefined}
        transition={{ duration: 0.4 }}
      >
        <ShoppingCart className="w-6 h-6" />
      </motion.div>

      {/* Success/Added indicator glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={false}
        animate={
          justAdded
            ? {
                boxShadow: [
                  `0 0 0 0px ${badgeColor}33`,
                  `0 0 20px 8px ${badgeColor}66`,
                  `0 0 0 0px ${badgeColor}00`,
                ],
              }
            : {}
        }
        transition={{ duration: 0.5 }}
        style={{ pointerEvents: "none" }}
      />

      {/* Badge */}
      <AnimatePresence mode="wait">
        {showBadge && itemCount > 0 && (
          <motion.span
            key={itemCount}
            initial={{ scale: 0, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -10 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 25,
            }}
            className={cn(
              "absolute -top-1 -right-1 z-20",
              "flex items-center justify-center",
              "text-white text-xs font-bold rounded-full shadow-sm",
              "min-w-[18px] h-[18px] px-1",
            )}
            style={{
              backgroundColor: badgeColor,
              fontSize: itemCount > 99 ? "10px" : "12px",
            }}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );

  // Wrap in Link if href is provided and no onClick
  if (href && !onClick) {
    return <Link href={href}>{cartContent}</Link>;
  }

  return cartContent;
}

/**
 * Wrapper component that provides cart context
 */
function CartIconWrapper({
  children,
}: {
  children: (cart: UseCartReturn, cartUI: UseCartUIReturn) => React.ReactNode;
}) {
  const cart = useCart();
  const cartUI = useCartUI();
  return <>{children(cart, cartUI)}</>;
}

/**
 * Animated cart icon component with smooth animations
 */
export function AnimatedCartIcon(props: AnimatedCartIconProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // On server, render with default state (no cart)
  if (!isClient) {
    return <AnimatedCartIconContent {...props} cart={defaultCartState} cartUI={defaultCartUIState} />;
  }

  // On client, use the actual cart context
  return (
    <CartIconWrapper>
      {(cart, cartUI) => <AnimatedCartIconContent {...props} cart={cart} cartUI={cartUI} />}
    </CartIconWrapper>
  );
}

/**
 * Compact animated cart icon content
 */
function CompactCartIconContent({
  className = "",
  showBadge = true,
  onClick,
  badgeColor = "#FF6900",
  cart = defaultCartState,
  cartUI = defaultCartUIState,
}: { className?: string; showBadge?: boolean; onClick?: () => void; badgeColor?: string; cart?: UseCartReturn; cartUI?: UseCartUIReturn }) {
  const { itemCount } = cart;
  const { reducedMotion } = cartUI;
  const controls = useAnimation();
  const [prevItemCount, setPrevItemCount] = React.useState(itemCount);
  const [justAdded, setJustAdded] = React.useState(false);

  React.useEffect(() => {
    if (itemCount > prevItemCount) {
      setJustAdded(true);
      if (!reducedMotion) {
        controls.start({
          scale: [1, 1.2, 1],
          transition: {
            duration: 0.3,
            ease: "easeInOut",
          },
        });
      }
      setTimeout(() => setJustAdded(false), 300);
    }
    setPrevItemCount(itemCount);
  }, [itemCount, prevItemCount, controls, reducedMotion]);

  return (
    <motion.button
      className={cn(
        "relative p-1.5 rounded-full hover:bg-muted/80 transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        className,
      )}
      onClick={onClick}
      animate={controls}
      whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
      aria-label={`Shopping cart with ${itemCount} items`}
      data-cart-icon
    >
      <ShoppingCart className="w-5 h-5 text-foreground" />

      <AnimatePresence mode="wait">
        {showBadge && itemCount > 0 && (
          <motion.span
            key={itemCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
            className="absolute -top-0.5 -right-0.5 z-10"
            style={{
              backgroundColor: badgeColor,
            }}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export interface CompactAnimatedCartIconProps {
  className?: string;
  showBadge?: boolean;
  onClick?: () => void;
  badgeColor?: string;
}

export function CompactAnimatedCartIcon(props: CompactAnimatedCartIconProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <CompactCartIconContent {...props} cart={defaultCartState} cartUI={defaultCartUIState} />;
  }

  return (
    <CartIconWrapper>
      {(cart, cartUI) => <CompactCartIconContent {...props} cart={cart} cartUI={cartUI} />}
    </CartIconWrapper>
  );
}

/**
 * Floating cart icon content
 */
function FloatingCartIconContent({
  className = "",
  showBadge = true,
  onClick,
  badgeColor = "#FF6900",
  floating = true,
  cart = defaultCartState,
  cartUI = defaultCartUIState,
}: { className?: string; showBadge?: boolean; onClick?: () => void; badgeColor?: string; floating?: boolean; cart?: UseCartReturn; cartUI?: UseCartUIReturn }) {
  const { itemCount } = cart;
  const { reducedMotion } = cartUI;
  const controls = useAnimation();
  const [prevItemCount, setPrevItemCount] = React.useState(itemCount);
  const [justAdded, setJustAdded] = React.useState(false);

  React.useEffect(() => {
    if (itemCount > prevItemCount) {
      setJustAdded(true);
      if (!reducedMotion) {
        controls.start({
          y: [0, -12, 0],
          scale: [1, 1.3, 1.1, 1],
          rotate: [0, -15, 15, -10, 10, 0],
          transition: {
            duration: 0.6,
            ease: "easeOut",
          },
        });
      }
      setTimeout(() => setJustAdded(false), 600);
    }
    setPrevItemCount(itemCount);
  }, [itemCount, prevItemCount, controls, reducedMotion]);

  return (
    <motion.button
      className={cn(
        "relative",
        "p-3 rounded-full",
        "bg-gradient-to-br from-orange-500 to-orange-600",
        "hover:from-orange-600 hover:to-orange-700",
        "text-white shadow-lg hover:shadow-xl",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2",
        floating && "animate-bounce-slow",
        className,
      )}
      onClick={onClick}
      animate={controls}
      whileHover={!reducedMotion ? { scale: 1.05 } : undefined}
      whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
      aria-label={`Shopping cart with ${itemCount} items`}
      data-cart-icon
    >
      <ShoppingCart className="w-6 h-6 relative z-10" />

      {/* Glow effect when just added */}
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={false}
        animate={
          justAdded
            ? {
                boxShadow: [
                  "0 0 0 0px rgba(255, 255, 255, 0)",
                  "0 0 30px 10px rgba(255, 255, 255, 0.4)",
                  "0 0 0 0px rgba(255, 255, 255, 0)",
                ],
              }
            : {}
        }
        transition={{ duration: 0.6 }}
      />

      <AnimatePresence mode="wait">
        {showBadge && itemCount > 0 && (
          <motion.span
            key={itemCount}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            className="absolute -top-1 -right-1 z-20"
          >
            <span
              className="flex items-center justify-center rounded-full text-xs font-bold shadow-md"
              style={{
                backgroundColor: "white",
                color: badgeColor,
                width: "22px",
                height: "22px",
              }}
            >
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export interface FloatingAnimatedCartIconProps {
  className?: string;
  showBadge?: boolean;
  onClick?: () => void;
  badgeColor?: string;
  /** Show floating animation */
  floating?: boolean;
}

export function FloatingAnimatedCartIcon(props: FloatingAnimatedCartIconProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <FloatingCartIconContent {...props} cart={defaultCartState} cartUI={defaultCartUIState} />;
  }

  return (
    <CartIconWrapper>
      {(cart, cartUI) => <FloatingCartIconContent {...props} cart={cart} cartUI={cartUI} />}
    </CartIconWrapper>
  );
}

/**
 * Slide-in cart icon content
 */
function SlideInCartIconContent({
  className = "",
  onClick,
  href = "/checkout",
  badgeColor = "#FF6900",
  cart = defaultCartState,
  cartUI = defaultCartUIState,
}: { className?: string; onClick?: () => void; href?: string; badgeColor?: string; cart?: UseCartReturn; cartUI?: UseCartUIReturn }) {
  const { itemCount } = cart;
  const { reducedMotion } = cartUI;
  const controls = useAnimation();
  const badgeControls = useAnimation();
  const [prevItemCount, setPrevItemCount] = React.useState(itemCount);

  React.useEffect(() => {
    if (itemCount > prevItemCount) {
      // Cart add - bounce cart and slide in badge
      controls.start({
        y: [0, -5, 0],
        transition: { duration: 0.2 },
      });

      badgeControls.start({
        x: [20, 0],
        opacity: [0, 1],
        scale: [0.5, 1],
        transition: {
          type: "spring",
          stiffness: 500,
          damping: 30,
        },
      });
    } else if (itemCount < prevItemCount && itemCount > 0) {
      // Cart remove - subtle shake
      controls.start({
        x: [0, -3, 3, -2, 2, 0],
        transition: { duration: 0.2 },
      });
    } else if (itemCount === 0 && prevItemCount > 0) {
      // Cart empty - badge slides out
      badgeControls.start({
        x: [0, 20],
        opacity: [1, 0],
        transition: { duration: 0.2 },
      });
    }

    setPrevItemCount(itemCount);
  }, [itemCount, prevItemCount, controls, badgeControls]);

  const cartContent = (
    <motion.button
      className={cn("relative", className)}
      onClick={onClick}
      animate={controls}
      whileHover={!reducedMotion ? { scale: 1.05 } : undefined}
      whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
      aria-label={`Shopping cart with ${itemCount} items`}
      data-cart-icon
    >
      <ShoppingCart className="w-5 h-5" />

      <AnimatePresence mode="wait">
        {itemCount > 0 && (
          <motion.span
            key={itemCount}
            initial={{ x: 20, opacity: 0, scale: 0.5 }}
            animate={badgeControls}
            exit={{ x: 20, opacity: 0, scale: 0.5 }}
            className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: badgeColor }}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );

  if (href) {
    return <Link href={href}>{cartContent}</Link>;
  }

  return cartContent;
}

export interface SlideInCartIconProps {
  className?: string;
  onClick?: () => void;
  href?: string;
  badgeColor?: string;
}

export function SlideInCartIcon(props: SlideInCartIconProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <SlideInCartIconContent {...props} cart={defaultCartState} cartUI={defaultCartUIState} />;
  }

  return (
    <CartIconWrapper>
      {(cart, cartUI) => <SlideInCartIconContent {...props} cart={cart} cartUI={cartUI} />}
    </CartIconWrapper>
  );
}
