/**
 * Enhanced Nutrition Data with Gram-Based Calculations
 * Supports fresh, dehydrated, and cooked options with per-gram values
 */

export interface NutritionPer100g {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fiber: number; // grams
  fat: number; // grams
  vitaminC: number; // mg
  potassium: number; // mg
  antioxidants: number; // ORAC units
  magnesium: number; // mg
  vitaminB6: number; // mg
  bromelain?: number; // GDU (for pineapple)
}

export interface FoodItem {
  id: string;
  name: string;
  type: 'fresh' | 'dehydrated' | 'cooked';
  description: string;
  nutrition: NutritionPer100g;
  benefits: string[];
  gymFocus: 'muscle-gain' | 'fat-loss' | 'endurance' | 'general';
}

export const foodDatabase: FoodItem[] = [
  {
    id: 'kiwi-fresh',
    name: 'Kiwi (Fresh)',
    type: 'fresh',
    description: 'Immunity powerhouse with high vitamin C',
    nutrition: {
      calories: 61,
      protein: 1.1,
      carbs: 14.7,
      fiber: 3.0,
      fat: 0.5,
      vitaminC: 92.7,
      potassium: 312,
      antioxidants: 1200,
      magnesium: 17,
      vitaminB6: 0.06,
    },
    benefits: ['Immunity boost', 'Digestive health', 'Skin health'],
    gymFocus: 'general',
  },
  {
    id: 'kiwi-dried',
    name: 'Kiwi (Dehydrated)',
    type: 'dehydrated',
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
    gymFocus: 'endurance',
  },
  {
    id: 'banana-fresh',
    name: 'Banana (Fresh)',
    type: 'fresh',
    description: 'Natural energy booster',
    nutrition: {
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fiber: 2.6,
      fat: 0.3,
      vitaminC: 8.7,
      potassium: 358,
      antioxidants: 790,
      magnesium: 27,
      vitaminB6: 0.43,
    },
    benefits: ['Quick energy', 'Potassium rich', 'Muscle recovery'],
    gymFocus: 'muscle-gain',
  },
  {
    id: 'banana-dried',
    name: 'Banana (Dehydrated)',
    type: 'dehydrated',
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
    gymFocus: 'muscle-gain',
  },
  {
    id: 'mango-fresh',
    name: 'Mango (Fresh)',
    type: 'fresh',
    description: 'Golden nutrition with beta-carotene',
    nutrition: {
      calories: 60,
      protein: 0.8,
      carbs: 15.0,
      fiber: 1.6,
      fat: 0.4,
      vitaminC: 36.4,
      potassium: 168,
      antioxidants: 1100,
      magnesium: 10,
      vitaminB6: 0.12,
    },
    benefits: ['Eye health', 'Immunity', 'Antioxidant rich'],
    gymFocus: 'general',
  },
  {
    id: 'mango-dried',
    name: 'Mango (Dehydrated)',
    type: 'dehydrated',
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
    gymFocus: 'endurance',
  },
  {
    id: 'blueberry-fresh',
    name: 'Blueberry (Fresh)',
    type: 'fresh',
    description: 'Brain-enhancing superfruit',
    nutrition: {
      calories: 57,
      protein: 0.7,
      carbs: 14.5,
      fiber: 2.4,
      fat: 0.3,
      vitaminC: 9.7,
      potassium: 77,
      antioxidants: 9621,
      magnesium: 6,
      vitaminB6: 0.05,
    },
    benefits: ['Brain health', 'Antioxidant champion', 'Anti-aging'],
    gymFocus: 'general',
  },
  {
    id: 'blueberry-dried',
    name: 'Blueberry (Dehydrated)',
    type: 'dehydrated',
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
    gymFocus: 'general',
  },
  {
    id: 'pineapple-fresh',
    name: 'Pineapple (Fresh)',
    type: 'fresh',
    description: 'Digestive aid with bromelain',
    nutrition: {
      calories: 50,
      protein: 0.5,
      carbs: 13.1,
      fiber: 1.4,
      fat: 0.1,
      vitaminC: 47.8,
      potassium: 109,
      antioxidants: 560,
      magnesium: 12,
      vitaminB6: 0.11,
      bromelain: 0.5,
    },
    benefits: ['Digestive health', 'Anti-inflammatory', 'Immunity'],
    gymFocus: 'fat-loss',
  },
  {
    id: 'pineapple-dried',
    name: 'Pineapple (Dehydrated)',
    type: 'dehydrated',
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
    gymFocus: 'fat-loss',
  },
  {
    id: 'papaya-fresh',
    name: 'Papaya (Fresh)',
    type: 'fresh',
    description: 'Immunity booster with natural enzymes',
    nutrition: {
      calories: 43,
      protein: 0.5,
      carbs: 10.8,
      fiber: 1.7,
      fat: 0.3,
      vitaminC: 60.9,
      potassium: 182,
      antioxidants: 300,
      magnesium: 21,
      vitaminB6: 0.04,
    },
    benefits: ['Immunity support', 'Digestive health', 'Skin health'],
    gymFocus: 'general',
  },
  {
    id: 'papaya-dried',
    name: 'Papaya (Dehydrated)',
    type: 'dehydrated',
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
    gymFocus: 'general',
  },
  {
    id: 'apple-fresh',
    name: 'Apple (Fresh)',
    type: 'fresh',
    description: 'Heart-friendly energy snack',
    nutrition: {
      calories: 52,
      protein: 0.3,
      carbs: 13.8,
      fiber: 2.4,
      fat: 0.2,
      vitaminC: 4.6,
      potassium: 107,
      antioxidants: 490,
      magnesium: 5,
      vitaminB6: 0.04,
    },
    benefits: ['Heart health', 'Energy boost', 'Fiber rich'],
    gymFocus: 'fat-loss',
  },
  {
    id: 'apple-dried',
    name: 'Apple (Dehydrated)',
    type: 'dehydrated',
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
    gymFocus: 'fat-loss',
  },
  {
    id: 'strawberry-fresh',
    name: 'Strawberry (Fresh)',
    type: 'fresh',
    description: 'Antioxidant champion',
    nutrition: {
      calories: 32,
      protein: 0.7,
      carbs: 7.7,
      fiber: 2.0,
      fat: 0.3,
      vitaminC: 58.8,
      potassium: 153,
      antioxidants: 5938,
      magnesium: 13,
      vitaminB6: 0.05,
    },
    benefits: ['Antioxidant rich', 'Immunity', 'Skin health'],
    gymFocus: 'general',
  },
  {
    id: 'strawberry-dried',
    name: 'Strawberry (Dehydrated)',
    type: 'dehydrated',
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
    gymFocus: 'general',
  },
];

