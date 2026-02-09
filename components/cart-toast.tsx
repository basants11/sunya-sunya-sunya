/**
 * Cart Toast Notification System
 * Toast notifications for cart actions with animations
 */

"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  ShoppingCart,
  Tag,
  Truck,
  X,
} from "lucide-react";
import * as React from "react";

/**
 * Toast types
 */
export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "cart"
  | "shipping"
  | "promo";

/**
 * Toast configuration
 */
export interface ToastConfig {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Toast context
 */
interface ToastContextValue {
  toasts: ToastConfig[];
  showToast: (toast: Omit<ToastConfig, "id">) => string;
  hideToast: (id: string) => void;
  hideAll: () => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

/**
 * Toast provider component
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastConfig[]>([]);

  const showToast = React.useCallback((toast: Omit<ToastConfig, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const hideToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const hideAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast, hideAll }}>
      {children}
      <CartToastContainer />
    </ToastContext.Provider>
  );
}

/**
 * Hook to use toast context
 */
export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

/**
 * Hook to show cart-specific toasts
 */
export function useCartToast() {
  const { showToast } = useToast();

  const showAddedToCart = React.useCallback(
    (productName: string, quantity: number, price?: number) => {
      return showToast({
        type: "cart",
        title: "Added to Cart",
        message: `${quantity}x ${productName}${price ? ` - NPR ${price.toLocaleString()}` : ""}`,
        duration: 4000,
      });
    },
    [showToast],
  );

  const showRemovedFromCart = React.useCallback(
    (productName: string) => {
      return showToast({
        type: "info",
        title: "Removed from Cart",
        message: `${productName} has been removed`,
        duration: 3000,
      });
    },
    [showToast],
  );

  const showQuantityUpdated = React.useCallback(
    (productName: string, quantity: number) => {
      return showToast({
        type: "success",
        title: "Quantity Updated",
        message: `${productName} quantity: ${quantity}`,
        duration: 3000,
      });
    },
    [showToast],
  );

  const showFreeShipping = React.useCallback(() => {
    return showToast({
      type: "shipping",
      title: "🎉 Free Shipping Unlocked!",
      message: "Your order now qualifies for free shipping",
      duration: 5000,
    });
  }, [showToast]);

  const showShippingReminder = React.useCallback(
    (amountNeeded: number) => {
      return showToast({
        type: "info",
        title: "Add NPR " + amountNeeded.toLocaleString() + " more",
        message: "for FREE shipping!",
        duration: 4000,
      });
    },
    [showToast],
  );

  const showPromoApplied = React.useCallback(
    (code: string, discount: number) => {
      return showToast({
        type: "promo",
        title: "Promo Code Applied!",
        message: `Code ${code}: -NPR ${discount.toLocaleString()}`,
        duration: 4000,
      });
    },
    [showToast],
  );

  const showPromoInvalid = React.useCallback(
    (message: string) => {
      return showToast({
        type: "error",
        title: "Invalid Promo Code",
        message,
        duration: 4000,
      });
    },
    [showToast],
  );

  const showError = React.useCallback(
    (title: string, message: string) => {
      return showToast({
        type: "error",
        title,
        message,
        duration: 5000,
      });
    },
    [showToast],
  );

  const showStockWarning = React.useCallback(
    (productName: string, available: number) => {
      return showToast({
        type: "warning",
        title: "Limited Stock",
        message: `Only ${available} units of ${productName} available`,
        duration: 4000,
      });
    },
    [showToast],
  );

  const showOutOfStock = React.useCallback(
    (productName: string) => {
      return showToast({
        type: "error",
        title: "Out of Stock",
        message: `${productName} is currently unavailable`,
        duration: 4000,
      });
    },
    [showToast],
  );

  return {
    showAddedToCart,
    showRemovedFromCart,
    showQuantityUpdated,
    showFreeShipping,
    showShippingReminder,
    showPromoApplied,
    showPromoInvalid,
    showError,
    showStockWarning,
    showOutOfStock,
  };
}

/**
 * Toast container component
 */
function CartToastContainer() {
  const { toasts, hideToast } = useToast();

  return (
    <div
      className={cn(
        "fixed z-[100] flex flex-col gap-2",
        "pointer-events-none",
        "bottom-4 right-4 sm:bottom-6 sm:right-6",
        "max-w-sm w-full",
      )}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Individual toast item component
 */
function ToastItem({
  toast,
  onClose,
}: {
  toast: ToastConfig;
  onClose: () => void;
}) {
  React.useEffect(() => {
    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, onClose]);

  const icon = getToastIcon(toast.type);
  const styles = getToastStyles(toast.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "pointer-events-auto",
        "bg-background border rounded-xl shadow-lg",
        "overflow-hidden",
        "flex items-start gap-3 p-4",
        styles.border,
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          styles.iconBg,
        )}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-semibold", styles.text)}>
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {toast.message}
          </p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className={cn(
              "text-xs font-medium mt-2 hover:underline",
              styles.actionText,
            )}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full",
          "flex items-center justify-center",
          "text-muted-foreground hover:text-foreground",
          "transition-colors",
        )}
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar */}
      {toast.duration !== 0 && (
        <motion.div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-0.5",
            styles.progressBg,
          )}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{
            duration: (toast.duration ?? 4000) / 1000,
            ease: "linear",
          }}
        />
      )}
    </motion.div>
  );
}

