/**
 * useLoginModal Hook
 * Hook for controlling the login modal state
 * Provides simple interface for opening/closing the login modal
 */

import { useAuth } from "@/contexts/auth-context";
import { useCallback } from "react";

export interface UseLoginModalReturn {
  /** Whether the login modal is currently open */
  isOpen: boolean;
  /** Open the login modal with optional configuration */
  open: (options?: { redirectTo?: string; onSuccess?: () => void }) => void;
  /** Close the login modal */
  close: () => void;
  /** Toggle the login modal open/closed */
  toggle: () => void;
}

/**
 * Hook to control the login modal
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { open, close, isOpen } = useLoginModal();
 *
 *   return (
 *     <button onClick={() => open({ redirectTo: '/dashboard' })}>
 *       Login
 *     </button>
 *   );
 * }
 * ```
 */
export function useLoginModal(): UseLoginModalReturn {
  const { isLoginModalOpen, openLoginModal, closeLoginModal } = useAuth();

  const open = useCallback(
    (options?: { redirectTo?: string; onSuccess?: () => void }) => {
      openLoginModal(options);
    },
    [openLoginModal],
  );

  const close = useCallback(() => {
    closeLoginModal();
  }, [closeLoginModal]);

  const toggle = useCallback(() => {
    if (isLoginModalOpen) {
      closeLoginModal();
    } else {
      openLoginModal();
    }
  }, [isLoginModalOpen, openLoginModal, closeLoginModal]);

  return {
    isOpen: isLoginModalOpen,
    open,
    close,
    toggle,
  };
}

export default useLoginModal;
