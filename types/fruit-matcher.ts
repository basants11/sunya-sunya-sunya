import { NutritionPer100g } from "@/lib/nutrition-data";
import { Product } from "@/lib/products";

export enum MatchType {
  EXACT = "EXACT",
  SYNONYM = "SYNONYM",
  PARTIAL = "PARTIAL",
  SIMILAR = "SIMILAR",
  NONE = "NONE",
}

export enum AvailabilityStatus {
  IN_STOCK = "IN_STOCK",
  LIMITED = "LIMITED",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

export interface FruitSynonym {
  baseName: string;
  synonyms: string[];
}

export interface MatchOptions {
  minSimilarityThreshold?: number;
  includeSynonyms?: boolean;
  considerNutritionalSimilarity?: boolean;
  maxAlternatives?: number;
  filterUnsafe?: boolean;
}

export interface ProductWithNutrition extends Product {
  nutrition: NutritionPer100g;
  availabilityStatus: AvailabilityStatus;
}

export interface NutritionalSimilarityScore {
  overallScore: number;
  caloriesScore: number;
  sugarScore: number;
  fiberScore: number;
  vitaminsScore: number;
  factors: {
    calories: number;
    sugar: number;
    fiber: number;
    vitamins: number;
  };
}

export interface FruitMatchResult {
  product?: Product;
  matchType: MatchType;
  similarityScore: number;
  isExactMatch: boolean;
  availabilityStatus: AvailabilityStatus;
  searchedFruit: string;
  matchedFruit?: string;
  isAlternative: boolean;
  reason?: string;
  nutritionalSimilarity?: NutritionalSimilarityScore;
}

export interface AlternativeSuggestion {
  product: Product;
  similarityScore: number;
  nutritionalSimilarity: NutritionalSimilarityScore;
  reason: string;
  isSafe: boolean;
  safetyWarnings?: string[];
  matchType: MatchType;
}

export interface HighlightPillResult {
  pillId?: number;
  found: boolean;
  matchType: MatchType;
}
