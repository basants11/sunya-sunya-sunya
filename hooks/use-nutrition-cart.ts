/**
 * Nutrition Cart Hook
 * Custom hook for cart operations with Framer Motion animations
 */

'use client';

import { useCart } from '@/lib/cart/use-cart';
import { useAnimation } from 'framer-motion';
import * as React from 'react';

export interface NutritionCartItem {
  productId: number;
  grams: number;
  fruitName: string;
}

export interface UseNutritionCartReturn {
  addToCart: (productId: number, grams: number, fruitName: string) => void;
  animateFruitToCart: (fruitImageElement: HTMLElement | null) => Promise<void>;
  animateCartIcon: () => Promise<void>;
  getCartItem: (productId: number) => NutritionCartItem | undefined;
  isItemInCart: (productId: number) => boolean;
  cartControls: ReturnType<typeof useControlledAnimation>;
}

/**
 * Hook for controlled animation state
 */
function useControlledAnimation() {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const controls = useAnimation();

  const startAnimation = React.useCallback(async () => {
    setIsAnimating(true);
    await controls.start({
      scale: [1, 1.2, 1],
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.4,
        ease: 'easeInOut',
      },
    });
    setIsAnimating(false);
  }, [controls]);

  return { isAnimating, controls, startAnimation };
}

/**
 * Main nutrition cart hook
 */
export function useNutritionCart(): UseNutritionCartReturn {
  const { addItem, getItem, hasItem } = useCart();
  const cartControls = useControlledAnimation();
  const [cartItems, setCartItems] = React.useState<Map<number, NutritionCartItem>>(new Map());

  /**
   * Add fruit to cart with animation
   */
  const addToCart = React.useCallback(
    (productId: number, grams: number, fruitName: string) => {
      // Add to existing cart system
      addItem(productId, 1);

      // Update local cart items map
      setCartItems((prev) => {
        const newMap = new Map(prev);
        newMap.set(productId, { productId, grams, fruitName });
        return newMap;
      });
    },
    [addItem]
  );

  /**
   * Animate fruit image to cart (fly-to-cart effect)
   */
  const animateFruitToCart = React.useCallback(
    async (fruitImageElement: HTMLElement | null): Promise<void> => {
      if (!fruitImageElement) {
        return;
      }

      // Find cart icon element
      const cartIcon = document.querySelector('[data-cart-icon]') as HTMLElement;
      if (!cartIcon) {
        return;
      }

      // Get positions
      const fruitRect = fruitImageElement.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      // Calculate center points
      const startX = fruitRect.left + fruitRect.width / 2;
      const startY = fruitRect.top + fruitRect.height / 2;
      const endX = cartRect.left + cartRect.width / 2;
      const endY = cartRect.top + cartRect.height / 2;

      // Create flying element
      const flyingElement = fruitImageElement.cloneNode(true) as HTMLElement;
      flyingElement.style.position = 'fixed';
      flyingElement.style.zIndex = '9999';
      flyingElement.style.pointerEvents = 'none';
      flyingElement.style.width = `${fruitRect.width}px`;
      flyingElement.style.height = `${fruitRect.height}px`;
      flyingElement.style.left = `${fruitRect.left}px`;
      flyingElement.style.top = `${fruitRect.top}px`;
      flyingElement.style.transition = 'none';
      flyingElement.style.opacity = '0.8';
      flyingElement.style.transform = 'scale(1)';

      document.body.appendChild(flyingElement);

      // Animate to cart
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          flyingElement.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          flyingElement.style.left = `${endX - fruitRect.width / 2}px`;
          flyingElement.style.top = `${endY - fruitRect.height / 2}px`;
          flyingElement.style.transform = 'scale(0.3)';
          flyingElement.style.opacity = '0';

          setTimeout(() => {
            flyingElement.remove();
            resolve();
          }, 600);
        });
      });
    },
    []
  );

  /**
   * Animate cart icon when item added
   */
  const animateCartIcon = React.useCallback(async (): Promise<void> => {
    await cartControls.startAnimation();
  }, [cartControls]);

  /**
   * Get cart item details
   */
  const getCartItem = React.useCallback(
    (productId: number): NutritionCartItem | undefined => {
      return cartItems.get(productId);
    },
    [cartItems]
  );

  /**
   * Check if item is in cart
   */
  const isItemInCart = React.useCallback(
    (productId: number): boolean => {
      return hasItem(productId);
    },
    [hasItem]
  );

  return {
    addToCart,
    animateFruitToCart,
    animateCartIcon,
    getCartItem,
    isItemInCart,
    cartControls,
  };
}
