/**
 * Cart React Hooks
 * React hooks for accessing cart state and actions.
 */

'use client';

import * as React from 'react';
import { useSyncExternalStore } from 'react';
import {
  selectEffectiveReducedMotion,
  selectHapticsEnabled,
  selectHasItem,
  selectIsAddBurst,
  selectIsEmpty,
  selectIsIdle,
  selectItemById,
  selectItemCount,
  selectItems,
  selectSoundEnabled,
  selectTelemetry,
  selectToggleCount,
} from './selectors';
import type { CartStore } from './store';
import type { UseCartReturn, UseCartUIReturn } from './types';

/**
 * Cart store context.
 */
const CartStoreContext = React.createContext<CartStore | null>(null);

/**
 * Cart provider component.
 */
export function CartProvider({ store, children }: { store: CartStore; children: React.ReactNode }) {
  return <CartStoreContext.Provider value={store}>{children}</CartStoreContext.Provider>;
}

/**
 * Get cart store from context.
 */
function useCartStore(): CartStore {
  const store = React.useContext(CartStoreContext);
  if (!store) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return store;
}

/**
 * Main cart hook for accessing cart state and actions.
 */
export function useCart(): UseCartReturn {
  const store = useCartStore();
  const state = useSyncExternalStore(
    store.subscribe.bind(store),
    store.getState.bind(store),
    store.getState.bind(store)
  );

  const items = React.useMemo(() => selectItems(state), [state]);
  const itemCount = React.useMemo(() => selectItemCount(state), [state]);
  const isEmpty = React.useMemo(() => selectIsEmpty(state), [state]);

  const addItem = React.useCallback(
    (id: number, quantity: number = 1) => {
      store.dispatch({ type: 'ADD_ITEM', payload: { id, quantity } });
    },
    [store]
  );

  const removeItem = React.useCallback(
    (id: number) => {
      store.dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    },
    [store]
  );

  const updateQuantity = React.useCallback(
    (id: number, quantity: number) => {
      store.dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    },
    [store]
  );

  const clearCart = React.useCallback(() => {
    store.dispatch({ type: 'CLEAR_CART' });
  }, [store]);

  const getItem = React.useCallback(
    (id: number) => {
      return selectItemById(state, id);
    },
    [state]
  );

  const hasItem = React.useCallback(
    (id: number) => {
      return selectHasItem(state, id);
    },
    [state]
  );

  return {
    items,
    itemCount,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItem,
    hasItem,
  };
}

/**
 * Cart UI hook for accessing UI preferences and telemetry.
 */
export function useCartUI(): UseCartUIReturn {
  const store = useCartStore();
  const state = useSyncExternalStore(
    store.subscribe.bind(store),
    store.getState.bind(store),
    store.getState.bind(store)
  );

  const reducedMotion = React.useMemo(() => selectEffectiveReducedMotion(state), [state]);
  const soundEnabled = React.useMemo(() => selectSoundEnabled(state), [state]);
  const hapticsEnabled = React.useMemo(() => selectHapticsEnabled(state), [state]);
  const isIdle = React.useMemo(() => selectIsIdle(state), [state]);
  const isAddBurst = React.useMemo(() => selectIsAddBurst(state), [state]);
  const toggleCount = React.useMemo(() => selectToggleCount(state), [state]);

  const toggleReducedMotion = React.useCallback(() => {
    store.dispatch({ type: 'SET_REDUCED_MOTION', payload: !state.reducedMotion });
  }, [store, state.reducedMotion]);

  const toggleSound = React.useCallback(() => {
    store.dispatch({ type: 'SET_SOUND_ENABLED', payload: !state.soundEnabled });
  }, [store, state.soundEnabled]);

  const toggleHaptics = React.useCallback(() => {
    store.dispatch({ type: 'SET_HAPTICS_ENABLED', payload: !state.hapticsEnabled });
  }, [store, state.hapticsEnabled]);

  const registerHoverIntent = React.useCallback(
    (productId: number, duration: number) => {
      store.registerHoverIntent(productId, duration);
    },
    [store]
  );

  return {
    reducedMotion,
    soundEnabled,
    hapticsEnabled,
    toggleReducedMotion,
    toggleSound,
    toggleHaptics,
    isIdle,
    isAddBurst,
    toggleCount,
    registerHoverIntent,
  };
}

/**
 * Hook to access cart telemetry data.
 */
export function useCartTelemetry() {
  const store = useCartStore();
  const state = useSyncExternalStore(
    store.subscribe.bind(store),
    store.getState.bind(store),
    store.getState.bind(store)
  );

  const telemetry = React.useMemo(() => selectTelemetry(state), [state]);

  return telemetry;
}

/**
 * Hook to subscribe to cart events.
 */
export function useCartEvent<T = unknown>(
  eventType: Parameters<CartStore['onEvent']>[0],
  callback: Parameters<CartStore['onEvent']>[1],
  deps: React.DependencyList = []
) {
  const store = useCartStore();

  React.useEffect(() => {
    const unsubscribe = store.onEvent(eventType, callback);
    return unsubscribe;
  }, [store, eventType, callback, ...deps]);
}

/**
 * Hook to register cart toggle events.
 */
export function useCartToggle() {
  const store = useCartStore();

  const registerToggle = React.useCallback(() => {
    store.registerToggle();
  }, [store]);

  return { registerToggle };
}

/**
 * Hook to get cart store instance directly.
 * Useful for advanced use cases where you need direct access to the store.
 */
export function useCartStoreInstance(): CartStore {
  return useCartStore();
}
