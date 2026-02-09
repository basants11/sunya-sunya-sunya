/**
 * Recommendation Engine
 * Maps food searches to SUNYA product catalog with smart matching
 */

import { FoodItem, calculateNutrition, identifyDeficiencies } from './nutrition-data';
import { products, type Product } from './products';

export interface Recommendation {
  product: Product;
  matchScore: number;
  suggestedQuantity: number; // in grams
  reason: string;
  comparison: string;
  benefits: string[];
  gymFocus: string;
  pricePerServing: number;
}

export interface SearchHistory {
  query: string;
  timestamp: number;
  grams: number;
  foodId?: string;
}

/**
 * Map food database to product catalog
 */
const foodToProductMap: Record<string, number> = {
  'kiwi-fresh': 1,
  'kiwi-dried': 1,
  'blueberry-fresh': 2,
  'blueberry-dried': 2,
  'pineapple-fresh': 3,
  'pineapple-dried': 3,
  'papaya-fresh': 4,
  'papaya-dried': 4,
  'apple-fresh': 5,
  'apple-dried': 5,
  'banana-fresh': 6,
  'banana-dried': 6,
  'mango-fresh': 7,
  'mango-dried': 7,
  'strawberry-fresh': 8,
  'strawberry-dried': 8,
};

/**
 * Calculate match score between food and product
 */
function calculateMatchScore(food: FoodItem, product: Product): number {
  let score = 0;

  // Direct name match
  if (food.name.toLowerCase().includes(product.name.toLowerCase())) {
    score += 50;
  }

  // Type match (dehydrated products match better)
  if (food.type === 'dehydrated') {
    score += 30;
  }

  // Gym focus alignment
  const gymFocusScores: Record<string, number> = {
    'muscle-gain': 25,
    'fat-loss': 20,
    'endurance': 20,
    'general': 15,
  };
  score += gymFocusScores[food.gymFocus] || 10;

  return Math.min(score, 100);
}

/**
 * Generate comparison text
 */
function generateComparison(food: FoodItem, product: Product, grams: number): string {
  const foodNutrition = calculateNutrition(food, grams);
  const productGrams = 30; // Standard serving size for dried fruits
  const productNutrition = calculateNutrition(
    foodDatabase.find(f => f.id === `${food.name.split(' ')[0].toLowerCase()}-dried`) || food,
    productGrams
  );

  const energyComparison = foodNutrition.calories > productNutrition.calories
    ? `${grams}g of ${food.name} = ${Math.round(foodNutrition.calories / productNutrition.calories)} packs of ${product.name}`
    : `1 pack of ${product.name} = ${Math.round(productNutrition.calories / foodNutrition.calories)}x energy of ${grams}g ${food.name}`;

  const fiberComparison = foodNutrition.fiber > productNutrition.fiber
    ? `Same energy + ${Math.round(foodNutrition.fiber - productNutrition.fiber)}g more fiber`
    : `Same energy + ${Math.round(productNutrition.fiber - foodNutrition.fiber)}g more fiber`;

  return `${energyComparison} (${fiberComparison})`;
}

/**
 * Generate recommendation reason
 */
function generateRecommendationReason(food: FoodItem, deficiencies: string[]): string {
  if (deficiencies.length > 0) {
    const topDeficiency = deficiencies[0];
    const reasons: Record<string, string> = {
      'Protein': 'Boost your protein intake for muscle recovery',
      'Fiber': 'Enhance your digestive health with premium fiber',
      'Vitamin C': 'Supercharge your immunity with concentrated Vitamin C',
      'Potassium': 'Support muscle function with potassium-rich nutrition',
      'Magnesium': 'Optimize energy metabolism with magnesium',
    };
    return reasons[topDeficiency] || 'Perfect for your daily wellness';
  }

  const gymFocusReasons: Record<string, string> = {
    'muscle-gain': 'Fuel your muscle growth with premium nutrition',
    'fat-loss': 'Support your weight loss journey with natural energy',
    'endurance': 'Power your endurance with sustained energy release',
    'general': 'Perfect for your daily wellness routine',
  };

  return gymFocusReasons[food.gymFocus] || 'Perfect for your daily wellness';
}

