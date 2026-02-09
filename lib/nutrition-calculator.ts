/**
 * Personalized Nutrition Calculator
 * Calculates daily macro/micronutrient requirements based on user data
 */

export interface UserProfile {
  age: number;
  height: number; // cm
  weight: number; // kg
  gender?: 'male' | 'female';
  fitnessGoal: 'muscle-gain' | 'weight-loss' | 'endurance' | 'general-wellness';
  healthConditions: (HealthCondition | string)[];
  activityLevel: 'sedentary' | 'moderate' | 'high';
  dietaryPreferences?: string[];
}

export type HealthCondition = 
  | 'diabetes' 
  | 'hypertension' 
  | 'allergies' 
  | 'heart' 
  | 'kidney' 
  | 'none';

export interface DailyRequirements {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fiber: number; // grams
  fat: number; // grams
  vitaminC: number; // mg
  potassium: number; // mg
  magnesium: number; // mg
  vitaminB6: number; // mg
  antioxidants: number; // ORAC units
}

export interface NutrientStatus {
  nutrient: string;
  current: number;
  required: number;
  percentage: number;
  status: 'deficient' | 'adequate' | 'excess';
}

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
 */
function calculateBMR(profile: UserProfile): number {
  const { age, height, weight, gender = 'male' } = profile;
  
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 */
function calculateTDEE(bmr: number, activityLevel: UserProfile['activityLevel']): number {
  const activityMultipliers = {
    sedentary: 1.2,
    moderate: 1.55,
    high: 1.9
  };
  
  return bmr * activityMultipliers[activityLevel];
}

/**
 * Adjust calories based on fitness goal
 */
function adjustCaloriesForGoal(
  tdee: number, 
  goal: UserProfile['fitnessGoal']
): number {
  const adjustments = {
    'muscle-gain': tdee + 300, // Surplus for muscle gain
    'weight-loss': tdee - 500, // Deficit for weight loss
    'endurance': tdee + 200, // Slight surplus for endurance
    'general-wellness': tdee // Maintenance
  };
  
  return Math.round(adjustments[goal]);
}

/**
 * Calculate macronutrient distribution based on goal
 */
function calculateMacronutrients(
  calories: number,
  goal: UserProfile['fitnessGoal']
): { protein: number; carbs: number; fat: number } {
  const distributions = {
    'muscle-gain': { protein: 0.30, carbs: 0.45, fat: 0.25 },
    'weight-loss': { protein: 0.35, carbs: 0.35, fat: 0.30 },
    'endurance': { protein: 0.20, carbs: 0.60, fat: 0.20 },
    'general-wellness': { protein: 0.25, carbs: 0.50, fat: 0.25 }
  };
  
  const dist = distributions[goal];
  
  return {
    protein: Math.round((calories * dist.protein) / 4), // 4 cal/g
    carbs: Math.round((calories * dist.carbs) / 4), // 4 cal/g
    fat: Math.round((calories * dist.fat) / 9) // 9 cal/g
  };
}

/**
 * Calculate micronutrient requirements based on age and gender
 */
function calculateMicronutrients(profile: UserProfile): {
  vitaminC: number;
  potassium: number;
  magnesium: number;
  vitaminB6: number;
  antioxidants: number;
} {
  const { age, gender = 'male' } = profile;
  
  // Vitamin C (mg)
  let vitaminC = gender === 'male' ? 90 : 75;
  if (age > 70) vitaminC += 10;
  
  // Potassium (mg)
  const potassium = 3500;
  
  // Magnesium (mg)
  let magnesium = gender === 'male' ? 400 : 310;
  if (age > 30) magnesium += 10;
  if (age > 50) magnesium += 10;
  
  // Vitamin B6 (mg)
  let vitaminB6 = gender === 'male' ? 1.3 : 1.3;
  if (age > 50) vitaminB6 = 1.7;
  
  // Antioxidants (ORAC units - baseline recommendation)
  const antioxidants = 5000;
  
  return { vitaminC, potassium, magnesium, vitaminB6, antioxidants };
}

/**
 * Adjust requirements based on health conditions
 */
function adjustForHealthConditions(
  requirements: DailyRequirements,
  conditions: (HealthCondition | string)[]
): DailyRequirements {
  const adjusted = { ...requirements };
  
  conditions.forEach(condition => {
    switch (condition) {
      case 'diabetes':
        // Lower carbs, higher fiber
        adjusted.carbs = Math.round(adjusted.carbs * 0.8);
        adjusted.fiber = Math.round(adjusted.fiber * 1.2);
        break;
      case 'hypertension':
        // Higher potassium, lower sodium (not tracked here)
        adjusted.potassium = Math.round(adjusted.potassium * 1.2);
        break;
      case 'heart':
        // Higher fiber, lower fat
        adjusted.fiber = Math.round(adjusted.fiber * 1.3);
        adjusted.fat = Math.round(adjusted.fat * 0.85);
        break;
      case 'kidney':
        // Lower protein, lower potassium
        adjusted.protein = Math.round(adjusted.protein * 0.8);
        adjusted.potassium = Math.round(adjusted.potassium * 0.7);
        break;
      case 'allergies':
        // No specific adjustment, handled in food safety
        break;
    }
  });
  
  return adjusted;
}

/**
 * Calculate complete daily requirements
 */
export function calculateDailyRequirements(profile: UserProfile): DailyRequirements {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const calories = adjustCaloriesForGoal(tdee, profile.fitnessGoal);
  const macros = calculateMacronutrients(calories, profile.fitnessGoal);
  const micros = calculateMicronutrients(profile);
  
  let requirements: DailyRequirements = {
    calories,
    protein: macros.protein,
    carbs: macros.carbs,
    fiber: 25 + (profile.weight * 0.5), // Base + weight-based
    fat: macros.fat,
    ...micros
  };
  
  // Adjust for health conditions
  if (profile.healthConditions.length > 0) {
    requirements = adjustForHealthConditions(requirements, profile.healthConditions);
  }
  
  return requirements;
}

/**
 * Calculate nutrient status based on current intake
 */
export function calculateNutrientStatus(
  current: Partial<DailyRequirements>,
  required: DailyRequirements
): NutrientStatus[] {
  const nutrients: (keyof DailyRequirements)[] = [
    'calories', 'protein', 'carbs', 'fiber', 'fat', 
    'vitaminC', 'potassium', 'magnesium', 'vitaminB6', 'antioxidants'
  ];
  
  return nutrients.map(nutrient => {
    const currentVal = current[nutrient] || 0;
    const requiredVal = required[nutrient];
    const percentage = Math.round((currentVal / requiredVal) * 100);
    
    let status: 'deficient' | 'adequate' | 'excess';
    if (percentage < 80) {
      status = 'deficient';
    } else if (percentage > 120) {
      status = 'excess';
    } else {
      status = 'adequate';
    }
    
    return {
      nutrient: nutrient.charAt(0).toUpperCase() + nutrient.slice(1),
      current: currentVal,
      required: requiredVal,
      percentage,
      status
    };
  });
}

/**
 * Get personalized recommendations based on deficiencies
 */
export function getRecommendationMessage(status: NutrientStatus[]): string {
  const deficient = status.filter(s => s.status === 'deficient');
  
  if (deficient.length === 0) {
    return "Your nutrition is well-balanced! Keep up the great work.";
  }
  
  const topDeficiency = deficient[0];
  const messages: Record<string, string> = {
    'Calories': "Increase your calorie intake with energy-dense SUNYA products.",
    'Protein': "Boost protein intake with our premium dried fruits for muscle recovery.",
    'Carbs': "Add more complex carbohydrates from our fruit selection for sustained energy.",
    'Fiber': "Increase fiber intake with our high-fiber dried fruits for digestive health.",
    'Fat': "Include healthy fats from our premium nut selections.",
    'VitaminC': "Supercharge immunity with our Vitamin C-rich dried fruits.",
    'Potassium': "Support muscle function with potassium-rich SUNYA products.",
    'Magnesium': "Optimize energy metabolism with magnesium-rich options.",
    'VitaminB6': "Enhance protein metabolism with B6-rich selections.",
    'Antioxidants': "Fight free radicals with our antioxidant-packed superfoods."
  };
  
  return messages[topDeficiency.nutrient] || "Focus on balanced nutrition with SUNYA products.";
}

/**
 * Calculate suggested daily intake for a product
 */
export function calculateProductIntake(
  requirements: DailyRequirements,
  productCalories: number,
  productProtein: number,
  productFiber: number
): { grams: number; servings: number; reason: string } {
  // Aim for 10-15% of daily calories from this product
  const targetCalories = requirements.calories * 0.12;
  const grams = Math.round((targetCalories / productCalories) * 100);
  const servings = Math.round(grams / 30); // 30g standard serving
  
  let reason = "Perfect for your daily nutrition";
  
  if (productProtein > 3) {
    reason = "Great protein source for your goals";
  } else if (productFiber > 10) {
    reason = "High fiber for digestive health";
  } else if (productCalories > 300) {
    reason = "Energy-dense for your active lifestyle";
  }
  
  return { grams: Math.max(30, grams), servings: Math.max(1, servings), reason };
}

/**
 * Validate user profile data
 */
export function validateProfile(profile: Partial<UserProfile>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!profile.age || profile.age < 10 || profile.age > 100) {
    errors.push("Age must be between 10 and 100");
  }
  
  if (!profile.height || profile.height < 100 || profile.height > 250) {
    errors.push("Height must be between 100 and 250 cm");
  }
  
  if (!profile.weight || profile.weight < 30 || profile.weight > 200) {
    errors.push("Weight must be between 30 and 200 kg");
  }
  
  if (!profile.fitnessGoal) {
    errors.push("Please select a fitness goal");
  }
  
  if (!profile.activityLevel) {
    errors.push("Please select an activity level");
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
