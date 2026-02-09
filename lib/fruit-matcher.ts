/**
 * Fruit Matcher Engine
 * 
 * Matches searched fruits to available products and suggests nutritionally similar alternatives.
 * Uses a combination of name matching and nutritional similarity algorithms.
 */

import {
  AlternativeSuggestion,
  AvailabilityStatus,
  FruitMatchResult,
  FruitSynonym,
  HighlightPillResult,
  MatchOptions,
  MatchType,
  NutritionalSimilarityScore,
  ProductWithNutrition
} from '../types/fruit-matcher';
import { DietaryRestriction, UserProfile } from '../types/user-profile';
import { foodDatabase, NutritionPer100g } from './nutrition-data';
import { Product } from './products';

/**
 * Fruit synonym mappings for matching variations
 */
const FRUIT_SYNONYMS: FruitSynonym[] = [
  {
    baseName: 'kiwi',
    synonyms: ['kiwifruit', 'chinese gooseberry', 'kiwi fruit']
  },
  {
    baseName: 'blueberry',
    synonyms: ['blueberries', 'wild blueberry', 'highbush blueberry']
  },
  {
    baseName: 'pineapple',
    synonyms: ['ananas', 'pine apple']
  },
  {
    baseName: 'papaya',
    synonyms: ['pawpaw', 'papaw', 'paw-paw']
  },
  {
    baseName: 'apple',
    synonyms: ['apples', 'malus', 'fruit apple']
  },
  {
    baseName: 'banana',
    synonyms: ['bananas', 'plantain']
  },
  {
    baseName: 'mango',
    synonyms: ['mangos', 'mangoes', 'king of fruits']
  },
  {
    baseName: 'strawberry',
    synonyms: ['strawberries', 'wild strawberry']
  }
];

/**
 * Default match options
 */
const DEFAULT_MATCH_OPTIONS: MatchOptions = {
  minSimilarityThreshold: 50,
  includeSynonyms: true,
  considerNutritionalSimilarity: true,
  maxAlternatives: 3,
  filterUnsafe: true
};

/**
 * Fruit Matcher class for matching fruits to products
 */
export class FruitMatcher {
  private products: Product[];
  private productsWithNutrition: Map<number, ProductWithNutrition>;
  private options: MatchOptions;

  /**
   * Create a new FruitMatcher instance
   * @param products - Available products to match against
   * @param options - Matching options
   */
  constructor(products: Product[], options: MatchOptions = {}) {
    this.products = products;
    this.options = { ...DEFAULT_MATCH_OPTIONS, ...options };
    this.productsWithNutrition = this.enrichProductsWithNutrition();
  }

  /**
   * Enrich products with nutrition data
   */
  private enrichProductsWithNutrition(): Map<number, ProductWithNutrition> {
    const enriched = new Map<number, ProductWithNutrition>();

    for (const product of this.products) {
      const nutrition = this.getNutritionForProduct(product);
      const availabilityStatus = this.getAvailabilityStatus(product);

      enriched.set(product.id, {
        ...product,
        nutrition,
        availabilityStatus
      });
    }

    return enriched;
  }

  /**
   * Get nutrition data for a product
   */
  private getNutritionForProduct(product: Product): NutritionPer100g {
    // Extract fruit name from product name (e.g., "Dried Kiwi" -> "kiwi")
    const fruitName = product.name
      .toLowerCase()
      .replace('dried ', '')
      .trim();

    // Find matching nutrition data
    const nutritionData = foodDatabase.find(
      food => food.name.toLowerCase().includes(fruitName) && food.type === 'dehydrated'
    );

    return nutritionData?.nutrition || this.getDefaultNutrition();
  }

  /**
   * Get default nutrition data when not found
   */
  private getDefaultNutrition(): NutritionPer100g {
    return {
      calories: 300,
      protein: 3,
      carbs: 70,
      fiber: 10,
      fat: 1,
      vitaminC: 50,
      potassium: 500,
      antioxidants: 2000,
      magnesium: 50,
      vitaminB6: 0.3
    };
  }

  /**
   * Get availability status for a product
   */
  private getAvailabilityStatus(product: Product): AvailabilityStatus {
    // In a real application, this would check inventory
    // For now, we'll use badge as a proxy
    if (product.badge === 'Limited Seasonal') {
      return AvailabilityStatus.LIMITED;
    }
    return AvailabilityStatus.IN_STOCK;
  }

