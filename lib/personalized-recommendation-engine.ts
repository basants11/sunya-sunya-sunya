/**
 * Personalized Recommendation Engine
 * Combines nutrition calculation and food safety to generate personalized SUNYA product recommendations
 */

import { FoodSafetyResult, checkFoodSafety, getCachedSafetyResult, setCachedSafetyResult } from './food-safety-engine';
import { DailyRequirements, UserProfile, calculateDailyRequirements, calculateProductIntake } from './nutrition-calculator';
import { FoodItem, calculateNutrition, foodDatabase } from './nutrition-data';
import { products, type Product } from './products';

export interface PersonalizedRecommendation {
  product: Product;
  foodItem: FoodItem;
  safetyResult: FoodSafetyResult;
  dailyQuantity: number; // grams
  servings: number;
  reason: string;
  benefits: string[];
  nutritionContribution: {
    calories: number;
    protein: number;
    carbs: number;
    fiber: number;
    fat: number;
    vitaminC: number;
    potassium: number;
    magnesium: number;
  };
  matchScore: number; // 0-100
  priority: 'high' | 'medium' | 'low';
}

export interface DailyPackage {
  recommendations: PersonalizedRecommendation[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFiber: number;
  totalFat: number;
  totalPrice: number;
  meetsRequirements: boolean;
  coveragePercentage: number;
}

export interface RecommendationSummary {
  userProfile: UserProfile;
  dailyRequirements: DailyRequirements;
  recommendations: PersonalizedRecommendation[];
  dailyPackage: DailyPackage;
  safetyAdvice: string;
  unsafeFoods: FoodSafetyResult[];
}

/**
 * Map SUNYA products to food database
 */
const productToFoodMap: Record<number, string> = {
  1: 'kiwi-dried',
  2: 'blueberry-dried',
  3: 'pineapple-dried',
  4: 'papaya-dried',
  5: 'apple-dried',
  6: 'banana-dried',
  7: 'mango-dried',
  8: 'strawberry-dried'
};

/**
 * Calculate match score for a product based on user profile
 */
function calculateMatchScore(
  product: Product,
  foodItem: FoodItem,
  requirements: DailyRequirements,
  safetyResult: FoodSafetyResult
): number {
  let score = 0;

  // Safety score (most important)
  if (safetyResult.safetyLevel === 'safe') {
    score += 40;
  } else if (safetyResult.safetyLevel === 'caution') {
    score += 20;
  } else {
    score += 0;
  }

  // Nutritional alignment
  const nutrition = foodItem.nutrition;
  const proteinRatio = nutrition.protein / requirements.protein;
  const fiberRatio = nutrition.fiber / requirements.fiber;
  const vitaminCRatio = nutrition.vitaminC / requirements.vitaminC;

  // Bonus for high protein
  if (proteinRatio > 0.1) score += 15;
  
  // Bonus for high fiber
  if (fiberRatio > 0.15) score += 15;
  
  // Bonus for high Vitamin C
  if (vitaminCRatio > 0.2) score += 10;

  // Fitness goal alignment
  const gymFocusScores: Record<string, number> = {
    'muscle-gain': nutrition.protein > 4 ? 10 : 5,
    'weight-loss': nutrition.fiber > 10 ? 10 : 5,
    'endurance': nutrition.carbs > 60 ? 10 : 5,
    'general-wellness': 5
  };

  score += gymFocusScores[foodItem.gymFocus] || 5;

  return Math.min(score, 100);
}

/**
 * Generate personalized recommendations
 */
export function generatePersonalizedRecommendations(
  profile: UserProfile
): RecommendationSummary {
  // Calculate daily requirements
  const requirements = calculateDailyRequirements(profile);

  // Get all SUNYA products with their food data
  const allRecommendations: PersonalizedRecommendation[] = [];

  products.forEach(product => {
    const foodId = productToFoodMap[product.id];
    if (!foodId) return;

    const foodItem = foodDatabase.find(f => f.id === foodId);
    if (!foodItem) return;

    // Check safety (with caching)
    let safetyResult = getCachedSafetyResult(foodId, profile.healthConditions, profile.age);
    if (!safetyResult) {
      safetyResult = checkFoodSafety(foodItem, profile.healthConditions, profile.age);
      setCachedSafetyResult(foodId, profile.healthConditions, profile.age, safetyResult);
    }

    // Skip unsafe foods
    if (safetyResult.safetyLevel === 'avoid') {
      return;
    }

    // Calculate daily quantity
    const intake = calculateProductIntake(
      requirements,
      foodItem.nutrition.calories,
      foodItem.nutrition.protein,
      foodItem.nutrition.fiber
    );

    // Calculate nutrition contribution
    const nutritionContribution = calculateNutrition(foodItem, intake.grams);

    // Calculate match score
    const matchScore = calculateMatchScore(product, foodItem, requirements, safetyResult);

    // Determine priority
    let priority: 'high' | 'medium' | 'low';
    if (matchScore >= 80) {
      priority = 'high';
    } else if (matchScore >= 60) {
      priority = 'medium';
    } else {
      priority = 'low';
    }

    allRecommendations.push({
      product,
      foodItem,
      safetyResult,
      dailyQuantity: intake.grams,
      servings: intake.servings,
      reason: intake.reason,
      benefits: foodItem.benefits,
      nutritionContribution,
      matchScore,
      priority
    });
  });

  // Sort by match score and priority
  allRecommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.matchScore - a.matchScore;
  });

  // Generate daily package (top 3-5 products)
  const topRecommendations = allRecommendations.slice(0, 5);
  const dailyPackage = generateDailyPackage(topRecommendations, requirements);

  // Get unsafe foods
  const unsafeFoods: FoodSafetyResult[] = [];
  products.forEach(product => {
    const foodId = productToFoodMap[product.id];
    if (!foodId) return;

    const foodItem = foodDatabase.find(f => f.id === foodId);
    if (!foodItem) return;

    const safetyResult = checkFoodSafety(foodItem, profile.healthConditions, profile.age);
    if (safetyResult.safetyLevel !== 'safe') {
      unsafeFoods.push(safetyResult);
    }
  });

  // Get safety advice
  const safetyAdvice = getSafetyAdvice(profile);

  return {
    userProfile: profile,
    dailyRequirements: requirements,
    recommendations: allRecommendations,
    dailyPackage,
    safetyAdvice,
    unsafeFoods
  };
}

