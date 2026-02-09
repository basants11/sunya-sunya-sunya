export enum NutritionAPISource {
  OPENFOODFACTS = 'OPENFOODFACTS',
  USDA = 'USDA',
  FALLBACK = 'FALLBACK',
}

export interface NutritionAPIOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  useCache?: boolean;
  cacheTTL?: number;
}

export interface OpenFoodFactsProduct {
  code: string;
  product_name?: string;
  product_name_en?: string;
  nutriments: Record<string, number>;
  categories_tags?: string[];
  brands?: string;
}

export interface OpenFoodFactsResponse {
  count: number;
  products: OpenFoodFactsProduct[];
}

export interface USDAFoodNutrient {
  nutrientName: string;
  value: number;
}

export interface USDAFoodItem {
  fdcId: number;
  description: string;
  foodNutrients: USDAFoodNutrient[];
  servingSize?: number;
  servingSizeUnit?: string;
  foodCategory?: string;
  brandOwner?: string;
}

export interface USDAFoodDataResponse {
  totalHits: number;
  foods: USDAFoodItem[];
}

export interface NormalizedNutritionData {
  id: string | number;
  name: string;
  source: NutritionAPISource;
  fetchedAt: number;
  calories: number;
  protein: number;
  carbs: number;
  fiber: number;
  fat: number;
  sugar: number;
  vitaminC?: number;
  vitaminB6?: number;
  potassium?: number;
  magnesium?: number;
  metadata: {
    originalServingSize: number;
    originalServingUnit: string;
    isDried: boolean;
    category?: string;
    brand?: string;
  };
}

export interface NutritionSearchResult {
  results: NormalizedNutritionData[];
  total: number;
  source: NutritionAPISource;
  fromCache: boolean;
}

export interface NutritionAPIError {
  message: string;
  source: NutritionAPISource;
  originalError?: unknown;
  statusCode?: number;
}

export interface NutritionCacheEntry {
  data: NormalizedNutritionData;
  cachedAt: number;
  expiresAt: number;
  ttl: number;
}
