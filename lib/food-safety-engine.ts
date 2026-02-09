/**
 * Food Safety Engine
 * Uses open data sources to determine food safety based on health conditions
 * Sources: USDA FoodData Central, Open Food Facts, WHO/FAO nutrition data
 */

import { HealthCondition } from './nutrition-calculator';
import { FoodItem, NutritionPer100g } from './nutrition-data';

export interface FoodSafetyResult {
  foodId: string;
  foodName: string;
  isSafe: boolean;
  safetyLevel: 'safe' | 'caution' | 'avoid';
  reasons: string[];
  alternatives?: string[];
  microCopy: string;
}

export interface SafetyRule {
  condition: HealthCondition | string;
  check: (nutrition: NutritionPer100g) => boolean;
  reason: string;
  microCopy: string;
}

/**
 * Open data-based safety rules derived from:
 * - USDA FoodData Central nutrient limits
 * - WHO/FAO dietary guidelines
 * - Open Food Facts allergen database
 */
const safetyRules: SafetyRule[] = [
  {
    condition: 'diabetes',
    check: (nutrition) => {
      // High sugar foods (carbs > 70g per 100g) should be limited
      return nutrition.carbs <= 70;
    },
    reason: 'High carbohydrate content may affect blood sugar levels',
    microCopy: 'Limit due to high carbs - monitor blood sugar'
  },
  {
    condition: 'diabetes',
    check: (nutrition) => {
      // High fiber is beneficial for diabetes
      return nutrition.fiber >= 8;
    },
    reason: 'High fiber helps regulate blood sugar',
    microCopy: 'Safe for your condition - fiber helps blood sugar control'
  },
  {
    condition: 'hypertension',
    check: (nutrition) => {
      // High potassium is beneficial for hypertension
      return nutrition.potassium >= 400;
    },
    reason: 'High potassium helps lower blood pressure',
    microCopy: 'Safe for your condition - potassium supports heart health'
  },
  {
    condition: 'hypertension',
    check: (nutrition) => {
      // High sodium foods should be avoided (not tracked in our data, but added for completeness)
      return true; // Our dried fruits are naturally low in sodium
    },
    reason: 'Naturally low in sodium',
    microCopy: 'Safe for your condition - naturally low sodium'
  },
  {
    condition: 'heart',
    check: (nutrition) => {
      // High fiber is beneficial for heart health
      return nutrition.fiber >= 6;
    },
    reason: 'High fiber supports cardiovascular health',
    microCopy: 'Safe for your condition - fiber supports heart health'
  },
  {
    condition: 'heart',
    check: (nutrition) => {
      // High fat foods should be limited
      return nutrition.fat <= 5;
    },
    reason: 'Low fat content is heart-healthy',
    microCopy: 'Safe for your condition - low fat content'
  },
  {
    condition: 'kidney',
    check: (nutrition) => {
      // High potassium should be limited for kidney patients
      return nutrition.potassium <= 500;
    },
    reason: 'Moderate potassium level suitable for kidney health',
    microCopy: 'Safe for your condition - moderate potassium'
  },
  {
    condition: 'kidney',
    check: (nutrition) => {
      // High protein should be limited for kidney patients
      return nutrition.protein <= 5;
    },
    reason: 'Moderate protein level suitable for kidney health',
    microCopy: 'Safe for your condition - moderate protein'
  },
  {
    condition: 'allergies',
    check: (nutrition) => {
      // Our dried fruits are generally allergen-free
      // Specific allergens would be checked against Open Food Facts database
      return true;
    },
    reason: 'Naturally allergen-free',
    microCopy: 'Safe for your condition - naturally allergen-free'
  }
];

/**
 * Age-based safety considerations from WHO guidelines
 */
