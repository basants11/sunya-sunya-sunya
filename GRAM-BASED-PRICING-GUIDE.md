# Gram-Based Pricing System Guide

This guide explains how to use the gram-based pricing system for calculating product prices in different gram amounts (100g, 200g, 300g, 400g, 500g, 1kg).

## Overview

The gram-based pricing system allows clients to:

- Select products in different gram quantities
- Calculate prices based on gram amounts
- Display price per gram for transparency
- Support bulk discounts for larger quantities

## Type Definitions

### GramOption

```typescript
export type GramOption = 100 | 200 | 300 | 400 | 500 | 1000;
```

Defines the available gram options for products.

### GramPricing

```typescript
export interface GramPricing {
  grams: GramOption;
  price: number;
  pricePerGram: number;
}
```

Contains pricing information for a specific gram amount.

### Product

```typescript
export interface Product {
  id: number;
  name: string;
  nrsPrice: number; // Base price (for backward compatibility)
  description: string;
  features: string[];
  image: string;
  badge: string;
  // Gram-based pricing options
  gramPricing?: GramPricing[];
  // Base price per gram (for calculation)
  pricePerGram?: number;
}
```

### CartItem

```typescript
export interface CartItem {
  id: number;
  name: string;
  nrsPrice: number;
  quantity: number;
  // Gram-based options
  selectedGrams?: GramOption;
  // Calculated price based on grams
  calculatedPrice?: number;
  image?: string;
}
```

## Utility Functions

### calculatePriceByGrams

Calculates the price for a specific gram amount.

```typescript
import { calculatePriceByGrams } from "@/lib/products";

const product = products[0]; // Dried Kiwi
const price = calculatePriceByGrams(product, 500); // Returns 2499
```

**Logic:**

1. If product has specific `gramPricing`, use the matching price
2. Otherwise, calculate using `pricePerGram`
3. Fallback to base price calculation (assuming 500g as standard)

### calculatePricePerGram

Calculates the price per gram for a specific gram amount.

```typescript
import { calculatePricePerGram } from "@/lib/products";

const product = products[0];
const pricePerGram = calculatePricePerGram(product, 500); // Returns 5.00
```

### formatGramDisplay

Formats gram amounts for display (e.g., 100g, 1kg).

```typescript
import { formatGramDisplay } from "@/lib/products";

formatGramDisplay(100); // Returns "100g"
formatGramDisplay(1000); // Returns "1kg"
```

### getAvailableGramOptions

Returns available gram options for a product.

```typescript
import { getAvailableGramOptions } from "@/lib/products";

const options = getAvailableGramOptions(product); // Returns [100, 200, 300, 400, 500, 1000]
```

## Usage Examples

### Example 1: Basic Price Calculation

```typescript
import {
  products,
  calculatePriceByGrams,
  formatGramDisplay,
} from "@/lib/products";

// Get a product
const kiwi = products.find((p) => p.id === 1); // Dried Kiwi

// Calculate price for different gram amounts
const price100g = calculatePriceByGrams(kiwi, 100); // 599
const price500g = calculatePriceByGrams(kiwi, 500); // 2499
const price1kg = calculatePriceByGrams(kiwi, 1000); // 4499

// Display formatted
console.log(`${formatGramDisplay(100)}: NPR ${price100g}`); // "100g: NPR 599"
console.log(`${formatGramDisplay(500)}: NPR ${price500g}`); // "500g: NPR 2499"
console.log(`${formatGramDisplay(1000)}: NPR ${price1kg}`); // "1kg: NPR 4499"
```

### Example 2: Creating a Cart Item with Gram Selection

```typescript
import { CartItem, calculatePriceByGrams } from "@/lib/products";

const product = products[0];
const selectedGrams = 500;

const cartItem: CartItem = {
  id: product.id,
  name: product.name,
  nrsPrice: product.nrsPrice,
  quantity: 2,
  selectedGrams: selectedGrams,
  calculatedPrice: calculatePriceByGrams(product, selectedGrams),
  image: product.image,
};

// Total price for this cart item
const itemTotal = cartItem.calculatedPrice * cartItem.quantity; // 2499 * 2 = 4998
```

### Example 3: Using the GramSelector Component

```typescript
import { GramSelector } from "@/components/gram-selector";
import { useState } from "react";

function ProductPage({ product }: { product: Product }) {
  const [selectedGrams, setSelectedGrams] = useState<GramOption>(500);
  const [price, setPrice] = useState<number>(0);

  const handleGramSelect = (grams: GramOption, calculatedPrice: number) => {
    setSelectedGrams(grams);
    setPrice(calculatedPrice);
  };

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>

      <GramSelector
        product={product}
        onGramSelect={handleGramSelect}
        selectedGrams={selectedGrams}
      />

      <div className="total-price">
        Total: NPR {price}
      </div>
    </div>
  );
}
```

### Example 4: Bulk Price Comparison