/**
 * Get icon for toast type
 */
function getToastIcon(type: ToastType): React.ReactNode {
  const iconClass = "w-4 h-4";

  switch (type) {
    case "success":
      return <CheckCircle2 className={cn(iconClass, "text-green-600")} />;
    case "error":
      return <AlertCircle className={cn(iconClass, "text-red-600")} />;
    case "warning":
      return <AlertCircle className={cn(iconClass, "text-amber-600")} />;
    case "info":
      return <Info className={cn(iconClass, "text-blue-600")} />;
    case "cart":
      return <ShoppingCart className={cn(iconClass, "text-orange-600")} />;
    case "shipping":
      return <Truck className={cn(iconClass, "text-green-600")} />;
    case "promo":
      return <Tag className={cn(iconClass, "text-purple-600")} />;
    default:
      return <Info className={cn(iconClass, "text-blue-600")} />;
  }
}

/**
 * Get styles for toast type
 */
function getToastStyles(type: ToastType) {
  switch (type) {
    case "success":
      return {
        border: "border-green-200 dark:border-green-800",
        iconBg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-900 dark:text-green-100",
        actionText: "text-green-700 dark:text-green-300",
        progressBg: "bg-green-500/20",
      };
    case "error":
      return {
        border: "border-red-200 dark:border-red-800",
        iconBg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-900 dark:text-red-100",
        actionText: "text-red-700 dark:text-red-300",
        progressBg: "bg-red-500/20",
      };
    case "warning":
      return {
        border: "border-amber-200 dark:border-amber-800",
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-900 dark:text-amber-100",
        actionText: "text-amber-700 dark:text-amber-300",
        progressBg: "bg-amber-500/20",
      };
    case "info":
      return {
        border: "border-blue-200 dark:border-blue-800",
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-900 dark:text-blue-100",
        actionText: "text-blue-700 dark:text-blue-300",
        progressBg: "bg-blue-500/20",
      };
    case "cart":
      return {
        border: "border-orange-200 dark:border-orange-800",
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-900 dark:text-orange-100",
        actionText: "text-orange-700 dark:text-orange-300",
        progressBg: "bg-orange-500/20",
      };
    case "shipping":
      return {
        border: "border-green-200 dark:border-green-800",
        iconBg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-900 dark:text-green-100",
        actionText: "text-green-700 dark:text-green-300",
        progressBg: "bg-green-500/20",
      };
    case "promo":
      return {
        border: "border-purple-200 dark:border-purple-800",
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-900 dark:text-purple-100",
        actionText: "text-purple-700 dark:text-purple-300",
        progressBg: "bg-purple-500/20",
      };
    default:
      return {
        border: "border-border",
        iconBg: "bg-muted",
        text: "text-foreground",
        actionText: "text-primary",
        progressBg: "bg-primary/20",
      };
  }
}

/**
 * Static toast for immediate display (no provider needed)
 */
export function showStaticToast(toast: Omit<ToastConfig, "id">) {
  // This would typically be used with a global toast system
  console.log("[Toast]", toast.type, toast.title, toast.message);
}
