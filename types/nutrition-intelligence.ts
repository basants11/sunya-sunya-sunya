export enum RiskLevel {
  LOW = "LOW",
  MODERATE = "MODERATE",
  HIGH = "HIGH",
  AVOID = "AVOID",
}

export interface DietaryRisk {
  type: string;
  level: RiskLevel;
  description: string;
  cause: string;
  value: number;
  threshold: number;
  unit: string;
  appliesToProfile: boolean;
}

export interface NutritionSummary {
  description: string;
  highlights: string[];
  calorieDensity: "low" | "moderate" | "high";
  primaryMacronutrient: "protein" | "carbs" | "fat" | "balanced";
}

export interface SafeConsumptionRange {
  minGrams: number;
  maxGrams: number;
  recommendedGrams: number;
  reason: string;
  isConservative: boolean;
}

export interface RecommendationOptions {
  includeDetails?: boolean;
  maxRisks?: number;
  conservativeMode?: boolean;
}

export interface NutritionIntelligenceResult {
  summary: NutritionSummary;
  safeRange: SafeConsumptionRange;
  risks: DietaryRisk[];
  recommendation: string;
  isSafe: boolean;
  warnings: string[];
  analyzedAt: number;
}
