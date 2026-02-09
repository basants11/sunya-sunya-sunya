/**
 * Cart Store
 * Central cart store with event bus, idle detection, and burst detection.
 */

import {
  CartEventBus, createAddBurstEndedEvent, createAddBurstStartedEvent, createAddToCartEvent, createCartIdleEvent, createCartToggledEvent,
  createHoverIntentEvent, createRemoveFromCartEvent,
  createUpdateQuantityEvent, emitCartDomEvent
} from './events';
import { selectItemCount } from './selectors';
import type {
  CartAction,
  CartState,
  CartStoreConfig
} from './types';

/**
 * Default store configuration.
 */
export const DEFAULT_CART_CONFIG: CartStoreConfig = {
  storageKey: 'sunya.cart',
  legacyStorageKey: 'cart',
  saveDebounceMs: 500,
  idleThresholdMs: 15000, // 15 seconds base
  idleRandomWindowMs: 10000, // Add 0-10 seconds randomness
  toggleWindowMs: 20000, // 20 seconds for toggle counting
  burstThresholdMs: 2000, // 2 seconds between adds to consider a burst
};

/**
 * Central cart store with event bus and state management.
 */
export class CartStore {
  private state: CartState;
  private listeners = new Set<() => void>();
  private eventBus = new CartEventBus();
  private config: CartStoreConfig;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private idleThreshold: number;
  private burstTimer: ReturnType<typeof setTimeout> | null = null;
  private burstItemsAdded = 0;
  private burstStartTime = 0;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private saveFn: () => void;

  constructor(config: Partial<CartStoreConfig> = {}) {
    this.config = { ...DEFAULT_CART_CONFIG, ...config };
    this.idleThreshold = this.calculateIdleThreshold();

    const now = Date.now();
    this.state = {
      items: new Map(),
      reducedMotion: false,
      soundEnabled: true,
      hapticsEnabled: true,
      lastInteractionTime: now,
      isIdle: false,
      isAddBurst: false,
      toggleCount: 0,
      toggleWindowStart: now,
    };

    // Create debounced save function
    this.saveFn = () => {
      if (typeof window !== 'undefined') {
        // Import dynamically to avoid SSR issues
        import('./persistence').then(({ saveCartState }) => {
          saveCartState(this.state);
        }).catch((error) => {
          console.error('Failed to save cart state:', error);
        });
      }
    };
  }

  /**
   * Calculate idle threshold with randomness.
   */
  private calculateIdleThreshold(): number {
    const randomOffset = Math.floor(Math.random() * this.config.idleRandomWindowMs);
    return this.config.idleThresholdMs + randomOffset;
  }

  /**
   * Get current state.
   */
  getState(): CartState {
    return this.state;
  }

  /**
   * Subscribe to state changes.
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Subscribe to cart events.
   */
  onEvent<T = unknown>(
    eventType: Parameters<CartEventBus['on']>[0],
    listener: Parameters<CartEventBus['on']>[1]
  ): () => void {
    return this.eventBus.on(eventType, listener);
  }

  /**
   * Dispatch an action to update state.
   */
  dispatch(action: CartAction): void {
    const prevState = { ...this.state };
    this.state = this.reduce(this.state, action);

    // Notify listeners if state changed
    if (this.state !== prevState) {
      this.listeners.forEach((listener) => {
        try {
          listener();
        } catch (error) {
          console.error('Error in cart state listener:', error);
        }
      });

      // Trigger debounced save
      this.triggerSave();
    }
  }

