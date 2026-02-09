/**
 * Safety Validator
 * 
 * Conservative safety validation for food recommendations.
 * Blocks unsafe items based on user profile and health sensitivities.
 * Never provides medical advice or diagnoses.
 */

import type {
  NormalizedNutritionData
} from '@/types/nutrition';
import type {
  DietaryRisk
} from '@/types/nutrition-intelligence';
import {
  RiskLevel
} from '@/types/nutrition-intelligence';
import type {
  UserProfile
} from '@/types/user-profile';
import {
  DietaryRestriction
} from '@/types/user-profile';
import {
  NutritionIntelligenceEngine
} from './nutrition-intelligence';

/**
 * Safety validation result interface
 */
export interface SafetyValidationResult {
  /** Whether the food is safe for the user's profile */
  isSafe: boolean;
  /** Safety warnings */
  warnings: string[];
  /** Whether the recommendation should be blocked */
  shouldBlock: boolean;
  /** Reason for blocking (if applicable) */
  blockReason?: string;
}

/**
 * Safe alternative interface
 */
export interface SafeAlternative {
  /** Alternative food item */
  food: NormalizedNutritionData;
  /** Reason why it's a safe alternative */
  reason: string;
  /** How it compares to the original */
  comparison: string;
}

/**
 * Safety Validator Class
 * 
 * Provides conservative safety validation for food recommendations.
 * If unsure, blocks the recommendation.
 */
export class SafetyValidator {
  /**
   * Check if a food is safe for the user's profile
   * @param nutritionData - Normalized nutrition data
   * @param userProfile - User profile
   * @returns Safety validation result
   */
  static isSafeForProfile(
    nutritionData: NormalizedNutritionData,
    userProfile: UserProfile | null
  ): boolean {
    const result = this.validateSafety(nutritionData, userProfile);
    return result.isSafe;
  }

  /**
   * Get safety warnings for a food item
   * @param nutritionData - Normalized nutrition data
   * @param userProfile - User profile
   * @returns Array of safety warnings
   */
  static getSafetyWarnings(
    nutritionData: NormalizedNutritionData,
    userProfile: UserProfile | null
  ): string[] {
    const result = this.validateSafety(nutritionData, userProfile);
    return result.warnings;
  }

  /**
   * Check if a recommendation should be blocked
   * @param nutritionData - Normalized nutrition data
   * @param userProfile - User profile
   * @returns Whether to block the recommendation
   */
  static shouldBlockRecommendation(
    nutritionData: NormalizedNutritionData,
    userProfile: UserProfile | null
  ): boolean {
    const result = this.validateSafety(nutritionData, userProfile);
    return result.shouldBlock;
  }

  /**
   * Get safe alternatives for a food item
   * @param nutritionData - Normalized nutrition data
   * @param userProfile - User profile
   * @param availableProducts - Available products to choose from
   * @returns Array of safe alternatives
   */
  static getSafeAlternatives(
    nutritionData: NormalizedNutritionData,
    userProfile: UserProfile | null,
    availableProducts: NormalizedNutritionData[]
  ): SafeAlternative[] {
    if (!userProfile) {
      // No profile, no alternatives needed
      return [];
    }

    const alternatives: SafeAlternative[] = [];

    // Filter out the current food and unsafe foods
    const safeProducts = availableProducts.filter(product => {
      if (product.id === nutritionData.id) {
        return false; // Skip the current food
      }

      const isSafe = this.isSafeForProfile(product, userProfile);
      return isSafe;
    });

    // Sort by similarity (calorie density, primary macronutrient)
    const sortedProducts = this.sortBySimilarity(nutritionData, safeProducts);

    // Take top 3 alternatives
    const topAlternatives = sortedProducts.slice(0, 3);

    // Generate alternative descriptions
    topAlternatives.forEach(product => {
      alternatives.push({
        food: product,
        reason: this.generateAlternativeReason(nutritionData, product, userProfile),
        comparison: this.generateComparison(nutritionData, product)
      });
    });

    return alternatives;
  }

