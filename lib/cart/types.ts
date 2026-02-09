/**
 * Cart Domain Types
 * Normalized cart item structure and related types for the central cart store.
 */

/**
 * Normalized cart item with minimal required fields.
 * Product details are looked up from the products catalog by ID.
 */
export interface CartItem {
  /** Unique product identifier */
  id: number;
  /** Quantity of this item in cart */
  quantity: number;
  /** Optional: timestamp when item was added (for analytics) */
  addedAt?: number;
}

/**
 * Cart state containing all items and UI preferences.
 */
export interface CartState {
  /** Map of product ID to cart item for O(1) lookups */
  items: Map<number, CartItem>;
  /** User's reduced motion preference (respects system preference) */
  reducedMotion: boolean;
  /** Whether sound effects are enabled */
  soundEnabled: boolean;
  /** Whether haptic feedback is enabled */
  hapticsEnabled: boolean;
  /** Timestamp of last user interaction (for idle detection) */
  lastInteractionTime: number;
  /** Whether cart is currently idle (no interaction for threshold time) */
  isIdle: boolean;
  /** Whether an add-to-cart burst is in progress (multiple rapid adds) */
  isAddBurst: boolean;
  /** Count of cart open/close toggles in rolling window (hesitation detection) */
  toggleCount: number;
  /** Timestamp when toggle count window started */
  toggleWindowStart: number;
}

/**
 * Cart action types for state updates.
 */
export type CartAction =
  | { type: 'ADD_ITEM'; payload: { id: number; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_REDUCED_MOTION'; payload: boolean }
  | { type: 'SET_SOUND_ENABLED'; payload: boolean }
  | { type: 'SET_HAPTICS_ENABLED'; payload: boolean }
  | { type: 'RECORD_INTERACTION' }
  | { type: 'SET_IDLE'; payload: boolean }
  | { type: 'START_ADD_BURST' }
  | { type: 'END_ADD_BURST' }
  | { type: 'RECORD_TOGGLE' }
  | { type: 'RESET_TOGGLE_WINDOW' }
  | { type: 'HYDRATE_STATE'; payload: Partial<CartState> };

/**
 * Cart event types for the event bus.
 */
export type CartEventType =
  | 'addToCart'
  | 'removeFromCart'
  | 'updateQuantity'
  | 'clearCart'
  | 'cartIdle'
  | 'checkoutIntent'
  | 'addBurstStarted'
  | 'addBurstEnded'
  | 'cartToggled'
  | 'hoverIntent';

/**
 * Base event structure for all cart events.
 */
export interface CartEvent<T = unknown> {
  type: CartEventType;
  timestamp: number;
  payload: T;
}

/**
 * Specific event payload types.
 */
export interface AddToCartPayload {
  productId: number;
  quantity: number;
  totalQuantity: number;
}

export interface RemoveFromCartPayload {
  productId: number;
  remainingQuantity: number;
}

export interface UpdateQuantityPayload {
  productId: number;
  oldQuantity: number;
  newQuantity: number;
}

export interface CartIdlePayload {
  idleDuration: number;
  itemCount: number;
}

export interface CheckoutIntentPayload {
  itemCount: number;
  totalValue: number;
}

export interface AddBurstPayload {
  itemsAdded: number;
  duration: number;
}

export interface CartToggledPayload {
  isOpen: boolean;
  toggleCount: number;
  windowDuration: number;
}

export interface HoverIntentPayload {
  productId: number;
  duration: number;
}

/**
 * Event listener type for cart events.
 */
export type CartEventListener<T = unknown> = (event: CartEvent<T>) => void;

/**
 * Store configuration options.
 */
export interface CartStoreConfig {
  /** Storage key for localStorage persistence */
  storageKey: string;
  /** Legacy storage key to migrate from */
  legacyStorageKey: string;
  /** Debounce time for saving to localStorage (ms) */
  saveDebounceMs: number;
  /** Minimum idle time before marking as idle (ms) */
  idleThresholdMs: number;
  /** Random window for idle detection (ms) - adds randomness to threshold */
  idleRandomWindowMs: number;
  /** Time window for counting toggles (ms) */
  toggleWindowMs: number;
  /** Burst detection: max time between adds to consider a burst (ms) */
  burstThresholdMs: number;
}

/**
 * Public API returned by useCart hook.
 */
export interface UseCartReturn {
  /** Current cart items as array */
  items: CartItem[];
  /** Total number of items in cart */
  itemCount: number;
  /** Whether cart is empty */
  isEmpty: boolean;
  /** Add item to cart */
  addItem: (id: number, quantity?: number) => void;
  /** Remove item from cart */
  removeItem: (id: number) => void;
  /** Update item quantity */
  updateQuantity: (id: number, quantity: number) => void;
  /** Clear all items from cart */
  clearCart: () => void;
  /** Get item by ID */
  getItem: (id: number) => CartItem | undefined;
  /** Check if item exists in cart */
  hasItem: (id: number) => boolean;
}

/**
 * UI preferences API returned by useCartUI hook.
 */
export interface UseCartUIReturn {
  /** Effective reduced motion preference */
  reducedMotion: boolean;
  /** Whether sound effects are enabled */
  soundEnabled: boolean;
  /** Whether haptic feedback is enabled */
  hapticsEnabled: boolean;
  /** Toggle reduced motion */
  toggleReducedMotion: () => void;
  /** Toggle sound */
  toggleSound: () => void;
  /** Toggle haptics */
  toggleHaptics: () => void;
  /** Whether cart is currently idle */
  isIdle: boolean;
  /** Whether an add burst is in progress */
  isAddBurst: boolean;
  /** Toggle count in current window */
  toggleCount: number;
  /** Record a hover intent event */
  registerHoverIntent: (productId: number, duration: number) => void;
}

/**
 * Telemetry data for hesitation detection.
 */
export interface CartTelemetry {
  /** Number of open/close toggles in rolling window */
  toggleCount: number;
  /** Duration of current toggle window (ms) */
  windowDuration: number;
  /** Whether user is showing hesitation patterns */
  isHesitating: boolean;
  /** Total hover intents recorded */
  hoverIntentCount: number;
  /** Average hover duration (ms) */
  avgHoverDuration: number;
}

/**
 * Legacy cart item format from localStorage['cart']
 */
export interface LegacyCartItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

/**
 * Persisted cart format for localStorage['sunya.cart']
 */
export interface PersistedCart {
  version: 1;
  items: Array<{ id: number; quantity: number; addedAt?: number }>;
  ui: {
    reducedMotion: boolean;
    soundEnabled: boolean;
    hapticsEnabled: boolean;
  };
  updatedAt: number;
}