/**
 * Get recommendations based on food search
 */
export function getRecommendations(
  food: FoodItem,
  grams: number,
  searchHistory: SearchHistory[] = []
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const productId = foodToProductMap[food.id];

  if (!productId) {
    return recommendations;
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    return recommendations;
  }

  const matchScore = calculateMatchScore(food, product);
  const nutrition = calculateNutrition(food, grams);
  const deficiencies = identifyDeficiencies(nutrition);

  // Calculate suggested quantity (aim for similar calorie content)
  const suggestedQuantity = Math.round((nutrition.calories / 250) * 30); // 30g pack ~250 cal

  const recommendation: Recommendation = {
    product,
    matchScore,
    suggestedQuantity: Math.max(30, suggestedQuantity),
    reason: generateRecommendationReason(food, deficiencies),
    comparison: generateComparison(food, product, grams),
    benefits: food.benefits,
    gymFocus: food.gymFocus,
    pricePerServing: Math.round((product.nrsPrice / 1000) * suggestedQuantity),
  };

  recommendations.push(recommendation);

  // Add personalized suggestions based on search history
  if (searchHistory.length > 0) {
    const recentSearches = searchHistory.slice(-3);
    const complementaryProducts = getComplementaryProducts(food, recentSearches);
    recommendations.push(...complementaryProducts);
  }

  return recommendations.slice(0, 3); // Return top 3 recommendations
}

/**
 * Get complementary products based on search history
 */
function getComplementaryProducts(
  currentFood: FoodItem,
  searchHistory: SearchHistory[]
): Recommendation[] {
  const complementary: Recommendation[] = [];
  const seenProductIds = new Set<number>();

  // Find products from recent searches
  for (const search of searchHistory) {
    const foodId = search.foodId;
    if (!foodId) continue;

    const productId = foodToProductMap[foodId];
    if (!productId || productId === foodToProductMap[currentFood.id]) continue;
    if (seenProductIds.has(productId)) continue;

    const product = products.find(p => p.id === productId);
    if (!product) continue;

    seenProductIds.add(productId);

    complementary.push({
      product,
      matchScore: 60,
      suggestedQuantity: 30,
      reason: 'Complement your nutrition with variety',
      comparison: 'Perfect addition to your wellness routine',
      benefits: ['Variety', 'Balanced nutrition', 'Daily wellness'],
      gymFocus: 'general',
      pricePerServing: Math.round(product.nrsPrice / 33),
    });
  }

  return complementary;
}

/**
 * Get products user hasn't bought yet (for trial encouragement)
 */
export function getNewProductsToTry(
  purchasedProductIds: number[],
  limit: number = 3
): Product[] {
  return products
    .filter(p => !purchasedProductIds.includes(p.id))
    .slice(0, limit);
}

/**
 * Store search history
 */
export function storeSearchHistory(search: SearchHistory): void {
  if (typeof window === 'undefined') return;

  const history = getSearchHistory();
  history.push(search);

  // Keep only last 20 searches
  const trimmedHistory = history.slice(-20);
  localStorage.setItem('sunya-search-history', JSON.stringify(trimmedHistory));
}

/**
 * Get search history
 */
export function getSearchHistory(): SearchHistory[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('sunya-search-history');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Clear search history
 */
export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('sunya-search-history');
}