/**
 * Generate daily package from recommendations
 */
function generateDailyPackage(
  recommendations: PersonalizedRecommendation[],
  requirements: DailyRequirements
): DailyPackage {
  const totalCalories = recommendations.reduce((sum, r) => sum + r.nutritionContribution.calories, 0);
  const totalProtein = recommendations.reduce((sum, r) => sum + r.nutritionContribution.protein, 0);
  const totalCarbs = recommendations.reduce((sum, r) => sum + r.nutritionContribution.carbs, 0);
  const totalFiber = recommendations.reduce((sum, r) => sum + r.nutritionContribution.fiber, 0);
  const totalFat = recommendations.reduce((sum, r) => sum + r.nutritionContribution.fat, 0);
  const totalPrice = recommendations.reduce((sum, r) => {
    const pricePerGram = r.product.nrsPrice / 1000;
    return sum + (pricePerGram * r.dailyQuantity);
  }, 0);

  const coveragePercentage = Math.round((totalCalories / requirements.calories) * 100);
  const meetsRequirements = coveragePercentage >= 80 && coveragePercentage <= 120;

  return {
    recommendations,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFiber,
    totalFat,
    totalPrice: Math.round(totalPrice),
    meetsRequirements,
    coveragePercentage
  };
}

/**
 * Get safety advice based on profile
 */
function getSafetyAdvice(profile: UserProfile): string {
  if (profile.healthConditions.length === 0 || profile.healthConditions.includes('none')) {
    return 'All SUNYA products are safe for your profile. Enjoy our premium selection!';
  }

  const advice: string[] = [];

  if (profile.healthConditions.includes('diabetes')) {
    advice.push('Focus on high-fiber, lower-carb options like berries and apples');
  }

  if (profile.healthConditions.includes('hypertension')) {
    advice.push('Choose potassium-rich options like bananas');
  }

  if (profile.healthConditions.includes('heart')) {
    advice.push('Prioritize high-fiber options for cardiovascular health');
  }

  if (profile.healthConditions.includes('kidney')) {
    advice.push('Select lower potassium options like apples and cranberries');
  }

  return advice.join('. ');
}

/**
 * Recalculate recommendations when profile changes
 */
export function recalculateRecommendations(
  profile: UserProfile
): RecommendationSummary {
  return generatePersonalizedRecommendations(profile);
}

/**
 * Get product recommendation by ID
 */
export function getProductRecommendation(
  productId: number,
  profile: UserProfile
): PersonalizedRecommendation | null {
  const summary = generatePersonalizedRecommendations(profile);
  return summary.recommendations.find(r => r.product.id === productId) || null;
}

/**
 * Get daily package for subscription
 */
export function getDailyPackageForSubscription(
  profile: UserProfile
): DailyPackage {
  const summary = generatePersonalizedRecommendations(profile);
  return summary.dailyPackage;
}

/**
 * Validate recommendation data
 */
export function validateRecommendation(
  recommendation: PersonalizedRecommendation
): boolean {
  return (
    recommendation.product &&
    recommendation.foodItem &&
    recommendation.safetyResult &&
    recommendation.dailyQuantity > 0 &&
    recommendation.matchScore >= 0 &&
    recommendation.matchScore <= 100
  );
}

/**
 * Get recommendation statistics
 */
export function getRecommendationStats(
  summary: RecommendationSummary
): {
  totalProducts: number;
  safeProducts: number;
  cautionProducts: number;
  avoidProducts: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
} {
  return {
    totalProducts: summary.recommendations.length,
    safeProducts: summary.recommendations.filter(r => r.safetyResult.safetyLevel === 'safe').length,
    cautionProducts: summary.recommendations.filter(r => r.safetyResult.safetyLevel === 'caution').length,
    avoidProducts: summary.unsafeFoods.length,
    highPriority: summary.recommendations.filter(r => r.priority === 'high').length,
    mediumPriority: summary.recommendations.filter(r => r.priority === 'medium').length,
    lowPriority: summary.recommendations.filter(r => r.priority === 'low').length
  };
}