  /**
   * Reduce state based on action.
   */
  private reduce(state: CartState, action: CartAction): CartState {
    const now = Date.now();

    switch (action.type) {
      case 'ADD_ITEM': {
        const { id, quantity } = action.payload;
        const existing = state.items.get(id);
        const newQuantity = existing ? existing.quantity + quantity : quantity;

        if (newQuantity <= 0) {
          // Remove item if quantity becomes 0 or negative
          const newItems = new Map(state.items);
          newItems.delete(id);
          return { ...state, items: newItems };
        }

        const newItems = new Map(state.items);
        newItems.set(id, {
          id,
          quantity: newQuantity,
          addedAt: existing?.addedAt || now,
        });

        // Emit event
        const event = createAddToCartEvent(id, quantity, newQuantity);
        this.eventBus.emit(event);
        emitCartDomEvent('addToCart', event.payload);

        // Handle burst detection
        this.handleAddBurst(id, quantity);

        // Record interaction
        this.recordInteraction();

        return { ...state, items: newItems };
      }

      case 'REMOVE_ITEM': {
        const { id } = action.payload;
        if (!state.items.has(id)) return state;

        const newItems = new Map(state.items);
        newItems.delete(id);

        // Emit event
        const event = createRemoveFromCartEvent(id, selectItemCount(state));
        this.eventBus.emit(event);
        emitCartDomEvent('removeFromCart', event.payload);

        // Record interaction
        this.recordInteraction();

        return { ...state, items: newItems };
      }

      case 'UPDATE_QUANTITY': {
        const { id, quantity } = action.payload;
        const existing = state.items.get(id);

        if (!existing) return state;

        if (quantity <= 0) {
          // Remove item if quantity becomes 0 or negative
          const newItems = new Map(state.items);
          newItems.delete(id);

          // Emit event
          const event = createUpdateQuantityEvent(id, existing.quantity, 0);
          this.eventBus.emit(event);
          emitCartDomEvent('updateQuantity', event.payload);

          // Record interaction
          this.recordInteraction();

          return { ...state, items: newItems };
        }

        const newItems = new Map(state.items);
        newItems.set(id, { ...existing, quantity });

        // Emit event
        const event = createUpdateQuantityEvent(id, existing.quantity, quantity);
        this.eventBus.emit(event);
        emitCartDomEvent('updateQuantity', event.payload);

        // Record interaction
        this.recordInteraction();

        return { ...state, items: newItems };
      }

      case 'CLEAR_CART': {
        if (state.items.size === 0) return state;

        // Emit event
        this.eventBus.emit({
          type: 'clearCart',
          timestamp: now,
          payload: undefined,
        });

        // Record interaction
        this.recordInteraction();

        return { ...state, items: new Map() };
      }

      case 'SET_REDUCED_MOTION': {
        return { ...state, reducedMotion: action.payload };
      }

      case 'SET_SOUND_ENABLED': {
        return { ...state, soundEnabled: action.payload };
      }

      case 'SET_HAPTICS_ENABLED': {
        return { ...state, hapticsEnabled: action.payload };
      }

      case 'RECORD_INTERACTION': {
        this.resetIdleTimer();
        return { ...state, lastInteractionTime: now, isIdle: false };
      }

      case 'SET_IDLE': {
        if (state.isIdle === action.payload) return state;

        if (action.payload) {
          // Emit idle event
          const idleDuration = now - state.lastInteractionTime;
          const event = createCartIdleEvent(idleDuration, selectItemCount(state));
          this.eventBus.emit(event);
          emitCartDomEvent('cartIdle', event.payload);
        }

        return { ...state, isIdle: action.payload };
      }

      case 'START_ADD_BURST': {
        return { ...state, isAddBurst: true };
      }

      case 'END_ADD_BURST': {
        return { ...state, isAddBurst: false };
      }

      case 'RECORD_TOGGLE': {
        // Check if we need to reset the toggle window
        const windowDuration = now - state.toggleWindowStart;
        if (windowDuration > this.config.toggleWindowMs) {
          // Reset window
          return {
            ...state,
            toggleCount: 1,
            toggleWindowStart: now,
          };
        }

        // Increment toggle count
        const newCount = state.toggleCount + 1;

        // Emit event
        const event = createCartToggledEvent(true, newCount, windowDuration);
        this.eventBus.emit(event);

        return {
          ...state,
          toggleCount: newCount,
        };
      }

      case 'RESET_TOGGLE_WINDOW': {
        return {
          ...state,
          toggleCount: 0,
          toggleWindowStart: now,
        };
      }

      case 'HYDRATE_STATE': {
        const payload = action.payload;

        return {
          ...state,
          items: payload.items || state.items,
          reducedMotion: payload.reducedMotion ?? state.reducedMotion,
          soundEnabled: payload.soundEnabled ?? state.soundEnabled,
          hapticsEnabled: payload.hapticsEnabled ?? state.hapticsEnabled,
        };
      }

      default:
        return state;
    }
  }

