// Gram-based pricing options
export type GramOption = 100 | 200 | 300 | 400 | 500 | 1000;

// Price per gram for different gram amounts
export interface GramPricing {
  grams: GramOption;
  price: number;
  pricePerGram: number;
}

// Enhanced product interface with gram-based pricing
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

// Cart item with gram-based quantity support
export interface CartItem {
  id: number;
  name?: string;
  nrsPrice?: number;
  quantity: number;
  // Gram-based options
  selectedGrams?: GramOption;
  // Calculated price based on grams
  calculatedPrice?: number;
  image?: string;
}

// Extended cart item for checkout with gram support
export interface CheckoutCartItem extends CartItem {
  name: string;
  nrsPrice: number;
  image?: string;
  calculatedPrice?: number;
  grams?: number;
  quantity: number;
}

// Type for checkout modal props
export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: CartItem[];
  total?: number;
  singleProduct?: CheckoutCartItem;
}

// Utility functions for gram-based pricing calculations
export const calculatePriceByGrams = (
  product: Product,
  grams: GramOption,
): number => {
  // If product has specific gram pricing, use it
  if (product.gramPricing) {
    const pricing = product.gramPricing.find((p) => p.grams === grams);
    if (pricing) {
      return pricing.price;
    }
  }

  // Otherwise calculate based on price per gram
  if (product.pricePerGram) {
    return product.pricePerGram * grams;
  }

  // Fallback to base price (assuming 500g as standard)
  const standardGrams = 500;
  const pricePerGram = product.nrsPrice / standardGrams;
  return Math.round(pricePerGram * grams);
};

export const calculatePricePerGram = (
  product: Product,
  grams: GramOption,
): number => {
  const price = calculatePriceByGrams(product, grams);
  return Math.round((price / grams) * 100) / 100; // Round to 2 decimal places
};

export const formatGramDisplay = (grams: GramOption): string => {
  if (grams >= 1000) {
    return `${grams / 1000}kg`;
  }
  return `${grams}g`;
};

export const getAvailableGramOptions = (product: Product): GramOption[] => {
  if (product.gramPricing && product.gramPricing.length > 0) {
    return product.gramPricing.map((p) => p.grams);
  }
  // Default options if no specific pricing defined
  return [100, 200, 300, 400, 500, 1000];
};