  /**
   * Validate safety of a food item
   * @param nutritionData - Normalized nutrition data
   * @param userProfile - User profile
   * @returns Safety validation result
   */
  private static validateSafety(
    nutritionData: NormalizedNutritionData,
    userProfile: UserProfile | null
  ): SafetyValidationResult {
    const warnings: string[] = [];
    let shouldBlock = false;
    let blockReason: string | undefined;

    // If no user profile, assume safe (conservative approach: no data = no restriction)
    if (!userProfile) {
      return {
        isSafe: true,
        warnings: [],
        shouldBlock: false
      };
    }

    // Get risks from nutrition intelligence engine
    const risks = NutritionIntelligenceEngine.detectRisks(nutritionData, userProfile);

    // Check for avoid-level risks
    const avoidRisks = risks.filter(r => r.level === RiskLevel.AVOID && r.appliesToProfile);
    if (avoidRisks.length > 0) {
      shouldBlock = true;
      blockReason = `Contains ${avoidRisks.map(r => r.type.toLowerCase()).join(', ')}`;
      warnings.push(...avoidRisks.map(r => r.description));
    }

    // Check for high-level risks (block in conservative mode)
    const highRisks = risks.filter(r => r.level === RiskLevel.HIGH && r.appliesToProfile);
    if (highRisks.length > 0) {
      shouldBlock = true;
      blockReason = blockReason || `High in ${highRisks.map(r => r.type.toLowerCase()).join(', ')}`;
      warnings.push(...highRisks.map(r => r.description));
    }

    // Check for allergens
    const allergenRisks = this.checkAllergens(nutritionData, userProfile);
    if (allergenRisks.length > 0) {
      shouldBlock = true;
      blockReason = blockReason || allergenRisks.join(', ');
      warnings.push(...allergenRisks);
    }

    // Check for dietary restrictions
    const restrictionWarnings = this.checkDietaryRestrictions(nutritionData, userProfile);
    warnings.push(...restrictionWarnings);

    // Check for custom sensitivities
    const customWarnings = this.checkCustomSensitivities(nutritionData, userProfile);
    warnings.push(...customWarnings);

    // If there are custom warnings and we're being conservative, block
    if (customWarnings.length > 0) {
      shouldBlock = true;
      blockReason = blockReason || 'Matches custom sensitivities';
    }

    return {
      isSafe: !shouldBlock,
      warnings,
      shouldBlock,
      blockReason
    };
  }

  /**
   * Check for allergens
   */
  private static checkAllergens(
    nutritionData: NormalizedNutritionData,
    userProfile: UserProfile
  ): string[] {
    const warnings: string[] = [];

    if (!userProfile.healthSensitivities) {
      return warnings;
    }

    const foodName = nutritionData.name.toLowerCase();

    // Check for nut allergy
    const hasNutAllergy = userProfile.healthSensitivities.some(
      s => s.restriction === DietaryRestriction.NUT_ALLERGY
    );

    if (hasNutAllergy) {
      const nuts = ['almond', 'cashew', 'walnut', 'pecan', 'pistachio', 'hazelnut', 'macadamia', 'brazil nut'];
      const isNut = nuts.some(nut => foodName.includes(nut));

      if (isNut) {
        warnings.push('Contains nuts - you have a nut allergy');
      }
    }

    // Check for fruit allergy
    const hasFruitAllergy = userProfile.healthSensitivities.some(
      s => s.restriction === DietaryRestriction.FRUIT_ALLERGY
    );

    if (hasFruitAllergy) {
      warnings.push('This is a fruit - you have a fruit allergy');
    }

    return warnings;
  }