  /**
   * Match searched fruit to products
   * @param searchedFruit - The fruit name to search for
   * @param availableProducts - Available products to match against
   * @returns Match result with product and similarity score
   */
  matchFruitToProduct(
    searchedFruit: string,
    availableProducts: Product[] = this.products
  ): FruitMatchResult {
    const normalizedSearch = searchedFruit.toLowerCase().trim();

    // Try exact match first
    const exactMatch = this.findExactMatch(searchedFruit, availableProducts);
    if (exactMatch) {
      return {
        product: exactMatch,
        matchType: MatchType.EXACT,
        similarityScore: 100,
        isExactMatch: true,
        availabilityStatus: this.productsWithNutrition.get(exactMatch.id)?.availabilityStatus || AvailabilityStatus.IN_STOCK,
        searchedFruit,
        matchedFruit: exactMatch.name,
        isAlternative: false,
        reason: 'Exact name match found'
      };
    }

    // Try synonym match
    if (this.options.includeSynonyms) {
      const synonymMatch = this.findSynonymMatch(searchedFruit, availableProducts);
      if (synonymMatch) {
        return {
          product: synonymMatch,
          matchType: MatchType.SYNONYM,
          similarityScore: 95,
          isExactMatch: false,
          availabilityStatus: this.productsWithNutrition.get(synonymMatch.id)?.availabilityStatus || AvailabilityStatus.IN_STOCK,
          searchedFruit,
          matchedFruit: synonymMatch.name,
          isAlternative: false,
          reason: 'Synonym match found'
        };
      }
    }

    // Try partial match
    const partialMatch = this.findPartialMatch(searchedFruit, availableProducts);
    if (partialMatch) {
      return {
        product: partialMatch,
        matchType: MatchType.PARTIAL,
        similarityScore: 80,
        isExactMatch: false,
        availabilityStatus: this.productsWithNutrition.get(partialMatch.id)?.availabilityStatus || AvailabilityStatus.IN_STOCK,
        searchedFruit,
        matchedFruit: partialMatch.name,
        isAlternative: false,
        reason: 'Partial name match found'
      };
    }

    // No match found - return empty result
    return {
      matchType: MatchType.NONE,
      similarityScore: 0,
      isExactMatch: false,
      availabilityStatus: AvailabilityStatus.OUT_OF_STOCK,
      searchedFruit,
      isAlternative: false,
      reason: 'No match found'
    };
  }

  /**
   * Find exact product match
   * @param searchedFruit - The fruit name to search for
   * @param availableProducts - Available products to search
   * @returns Exact match product or undefined
   */
  findExactMatch(searchedFruit: string, availableProducts: Product[] = this.products): Product | undefined {
    const normalizedSearch = searchedFruit.toLowerCase().trim();

    return availableProducts.find(product => {
      const normalizedName = product.name.toLowerCase().trim();
      return normalizedName === normalizedSearch;
    });
  }

  /**
   * Find synonym match
   * @param searchedFruit - The fruit name to search for
   * @param availableProducts - Available products to search
   * @returns Synonym match product or undefined
   */
  private findSynonymMatch(searchedFruit: string, availableProducts: Product[] = this.products): Product | undefined {
    const normalizedSearch = searchedFruit.toLowerCase().trim();

    for (const synonym of FRUIT_SYNONYMS) {
      // Check if searched fruit is a synonym
      if (synonym.synonyms.some(s => s.toLowerCase() === normalizedSearch)) {
        // Find product with base name
        return availableProducts.find(product =>
          product.name.toLowerCase().includes(synonym.baseName)
        );
      }

      // Check if product name is a synonym of searched fruit
      if (synonym.baseName === normalizedSearch) {
        return availableProducts.find(product =>
          synonym.synonyms.some(s => product.name.toLowerCase().includes(s))
        );
      }
    }

    return undefined;
  }

  /**
   * Find partial match
   * @param searchedFruit - The fruit name to search for
   * @param availableProducts - Available products to search
   * @returns Partial match product or undefined
   */
  private findPartialMatch(searchedFruit: string, availableProducts: Product[] = this.products): Product | undefined {
    const normalizedSearch = searchedFruit.toLowerCase().trim();

    return availableProducts.find(product => {
      const normalizedName = product.name.toLowerCase().trim();
      return normalizedName.includes(normalizedSearch) || normalizedSearch.includes(normalizedName);
    });
  }

  /**
   * Find nutritionally similar fruits
   * @param searchedFruit - The fruit name to search for
   * @param availableProducts - Available products to search
   * @returns Array of similar fruits with similarity scores
   */
  findSimilarFruits(
    searchedFruit: string,
    availableProducts: Product[] = this.products
  ): FruitMatchResult[] {
    const results: FruitMatchResult[] = [];

    // Get nutrition data for searched fruit
    const searchedNutrition = this.getNutritionForSearchedFruit(searchedFruit);
    if (!searchedNutrition) {
      return results;
    }

    // Calculate similarity for each product
    for (const product of availableProducts) {
      const productWithNutrition = this.productsWithNutrition.get(product.id);
      if (!productWithNutrition) continue;

      const similarity = this.calculateNutritionalSimilarity(
        searchedNutrition,
        productWithNutrition.nutrition
      );

      if (similarity.overallScore >= (this.options.minSimilarityThreshold || 50)) {
        results.push({
          product,
          matchType: MatchType.SIMILAR,
          similarityScore: similarity.overallScore,
          isExactMatch: false,
          availabilityStatus: productWithNutrition.availabilityStatus,
          searchedFruit,
          matchedFruit: product.name,
          nutritionalSimilarity: similarity,
          isAlternative: true,
          reason: `Nutritionally similar (${similarity.overallScore}% match)`
        });
      }
    }

    // Sort by similarity score (descending)
    return results.sort((a, b) => b.similarityScore - a.similarityScore);
  }