/**
 * Calculate nutrition based on grams
 */
export function calculateNutrition(food: FoodItem, grams: number): NutritionPer100g {
  const factor = grams / 100;
  return {
    calories: Math.round(food.nutrition.calories * factor),
    protein: Number((food.nutrition.protein * factor).toFixed(1)),
    carbs: Number((food.nutrition.carbs * factor).toFixed(1)),
    fiber: Number((food.nutrition.fiber * factor).toFixed(1)),
    fat: Number((food.nutrition.fat * factor).toFixed(1)),
    vitaminC: Math.round(food.nutrition.vitaminC * factor),
    potassium: Math.round(food.nutrition.potassium * factor),
    antioxidants: Math.round(food.nutrition.antioxidants * factor),
    magnesium: Math.round(food.nutrition.magnesium * factor),
    vitaminB6: Number((food.nutrition.vitaminB6 * factor).toFixed(2)),
    bromelain: food.nutrition.bromelain ? Number((food.nutrition.bromelain * factor).toFixed(1)) : undefined,
  };
}

/**
 * Search food database by name
 */
export function searchFood(query: string): FoodItem[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  return foodDatabase.filter(food => 
    food.name.toLowerCase().includes(normalizedQuery) ||
    food.description.toLowerCase().includes(normalizedQuery) ||
    food.benefits.some(benefit => benefit.toLowerCase().includes(normalizedQuery))
  );
}

/**
 * Get daily value percentages for nutrients
 */
export function getDailyValuePercentages(nutrition: NutritionPer100g) {
  return {
    calories: Math.round((nutrition.calories / 2000) * 100),
    protein: Math.round((nutrition.protein / 50) * 100),
    carbs: Math.round((nutrition.carbs / 300) * 100),
    fiber: Math.round((nutrition.fiber / 25) * 100),
    fat: Math.round((nutrition.fat / 65) * 100),
    vitaminC: Math.round((nutrition.vitaminC / 90) * 100),
    potassium: Math.round((nutrition.potassium / 3500) * 100),
    magnesium: Math.round((nutrition.magnesium / 400) * 100),
    vitaminB6: Math.round((nutrition.vitaminB6 / 1.7) * 100),
  };
}

/**
 * Identify deficiencies based on daily values
 */
export function identifyDeficiencies(nutrition: NutritionPer100g): string[] {
  const deficiencies: string[] = [];
  const dv = getDailyValuePercentages(nutrition);

  if (dv.protein < 20) deficiencies.push('Protein');
  if (dv.fiber < 25) deficiencies.push('Fiber');
  if (dv.vitaminC < 30) deficiencies.push('Vitamin C');
  if (dv.potassium < 20) deficiencies.push('Potassium');
  if (dv.magnesium < 20) deficiencies.push('Magnesium');

  return deficiencies;
}
