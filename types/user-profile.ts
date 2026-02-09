export enum ActivityLevel {
  SEDENTARY = 'sedentary',
  LIGHT = 'light',
  MODERATE = 'moderate',
  ACTIVE = 'active',
  VERY_ACTIVE = 'very-active',
}

export enum DietaryRestriction {
  DIABETES = 'DIABETES',
  SUGAR_SENSITIVE = 'SUGAR_SENSITIVE',
  POTASSIUM_SENSITIVE = 'POTASSIUM_SENSITIVE',
  LOW_FIBER = 'LOW_FIBER',
  HIGH_FIBER = 'HIGH_FIBER',
  LOW_PROTEIN = 'LOW_PROTEIN',
  HIGH_PROTEIN = 'HIGH_PROTEIN',
  FRUIT_ALLERGY = 'FRUIT_ALLERGY',
  KIDNEY_DISEASE = 'KIDNEY_DISEASE',
  ACID_REFLUX = 'ACID_REFLUX',
  NUT_ALLERGY = 'NUT_ALLERGY',
  HYPERTENSION = 'HYPERTENSION',
  SODIUM_SENSITIVE = 'SODIUM_SENSITIVE',
  GLUTEN_INTOLERANCE = 'GLUTEN_INTOLERANCE',
  LACTOSE_INTOLERANCE = 'LACTOSE_INTOLERANCE',
}

export interface UserProfile {
  age?: number;
  weight?: number; // kg
  height?: number; // cm
  activityLevel?: ActivityLevel;
  healthSensitivities?: Array<{
    restriction: DietaryRestriction;
    severity?: string;
  }>;
  customSensitivities?: string[];
  updatedAt?: string;
}

export interface HealthSensitivity {
  restriction: DietaryRestriction;
  severity?: string;
}

export interface ProfileUpdateOptions {
  validateOnly?: boolean;
  mergeWithExisting?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}