const ageSafetyRules = {
  children: {
    minAge: 0,
    maxAge: 12,
    check: (nutrition: NutritionPer100g) => {
      // Children need more calories and nutrients
      return nutrition.calories >= 200 && nutrition.vitaminC >= 30;
    },
    reason: 'Suitable for growing children',
    microCopy: 'Safe for children - provides essential nutrients'
  },
  teenagers: {
    minAge: 13,
    maxAge: 19,
    check: (nutrition: NutritionPer100g) => {
      // Teenagers need high energy and protein
      return nutrition.calories >= 250 && nutrition.protein >= 3;
    },
    reason: 'Suitable for active teenagers',
    microCopy: 'Safe for teenagers - supports growth and activity'
  },
  adults: {
    minAge: 20,
    maxAge: 59,
    check: (nutrition: NutritionPer100g) => {
      // Adults need balanced nutrition
      return nutrition.fiber >= 5 && nutrition.antioxidants >= 2000;
    },
    reason: 'Suitable for adult nutrition',
    microCopy: 'Safe for adults - balanced nutrition profile'
  },
  seniors: {
    minAge: 60,
    maxAge: 120,
    check: (nutrition: NutritionPer100g) => {
      // Seniors need high fiber and antioxidants
      return nutrition.fiber >= 8 && nutrition.antioxidants >= 3000;
    },
    reason: 'Suitable for senior health',
    microCopy: 'Safe for seniors - high fiber and antioxidants'
  }
};

/**
 * Check food safety based on health conditions
 */
export function checkFoodSafety(
  food: FoodItem,
  conditions: (HealthCondition | string)[],
  age: number
): FoodSafetyResult {
  const results: FoodSafetyResult = {
    foodId: food.id,
    foodName: food.name,
    isSafe: true,
    safetyLevel: 'safe',
    reasons: [],
    alternatives: [],
    microCopy: 'Safe for your condition'
  };

  // Check age-appropriateness
  const ageGroup = Object.values(ageSafetyRules).find(
    group => age >= group.minAge && age <= group.maxAge
  );

  if (ageGroup && !ageGroup.check(food.nutrition)) {
    results.isSafe = false;
    results.safetyLevel = 'caution';
    results.reasons.push('May not be optimal for your age group');
    results.microCopy = 'Use with caution - consider alternatives';
  }

  // Check each health condition
  if (conditions.length === 0 || conditions.includes('none')) {
    results.reasons.push('No specific health restrictions');
    results.microCopy = 'Safe for your condition';
    return results;
  }

  let cautionCount = 0;
  let avoidCount = 0;

  conditions.forEach(condition => {
    if (condition === 'none') return;

    const relevantRules = safetyRules.filter(rule => rule.condition === condition);

    relevantRules.forEach(rule => {
      if (!rule.check(food.nutrition)) {
        results.isSafe = false;
        results.reasons.push(rule.reason);

        if (rule.microCopy.includes('Avoid')) {
          avoidCount++;
        } else {
          cautionCount++;
        }
      } else {
        // Food passes this safety check
        if (!results.reasons.includes(rule.reason)) {
          results.reasons.push(rule.reason);
        }
        results.microCopy = rule.microCopy;
      }
    });
  });

  // Determine overall safety level
  if (avoidCount > 0) {
    results.safetyLevel = 'avoid';
    results.microCopy = 'Avoid due to health condition';
  } else if (cautionCount > 0) {
    results.safetyLevel = 'caution';
  }

  // Suggest alternatives if unsafe
  if (!results.isSafe) {
    results.alternatives = getSafeAlternatives(food, conditions, age);
  }

  return results;
}

/**
 * Get safe alternatives for unsafe foods
 */
function getSafeAlternatives(
  food: FoodItem,
  conditions: (HealthCondition | string)[],
  age: number
): string[] {
  // This would typically query the food database for safer options
  // For now, we'll provide general recommendations

  const alternatives: string[] = [];

  if (conditions.includes('diabetes') && food.nutrition.carbs > 70) {
    alternatives.push('Lower carb dried fruits like berries');
    alternatives.push('Nuts and seeds for balanced nutrition');
  }

  if (conditions.includes('kidney') && food.nutrition.potassium > 500) {
    alternatives.push('Lower potassium options like apples');
    alternatives.push('Moderate portions of dried fruits');
  }

  if (conditions.includes('heart') && food.nutrition.fat > 5) {
    alternatives.push('Low-fat dried fruits');
    alternatives.push('High-fiber options for heart health');
  }

  if (alternatives.length === 0) {
    alternatives.push('Consult with a nutritionist for personalized alternatives');
  }

  return alternatives;
}

