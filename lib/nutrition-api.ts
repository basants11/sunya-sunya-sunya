/**
 * Nutrition API Integration Layer
 *
 * This module provides a unified interface for fetching nutrition data from
 * multiple public APIs (OpenFoodFacts, USDA) with normalization to per 100g basis.
 *
 * Features:
 * - Fetch from OpenFoodFacts API (free, no API key required)
 * - Fetch from USDA FoodData Central API (free public endpoint)
 * - Fallback mechanism between APIs
 * - Response normalization to standard format (per 100g)
 * - Error handling and retry logic
 * - Caching integration
 *
 * IMPORTANT: This module provides nutritional information only and does not
 * provide medical advice or diagnoses.
 */

import type {
  NormalizedNutritionData,
  NutritionAPIError,
  NutritionAPIOptions,
  NutritionSearchResult,
  OpenFoodFactsProduct,
  OpenFoodFactsResponse,
  USDAFoodDataResponse,
  USDAFoodItem,
} from '@/types/nutrition';
import { NutritionAPISource } from '@/types/nutrition';
import { NutritionCache } from './nutrition-cache';

/**
 * Default API configuration
 */
const DEFAULT_OPTIONS: Required<NutritionAPIOptions> = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 10000,
  useCache: true,
  cacheTTL: 24 * 60 * 60 * 1000, // 24 hours
};

/**
 * OpenFoodFacts API endpoint (free, no API key required)
 */
const OPENFOODFACTS_API_URL = 'https://world.openfoodfacts.org/cgi/search.pl';

/**
 * USDA FoodData Central API endpoint (free public access)
 */
const USDA_API_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';

/**
 * USDA API key for public access (free tier)
 * Note: This is a public demo key with rate limits
 */
const USDA_API_KEY = 'DEMO_KEY';

/**
 * Nutrition API class for fetching and normalizing nutrition data
 */
export class NutritionAPI {
  private cache: NutritionCache;
  private options: Required<NutritionAPIOptions>;

