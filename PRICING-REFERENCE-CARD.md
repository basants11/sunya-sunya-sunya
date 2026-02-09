# Product Pricing Reference Card

Quick reference for gram-based pricing across all products.

## Pricing Structure Overview

| Product              | 100g    | 200g      | 300g      | 400g      | 500g      | 1kg       |
| -------------------- | ------- | --------- | --------- | --------- | --------- | --------- |
| **Dried Kiwi**       | NPR 599 | NPR 1,099 | NPR 1,599 | NPR 2,099 | NPR 2,499 | NPR 4,499 |
| **Dried Blueberry**  | NPR 699 | NPR 1,299 | NPR 1,899 | NPR 2,399 | NPR 2,899 | NPR 5,199 |
| **Dried Pineapple**  | NPR 549 | NPR 999   | NPR 1,449 | NPR 1,899 | NPR 2,399 | NPR 4,299 |
| **Dried Papaya**     | NPR 599 | NPR 1,099 | NPR 1,649 | NPR 2,099 | NPR 2,599 | NPR 4,699 |
| **Dried Apple**      | NPR 499 | NPR 899   | NPR 1,349 | NPR 1,799 | NPR 2,199 | NPR 3,999 |
| **Dried Banana**     | NPR 449 | NPR 799   | NPR 1,199 | NPR 1,599 | NPR 1,999 | NPR 3,599 |
| **Dried Mango**      | NPR 649 | NPR 1,199 | NPR 1,749 | NPR 2,199 | NPR 2,699 | NPR 4,899 |
| **Dried Strawberry** | NPR 749 | NPR 1,399 | NPR 2,049 | NPR 2,699 | NPR 3,199 | NPR 5,799 |

## Price Per Gram Comparison

| Product              | 100g/g   | 200g/g   | 300g/g   | 400g/g   | 500g/g   | 1kg/g    |
| -------------------- | -------- | -------- | -------- | -------- | -------- | -------- |
| **Dried Kiwi**       | NPR 5.99 | NPR 5.50 | NPR 5.33 | NPR 5.25 | NPR 5.00 | NPR 4.50 |
| **Dried Blueberry**  | NPR 6.99 | NPR 6.50 | NPR 6.33 | NPR 6.00 | NPR 5.80 | NPR 5.20 |
| **Dried Pineapple**  | NPR 5.49 | NPR 5.00 | NPR 4.83 | NPR 4.75 | NPR 4.80 | NPR 4.30 |
| **Dried Papaya**     | NPR 5.99 | NPR 5.50 | NPR 5.50 | NPR 5.25 | NPR 5.20 | NPR 4.70 |
| **Dried Apple**      | NPR 4.99 | NPR 4.50 | NPR 4.50 | NPR 4.50 | NPR 4.40 | NPR 4.00 |
| **Dried Banana**     | NPR 4.49 | NPR 4.00 | NPR 4.00 | NPR 4.00 | NPR 4.00 | NPR 3.60 |
| **Dried Mango**      | NPR 6.49 | NPR 6.00 | NPR 5.83 | NPR 5.50 | NPR 5.40 | NPR 4.90 |
| **Dried Strawberry** | NPR 7.49 | NPR 7.00 | NPR 6.83 | NPR 6.75 | NPR 6.40 | NPR 5.80 |

## Bulk Savings (1kg vs 500g)

| Product              | 500g Price | 1kg Price | Savings | Discount |
| -------------------- | ---------- | --------- | ------- | -------- |
| **Dried Kiwi**       | NPR 2,499  | NPR 4,499 | NPR 499 | 10%      |
| **Dried Blueberry**  | NPR 2,899  | NPR 5,199 | NPR 599 | 10.3%    |
| **Dried Pineapple**  | NPR 2,399  | NPR 4,299 | NPR 499 | 10.4%    |
| **Dried Papaya**     | NPR 2,599  | NPR 4,699 | NPR 499 | 9.6%     |
| **Dried Apple**      | NPR 2,199  | NPR 3,999 | NPR 399 | 9.1%     |
| **Dried Banana**     | NPR 1,999  | NPR 3,599 | NPR 399 | 10%      |
| **Dried Mango**      | NPR 2,699  | NPR 4,899 | NPR 499 | 9.3%     |
| **Dried Strawberry** | NPR 3,199  | NPR 5,799 | NPR 599 | 9.4%     |

## Quick Calculation Examples

### Example 1: Single Purchase

```
Product: Dried Kiwi
Quantity: 300g
Price: NPR 1,599
Price per gram: NPR 5.33
```

### Example 2: Multiple Items

```
Cart:
- Dried Kiwi (500g) x 2 = NPR 4,998
- Dried Blueberry (200g) x 1 = NPR 1,299
- Dried Banana (1kg) x 1 = NPR 3,599

Total: NPR 9,896
```

### Example 3: Bulk Purchase

```
Product: Dried Strawberry
Quantity: 1kg
Price: NPR 5,799
Price per gram: NPR 5.80
Savings vs 500g: NPR 599 (9.4% discount)
```

## Price Analysis Tips

1. **Best Value**: 1kg packages offer the best price per gram
2. **Standard Size**: 500g is the baseline pricing
3. **Small Quantities**: 100g-200g have higher per-gram prices for convenience
4. **Compare Products**: Use price per gram to compare different products
5. **Bulk Discounts**: 1kg packages typically save 9-10% compared to 500g

## Usage in Code

```typescript
import {
  products,
  calculatePriceByGrams,
  formatGramDisplay,
} from "@/lib/products";

// Get price for any product and gram amount
const kiwi = products.find((p) => p.id === 1);
const price = calculatePriceByGrams(kiwi, 500); // NPR 2,499

// Format for display
const display = formatGramDisplay(500); // "500g"
```

## Product Features Summary

| Product          | Key Features                                          | Badge             |
| ---------------- | ----------------------------------------------------- | ----------------- |
| Dried Kiwi       | Small-batch, Export-grade, Vitamin C                  | Limited Seasonal  |
| Dried Blueberry  | 5x antioxidants, Brain health, Vitamin C              | Premium Quality   |
| Dried Pineapple  | Bromelain, Digestive health, Natural enzymes          | Seasonal Favorite |
| Dried Papaya     | Immunity support, Natural enzymes, Digestive health   | Exotic Choice     |
| Dried Apple      | Heart health, Energy boost, Rich in fiber             | Everyday Vitality |
| Dried Banana     | Potassium rich, Energy booster, Natural magnesium     | Natural Energy    |
| Dried Mango      | Beta-carotene rich, Eye health, Vitamin A source      | Tropical Delight  |
| Dried Strawberry | Highest antioxidants, Cellular health, Immunity boost | Superfood         |

---

**Note**: All prices are in Nepalese Rupees (NPR). Prices may be subject to change. Always use the `calculatePriceByGrams` function for accurate calculations in your application.
