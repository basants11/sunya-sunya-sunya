/**
 * Cart Dropdown Hook
 * Manages the visibility state of the cart dropdown panel.
 */

"use client";

import * as React from "react";

/**
 * Cart dropdown state and actions
 */
export interface CartDropdownState {
  /** Whether the dropdown is currently open */
  isOpen: boolean;
  /** Open the dropdown */
  open: () => void;
  /** Close the dropdown */
  close: () => void;
  /** Toggle the dropdown */
  toggle: () => void;
}

/**
 * Hook to manage cart dropdown visibility
 */
export function useCartDropdown(): CartDropdownState {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
