/**
 * Cart Selectors
 * Derived state selectors for cart data.
 */

import type { CartItem, CartState, CartTelemetry } from './types';

/**
 * Get cart items as an array (preserves insertion order).
 */
export function selectItems(state: CartState): CartItem[] {
  return Array.from(state.items.values());
}

/**
 * Get total number of items in cart (sum of all quantities).
 */
export function selectItemCount(state: CartState): number {
  let total = 0;
  for (const item of state.items.values()) {
    total += item.quantity;
  }
  return total;
}

/**
 * Get number of unique products in cart.
 */
export function selectUniqueItemCount(state: CartState): number {
  return state.items.size;
}

/**
 * Check if cart is empty.
 */
export function selectIsEmpty(state: CartState): boolean {
  return state.items.size === 0;
}

/**
 * Get item by product ID.
 */
export function selectItemById(state: CartState, id: number): CartItem | undefined {
  return state.items.get(id);
}

/**
 * Check if item exists in cart.
 */
export function selectHasItem(state: CartState, id: number): boolean {
  return state.items.has(id);
}

/**
 * Get effective reduced motion preference.
 * Combines system preference with user override.
 */
export function selectEffectiveReducedMotion(state: CartState): boolean {
  return state.reducedMotion;
}

/**
 * Get sound enabled preference.
 */
export function selectSoundEnabled(state: CartState): boolean {
  return state.soundEnabled;
}

/**
 * Get haptics enabled preference.
 */
export function selectHapticsEnabled(state: CartState): boolean {
  return state.hapticsEnabled;
}

/**
 * Get idle state.
 */
export function selectIsIdle(state: CartState): boolean {
  return state.isIdle;
}

/**
 * Get add burst state.
 */
export function selectIsAddBurst(state: CartState): boolean {
  return state.isAddBurst;
}

/**
 * Get toggle count in current window.
 */
export function selectToggleCount(state: CartState): number {
  return state.toggleCount;
}

/**
 * Get time since last interaction (ms).
 */
export function selectTimeSinceLastInteraction(state: CartState, now: number = Date.now()): number {
  return now - state.lastInteractionTime;
}

/**
 * Get duration of current toggle window (ms).
 */
export function selectToggleWindowDuration(state: CartState, now: number = Date.now()): number {
  return now - state.toggleWindowStart;
}

/**
 * Get telemetry data for hesitation detection.
 */
export function selectTelemetry(state: CartState, now: number = Date.now()): CartTelemetry {
  const windowDuration = selectToggleWindowDuration(state, now);
  const isHesitating = state.toggleCount >= 3; // Threshold for hesitation pattern
  
  return {
    toggleCount: state.toggleCount,
    windowDuration,
    isHesitating,
    hoverIntentCount: 0, // Placeholder for future implementation
    avgHoverDuration: 0, // Placeholder for future implementation
  };
}

/**
 * Get cart summary for display.
 */
export function selectCartSummary(state: CartState) {
  return {
    itemCount: selectItemCount(state),
    uniqueItemCount: selectUniqueItemCount(state),
    isEmpty: selectIsEmpty(state),
  };
}