  /**
   * Check for dietary restrictions
   */
  private static checkDietaryRestrictions(
    nutritionData: NormalizedNutritionData,
    userProfile: UserProfile
  ): string[] {
    const warnings: string[] = [];

    if (!userProfile.healthSensitivities) {
      return warnings;
    }

    const { sugar, potassium } = nutritionData;

    // Check sugar restrictions
    const hasDiabetes = userProfile.healthSensitivities.some(
      s => s.restriction === DietaryRestriction.DIABETES
    );
    const hasSugarSensitivity = userProfile.healthSensitivities.some(
      s => s.restriction === DietaryRestriction.SUGAR_SENSITIVE
    );

    if (hasDiabetes && sugar > 10) {
      warnings.push(`High sugar content (${sugar.toFixed(1)}g per 100g) - may not be suitable for diabetes`);
    } else if (hasSugarSensitivity && sugar > 15) {
      warnings.push(`Moderate to high sugar content (${sugar.toFixed(1)}g per 100g) - you are sugar sensitive`);
    }

    // Check potassium restrictions
    const hasKidneyDisease = userProfile.healthSensitivities.some(
      s => s.restriction === DietaryRestriction.KIDNEY_DISEASE
    );
    const hasPotassiumSensitivity = userProfile.healthSensitivities.some(
      s => s.restriction === DietaryRestriction.POTASSIUM_SENSITIVE
    );

    if (potassium) {
      if (hasKidneyDisease && potassium > 200) {
        warnings.push(`High potassium content (${potassium.toFixed(0)}mg per 100g) - may not be suitable for kidney disease`);
      } else if (hasPotassiumSensitivity && potassium > 300) {
        warnings.push(`Moderate to high potassium content (${potassium.toFixed(0)}mg per 100g) - you are potassium sensitive`);
      }
    }

    // Check acid reflux
    const hasAcidReflux = userProfile.healthSensitivities.some(
      s => s.restriction === DietaryRestriction.ACID_REFLUX
    );

    if (hasAcidReflux) {
      const acidicFoods = [
        'citrus', 'lemon', 'orange', 'grapefruit', 'lime',
        'tomato', 'pineapple', 'strawberry', 'cranberry'
      ];

      const foodName = nutritionData.name.toLowerCase();
      const isAcidic = acidicFoods.some(food => foodName.includes(food));

      if (isAcidic) {
        warnings.push('Acidic food - may trigger acid reflux symptoms');
      }
    }

    return warnings;
  }

  /**
   * Check for custom sensitivities
   */
  private static checkCustomSensitivities(
    nutritionData: NormalizedNutritionData,
    userProfile: UserProfile
  ): string[] {
    const warnings: string[] = [];

    if (!userProfile.customSensitivities || userProfile.customSensitivities.length === 0) {
      return warnings;
    }

    const foodName = nutritionData.name.toLowerCase();

    userProfile.customSensitivities.forEach(sensitivity => {
      const lowerSensitivity = sensitivity.toLowerCase();
      if (foodName.includes(lowerSensitivity)) {
        warnings.push(`Matches custom sensitivity: ${sensitivity}`);
      }
    });

    return warnings;
  }

  /**
   * Sort products by similarity to the original food
   */
  private static sortBySimilarity(
    original: NormalizedNutritionData,
    products: NormalizedNutritionData[]
  ): NormalizedNutritionData[] {
    return [...products].sort((a, b) => {
      const similarityA = this.calculateSimilarity(original, a);
      const similarityB = this.calculateSimilarity(original, b);
      return similarityB - similarityA; // Higher similarity first
    });
  }

  /**
   * Calculate similarity between two foods
   */
  private static calculateSimilarity(
    food1: NormalizedNutritionData,
    food2: NormalizedNutritionData
  ): number {
    let similarity = 0;

    // Calorie density similarity
    const calorieDiff = Math.abs(food1.calories - food2.calories);
    similarity += Math.max(0, 100 - calorieDiff);

    // Primary macronutrient similarity
    const summary1 = NutritionIntelligenceEngine.generateSummary(food1);
    const summary2 = NutritionIntelligenceEngine.generateSummary(food2);
    if (summary1.primaryMacronutrient === summary2.primaryMacronutrient) {
      similarity += 50;
    }

    // Fiber similarity
    const fiberDiff = Math.abs((food1.fiber || 0) - (food2.fiber || 0));
    similarity += Math.max(0, 50 - fiberDiff * 5);

    return similarity;
  }