  /**
   * Get nutrition data for searched fruit
   */
  private getNutritionForSearchedFruit(searchedFruit: string): NutritionPer100g | null {
    const normalizedSearch = searchedFruit.toLowerCase().trim();

    // Try to find in food database
    const foodItem = foodDatabase.find(food => {
      const normalizedName = food.name.toLowerCase();
      return normalizedName.includes(normalizedSearch) || normalizedSearch.includes(normalizedName);
    });

    return foodItem?.nutrition || null;
  }

  /**
   * Calculate nutritional similarity between two fruits
   * @param fruit1 - First fruit nutrition data
   * @param fruit2 - Second fruit nutrition data
   * @returns Similarity score (0-100) with breakdown
   */
  calculateNutritionalSimilarity(
    fruit1: NutritionPer100g,
    fruit2: NutritionPer100g
  ): NutritionalSimilarityScore {
    // Weight factors for different nutrients
    const factors = {
      calories: 0.25,
      sugar: 0.25,
      fiber: 0.25,
      vitamins: 0.25
    };

    // Calculate individual similarity scores
    const caloriesScore = this.calculateSimilarityScore(fruit1.calories, fruit2.calories, 0, 500);
    const sugarScore = this.calculateSimilarityScore(fruit1.carbs, fruit2.carbs, 0, 100);
    const fiberScore = this.calculateSimilarityScore(fruit1.fiber, fruit2.fiber, 0, 20);
    const vitaminsScore = this.calculateVitaminsSimilarity(fruit1, fruit2);

    // Calculate weighted overall score
    const overallScore = Math.round(
      caloriesScore * factors.calories +
      sugarScore * factors.sugar +
      fiberScore * factors.fiber +
      vitaminsScore * factors.vitamins
    );

    return {
      overallScore,
      caloriesScore,
      sugarScore,
      fiberScore,
      vitaminsScore,
      factors
    };
  }

  /**
   * Calculate similarity score for a single nutrient
   */
  private calculateSimilarityScore(
    value1: number,
    value2: number,
    min: number,
    max: number
  ): number {
    const range = max - min;
    const diff = Math.abs(value1 - value2);
    const similarity = Math.max(0, 100 - (diff / range) * 100);
    return Math.round(similarity);
  }

  /**
   * Calculate vitamins similarity score
   */
  private calculateVitaminsSimilarity(
    fruit1: NutritionPer100g,
    fruit2: NutritionPer100g
  ): number {
    const vitaminCScore = this.calculateSimilarityScore(fruit1.vitaminC, fruit2.vitaminC, 0, 500);
    const potassiumScore = this.calculateSimilarityScore(fruit1.potassium, fruit2.potassium, 0, 2000);
    const magnesiumScore = this.calculateSimilarityScore(fruit1.magnesium, fruit2.magnesium, 0, 500);
    const vitaminB6Score = this.calculateSimilarityScore(fruit1.vitaminB6, fruit2.vitaminB6, 0, 2);

    return Math.round((vitaminCScore + potassiumScore + magnesiumScore + vitaminB6Score) / 4);
  }

  /**
   * Get best alternative suggestion
   * @param searchedFruit - The fruit name to search for
   * @param availableProducts - Available products to search
   * @param userProfile - User profile for safety considerations
   * @returns Best alternative suggestion or undefined
   */
  getBestAlternative(
    searchedFruit: string,
    availableProducts: Product[] = this.products,
    userProfile?: UserProfile
  ): AlternativeSuggestion | undefined {
    // Find similar fruits
    const similarFruits = this.findSimilarFruits(searchedFruit, availableProducts);

    if (similarFruits.length === 0) {
      return undefined;
    }

    // Filter out unsafe items if option is enabled
    let candidates = similarFruits;
    if (this.options.filterUnsafe && userProfile) {
      candidates = similarFruits.filter(result => {
        const productWithNutrition = this.productsWithNutrition.get(result.product!.id);
        return this.isSafeForUser(productWithNutrition!, userProfile);
      });
    }

    if (candidates.length === 0) {
      return undefined;
    }

    // Get the best match
    const bestMatch = candidates[0];
    const productWithNutrition = this.productsWithNutrition.get(bestMatch.product!.id)!;

    // Check for safety warnings
    const safetyWarnings = userProfile
      ? this.getSafetyWarnings(productWithNutrition, userProfile)
      : [];

    return {
      product: bestMatch.product!,
      similarityScore: bestMatch.similarityScore,
      nutritionalSimilarity: bestMatch.nutritionalSimilarity!,
      reason: bestMatch.reason || 'Nutritionally similar alternative',
      isSafe: safetyWarnings.length === 0,
      safetyWarnings: safetyWarnings.length > 0 ? safetyWarnings : undefined,
      matchType: bestMatch.matchType
    };
  }