  /**
   * Creates a new NutritionAPI instance
   * @param options - Optional configuration options
   */
  constructor(options?: NutritionAPIOptions) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.cache = new NutritionCache(this.options.cacheTTL);
  }

  /**
   * Fetches nutrition data with fallback between APIs
   * @param searchTerm - The food item to search for
   * @returns Promise resolving to nutrition search result
   */
  async fetchNutrition(searchTerm: string): Promise<NutritionSearchResult> {
    // Check cache first if enabled
    if (this.options.useCache) {
      const cached = this.cache.get(searchTerm);
      if (cached) {
        return cached;
      }
    }

    // Try OpenFoodFacts first
    try {
      const result = await this.fetchFromOpenFoodFacts(searchTerm);

      // Cache the result
      if (this.options.useCache && result.results.length > 0) {
        this.cache.set(searchTerm, result.results[0]);
      }

      return result;
    } catch (error) {
      console.warn('OpenFoodFacts API failed, trying USDA as fallback:', error);

      // Fallback to USDA
      try {
        const result = await this.fetchFromUSDA(searchTerm);

        // Cache the result
        if (this.options.useCache && result.results.length > 0) {
          this.cache.set(searchTerm, result.results[0]);
        }

        return result;
      } catch (usdaError) {
        console.error('USDA API also failed:', usdaError);

        // Try to return cached data even if expired
        if (this.options.useCache) {
          const cached = this.cache.get(searchTerm);
          if (cached) {
            console.warn('Returning expired cached data as fallback');
            return cached;
          }
        }

        // All APIs failed, throw error
        throw this.createError(
          'All nutrition data sources failed. Please try again later.',
          NutritionAPISource.FALLBACK,
          usdaError
        );
      }
    }
  }

  /**
   * Fetches nutrition data from OpenFoodFacts API
   * @param searchTerm - The food item to search for
   * @returns Promise resolving to nutrition search result
   */
  private async fetchFromOpenFoodFacts(searchTerm: string): Promise<NutritionSearchResult> {
    const url = new URL(OPENFOODFACTS_API_URL);
    url.searchParams.append('search_terms', searchTerm);
    url.searchParams.append('search_simple', '1');
    url.searchParams.append('action', 'process');
    url.searchParams.append('json', '1');
    url.searchParams.append('page_size', '5');

    const response = await this.fetchWithRetry(url.toString(), NutritionAPISource.OPENFOODFACTS);
    const data: OpenFoodFactsResponse = await response.json();

    if (!data.products || data.products.length === 0) {
      throw this.createError(`No results found for "${searchTerm}" in OpenFoodFacts`, NutritionAPISource.OPENFOODFACTS);
    }

    // Normalize the first product
    const normalized = this.normalizeOpenFoodFactsProduct(data.products[0]);

    return {
      results: [normalized],
      total: data.count,
      source: NutritionAPISource.OPENFOODFACTS,
      fromCache: false,
    };
  }

  /**
   * Fetches nutrition data from USDA FoodData Central API
   * @param searchTerm - The food item to search for
   * @returns Promise resolving to nutrition search result
   */
  private async fetchFromUSDA(searchTerm: string): Promise<NutritionSearchResult> {
    const url = new URL(USDA_API_URL);
    url.searchParams.append('api_key', USDA_API_KEY);
    url.searchParams.append('query', searchTerm);
    url.searchParams.append('pageSize', '5');
    url.searchParams.append('dataType', 'Foundation,SR Legacy');

    const response = await this.fetchWithRetry(url.toString(), NutritionAPISource.USDA);
    const data: USDAFoodDataResponse = await response.json();

    if (!data.foods || data.foods.length === 0) {
      throw this.createError(`No results found for "${searchTerm}" in USDA database`, NutritionAPISource.USDA);
    }

    // Normalize the first food item
    const normalized = this.normalizeUSDAFoodItem(data.foods[0]);

    return {
      results: [normalized],
      total: data.totalHits,
      source: NutritionAPISource.USDA,
      fromCache: false,
    };
  }

  /**
   * Normalizes OpenFoodFacts product data to standard format
   * @param product - The OpenFoodFacts product to normalize
   * @returns Normalized nutrition data
   */
  private normalizeOpenFoodFactsProduct(product: OpenFoodFactsProduct): NormalizedNutritionData {
    const nutriments = product.nutriments || {};

    return {
      id: product.code,
      name: product.product_name_en || product.product_name || 'Unknown',
      source: NutritionAPISource.OPENFOODFACTS,
      fetchedAt: Date.now(),
      calories: nutriments['energy-kcal_100g'] || 0,
      protein: nutriments['proteins_100g'] || 0,
      carbs: nutriments['carbohydrates_100g'] || 0,
      fiber: nutriments['fiber_100g'] || 0,
      fat: nutriments['fat_100g'] || 0,
      sugar: nutriments['sugars_100g'] || 0,
      vitaminC: nutriments['vitamin-c_100g'],
      vitaminB6: nutriments['vitamin-b6_100g'],
      potassium: nutriments['potassium_100g'],
      magnesium: nutriments['magnesium_100g'],
      metadata: {
        originalServingSize: 100,
        originalServingUnit: 'g',
        isDried: product.product_name ? (this.isDriedFruit(product.product_name) ?? false) : false,
        category: product.categories_tags?.[0],
        brand: product.brands,
      },
    };
  }

  /**
   * Normalizes USDA food item data to standard format
   * @param food - The USDA food item to normalize
   * @returns Normalized nutrition data
   */
  private normalizeUSDAFoodItem(food: USDAFoodItem): NormalizedNutritionData {
    const nutrients = food.foodNutrients || [];

    // Helper function to get nutrient value by name
    const getNutrientValue = (name: string): number | undefined => {
      const nutrient = nutrients.find((n) => n.nutrientName.toLowerCase().includes(name.toLowerCase()));
      return nutrient?.value;
    };

    // Get values (USDA provides per 100g for most items)
    const calories = getNutrientValue('Energy') || 0;
    const protein = getNutrientValue('Protein') || 0;
    const carbs = getNutrientValue('Carbohydrate') || 0;
    const fiber = getNutrientValue('Fiber') || 0;
    const fat = getNutrientValue('Total lipid') || 0;
    const sugar = getNutrientValue('Sugars') || 0;
    const vitaminC = getNutrientValue('Vitamin C');
    const vitaminB6 = getNutrientValue('Vitamin B-6');
    const potassium = getNutrientValue('Potassium');
    const magnesium = getNutrientValue('Magnesium');

    return {
      id: food.fdcId,
      name: food.description || 'Unknown',
      source: NutritionAPISource.USDA,
      fetchedAt: Date.now(),
      calories,
      protein,
      carbs,
      fiber,
      fat,
      sugar,
      vitaminC,
      vitaminB6,
      potassium,
      magnesium,
      metadata: {
        originalServingSize: food.servingSize || 100,
        originalServingUnit: food.servingSizeUnit || 'g',
        isDried: this.isDriedFruit(food.description),
        category: food.foodCategory,
        brand: food.brandOwner,
      },
    };
  }

  /**
   * Checks if a food item is a dried fruit based on its name
   * @param name - The food item name
   * @returns True if it appears to be a dried fruit
   */
  private isDriedFruit(name: string): boolean {
    const driedKeywords = ['dried', 'dehydrated', 'freeze-dried', 'sun-dried'];
    const lowerName = name.toLowerCase();
    return driedKeywords.some((keyword) => lowerName.includes(keyword));
  }

  /**
   * Fetches data with retry logic
   * @param url - The URL to fetch
   * @param source - The API source
   * @param attempt - Current attempt number
   * @returns Promise resolving to fetch response
   */
  private async fetchWithRetry(url: string, source: NutritionAPISource, attempt: number = 1): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.options.timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Sunya-Nutrition-App/1.0',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw this.createError(`HTTP ${response.status}: ${response.statusText}`, source, undefined, response.status);
      }

      return response;
    } catch (error) {
      if (attempt < this.options.maxRetries) {
        // Exponential backoff
        const delay = this.options.retryDelay * Math.pow(2, attempt - 1);
        await this.sleep(delay);
        return this.fetchWithRetry(url, source, attempt + 1);
      }

      throw this.createError(`Failed to fetch data after ${this.options.maxRetries} attempts`, source, error);
    }
  }

  /**
   * Creates a standardized API error
   * @param message - Error message
   * @param source - API source that caused the error
   * @param originalError - Original error object
   * @param statusCode - HTTP status code
   * @returns NutritionAPIError object
   */
  private createError(
    message: string,
    source: NutritionAPISource,
    originalError?: unknown,
    statusCode?: number
  ): NutritionAPIError {
    return {
      message,
      source,
      originalError,
      statusCode,
    };
  }

  /**
   * Sleeps for a specified duration
   * @param ms - Milliseconds to sleep
   * @returns Promise that resolves after the specified duration
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Clears the cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Gets cache statistics
   * @returns Cache statistics object
   */
  getCacheStats() {
    return this.cache.getStats();
  }
}

/**
 * Default NutritionAPI instance
 */
export const nutritionAPI = new NutritionAPI();

/**
 * Helper function to fetch nutrition data using the default API instance
 * @param searchTerm - The food item to search for
 * @returns Promise resolving to nutrition search result
 */
export async function fetchNutrition(searchTerm: string): Promise<NutritionSearchResult> {
  return nutritionAPI.fetchNutrition(searchTerm);
}

/**
 * Helper function to clear the nutrition cache
 */
export function clearNutritionCache(): void {
  nutritionAPI.clearCache();
}

/**
 * Helper function to get cache statistics
 */
export function getNutritionCacheStats() {
  return nutritionAPI.getCacheStats();
}