  /**
   * Generate reason for alternative
   */
  private static generateAlternativeReason(
    original: NormalizedNutritionData,
    alternative: NormalizedNutritionData,
    userProfile: UserProfile
  ): string {
    const originalRisks = NutritionIntelligenceEngine.detectRisks(original, userProfile);
    const alternativeRisks = NutritionIntelligenceEngine.detectRisks(alternative, userProfile);

    const originalAvoidRisks = originalRisks.filter(r => r.level === RiskLevel.AVOID);
    const alternativeAvoidRisks = alternativeRisks.filter(r => r.level === RiskLevel.AVOID);

    if (originalAvoidRisks.length > 0 && alternativeAvoidRisks.length === 0) {
      return `Does not contain ${originalAvoidRisks.map(r => r.type.toLowerCase()).join(', ')}`;
    }

    const originalHighRisks = originalRisks.filter(r => r.level === RiskLevel.HIGH);
    const alternativeHighRisks = alternativeRisks.filter(r => r.level === RiskLevel.HIGH);

    if (originalHighRisks.length > 0 && alternativeHighRisks.length === 0) {
      return `Lower in ${originalHighRisks.map(r => r.type.toLowerCase()).join(', ')}`;
    }

    return 'Safer alternative based on your profile';
  }

  /**
   * Generate comparison between foods
   */
  private static generateComparison(
    original: NormalizedNutritionData,
    alternative: NormalizedNutritionData
  ): string {
    const comparisons: string[] = [];

    // Compare calories
    const calorieDiff = alternative.calories - original.calories;
    if (Math.abs(calorieDiff) > 20) {
      comparisons.push(
        calorieDiff < 0
          ? `${Math.abs(calorieDiff)} fewer calories per 100g`
          : `${calorieDiff} more calories per 100g`
      );
    }

    // Compare sugar
    const sugarDiff = alternative.sugar - original.sugar;
    if (Math.abs(sugarDiff) > 2) {
      comparisons.push(
        sugarDiff < 0
          ? `${Math.abs(sugarDiff).toFixed(1)}g less sugar per 100g`
          : `${sugarDiff.toFixed(1)}g more sugar per 100g`
      );
    }

    // Compare fiber
    const fiberDiff = (alternative.fiber || 0) - (original.fiber || 0);
    if (Math.abs(fiberDiff) > 1) {
      comparisons.push(
        fiberDiff > 0
          ? `${fiberDiff.toFixed(1)}g more fiber per 100g`
          : `${Math.abs(fiberDiff).toFixed(1)}g less fiber per 100g`
      );
    }

    if (comparisons.length === 0) {
      return 'Similar nutritional profile';
    }

    return comparisons.join(', ');
  }

  /**
   * Get comprehensive safety report
   * @param nutritionData - Normalized nutrition data
   * @param userProfile - User profile
   * @returns Complete safety report
   */
  static getSafetyReport(
    nutritionData: NormalizedNutritionData,
    userProfile: UserProfile | null
  ): SafetyValidationResult & {
    risks: DietaryRisk[];
    recommendation: string;
  } {
    const validation = this.validateSafety(nutritionData, userProfile);
    const risks = NutritionIntelligenceEngine.detectRisks(nutritionData, userProfile);
    const recommendation = NutritionIntelligenceEngine.generateRecommendation(
      nutritionData,
      userProfile,
      { conservativeMode: true }
    );

    return {
      ...validation,
      risks,
      recommendation
    };
  }
}
