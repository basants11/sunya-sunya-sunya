/**
 * Cart Events
 * Event bus for cart state changes and DOM event emission.
 */

import type {
  AddBurstPayload,
  AddToCartPayload,
  CartEvent,
  CartEventListener,
  CartEventType,
  CartIdlePayload,
  CartToggledPayload,
  CheckoutIntentPayload,
  HoverIntentPayload,
  RemoveFromCartPayload,
  UpdateQuantityPayload,
} from './types';

/**
 * DOM event namespace prefix for cart events.
 */
export const CART_EVENT_PREFIX = 'sunya:cart:' as const;

/**
 * DOM event names that will be dispatched.
 */
export type CartDomEventName =
  | 'addToCart'
  | 'removeFromCart'
  | 'updateQuantity'
  | 'cartIdle'
  | 'checkoutIntent'
  | 'addBurstStarted'
  | 'addBurstEnded';

/**
 * Event bus for cart events.
 */
export class CartEventBus {
  private listeners = new Map<CartEventType, Set<CartEventListener<any>>>();

  /**
   * Subscribe to a cart event type.
   */
  on<T = unknown>(eventType: CartEventType, listener: CartEventListener<T>): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          this.listeners.delete(eventType);
        }
      }
    };
  }

  /**
   * Emit a cart event to all subscribers.
   */
  emit<T = unknown>(event: CartEvent<T>): void {
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error(`Error in cart event listener for ${event.type}:`, error);
        }
      });
    }
  }

  /**
   * Clear all event listeners.
   */
  clear(): void {
    this.listeners.clear();
  }
}

/**
 * Emit a namespaced DOM event for cart actions.
 * These events can be listened to by other parts of the application.
 */
export function emitCartDomEvent<TDetail>(
  eventName: CartDomEventName,
  detail: TDetail
): void {
  if (typeof window === 'undefined') return;

  const fullEventName = `${CART_EVENT_PREFIX}${eventName}`;
  const event = new CustomEvent(fullEventName, {
    detail,
    bubbles: true,
    cancelable: true,
  });

  window.dispatchEvent(event);
}

/**
 * Create an add to cart event.
 */
export function createAddToCartEvent(
  productId: number,
  quantity: number,
  totalQuantity: number
): CartEvent<AddToCartPayload> {
  return {
    type: 'addToCart',
    timestamp: Date.now(),
    payload: { productId, quantity, totalQuantity },
  };
}

/**
 * Create a remove from cart event.
 */
export function createRemoveFromCartEvent(
  productId: number,
  remainingQuantity: number
): CartEvent<RemoveFromCartPayload> {
  return {
    type: 'removeFromCart',
    timestamp: Date.now(),
    payload: { productId, remainingQuantity },
  };
}

/**
 * Create an update quantity event.
 */
export function createUpdateQuantityEvent(
  productId: number,
  oldQuantity: number,
  newQuantity: number
): CartEvent<UpdateQuantityPayload> {
  return {
    type: 'updateQuantity',
    timestamp: Date.now(),
    payload: { productId, oldQuantity, newQuantity },
  };
}

/**
 * Create a cart idle event.
 */
export function createCartIdleEvent(
  idleDuration: number,
  itemCount: number
): CartEvent<CartIdlePayload> {
  return {
    type: 'cartIdle',
    timestamp: Date.now(),
    payload: { idleDuration, itemCount },
  };
}

/**
 * Create a checkout intent event.
 */
export function createCheckoutIntentEvent(
  itemCount: number,
  totalValue: number
): CartEvent<CheckoutIntentPayload> {
  return {
    type: 'checkoutIntent',
    timestamp: Date.now(),
    payload: { itemCount, totalValue },
  };
}

/**
 * Create an add burst started event.
 */
export function createAddBurstStartedEvent(
  itemsAdded: number,
  duration: number
): CartEvent<AddBurstPayload> {
  return {
    type: 'addBurstStarted',
    timestamp: Date.now(),
    payload: { itemsAdded, duration },
  };
}

/**
 * Create an add burst ended event.
 */
export function createAddBurstEndedEvent(
  itemsAdded: number,
  duration: number
): CartEvent<AddBurstPayload> {
  return {
    type: 'addBurstEnded',
    timestamp: Date.now(),
    payload: { itemsAdded, duration },
  };
}

/**
 * Create a cart toggled event.
 */
export function createCartToggledEvent(
  isOpen: boolean,
  toggleCount: number,
  windowDuration: number
): CartEvent<CartToggledPayload> {
  return {
    type: 'cartToggled',
    timestamp: Date.now(),
    payload: { isOpen, toggleCount, windowDuration },
  };
}

/**
 * Create a hover intent event.
 */
export function createHoverIntentEvent(
  productId: number,
  duration: number
): CartEvent<HoverIntentPayload> {
  return {
    type: 'hoverIntent',
    timestamp: Date.now(),
    payload: { productId, duration },
  };
}