export const products: Product[] = [
  {
    id: 1,
    name: "Dried Kiwi",
    nrsPrice: 2499,
    description:
      "Hand-selected kiwis slices. Tart, vibrant, and naturally indulgent.",
    features: [
      "Small-batch production",
      "Export-grade quality",
      "Rich in Vitamin C",
    ],
    image: "/dried-kiwi-slices-premium.jpg",
    badge: "Limited Seasonal",
    pricePerGram: 5, // NPR per gram
    gramPricing: [
      { grams: 100, price: 599, pricePerGram: 5.99 },
      { grams: 200, price: 1099, pricePerGram: 5.5 },
      { grams: 300, price: 1599, pricePerGram: 5.33 },
      { grams: 400, price: 2099, pricePerGram: 5.25 },
      { grams: 500, price: 2499, pricePerGram: 5.0 },
      { grams: 1000, price: 4499, pricePerGram: 4.5 },
    ],
  },
  {
    id: 2,
    name: "Dried Blueberry",
    nrsPrice: 2899,
    description:
      "Brain-enhancing superfruit with 5x more antioxidants than fresh blueberries",
    features: [
      "5x more antioxidants",
      "Brain health support",
      "Rich in Vitamin C",
    ],
    image: "/dried-blueberry-premium.jpg",
    badge: "Premium Quality",
    pricePerGram: 5.8,
    gramPricing: [
      { grams: 100, price: 699, pricePerGram: 6.99 },
      { grams: 200, price: 1299, pricePerGram: 6.5 },
      { grams: 300, price: 1899, pricePerGram: 6.33 },
      { grams: 400, price: 2399, pricePerGram: 6.0 },
      { grams: 500, price: 2899, pricePerGram: 5.8 },
      { grams: 1000, price: 5199, pricePerGram: 5.2 },
    ],
  },
  {
    id: 3,
    name: "Dried Pineapple",
    nrsPrice: 2399,
    description: "Digestive aid rich in bromelain and vitamin C",
    features: ["Rich in bromelain", "Digestive health", "Natural enzymes"],
    image: "/dried-pineapple-rings.jpg",
    badge: "Seasonal Favorite",
    pricePerGram: 4.8,
    gramPricing: [
      { grams: 100, price: 549, pricePerGram: 5.49 },
      { grams: 200, price: 999, pricePerGram: 5.0 },
      { grams: 300, price: 1449, pricePerGram: 4.83 },
      { grams: 400, price: 1899, pricePerGram: 4.75 },
      { grams: 500, price: 2399, pricePerGram: 4.8 },
      { grams: 1000, price: 4299, pricePerGram: 4.3 },
    ],
  },
  {
    id: 4,
    name: "Dried Papaya",
    nrsPrice: 2599,
    description:
      "Immunity booster and digestive superstar with natural enzymes",
    features: ["Immunity support", "Natural enzymes", "Digestive health"],
    image: "/dried-papaya-premium.jpg",
    badge: "Exotic Choice",
    pricePerGram: 5.2,
    gramPricing: [
      { grams: 100, price: 599, pricePerGram: 5.99 },
      { grams: 200, price: 1099, pricePerGram: 5.5 },
      { grams: 300, price: 1649, pricePerGram: 5.5 },
      { grams: 400, price: 2099, pricePerGram: 5.25 },
      { grams: 500, price: 2599, pricePerGram: 5.2 },
      { grams: 1000, price: 4699, pricePerGram: 4.7 },
    ],
  },
  {
    id: 5,
    name: "Dried Apple",
    nrsPrice: 2199,
    description: "Heart-friendly and energy-rich snack for everyday vitality",
    features: ["Heart health", "Energy boost", "Rich in fiber"],
    image: "/dried-apple-rings-natural.jpg",
    badge: "Everyday Vitality",
    pricePerGram: 4.4,
    gramPricing: [
      { grams: 100, price: 499, pricePerGram: 4.99 },
      { grams: 200, price: 899, pricePerGram: 4.5 },
      { grams: 300, price: 1349, pricePerGram: 4.5 },
      { grams: 400, price: 1799, pricePerGram: 4.5 },
      { grams: 500, price: 2199, pricePerGram: 4.4 },
      { grams: 1000, price: 3999, pricePerGram: 4.0 },
    ],
  },
  {
    id: 6,
    name: "Dried Banana",
    nrsPrice: 1999,
    description: "Natural energy booster loaded with potassium and magnesium",
    features: ["Potassium rich", "Energy booster", "Natural magnesium"],
    image: "/dried-banana-chips-natural.jpg",
    badge: "Natural Energy",
    pricePerGram: 4.0,
    gramPricing: [
      { grams: 100, price: 449, pricePerGram: 4.49 },
      { grams: 200, price: 799, pricePerGram: 4.0 },
      { grams: 300, price: 1199, pricePerGram: 4.0 },
      { grams: 400, price: 1599, pricePerGram: 4.0 },
      { grams: 500, price: 1999, pricePerGram: 4.0 },
      { grams: 1000, price: 3599, pricePerGram: 3.6 },
    ],
  },
  {
    id: 7,
    name: "Dried Mango",
    nrsPrice: 2699,
    description: "Golden nutrition with beta-carotene for eye health",
    features: ["Beta-carotene rich", "Eye health", "Vitamin A source"],
    image: "/dried-mango-premium.jpg",
    badge: "Tropical Delight",
    pricePerGram: 5.4,
    gramPricing: [
      { grams: 100, price: 649, pricePerGram: 6.49 },
      { grams: 200, price: 1199, pricePerGram: 6.0 },
      { grams: 300, price: 1749, pricePerGram: 5.83 },
      { grams: 400, price: 2199, pricePerGram: 5.5 },
      { grams: 500, price: 2699, pricePerGram: 5.4 },
      { grams: 1000, price: 4899, pricePerGram: 4.9 },
    ],
  },
  {
    id: 8,
    name: "Dried Strawberry",
    nrsPrice: 3199,
    description: "Antioxidant champion for cellular rejuvenation",
    features: ["Highest antioxidants", "Cellular health", "Immunity boost"],
    image: "/dried-strawberry-premium.jpg",
    badge: "Superfood",
    pricePerGram: 6.4,
    gramPricing: [
      { grams: 100, price: 749, pricePerGram: 7.49 },
      { grams: 200, price: 1399, pricePerGram: 7.0 },
      { grams: 300, price: 2049, pricePerGram: 6.83 },
      { grams: 400, price: 2699, pricePerGram: 6.75 },
      { grams: 500, price: 3199, pricePerGram: 6.4 },
      { grams: 1000, price: 5799, pricePerGram: 5.8 },
    ],
  },
];