```typescript
import {
  products,
  calculatePriceByGrams,
  calculatePricePerGram,
} from "@/lib/products";

function comparePrices(productId: number) {
  const product = products.find((p) => p.id === productId);
  const gramOptions: GramOption[] = [100, 200, 300, 400, 500, 1000];

  console.log(`Price comparison for ${product.name}:`);
  console.log("----------------------------------------");

  gramOptions.forEach((grams) => {
    const price = calculatePriceByGrams(product, grams);
    const pricePerGram = calculatePricePerGram(product, grams);
    const savings =
      grams === 1000
        ? `Save NPR ${calculatePriceByGrams(product, 500) * 2 - price}`
        : "";

    console.log(
      `${formatGramDisplay(grams).padEnd(6)} | NPR ${price.toString().padStart(5)} | ` +
        `NPR ${pricePerGram.toFixed(2)}/g ${savings}`,
    );
  });
}

// Output example:
// Price comparison for Dried Kiwi:
// ----------------------------------------
// 100g   | NPR   599 | NPR 5.99/g
// 200g   | NPR  1099 | NPR 5.50/g
// 300g   | NPR  1599 | NPR 5.33/g
// 400g   | NPR  2099 | NPR 5.25/g
// 500g   | NPR  2499 | NPR 5.00/g
// 1kg    | NPR  4499 | NPR 4.50/g Save NPR 499
```

### Example 5: Checkout with Gram-Based Items

```typescript
import { CartItem, formatGramDisplay } from "@/lib/products";

function CheckoutSummary({ cartItems }: { cartItems: CartItem[] }) {
  const total = cartItems.reduce((sum, item) => {
    const itemPrice = item.calculatedPrice || item.nrsPrice;
    return sum + (itemPrice * item.quantity);
  }, 0);

  return (
    <div className="checkout-summary">
      <h3>Order Summary</h3>
      {cartItems.map(item => {
        const itemPrice = item.calculatedPrice || item.nrsPrice;
        const itemTotal = itemPrice * item.quantity;
        const gramDisplay = item.selectedGrams ?
          ` (${formatGramDisplay(item.selectedGrams)})` : '';

        return (
          <div key={item.id} className="cart-item">
            <span>{item.name}{gramDisplay} x{item.quantity}</span>
            <span>NPR {itemTotal}</span>
          </div>
        );
      })}
      <div className="total">
        <span>Total</span>
        <span>NPR {total}</span>
      </div>
    </div>
  );
}
```

## Pricing Strategy

The gram-based pricing system implements a tiered pricing strategy:

1. **Small quantities (100g-200g)**: Higher price per gram for convenience
2. **Medium quantities (300g-400g)**: Moderate discount
3. **Standard quantity (500g)**: Base pricing
4. **Bulk quantity (1kg)**: Best value with significant discount

### Example Pricing Structure (Dried Kiwi):

| Quantity | Price     | Price per Gram | Savings   |
| -------- | --------- | -------------- | --------- |
| 100g     | NPR 599   | NPR 5.99/g     | -         |
| 200g     | NPR 1,099 | NPR 5.50/g     | NPR 99    |
| 300g     | NPR 1,599 | NPR 5.33/g     | NPR 198   |
| 400g     | NPR 2,099 | NPR 5.25/g     | NPR 297   |
| 500g     | NPR 2,499 | NPR 5.00/g     | NPR 496   |
| 1kg      | NPR 4,499 | NPR 4.50/g     | NPR 1,499 |

## Integration with Existing Components

### Updating ProductCard

```typescript
import { ProductCard } from "@/components/ProductCard";
import { GramSelector } from "@/components/gram-selector";

function ProductPage({ product }: { product: Product }) {
  const [selectedGrams, setSelectedGrams] = useState<GramOption>(500);
  const [price, setPrice] = useState<number>(product.nrsPrice);

  return (
    <div>
      <ProductCard product={product} />
      <GramSelector
        product={product}
        onGramSelect={(grams, calculatedPrice) => {
          setSelectedGrams(grams);
          setPrice(calculatedPrice);
        }}
        selectedGrams={selectedGrams}
      />
      <button onClick={() => addToCart(product, selectedGrams, price)}>
        Add to Cart - NPR {price}
      </button>
    </div>
  );
}
```

### Updating Cart System

```typescript
import { CartItem, calculatePriceByGrams } from "@/lib/products";

function addToCart(product: Product, grams: GramOption, quantity: number = 1) {
  const cartItem: CartItem = {
    id: product.id,
    name: product.name,
    nrsPrice: product.nrsPrice,
    quantity: quantity,
    selectedGrams: grams,
    calculatedPrice: calculatePriceByGrams(product, grams),
    image: product.image,
  };

  // Add to cart state
  setCartItems([...cartItems, cartItem]);
}
```

## Best Practices

1. **Always use utility functions**: Use `calculatePriceByGrams` instead of manual calculations
2. **Display price per gram**: Show transparency to customers
3. **Highlight bulk savings**: Emphasize discounts for larger quantities
4. **Maintain backward compatibility**: Keep `nrsPrice` for existing functionality
5. **Validate gram options**: Use `getAvailableGramOptions` to ensure valid selections
6. **Format consistently**: Use `formatGramDisplay` for consistent UI display

## Testing

```typescript
import { calculatePriceByGrams, formatGramDisplay } from "@/lib/products";

describe("Gram-based pricing", () => {
  it("calculates correct price for 100g", () => {
    const product = products[0];
    expect(calculatePriceByGrams(product, 100)).toBe(599);
  });

  it("calculates correct price for 500g", () => {
    const product = products[0];
    expect(calculatePriceByGrams(product, 500)).toBe(2499);
  });

  it("formats grams correctly", () => {
    expect(formatGramDisplay(100)).toBe("100g");
    expect(formatGramDisplay(1000)).toBe("1kg");
  });
});
```

## Conclusion

The gram-based pricing system provides a flexible and transparent way to calculate product prices based on quantity. Clients can easily analyze and compare prices across different gram amounts, making informed purchasing decisions.

For questions or issues, refer to the component examples in `components/gram-selector.tsx` and the type definitions in `lib/products.ts`.
