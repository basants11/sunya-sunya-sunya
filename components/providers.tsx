/**
 * Providers Component
 * Wraps application with cart store provider and auth provider, sets up:
 * - Authentication state management
 * - Persistence load + debounced save
 * - prefers-reduced-motion listener
 * - Idle detection timer (15–25s randomized window)
 * - Add-burst detection for anti-spam
 */

"use client";

import { LoginModal } from "@/components/auth";
import { ToastProvider } from "@/components/cart-toast";
import { AuthProvider } from "@/contexts/auth-context";
import {
  createReducedMotionListener,
  getSystemReducedMotion,
  loadLegacyCart,
  loadPersistedCart,
} from "@/lib/cart/persistence";
import { CartStore } from "@/lib/cart/store";
import type { CartItem } from "@/lib/cart/types";
import { CartProvider } from "@/lib/cart/use-cart";
import * as React from "react";
import { Toaster } from "sonner";

/**
 * Compute random idle time in 15-25 second window.
 */
function computeRandomIdleMs(): number {
  return 15000 + Math.floor(Math.random() * 10000);
}

/**
 * Main providers component that wraps application.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = React.useState(false);
  const storeRef = React.useRef<CartStore | null>(null);

  // Only create store on client side
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Create store instance once (only on client)
  if (isMounted && !storeRef.current) {
    storeRef.current = new CartStore();
  }
  const store = storeRef.current;

  // Hydration + legacy migration (runs once on mount)
  React.useEffect(() => {
    if (!store) return;

    const now = Date.now();

    // Try to load from new storage format first
    const persisted = loadPersistedCart();
    if (persisted) {
      const itemsMap = new Map<number, CartItem>();
      for (const item of persisted.items) {
        itemsMap.set(item.id, {
          id: item.id,
          quantity: item.quantity,
          addedAt: item.addedAt,
        });
      }

      store.dispatch({
        type: "HYDRATE_STATE",
        payload: {
          items: itemsMap,
          reducedMotion: persisted.ui.reducedMotion,
          soundEnabled: persisted.ui.soundEnabled,
          hapticsEnabled: persisted.ui.hapticsEnabled,
        },
      });
      return;
    }

    // Fall back to legacy cart format
    const legacyItems = loadLegacyCart();
    if (legacyItems && legacyItems.length > 0) {
      const itemsMap = new Map<number, CartItem>();
      for (const item of legacyItems) {
        itemsMap.set(item.id, item);
      }

      store.dispatch({
        type: "HYDRATE_STATE",
        payload: {
          items: itemsMap,
        },
      });
      return;
    }

    // No existing data, start with empty cart
    store.dispatch({
      type: "HYDRATE_STATE",
      payload: {
        items: new Map(),
      },
    });
  }, [store]);

  // Bridge legacy CustomEvent('cartUpdated') -> store sync
  // This allows existing product code to continue working during migration
  React.useEffect(() => {
    if (!store) return;

    function onLegacyCartUpdated(e: Event) {
      const ce = e as CustomEvent<unknown>;
      const legacyItems = loadLegacyCart();

      if (legacyItems && legacyItems.length > 0) {
        const itemsMap = new Map<number, CartItem>();
        for (const item of legacyItems) {
          itemsMap.set(item.id, item);
        }

        if (store) {
          store.dispatch({
            type: "HYDRATE_STATE",
            payload: {
              items: itemsMap,
            },
          });
        }
      }
    }

    window.addEventListener(
      "cartUpdated",
      onLegacyCartUpdated as EventListener,
    );
    return () =>
      window.removeEventListener(
        "cartUpdated",
        onLegacyCartUpdated as EventListener,
      );
  }, [store]);

  // Debounced persistence to localStorage['sunya.cart']
  React.useEffect(() => {
    if (!store) return;

    let saveTimer: ReturnType<typeof setTimeout> | null = null;

    const unsubscribe = store.subscribe(() => {
      if (saveTimer !== null) {
        clearTimeout(saveTimer);
      }

      saveTimer = setTimeout(() => {
        saveTimer = null;
        // Import dynamically to avoid SSR issues
        import("@/lib/cart/persistence")
          .then(({ saveCartState }) => {
            saveCartState(store.getState());
          })
          .catch((error) => {
            console.error("Failed to save cart state:", error);
          });
      }, 500); // 500ms debounce
    });

    return () => {
      if (saveTimer !== null) {
        clearTimeout(saveTimer);
      }
      unsubscribe();
    };
  }, [store]);

  // prefers-reduced-motion listener
  React.useEffect(() => {
    if (!store) return;

    const apply = (prefersReducedMotion: boolean) => {
      store.dispatch({
        type: "SET_REDUCED_MOTION",
        payload: prefersReducedMotion,
      });
    };

    // Apply initial value
    apply(getSystemReducedMotion());

    // Listen for changes
    const cleanup = createReducedMotionListener(apply);

    return cleanup;
  }, [store]);

  // Idle detection: reset timer on user interaction; fire cartIdle if no interaction in randomized window
  React.useEffect(() => {
    if (!store) return;

    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let lastInteractionAt = Date.now();

    const scheduleIdleCheck = () => {
      if (idleTimer !== null) {
        clearTimeout(idleTimer);
      }

      const waitMs = computeRandomIdleMs();
      idleTimer = setTimeout(() => {
        const idleDuration = Date.now() - lastInteractionAt;
        store.dispatch({ type: "SET_IDLE", payload: true });
      }, waitMs);
    };

    const markInteraction = () => {
      lastInteractionAt = Date.now();
      store.dispatch({ type: "SET_IDLE", payload: false });
      scheduleIdleCheck();
    };

    // Start initial idle check
    scheduleIdleCheck();

    // Listen for user interactions
    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener("pointerdown", markInteraction, opts);
    window.addEventListener("keydown", markInteraction, opts);
    window.addEventListener("scroll", markInteraction, opts);
    window.addEventListener("focus", markInteraction);
    document.addEventListener("visibilitychange", markInteraction);

    return () => {
      if (idleTimer !== null) {
        clearTimeout(idleTimer);
      }
      window.removeEventListener(
        "pointerdown",
        markInteraction,
        opts as AddEventListenerOptions,
      );
      window.removeEventListener(
        "keydown",
        markInteraction,
        opts as AddEventListenerOptions,
      );
      window.removeEventListener(
        "scroll",
        markInteraction,
        opts as AddEventListenerOptions,
      );
      window.removeEventListener("focus", markInteraction);
      document.removeEventListener("visibilitychange", markInteraction);
    };
  }, [store]);

  // Add-burst detection: detect rapid addToCart events and emit start/end
  React.useEffect(() => {
    if (!store) return;

    const WINDOW_MS = 2000; // 2 second window
    const THRESHOLD = 3; // 3 items to trigger burst
    const QUIET_MS = 1200; // 1.2 seconds of quiet to end burst

    let addTimestamps: number[] = [];
    let burstEndTimer: ReturnType<typeof setTimeout> | null = null;

    const stopBurstLater = () => {
      if (burstEndTimer !== null) {
        clearTimeout(burstEndTimer);
      }
      burstEndTimer = setTimeout(() => {
        store.dispatch({ type: "END_ADD_BURST" });
        burstEndTimer = null;
      }, QUIET_MS);
    };

    const unsubscribe = store.onEvent("addToCart", (event) => {
      const now = event.timestamp;
      addTimestamps = [...addTimestamps, now].filter(
        (t) => t >= now - WINDOW_MS,
      );

      if (addTimestamps.length >= THRESHOLD) {
        store.dispatch({ type: "START_ADD_BURST" });
      }
      stopBurstLater();
    });

    return () => {
      if (burstEndTimer !== null) {
        clearTimeout(burstEndTimer);
      }
      unsubscribe();
    };
  }, [store]);

  // For SSR/non-mounted state, render without CartProvider to avoid hydration issues
  // CartProvider requires client-side store which isn't available during SSR
  if (!isMounted || !store) {
    return (
      <AuthProvider>
        <ToastProvider>
          {children}
          <LoginModal />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              },
            }}
          />
        </ToastProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <CartProvider store={store}>
        <ToastProvider>
          {children}
          <LoginModal />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              },
            }}
          />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