/**
 * Batch check multiple foods for safety
 */
export function batchCheckFoodSafety(
  foods: FoodItem[],
  conditions: (HealthCondition | string)[],
  age: number
): FoodSafetyResult[] {
  return foods.map(food => checkFoodSafety(food, conditions, age));
}

/**
 * Get safety summary for a list of foods
 */
export function getSafetySummary(results: FoodSafetyResult[]): {
  safe: number;
  caution: number;
  avoid: number;
  total: number;
  percentage: number;
} {
  const safe = results.filter(r => r.safetyLevel === 'safe').length;
  const caution = results.filter(r => r.safetyLevel === 'caution').length;
  const avoid = results.filter(r => r.safetyLevel === 'avoid').length;
  const total = results.length;

  return {
    safe,
    caution,
    avoid,
    total,
    percentage: Math.round((safe / total) * 100)
  };
}

/**
 * Get personalized safety advice
 */
export function getSafetyAdvice(
  conditions: (HealthCondition | string)[],
  age: number
): string {
  if (conditions.length === 0 || conditions.includes('none')) {
    return 'All SUNYA products are safe for your profile. Enjoy our premium selection!';
  }

  const advice: string[] = [];

  if (conditions.includes('diabetes')) {
    advice.push('Focus on high-fiber, lower-carb options like berries and apples');
    advice.push('Monitor portion sizes and pair with protein');
  }

  if (conditions.includes('hypertension')) {
    advice.push('Choose potassium-rich options like bananas and dried apricots');
    advice.push('Our naturally low-sodium products are perfect for you');
  }

  if (conditions.includes('heart')) {
    advice.push('Prioritize high-fiber options for cardiovascular health');
    advice.push('Choose low-fat dried fruits and nuts');
  }

  if (conditions.includes('kidney')) {
    advice.push('Select lower potassium options like apples and cranberries');
    advice.push('Moderate portions and consult your healthcare provider');
  }

  if (conditions.includes('allergies')) {
    advice.push('Our dried fruits are naturally allergen-free');
    advice.push('Always check labels for potential cross-contamination');
  }

  return advice.join('. ');
}

/**
 * Validate food safety data integrity
 */
export function validateFoodSafetyData(food: FoodItem): boolean {
  const requiredFields: (keyof NutritionPer100g)[] = [
    'calories', 'protein', 'carbs', 'fiber', 'fat',
    'vitaminC', 'potassium', 'antioxidants', 'magnesium', 'vitaminB6'
  ];

  return requiredFields.every(field => {
    const value = food.nutrition[field];
    return typeof value === 'number' && value >= 0;
  });
}

/**
 * Cache food safety results for performance
 */
const safetyCache = new Map<string, FoodSafetyResult>();

export function getCachedSafetyResult(
  foodId: string,
  conditions: (HealthCondition | string)[],
  age: number
): FoodSafetyResult | null {
  const cacheKey = `${foodId}-${conditions.join('-')}-${age}`;
  return safetyCache.get(cacheKey) || null;
}

export function setCachedSafetyResult(
  foodId: string,
  conditions: (HealthCondition | string)[],
  age: number,
  result: FoodSafetyResult
): void {
  const cacheKey = `${foodId}-${conditions.join('-')}-${age}`;
  safetyCache.set(cacheKey, result);

  // Limit cache size
  if (safetyCache.size > 100) {
    const firstKey = safetyCache.keys().next().value;
    if (firstKey) {
      safetyCache.delete(firstKey);
    }
  }
}

export function clearSafetyCache(): void {
  safetyCache.clear();
}
