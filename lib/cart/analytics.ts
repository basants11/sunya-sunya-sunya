/**
 * Cart Analytics
 * Event tracking and analytics integration for cart operations
 */

import type {
  AddToCartPayload,
  CartEvent,
  CheckoutIntentPayload,
  RemoveFromCartPayload,
  UpdateQuantityPayload,
} from "./types";

/**
 * Analytics event types
 */
export type CartAnalyticsEvent =
  | "product_added"
  | "product_removed"
  | "quantity_updated"
  | "cart_viewed"
  | "checkout_started"
  | "promo_applied"
  | "promo_removed"
  | "free_shipping_unlocked";

/**
 * Analytics event payload
 */
export interface CartAnalyticsPayload {
  event: CartAnalyticsEvent;
  productId?: number;
  productName?: string;
  quantity?: number;
  previousQuantity?: number;
  newQuantity?: number;
  cartTotal?: number;
  itemCount?: number;
  promoCode?: string;
  discount?: number;
  shippingCost?: number;
  freeShippingThreshold?: number;
}

/**
 * Global gtag type declaration
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Send analytics event to various tracking services
 */
export function trackCartEvent(payload: CartAnalyticsPayload): void {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("[Cart Analytics]", payload.event, payload);
  }

  // Dispatch custom event for other listeners
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("sunya:analytics:cart", {
        detail: payload,
        bubbles: true,
      }),
    );
  }

  // Send to Google Analytics / GTM if available
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", payload.event, payload);
  }

  // Send to Facebook Pixel if available
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", payload.event, payload);
  }
}

/**
 * Track add to cart event
 */
export function trackAddToCart(
  productId: number,
  productName: string,
  quantity: number,
  price: number,
  cartTotal: number,
  itemCount: number,
): void {
  trackCartEvent({
    event: "product_added",
    productId,
    productName,
    quantity,
    cartTotal,
    itemCount,
  });
}

/**
 * Track remove from cart event
 */
export function trackRemoveFromCart(
  productId: number,
  productName: string,
  quantity: number,
  cartTotal: number,
  itemCount: number,
): void {
  trackCartEvent({
    event: "product_removed",
    productId,
    productName,
    quantity,
    cartTotal,
    itemCount,
  });
}

/**
 * Track quantity update event
 */
export function trackQuantityUpdate(
  productId: number,
  productName: string,
  previousQuantity: number,
  newQuantity: number,
  cartTotal: number,
): void {
  trackCartEvent({
    event: "quantity_updated",
    productId,
    productName,
    previousQuantity,
    newQuantity,
    cartTotal,
  });
}

/**
 * Track checkout started event
 */
export function trackCheckoutStarted(
  cartTotal: number,
  itemCount: number,
  shippingCost: number,
  promoCode?: string,
  discount?: number,
): void {
  trackCartEvent({
    event: "checkout_started",
    cartTotal,
    itemCount,
    shippingCost,
    promoCode,
    discount,
  });
}

/**
 * Track promo code application
 */
export function trackPromoApplied(
  promoCode: string,
  discount: number,
  cartTotal: number,
): void {
  trackCartEvent({
    event: "promo_applied",
    promoCode,
    discount,
    cartTotal,
  });
}

/**
 * Track promo code removal
 */
export function trackPromoRemoved(promoCode: string, cartTotal: number): void {
  trackCartEvent({
    event: "promo_removed",
    promoCode,
    cartTotal,
  });
}

/**
 * Track free shipping unlock
 */
export function trackFreeShippingUnlocked(
  cartTotal: number,
  freeShippingThreshold: number,
): void {
  trackCartEvent({
    event: "free_shipping_unlocked",
    cartTotal,
    freeShippingThreshold,
  });
}

/**
 * Track cart viewed event
 */
export function trackCartViewed(cartTotal: number, itemCount: number): void {
  trackCartEvent({
    event: "cart_viewed",
    cartTotal,
    itemCount,
  });
}

/**
 * Convert cart event to analytics payload
 */
export function cartEventToAnalytics(
  event: CartEvent,
): CartAnalyticsPayload | undefined {
  switch (event.type) {
    case "addToCart": {
      const payload = event.payload as AddToCartPayload;
      return {
        event: "product_added",
        productId: payload.productId,
        quantity: payload.quantity,
        itemCount: payload.totalQuantity,
      };
    }
    case "removeFromCart": {
      const payload = event.payload as RemoveFromCartPayload;
      return {
        event: "product_removed",
        productId: payload.productId,
        quantity: 1,
        itemCount: payload.remainingQuantity,
      };
    }
    case "updateQuantity": {
      const payload = event.payload as UpdateQuantityPayload;
      return {
        event: "quantity_updated",
        productId: payload.productId,
        previousQuantity: payload.oldQuantity,
        newQuantity: payload.newQuantity,
      };
    }
    case "checkoutIntent": {
      const payload = event.payload as CheckoutIntentPayload;
      return {
        event: "checkout_started",
        cartTotal: payload.totalValue,
        itemCount: payload.itemCount,
        shippingCost: 0,
      };
    }
    default:
      return undefined;
  }
}

/**
 * Hook to track cart events for analytics
 */
export function useCartAnalytics() {
  const trackEvent = React.useCallback((payload: CartAnalyticsPayload) => {
    trackCartEvent(payload);
  }, []);

  return { trackEvent };
}

// Import React for the hook
import * as React from "react";