  /**
   * Record a user interaction and reset idle timer.
   */
  private recordInteraction(): void {
    this.dispatch({ type: 'RECORD_INTERACTION' });
  }

  /**
   * Reset idle timer with randomized threshold.
   */
  private resetIdleTimer(): void {
    if (this.idleTimer !== null) {
      clearTimeout(this.idleTimer);
    }

    this.idleThreshold = this.calculateIdleThreshold();

    this.idleTimer = setTimeout(() => {
      this.dispatch({ type: 'SET_IDLE', payload: true });
    }, this.idleThreshold);
  }

  /**
   * Handle add burst detection.
   */
  private handleAddBurst(productId: number, quantity: number): void {
    const now = Date.now();

    if (this.burstTimer === null) {
      // Start new burst
      this.burstStartTime = now;
      this.burstItemsAdded = quantity;
      this.dispatch({ type: 'START_ADD_BURST' });

      const event = createAddBurstStartedEvent(quantity, 0);
      this.eventBus.emit(event);
      emitCartDomEvent('addBurstStarted', event.payload);

      // Set timer to end burst
      this.burstTimer = setTimeout(() => {
        this.endAddBurst();
      }, this.config.burstThresholdMs);
    } else {
      // Continue burst
      this.burstItemsAdded += quantity;

      // Reset timer
      if (this.burstTimer !== null) {
        clearTimeout(this.burstTimer);
      }
      this.burstTimer = setTimeout(() => {
        this.endAddBurst();
      }, this.config.burstThresholdMs);
    }
  }

  /**
   * End add burst.
   */
  private endAddBurst(): void {
    if (this.burstTimer === null) return;

    clearTimeout(this.burstTimer);
    this.burstTimer = null;

    const duration = Date.now() - this.burstStartTime;

    const event = createAddBurstEndedEvent(this.burstItemsAdded, duration);
    this.eventBus.emit(event);
    emitCartDomEvent('addBurstEnded', event.payload);

    this.dispatch({ type: 'END_ADD_BURST' });

    this.burstItemsAdded = 0;
    this.burstStartTime = 0;
  }

  /**
   * Trigger debounced save.
   */
  private triggerSave(): void {
    if (this.saveTimer !== null) {
      clearTimeout(this.saveTimer);
    }

    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      this.saveFn();
    }, this.config.saveDebounceMs);
  }

  /**
   * Record a hover intent event.
   */
  registerHoverIntent(productId: number, duration: number): void {
    const event = createHoverIntentEvent(productId, duration);
    this.eventBus.emit(event);
  }

  /**
   * Record a cart toggle event.
   */
  registerToggle(): void {
    this.dispatch({ type: 'RECORD_TOGGLE' });
  }

  /**
   * Cleanup timers and listeners.
   */
  destroy(): void {
    if (this.idleTimer !== null) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }

    if (this.burstTimer !== null) {
      clearTimeout(this.burstTimer);
      this.burstTimer = null;
    }

    if (this.saveTimer !== null) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }

    this.listeners.clear();
    this.eventBus.clear();
  }
}

/**
 * Create a singleton cart store instance.
 */
let cartStoreInstance: CartStore | null = null;

export function getCartStore(config?: Partial<CartStoreConfig>): CartStore {
  if (!cartStoreInstance) {
    cartStoreInstance = new CartStore(config);
  }
  return cartStoreInstance;
}

/**
 * Reset the cart store instance (useful for testing).
 */
export function resetCartStore(): void {
  if (cartStoreInstance) {
    cartStoreInstance.destroy();
    cartStoreInstance = null;
  }
}