  /**
   * Check if a product is safe for a user
   */
  private isSafeForUser(product: ProductWithNutrition, userProfile: UserProfile): boolean {
    if (!userProfile.healthSensitivities || userProfile.healthSensitivities.length === 0) {
      return true;
    }

    const warnings = this.getSafetyWarnings(product, userProfile);
    return warnings.length === 0;
  }

  /**
   * Get safety warnings for a product based on user profile
   */
  private getSafetyWarnings(product: ProductWithNutrition, userProfile: UserProfile): string[] {
    const warnings: string[] = [];

    if (!userProfile.healthSensitivities) {
      return warnings;
    }

    for (const sensitivity of userProfile.healthSensitivities) {
      const warning = this.checkSensitivity(product, sensitivity);
      if (warning) {
        warnings.push(warning);
      }
    }

    return warnings;
  }

  /**
   * Check a specific sensitivity against a product
   */
  private checkSensitivity(
    product: ProductWithNutrition,
    sensitivity: { restriction: DietaryRestriction; severity?: string }
  ): string | null {
    const nutrition = product.nutrition;

    switch (sensitivity.restriction) {
      case DietaryRestriction.DIABETES:
        if (nutrition.carbs > 50) {
          return 'High carbohydrate content - may affect blood sugar';
        }
        break;

      case DietaryRestriction.SUGAR_SENSITIVE:
        if (nutrition.carbs > 40) {
          return 'High sugar content';
        }
        break;

      case DietaryRestriction.POTASSIUM_SENSITIVE:
        if (nutrition.potassium > 1000) {
          return 'High potassium content';
        }
        break;

      case DietaryRestriction.LOW_FIBER:
        if (nutrition.fiber > 5) {
          return 'High fiber content';
        }
        break;

      case DietaryRestriction.HIGH_FIBER:
        if (nutrition.fiber < 5) {
          return 'Low fiber content';
        }
        break;

      case DietaryRestriction.LOW_PROTEIN:
        if (nutrition.protein > 5) {
          return 'High protein content';
        }
        break;

      case DietaryRestriction.HIGH_PROTEIN:
        if (nutrition.protein < 2) {
          return 'Low protein content';
        }
        break;

      case DietaryRestriction.FRUIT_ALLERGY:
        // Check if product name contains common allergen fruits
        const allergenFruits = ['kiwi', 'banana', 'strawberry'];
        if (allergenFruits.some(fruit => product.name.toLowerCase().includes(fruit))) {
          return 'Potential allergen - contains fruit';
        }
        break;

      default:
        break;
    }

    return null;
  }

  /**
   * Highlight matching pill
   * @param fruitName - The fruit name to search for
   * @returns Pill ID to highlight or undefined
   */
  highlightMatchingPill(fruitName: string): HighlightPillResult {
    const matchResult = this.matchFruitToProduct(fruitName);

    if (matchResult.product && matchResult.matchType !== MatchType.NONE) {
      return {
        pillId: matchResult.product.id,
        found: true,
        matchType: matchResult.matchType
      };
    }

    return {
      found: false,
      matchType: MatchType.NONE
    };
  }

  /**
   * Get all available products with nutrition data
   */
  getProductsWithNutrition(): ProductWithNutrition[] {
    return Array.from(this.productsWithNutrition.values());
  }

  /**
   * Update match options
   */
  updateOptions(options: Partial<MatchOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

/**
 * Create a default fruit matcher instance
 */
export function createFruitMatcher(products: Product[]): FruitMatcher {
  return new FruitMatcher(products);
}

/**
 * Quick match function for simple use cases
 */
export function matchFruit(
  searchedFruit: string,
  products: Product[]
): FruitMatchResult {
  const matcher = new FruitMatcher(products);
  return matcher.matchFruitToProduct(searchedFruit);
}

/**
 * Quick alternative suggestion function
 */
export function suggestAlternative(
  searchedFruit: string,
  products: Product[],
  userProfile?: UserProfile
): AlternativeSuggestion | undefined {
  const matcher = new FruitMatcher(products);
  return matcher.getBestAlternative(searchedFruit, products, userProfile);
}