// Export food database for use in recommendation engine
const foodDatabase = [
  {
    id: 'kiwi-dried',
    name: 'Kiwi (Dehydrated)',
    type: 'dehydrated' as const,
    description: 'Concentrated nutrition - 8x more vitamin C than fresh',
    nutrition: {
      calories: 250,
      protein: 4.5,
      carbs: 58.8,
      fiber: 12.0,
      fat: 2.0,
      vitaminC: 370,
      potassium: 1248,
      antioxidants: 4800,
      magnesium: 68,
      vitaminB6: 0.24,
    },
    benefits: ['Immunity powerhouse', 'Energy boost', 'Fiber rich'],
    gymFocus: 'endurance' as const,
  },
  {
    id: 'blueberry-dried',
    name: 'Blueberry (Dehydrated)',
    type: 'dehydrated' as const,
    description: '5x more antioxidants than fresh',
    nutrition: {
      calories: 317,
      protein: 3.9,
      carbs: 80.6,
      fiber: 13.4,
      fat: 1.2,
      vitaminC: 54,
      potassium: 428,
      antioxidants: 48000,
      magnesium: 33,
      vitaminB6: 0.28,
    },
    benefits: ['Brain enhancement', 'Antioxidant powerhouse', 'Cellular health'],
    gymFocus: 'general' as const,
  },
  {
    id: 'pineapple-dried',
    name: 'Pineapple (Dehydrated)',
    type: 'dehydrated' as const,
    description: 'Rich in bromelain and vitamin C',
    nutrition: {
      calories: 278,
      protein: 2.8,
      carbs: 72.8,
      fiber: 7.8,
      fat: 0.6,
      vitaminC: 266,
      potassium: 604,
      antioxidants: 3136,
      magnesium: 67,
      vitaminB6: 0.61,
      bromelain: 2.8,
    },
    benefits: ['Digestive aid', 'Anti-inflammatory', 'Metabolism boost'],
    gymFocus: 'fat-loss' as const,
  },
  {
    id: 'papaya-dried',
    name: 'Papaya (Dehydrated)',
    type: 'dehydrated' as const,
    description: 'Concentrated enzymes for digestion',
    nutrition: {
      calories: 239,
      protein: 2.8,
      carbs: 60.0,
      fiber: 9.5,
      fat: 1.7,
      vitaminC: 338,
      potassium: 1012,
      antioxidants: 1680,
      magnesium: 117,
      vitaminB6: 0.22,
    },
    benefits: ['Immunity booster', 'Digestive superstar', 'Enzyme rich'],
    gymFocus: 'general' as const,
  },
  {
    id: 'apple-dried',
    name: 'Apple (Dehydrated)',
    type: 'dehydrated' as const,
    description: 'Concentrated fiber for heart health',
    nutrition: {
      calories: 243,
      protein: 1.4,
      carbs: 64.9,
      fiber: 11.2,
      fat: 0.9,
      vitaminC: 21,
      potassium: 500,
      antioxidants: 2290,
      magnesium: 23,
      vitaminB6: 0.19,
    },
    benefits: ['Heart health', 'Energy rich', 'Fiber powerhouse'],
    gymFocus: 'fat-loss' as const,
  },
  {
    id: 'banana-dried',
    name: 'Banana (Dehydrated)',
    type: 'dehydrated' as const,
    description: 'Concentrated energy for workouts',
    nutrition: {
      calories: 346,
      protein: 4.3,
      carbs: 88.7,
      fiber: 10.2,
      fat: 1.1,
      vitaminC: 34,
      potassium: 1390,
      antioxidants: 3070,
      magnesium: 105,
      vitaminB6: 1.68,
    },
    benefits: ['High energy density', 'Potassium powerhouse', 'Muscle fuel'],
    gymFocus: 'muscle-gain' as const,
  },
  {
    id: 'mango-dried',
    name: 'Mango (Dehydrated)',
    type: 'dehydrated' as const,
    description: 'Concentrated beta-carotene for eye health',
    nutrition: {
      calories: 314,
      protein: 4.2,
      carbs: 78.6,
      fiber: 8.4,
      fat: 2.1,
      vitaminC: 190,
      potassium: 880,
      antioxidants: 5760,
      magnesium: 52,
      vitaminB6: 0.63,
    },
    benefits: ['Eye health', 'Energy boost', 'Antioxidant rich'],
    gymFocus: 'endurance' as const,
  },
  {
    id: 'strawberry-dried',
    name: 'Strawberry (Dehydrated)',
    type: 'dehydrated' as const,
    description: 'Cellular rejuvenation powerhouse',
    nutrition: {
      calories: 328,
      protein: 7.2,
      carbs: 79.0,
      fiber: 20.5,
      fat: 3.1,
      vitaminC: 602,
      potassium: 1568,
      antioxidants: 60760,
      magnesium: 133,
      vitaminB6: 0.51,
    },
    benefits: ['Antioxidant champion', 'Cellular health', 'Immunity boost'],
    gymFocus: 'general' as const,
  },
];
