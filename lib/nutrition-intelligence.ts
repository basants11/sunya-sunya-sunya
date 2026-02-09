/**
 * Nutrition Intelligence Engine
 * 
 * Lightweight rule-based intelligence for nutrition analysis.
 * Provides summaries, safe consumption ranges, and dietary risk detection.
 * Never provides medical advice or diagnoses.
 */

import type {
  NormalizedNutritionData
} from '@/types/nutrition';
import type {
  DietaryRisk,
  NutritionIntelligenceResult,
  NutritionSummary,
  RecommendationOptions,
  SafeConsumptionRange
} from '@/types/nutrition-intelligence';
import {
  RiskLevel
} from '@/types/nutrition-intelligence';
import type {
  ActivityLevel,
  UserProfile
} from '@/types/user-profile';
import {
  DietaryRestriction
} from '@/types/user-profile';

/**
 * Nutrition Intelligence Engine
 * 
 * Uses rule-based logic to analyze nutrition data and provide
 * personalized insights without using AI APIs.
 */
export class NutritionIntelligenceEngine {
  /**
   * Daily calorie needs multipliers based on activity level
   * Base: BMR (Basal Metabolic Rate) × multiplier
   */
  private static readonly ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very-active': 1.9
  };

  /**
   * Sugar thresholds (grams per day) based on diabetes sensitivity
   */
  private static readonly SUGAR_THRESHOLDS = {
    normal: 50, // WHO recommendation
    sugarSensitive: 25, // Half of normal
    diabetes: 15 // Very strict limit
  };

  /**
   * Potassium thresholds (mg per day) for kidney disease
   */
  private static readonly POTASSIUM_THRESHOLDS = {
    normal: 4700, // Normal daily requirement
    potassiumSensitive: 2000, // Reduced for sensitivity
    kidneyDisease: 1500 // Strict limit for kidney disease
  };

  /**
   * Acidic food thresholds (pH scale)
   * Lower pH = more acidic
   */
  private static readonly ACIDIC_THRESHOLDS = {
    normal: 4.0, // Moderately acidic
    acidReflux: 4.5, // Less acidic for reflux
    severeReflux: 5.0 // Very mild acidity
  };

  /**
   * Fiber recommendations (grams per day)
   */
  private static readonly FIBER_RECOMMENDATIONS = {
    lowFiber: 10, // For low fiber diet
    normal: 25, // Normal recommendation
    highFiber: 35 // For high fiber diet
  };

  /**
   * Calorie density thresholds (kcal per 100g)
   */
  private static readonly CALORIE_DENSITY = {
    low: 100,
    moderate: 250,
    high: 400
  };

  /**
   * Generate a clear, concise nutrition summary
   * @param nutritionData - Normalized nutrition data
   * @returns Nutrition summary
   */
  static generateSummary(nutritionData: NormalizedNutritionData): NutritionSummary {
    const { calories, protein, carbs, fat, fiber, sugar, vitaminC, potassium } = nutritionData;

    // Determine calorie density
    let calorieDensity: 'low' | 'moderate' | 'high';
    if (calories < this.CALORIE_DENSITY.low) {
      calorieDensity = 'low';
    } else if (calories < this.CALORIE_DENSITY.moderate) {
      calorieDensity = 'moderate';
    } else {
      calorieDensity = 'high';
    }

    // Determine primary macronutrient
    const totalMacros = protein + carbs + fat;
    let primaryMacronutrient: 'protein' | 'carbs' | 'fat' | 'balanced';
    if (totalMacros === 0) {
      primaryMacronutrient = 'balanced';
    } else {
      const proteinRatio = protein / totalMacros;
      const carbsRatio = carbs / totalMacros;
      const fatRatio = fat / totalMacros;

      const maxRatio = Math.max(proteinRatio, carbsRatio, fatRatio);
      if (maxRatio < 0.45) {
        primaryMacronutrient = 'balanced';
      } else if (proteinRatio === maxRatio) {
        primaryMacronutrient = 'protein';
      } else if (carbsRatio === maxRatio) {
        primaryMacronutrient = 'carbs';
      } else {
        primaryMacronutrient = 'fat';
      }
    }

    // Generate highlights
    const highlights: string[] = [];

    if (fiber >= 5) {
      highlights.push(`High in fiber (${fiber.toFixed(1)}g per 100g)`);
    } else if (fiber >= 2) {
      highlights.push(`Good source of fiber (${fiber.toFixed(1)}g per 100g)`);
    }

    if (vitaminC && vitaminC >= 20) {
      highlights.push(`Rich in vitamin C (${vitaminC.toFixed(1)}mg per 100g)`);
    }

    if (potassium && potassium >= 300) {
      highlights.push(`Good potassium source (${potassium.toFixed(0)}mg per 100g)`);
    }

    if (protein >= 10) {
      highlights.push(`High in protein (${protein.toFixed(1)}g per 100g)`);
    }

    if (sugar <= 5) {
      highlights.push(`Low in sugar (${sugar.toFixed(1)}g per 100g)`);
    }

    if (highlights.length === 0) {
      highlights.push(`Contains ${calories} calories per 100g`);
    }

    // Generate description
    const description = this.generateDescription(
      nutritionData,
      calorieDensity,
      primaryMacronutrient
    );

    return {
      description,
      highlights,
      calorieDensity,
      primaryMacronutrient
    };
  }

  /**
   * Generate a description for the nutrition summary
   */
  private static generateDescription(
    nutritionData: NormalizedNutritionData,
    calorieDensity: 'low' | 'moderate' | 'high',
    primaryMacronutrient: 'protein' | 'carbs' | 'fat' | 'balanced'
  ): string {
    const { calories, sugar, fiber } = nutritionData;

    let description = `${nutritionData.name} is a`;

    if (calorieDensity === 'low') {
      description += ' low-calorie';
    } else if (calorieDensity === 'moderate') {
      description += ' moderate-calorie';
    } else {
      description += ' calorie-dense';
    }

    if (primaryMacronutrient === 'protein') {
      description += ' protein-rich';
    } else if (primaryMacronutrient === 'carbs') {
      description += ' carbohydrate-rich';
    } else if (primaryMacronutrient === 'fat') {
      description += ' fat-rich';
    }

    description += ' food';

    if (sugar <= 5) {
      description += ' with low sugar content';
    } else if (sugar >= 15) {
      description += ' with high sugar content';
    }

    if (fiber >= 5) {
      description += ' and high fiber';
    }

    description += '.';

    return description;
  }

  /**
   * Calculate safe daily consumption range in grams
   * @param nutritionData - Normalized nutrition data
   * @param userProfile - User profile for personalization
   * @returns Safe consumption range
   */
  static calculateSafeRange(
    nutritionData: NormalizedNutritionData,
    userProfile: UserProfile | null
  ): SafeConsumptionRange {
    const { calories, sugar, potassium } = nutritionData;

    // Calculate daily calorie needs
    const dailyCalories = this.calculateDailyCalories(userProfile);

    // Calculate max grams based on calories (max 10% of daily calories)
    const maxCalorieGrams = Math.floor((dailyCalories * 0.1) / calories * 100);

    // Calculate max grams based on sugar
    const sugarThreshold = this.getSugarThreshold(userProfile);
    const maxSugarGrams = sugar > 0 ? Math.floor((sugarThreshold / sugar) * 100) : Infinity;

    // Calculate max grams based on potassium
    const potassiumThreshold = this.getPotassiumThreshold(userProfile);
    const maxPotassiumGrams = potassium && potassium > 0
      ? Math.floor((potassiumThreshold / potassium) * 100)
      : Infinity;

    // Determine the limiting factor
    let maxGrams = Math.min(maxCalorieGrams, maxSugarGrams, maxPotassiumGrams);
    let reason = 'Based on calorie limits';
    let isConservative = false;

    if (maxSugarGrams < maxCalorieGrams && maxSugarGrams < maxPotassiumGrams) {
      reason = 'Limited by sugar content';
      isConservative = true;
    } else if (maxPotassiumGrams < maxCalorieGrams && maxPotassiumGrams < maxSugarGrams) {
      reason = 'Limited by potassium content';
      isConservative = true;
    }

    // Ensure minimum and maximum reasonable limits
    maxGrams = Math.min(Math.max(maxGrams, 30), 200);

    // Recommended serving is typically 30-50g for dried fruits
    const recommendedGrams = Math.min(50, Math.floor(maxGrams * 0.5));

    // Minimum safe consumption (at least 10g)
    const minGrams = 10;

    return {
      minGrams,
      maxGrams,
      recommendedGrams,
      reason,
      isConservative
    };
  }

  /**
   * Calculate daily calorie needs based on user profile
   */
  private static calculateDailyCalories(userProfile: UserProfile | null): number {
    if (!userProfile || !userProfile.weight || !userProfile.age || !userProfile.height) {
      // Default to 2000 calories if profile incomplete
      return 2000;
    }

    // Mifflin-St Jeor Equation for BMR
    // For simplicity, using male formula (can be enhanced with gender)
    const bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5;

    // Apply activity multiplier
    const multiplier = userProfile.activityLevel
      ? this.ACTIVITY_MULTIPLIERS[userProfile.activityLevel]
      : this.ACTIVITY_MULTIPLIERS.sedentary;

    return Math.round(bmr * multiplier);
  }

  /**
   * Get sugar threshold based on user profile
   */
  private static getSugarThreshold(userProfile: UserProfile | null): number {
    if (!userProfile?.healthSensitivities) {
      return this.SUGAR_THRESHOLDS.normal;
    }

    const hasDiabetes = userProfile.healthSensitivities.some(
      s => s.restriction === DietaryRestriction.DIABETES
    );
    const hasSugarSensitivity = userProfile.healthSensitivities.some(
      s => s.restriction === DietaryRestriction.SUGAR_SENSITIVE
    );

    if (hasDiabetes) {
      return this.SUGAR_THRESHOLDS.diabetes;
    } else if (hasSugarSensitivity) {
      return this.SUGAR_THRESHOLDS.sugarSensitive;
    }

    return this.SUGAR_THRESHOLDS.normal;
  }

  /**
   * Get potassium threshold based on user profile
   */
  private static getPotassiumThreshold(userProfile: UserProfile | null): number {
    if (!userProfile?.healthSensitivities) {
      return this.POTASSIUM_THRESHOLDS.normal;
    }

    const hasKidneyDisease = userProfile.healthSensitivities.some(
      s => s.restriction === DietaryRestriction.KIDNEY_DISEASE
    );
    const hasPotassiumSensitivity = userProfile.healthSensitivities.some(
      s => s.restriction === DietaryRestriction.POTASSIUM_SENSITIVE
    );

    if (hasKidneyDisease) {
      return this.POTASSIUM_THRESHOLDS.kidneyDisease;
    } else if (hasPotassiumSensitivity) {
      return this.POTASSIUM_THRESHOLDS.potassiumSensitive;
    }

    return this.POTASSIUM_THRESHOLDS.normal;
  }

  /**
   * Detect dietary risks based on nutrition data and user profile
   * @param nutritionData - Normalized nutrition data
   * @param userProfile - User profile for personalization
   * @returns Array of detected dietary risks
   */
  static detectRisks(
    nutritionData: NormalizedNutritionData,
    userProfile: UserProfile | null
  ): DietaryRisk[] {
    const risks: DietaryRisk[] = [];

    // Check sugar risks
    const sugarRisk = this.detectSugarRisk(nutritionData, userProfile);
    if (sugarRisk) {
      risks.push(sugarRisk);
    }

    // Check potassium risks
    const potassiumRisk = this.detectPotassiumRisk(nutritionData, userProfile);
    if (potassiumRisk) {
      risks.push(potassiumRisk);
    }

    // Check acidity risks
    const acidityRisk = this.detectAcidityRisk(nutritionData, userProfile);
    if (acidityRisk) {
      risks.push(acidityRisk);
    }

    // Check allergen risks
    const allergenRisks = this.detectAllergenRisks(nutritionData, userProfile);
    risks.push(...allergenRisks);

    return risks;
  }

  /**
   * Detect sugar-related risks
   */
  private static detectSugarRisk(
    nutritionData: NormalizedNutritionData,
    userProfile: UserProfile | null
  ): DietaryRisk | null {
    const { sugar } = nutritionData;
    const threshold = this.getSugarThreshold(userProfile);

    // Calculate sugar per 100g relative to daily limit
    const sugarPercentage = (sugar / threshold) * 100;

    if (sugarPercentage < 10) {
      return null; // Low sugar, no risk
    }

    let level: RiskLevel;
    if (sugarPercentage >= 50) {
      level = RiskLevel.AVOID;
    } else if (sugarPercentage >= 30) {
      level = RiskLevel.HIGH;
    } else if (sugarPercentage >= 20) {
      level = RiskLevel.MODERATE;
    } else {
      level = RiskLevel.LOW;
    }

    const appliesToProfile = userProfile?.healthSensitivities?.some(
      s => s.restriction === DietaryRestriction.DIABETES ||
           s.restriction === DietaryRestriction.SUGAR_SENSITIVE
    ) ?? false;

    return {
      type: 'High Sugar',
      level,
      description: `This food contains ${sugar.toFixed(1)}g of sugar per 100g, which is ${sugarPercentage.toFixed(0)}% of the daily limit.`,
      cause: 'Sugar',
      value: sugar,
      threshold,
      unit: 'g',
      appliesToProfile
    };
  }

  /**
   * Detect potassium-related risks
   */
  private static detectPotassiumRisk(
    nutritionData: NormalizedNutritionData,
    userProfile: UserProfile | null
  ): DietaryRisk | null {
    const { potassium } = nutritionData;

    if (!potassium || potassium === 0) {
      return null;
    }

    const threshold = this.getPotassiumThreshold(userProfile);

    // Calculate potassium per 100g relative to daily limit
    const potassiumPercentage = (potassium / threshold) * 100;

    if (potassiumPercentage < 10) {
      return null; // Low potassium, no risk
    }

    let level: RiskLevel;
    if (potassiumPercentage >= 50) {
      level = RiskLevel.AVOID;
    } else if (potassiumPercentage >= 30) {
      level = RiskLevel.HIGH;
    } else if (potassiumPercentage >= 20) {
      level = RiskLevel.MODERATE;
    } else {
      level = RiskLevel.LOW;
    }

    const appliesToProfile = userProfile?.healthSensitivities?.some(
      s => s.restriction === DietaryRestriction.KIDNEY_DISEASE ||
           s.restriction === DietaryRestriction.POTASSIUM_SENSITIVE
    ) ?? false;

    return {
      type: 'High Potassium',
      level,
      description: `This food contains ${potassium.toFixed(0)}mg of potassium per 100g, which is ${potassiumPercentage.toFixed(0)}% of the daily limit.`,
      cause: 'Potassium',
      value: potassium,
      threshold,
      unit: 'mg',
      appliesToProfile
    };
  }

  /**
   * Detect acidity-related risks
   */
  private static detectAcidityRisk(
    nutritionData: NormalizedNutritionData,
    userProfile: UserProfile | null
  ): DietaryRisk | null {
    // Estimate acidity based on food name (simplified approach)
    // In a real implementation, this would use actual pH data
    const acidicFoods = [
      'citrus', 'lemon', 'orange', 'grapefruit', 'lime',
      'tomato', 'pineapple', 'strawberry', 'cranberry',
      'apple', 'peach', 'plum', 'cherry'
    ];

    const foodName = nutritionData.name.toLowerCase();
    const isAcidic = acidicFoods.some(food => foodName.includes(food));

    if (!isAcidic) {
      return null;
    }

    const hasAcidReflux = userProfile?.healthSensitivities?.some(
      s => s.restriction === DietaryRestriction.ACID_REFLUX
    ) ?? false;

    if (!hasAcidReflux) {
      return null;
    }

    // Estimate pH based on food type (simplified)
    let estimatedPH = 3.5; // Default for citrus
    if (foodName.includes('tomato')) {
      estimatedPH = 4.2;
    } else if (foodName.includes('strawberry') || foodName.includes('apple')) {
      estimatedPH = 3.8;
    }

    const threshold = this.ACIDIC_THRESHOLDS.acidReflux;

    let level: RiskLevel;
    if (estimatedPH < 3.5) {
      level = RiskLevel.HIGH;
    } else if (estimatedPH < 4.0) {
      level = RiskLevel.MODERATE;
    } else {
      level = RiskLevel.LOW;
    }

    return {
      type: 'Acidic Food',
      level,
      description: `This food is estimated to be acidic (pH ~${estimatedPH.toFixed(1)}), which may trigger acid reflux symptoms.`,
      cause: 'Acidity',
      value: estimatedPH,
      threshold,
      unit: 'pH',
      appliesToProfile: hasAcidReflux
    };
  }

  /**
   * Detect allergen-related risks
   */
  private static detectAllergenRisks(
    nutritionData: NormalizedNutritionData,
    userProfile: UserProfile | null
  ): DietaryRisk[] {
    const risks: DietaryRisk[] = [];

    if (!userProfile?.healthSensitivities) {
      return risks;
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
        risks.push({
          type: 'Nut Allergen',
          level: RiskLevel.AVOID,
          description: 'This food contains nuts, which you are allergic to.',
          cause: 'Nuts',
          value: 1,
          threshold: 0,
          unit: 'presence',
          appliesToProfile: true
        });
      }
    }

    // Check for fruit allergy
    const hasFruitAllergy = userProfile.healthSensitivities.some(
      s => s.restriction === DietaryRestriction.FRUIT_ALLERGY
    );

    if (hasFruitAllergy) {
      risks.push({
        type: 'Fruit Allergen',
        level: RiskLevel.AVOID,
        description: 'This food is a fruit, which you are allergic to.',
        cause: 'Fruit',
        value: 1,
        threshold: 0,
        unit: 'presence',
        appliesToProfile: true
      });
    }

    return risks;
  }

  /**
   * Assess risk level for a given risk
   * @param risk - Dietary risk to assess
   * @returns Risk level
   */
  static assessRiskLevel(risk: DietaryRisk): RiskLevel {
    return risk.level;
  }

  /**
   * Generate a safe recommendation based on nutrition data and user profile
   * @param nutritionData - Normalized nutrition data
   * @param userProfile - User profile for personalization
   * @param options - Recommendation options
   * @returns Recommendation string
   */
  static generateRecommendation(
    nutritionData: NormalizedNutritionData,
    userProfile: UserProfile | null,
    options: RecommendationOptions = {}
  ): string {
    const {
      includeDetails = true,
      maxRisks = 3,
      conservativeMode = false
    } = options;

    const risks = this.detectRisks(nutritionData, userProfile);
    const safeRange = this.calculateSafeRange(nutritionData, userProfile);

    // Check for avoid-level risks
    const avoidRisks = risks.filter(r => r.level === RiskLevel.AVOID);
    if (avoidRisks.length > 0) {
      return this.generateAvoidRecommendation(avoidRisks, nutritionData);
    }

    // Check for high-level risks
    const highRisks = risks.filter(r => r.level === RiskLevel.HIGH);
    if (highRisks.length > 0 && conservativeMode) {
      return this.generateCautionRecommendation(highRisks, nutritionData, safeRange);
    }

    // Generate standard recommendation
    return this.generateStandardRecommendation(
      nutritionData,
      safeRange,
      risks.slice(0, maxRisks),
      includeDetails
    );
  }

  /**
   * Generate recommendation for foods to avoid
   */
  private static generateAvoidRecommendation(
    risks: DietaryRisk[],
    nutritionData: NormalizedNutritionData
  ): string {
    const riskTypes = risks.map(r => r.type).join(', ');
    return `Avoid ${nutritionData.name}. This food contains ${riskTypes.toLowerCase()}, which may not be suitable for your dietary needs. Please consult with a healthcare professional for personalized advice.`;
  }

  /**
   * Generate caution recommendation
   */
  private static generateCautionRecommendation(
    risks: DietaryRisk[],
    nutritionData: NormalizedNutritionData,
    safeRange: SafeConsumptionRange
  ): string {
    const riskTypes = risks.map(r => r.type).join(', ');
    return `Exercise caution with ${nutritionData.name}. Due to ${riskTypes.toLowerCase()}, limit consumption to ${safeRange.maxGrams}g per day. ${safeRange.reason}.`;
  }

  /**
   * Generate standard recommendation
   */
  private static generateStandardRecommendation(
    nutritionData: NormalizedNutritionData,
    safeRange: SafeConsumptionRange,
    risks: DietaryRisk[],
    includeDetails: boolean
  ): string {
    let recommendation = `${nutritionData.name} can be enjoyed as part of a balanced diet.`;

    if (includeDetails) {
      recommendation += ` A serving of ${safeRange.recommendedGrams}g is recommended, with a maximum of ${safeRange.maxGrams}g per day.`;

      if (risks.length > 0) {
        const riskDescriptions = risks
          .filter(r => r.appliesToProfile)
          .map(r => r.description)
          .join(' ');
        if (riskDescriptions) {
          recommendation += ` Note: ${riskDescriptions}`;
        }
      }
    }

    return recommendation;
  }

  /**
   * Run complete nutrition intelligence analysis
   * @param nutritionData - Normalized nutrition data
   * @param userProfile - User profile for personalization
   * @param options - Analysis options
   * @returns Complete nutrition intelligence result
   */
  static analyze(
    nutritionData: NormalizedNutritionData,
    userProfile: UserProfile | null,
    options: RecommendationOptions = {}
  ): NutritionIntelligenceResult {
    const summary = this.generateSummary(nutritionData);
    const safeRange = this.calculateSafeRange(nutritionData, userProfile);
    const risks = this.detectRisks(nutritionData, userProfile);
    const recommendation = this.generateRecommendation(nutritionData, userProfile, options);

    // Determine if food is safe
    const avoidRisks = risks.filter(r => r.level === RiskLevel.AVOID && r.appliesToProfile);
    const isSafe = avoidRisks.length === 0;

    // Generate warnings
    const warnings: string[] = [];
    risks.forEach(risk => {
      if (risk.appliesToProfile && risk.level !== RiskLevel.LOW) {
        warnings.push(risk.description);
      }
    });

    return {
      summary,
      safeRange,
      risks,
      recommendation,
      isSafe,
      warnings,
      analyzedAt: Date.now()
    };
  }
}
