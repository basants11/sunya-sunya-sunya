/**
 * Cart Persistence
 * localStorage persistence with migration from legacy cart format.
 */

import type { CartItem, CartState, LegacyCartItem, PersistedCart } from './types';

/**
 * Storage keys for cart data.
 */
export const CART_STORAGE_KEY = 'sunya.cart' as const;
export const LEGACY_CART_STORAGE_KEY = 'cart' as const;

/**
 * Safely parse JSON from localStorage.
 */
function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

/**
 * Normalize legacy cart items from localStorage['cart'] format.
 * Legacy format: { id, name, price, image, quantity }
 * New format: { id, quantity, addedAt? }
 */
export function normalizeLegacyCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const now = Date.now();
  const items: CartItem[] = [];

  for (const it of raw as LegacyCartItem[]) {
    const id = it?.id;
    if (typeof id !== 'number' || !Number.isFinite(id)) continue;

    const quantity = typeof it?.quantity === 'number' && Number.isFinite(it.quantity)
      ? Math.max(1, Math.floor(it.quantity))
      : 1;

    items.push({
      id,
      quantity,
      addedAt: now,
    });
  }

  return items;
}

/**
 * Load persisted cart from localStorage.
 * Returns null if no data exists or if data is invalid.
 */
export function loadPersistedCart(): PersistedCart | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  const parsed = safeJsonParse<PersistedCart>(raw);

  // Validate structure
  if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.items)) {
    return null;
  }

  // Validate items
  const validItems = parsed.items.filter(
    (item): item is { id: number; quantity: number; addedAt?: number } =>
      typeof item.id === 'number' &&
      Number.isFinite(item.id) &&
      typeof item.quantity === 'number' &&
      Number.isFinite(item.quantity) &&
      item.quantity > 0
  );

  if (validItems.length === 0) {
    return null;
  }

  return {
    version: 1,
    items: validItems,
    ui: parsed.ui || {
      reducedMotion: false,
      soundEnabled: true,
      hapticsEnabled: true,
    },
    updatedAt: parsed.updatedAt || Date.now(),
  };
}

/**
 * Load and migrate legacy cart from localStorage['cart'].
 * Returns normalized cart items or null if no legacy data exists.
 */
export function loadLegacyCart(): CartItem[] | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(LEGACY_CART_STORAGE_KEY);
  if (!raw) return null;

  const parsed = safeJsonParse<unknown>(raw);
  const items = normalizeLegacyCartItems(parsed);

  if (items.length === 0) return null;

  // Clear legacy data after successful migration
  try {
    window.localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to remove legacy cart data:', error);
  }

  return items;
}

/**
 * Save cart state to localStorage.
 * Uses debouncing to avoid excessive writes.
 */
export function saveCartState(state: CartState): void {
  if (typeof window === 'undefined') return;

  const persisted: PersistedCart = {
    version: 1,
    items: Array.from(state.items.values()).map((item) => ({
      id: item.id,
      quantity: item.quantity,
      addedAt: item.addedAt,
    })),
    ui: {
      reducedMotion: state.reducedMotion,
      soundEnabled: state.soundEnabled,
      hapticsEnabled: state.hapticsEnabled,
    },
    updatedAt: Date.now(),
  };

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(persisted));
  } catch (error) {
    console.error('Failed to save cart state:', error);
  }
}

/**
 * Create a debounced version of saveCartState.
 * Returns a function that should be called to trigger a save after the debounce delay.
 */
export function createDebouncedSave(
  saveFn: () => void,
  debounceMs: number
): () => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      saveFn();
    }, debounceMs);
  };
}

/**
 * Clear all cart data from localStorage.
 */
export function clearPersistedCart(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cart data:', error);
  }
}

/**
 * Get system reduced motion preference.
 */
export function getSystemReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Create a listener for system reduced motion changes.
 * Returns a cleanup function.
 */
export function createReducedMotionListener(
  callback: (prefersReducedMotion: boolean) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const handler = (event: MediaQueryListEvent) => {
    callback(event.matches);
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }

  // Legacy browsers
  if (mediaQuery.addListener) {
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }

  return () => {};
}
