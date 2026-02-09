/**
 * Cart Utilities
 * Price calculations, currency formatting, and helper functions
 */

import type { Product } from "@/lib/products";

/**
 * Currency formatter for NPR (Nepalese Rupee)
 */
export const nprCurrencyFormatter = new Intl.NumberFormat("en-NP", {
  style: "currency",
  currency: "NPR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Format price as NPR currency
 */
export function formatPrice(price: number): string {
  return nprCurrencyFormatter.format(price);
}

/**
 * Format price for display without currency symbol
 */
export function formatPriceSimple(price: number): string {
  return new Intl.NumberFormat("en-NP", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Free shipping threshold amount
 */
export const FREE_SHIPPING_THRESHOLD = 500;

/**
 * Calculate item total price
 */
export function calculateItemTotal(product: Product, quantity: number): number {
  return (product.nrsPrice || 0) * quantity;
}

/**
 * Calculate cart subtotal from items
 */
export function calculateCartSubtotal(
  items: Array<{ id: number; quantity: number }>,
  productMap: Map<number, Product>,
): number {
  let total = 0;
  for (const item of items) {
    const product = productMap.get(item.id);
    if (product) {
      total += calculateItemTotal(product, item.quantity);
    }
  }
  return total;
}

/**
 * Get amount needed for free shipping
 */
export function getAmountForFreeShipping(subtotal: number): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return FREE_SHIPPING_THRESHOLD - subtotal;
}

/**
 * Check if cart qualifies for free shipping
 */
export function qualifiesForFreeShipping(subtotal: number): boolean {
  return subtotal >= FREE_SHIPPING_THRESHOLD;
}

/**
 * Calculate shipping cost based on subtotal
 */
export function calculateShippingCost(subtotal: number): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  // Flat shipping rate when not meeting free shipping threshold
  return 50; // NPR 50 shipping fee
}

/**
 * Calculate tax amount (13% VAT for Nepal)
 */
export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * 0.13);
}

/**
 * Calculate cart total with tax and shipping
 */
export function calculateCartTotal(
  subtotal: number,
  shipping: number,
  tax: number,
  discount: number = 0,
): number {
  return subtotal + shipping + tax - discount;
}

/**
 * Discount types
 */
export type DiscountType = "percentage" | "fixed";

/**
 * Promotional code result
 */
export interface PromoCodeResult {
  isValid: boolean;
  discount: number;
  discountType?: DiscountType;
  code?: string;
  message?: string;
}

/**
 * Validate and calculate promotional code discount
 */
export function applyPromoCode(
  code: string,
  subtotal: number,
): PromoCodeResult {
  const normalizedCode = code.trim().toUpperCase();

  // Define promo codes
  const promoCodes: Record<
    string,
    { discount: number; type: DiscountType; minPurchase: number }
  > = {
    SUNYA10: { discount: 10, type: "percentage", minPurchase: 500 },
    SUNYA20: { discount: 20, type: "percentage", minPurchase: 1000 },
    FLAT100: { discount: 100, type: "fixed", minPurchase: 500 },
    FLAT200: { discount: 200, type: "fixed", minPurchase: 1000 },
    FIRST50: { discount: 50, type: "fixed", minPurchase: 300 },
  };

  const promo = promoCodes[normalizedCode];

  if (!promo) {
    return {
      isValid: false,
      discount: 0,
      message: "Invalid promo code",
    };
  }

  if (subtotal < promo.minPurchase) {
    return {
      isValid: false,
      discount: 0,
      message: `Minimum purchase of ${formatPrice(promo.minPurchase)} required`,
    };
  }

  let discountAmount: number;
  if (promo.type === "percentage") {
    discountAmount = Math.round(subtotal * (promo.discount / 100));
  } else {
    discountAmount = promo.discount;
  }

  // Don't allow discount to exceed subtotal
  discountAmount = Math.min(discountAmount, subtotal);

  return {
    isValid: true,
    discount: discountAmount,
    discountType: promo.type,
    code: normalizedCode,
    message: `Discount of ${promo.discount}${promo.type === "percentage" ? "%" : " NPR"} applied!`,
  };
}

/**
 * Stock status types
 */
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

/**
 * Get stock status based on quantity
 */
export function getStockStatus(
  quantity: number,
  threshold: number = 5,
): StockStatus {
  if (quantity <= 0) return "out_of_stock";
  if (quantity <= threshold) return "low_stock";
  return "in_stock";
}

/**
 * Check if item can be added based on stock
 */
export function canAddToCart(
  currentQuantity: number,
  addQuantity: number,
  maxStock: number,
): { canAdd: boolean; remaining: number; error?: string } {
  const newQuantity = currentQuantity + addQuantity;

  if (maxStock <= 0) {
    return {
      canAdd: false,
      remaining: 0,
      error: "Item is out of stock",
    };
  }

  if (newQuantity > maxStock) {
    return {
      canAdd: false,
      remaining: maxStock - currentQuantity,
      error: `Only ${maxStock - currentQuantity} more available`,
    };
  }

  return {
    canAdd: true,
    remaining: maxStock - newQuantity,
  };
}

/**
 * Calculate quantity increment based on stock
 */
export function getValidQuantity(
  currentQuantity: number,
  desiredQuantity: number,
  maxStock: number,
): number {
  if (desiredQuantity <= 0) return 0;
  if (desiredQuantity > maxStock) return maxStock;
  return desiredQuantity;
}

/**
 * Generate stock display text
 */
export function getStockDisplayText(
  status: StockStatus,
  quantity?: number,
): string {
  switch (status) {
    case "out_of_stock":
      return "Out of Stock";
    case "low_stock":
      return quantity !== undefined ? `Only ${quantity} left!` : "Low Stock";
    default:
      return "In Stock";
  }
}
