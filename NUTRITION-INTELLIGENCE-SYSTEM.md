# Nutrition Intelligence System - Complete Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Key Features](#key-features)
5. [Usage Guide](#usage-guide)
6. [Integration Instructions](#integration-instructions)
7. [API Reference](#api-reference)
8. [Component Documentation](#component-documentation)
9. [Safety Guidelines](#safety-guidelines)
10. [Future Enhancements](#future-enhancements)

---

## 1. System Overview

### Purpose
The Nutrition Intelligence System is a comprehensive, rule-based nutrition analysis platform designed for SUNYA's premium dried fruit products. It provides personalized nutrition insights, safety validation, and product recommendations without using AI APIs or providing medical advice.

### Core Philosophy
- **Rule-Based Intelligence**: Uses deterministic algorithms for consistent, predictable results
- **Privacy-First**: All user data stored locally in localStorage, never sent to servers
- **Safety-First**: Conservative approach - blocks recommendations when uncertain
- **No Medical Advice**: Provides nutritional information only, never diagnoses or treats conditions
- **Premium Experience**: Calm, sophisticated UI with smooth animations

### Key Capabilities
- Real-time nutrition data fetching from public APIs (OpenFoodFacts, USDA)
- Personalized daily requirement calculations based on user profile
- Safety validation against health conditions and dietary restrictions
- Intelligent fruit-to-product matching with similarity scoring
- Caching system for performance optimization
- Comprehensive risk detection (sugar, potassium, acidity, allergens)

---

## 2. Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Interface Layer                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────┐ │
│  │ NutritionSearch  │  │ UserProfileForm  │  │ Cart UI  │ │
│  │      Panel       │  │                 │  │          │ │
│  └────────┬─────────┘  └────────┬─────────┘  └────┬─────┘ │
└───────────┼────────────────────┼────────────────────┼────────┘
            │                    │                    │
┌───────────┼────────────────────┼────────────────────┼────────┐
│           │                    │                    │        │
│  ┌────────▼─────────┐  ┌────▼──────────┐  ┌────▼────┐ │
│  │  Fruit Matcher    │  │ UserProfile   │  │  Cart   │ │
│  │  Engine          │  │  Manager      │  │  Store  │ │
│  └────────┬─────────┘  └────┬──────────┘  └─────────┘ │
│           │                    │                         │
│  ┌────────▼────────────────────────────────────────────┐ │
│  │     Nutrition Intelligence Engine                   │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │ • Risk Detection                            │  │ │
│  │  │ • Safe Range Calculation                    │  │ │
│  │  │ • Summary Generation                        │  │ │
│  │  │ • Recommendation Logic                      │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  └────────┬────────────────────────────────────────────┘ │
│           │                                             │
│  ┌────────▼────────────────────────────────────────────┐ │
│  │     Safety Validator                              │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │ • Allergen Detection                       │  │ │
│  │  │ • Dietary Restriction Checks                │  │ │
│  │  │ • Custom Sensitivity Matching               │  │ │
│  │  │ • Alternative Suggestions                  │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  └────────┬────────────────────────────────────────────┘ │
│           │                                             │
│  ┌────────▼────────────────────────────────────────────┐ │
│  │     Nutrition API Layer                           │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │ • OpenFoodFacts Integration               │  │ │
│  │  │ • USDA FoodData Central Integration        │  │ │
│  │  │ • Data Normalization (per 100g)           │  │ │
│  │  │ • Fallback Mechanism                     │  │ │
│  │  │ • Retry Logic with Exponential Backoff     │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  └────────┬────────────────────────────────────────────┘ │
│           │                                             │
│  ┌────────▼────────────────────────────────────────────┐ │
│  │     Cache Layer                                  │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │ • In-Memory Cache                         │  │ │
│  │  │ • localStorage Persistence                 │  │ │
│  │  │ • TTL-based Expiration (24h default)      │  │ │
│  │  │ • Automatic Cleanup                       │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  └────────┬────────────────────────────────────────────┘ │
│           │                                             │
│  ┌────────▼────────────────────────────────────────────┐ │
│  │     Data Sources                                 │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │ • OpenFoodFacts API (free, no key)        │  │ │
│  │  │ • USDA FoodData Central API (free tier)    │  │ │
│  │  │ • Local Food Database (nutrition-data.ts)   │  │ │
│  │  │ • Product Catalog (products.ts)            │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Search → API Fetch → Normalize → Cache → Intelligence Engine
                                                          │
                                                          ▼
                                              Safety Validation
                                                          │
                                                          ▼
                                              Product Matching
                                                          │
                                                          ▼
                                              Display Results
```

### Technology Stack

**Core Libraries:**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Framer Motion**: Smooth animations
- **Tailwind CSS**: Utility-first styling

**External APIs:**
- **OpenFoodFacts**: Free, open-source food database
- **USDA FoodData Central**: Official US nutrition database

**Storage:**
- **localStorage**: User profile and cache persistence
- **In-Memory**: Runtime cache for performance

---

## 3. File Structure

### Core Library Files

```
lib/
├── nutrition-intelligence.ts          # Main intelligence engine
├── nutrition-api.ts                  # API integration layer
├── nutrition-cache.ts                # Caching system
├── nutrition-calculator.ts           # Daily requirement calculations
├── nutrition-data.ts                # Local food database
├── food-safety-engine.ts            # Safety validation rules
├── safety-validator.ts              # Comprehensive safety checks
├── personalized-recommendation-engine.ts  # Personalized recommendations
├── fruit-matcher.ts                 # Fruit-to-product matching
├── recommendation-engine.ts         # Product recommendation logic
├── user-profile.ts                 # User profile management
└── products.ts                     # Product catalog
```

### Component Files

```
components/
├── nutrition-search-bar.tsx         # Search input component
├── nutrition-search-panel.tsx       # Main integration component
├── nutrition-result-card.tsx        # Result display card
├── safety-warning-banner.tsx         # Safety alert component
├── user-profile-form.tsx            # Profile input form
└── animated-cart-icon.tsx           # Cart animation
```

### Page Files

```
app/
└── nutrition-search/
    ├── page.tsx                     # Page component
    └── nutrition-search-demo-client.tsx  # Client component
```

### Type Definitions

```
types/
├── nutrition.ts                     # Nutrition data types
├── nutrition-intelligence.ts        # Intelligence engine types
├── user-profile.ts                 # User profile types
└── fruit-matcher.ts                # Matcher types
```

### Hooks

```
hooks/
└── use-nutrition-cart.ts           # Cart management hook
```

---

## 4. Key Features

### 4.1 Real-Time Nutrition Search

**Capability**: Search any fruit worldwide and get instant nutrition data

**Features**:
- Fetches from OpenFoodFacts and USDA APIs
- Automatic fallback between APIs
- Data normalization to per-100g basis
- Debounced search to minimize API calls
- Loading states and error handling

**Example**:
```typescript
const api = new NutritionAPI();
const result = await api.fetchNutrition('kiwi');
// Returns normalized nutrition data per 100g
```

### 4.2 Personalized Daily Requirements

**Capability**: Calculate personalized daily macro/micronutrient needs

**Features**:
- BMR calculation using Mifflin-St Jeor equation
- Activity level multipliers
- Fitness goal adjustments
- Health condition modifications
- Age and gender considerations

**Example**:
```typescript
const profile: UserProfile = {
  age: 30,
  height: 175,
  weight: 70,
  gender: 'male',
  fitnessGoal: 'muscle-gain',
  activityLevel: 'moderate',
  healthConditions: []
};

const requirements = calculateDailyRequirements(profile);
// Returns: { calories: 2800, protein: 210, carbs: 350, ... }
```

### 4.3 Safety Validation

**Capability**: Block unsafe recommendations based on user profile

**Features**:
- Allergen detection (nuts, fruits)
- Dietary restriction checks (diabetes, kidney disease, etc.)
- Custom sensitivity matching
- Conservative blocking (if unsure, block)
- Alternative suggestions

**Example**:
```typescript
const isSafe = SafetyValidator.isSafeForProfile(
  nutritionData,
  userProfile
);

const warnings = SafetyValidator.getSafetyWarnings(
  nutritionData,
  userProfile
);
```

### 4.4 Risk Detection

**Capability**: Detect dietary risks in food items

**Risk Types**:
- **High Sugar**: Based on daily limits (50g normal, 25g sensitive, 15g diabetes)
- **High Potassium**: Based on kidney health (4700mg normal, 2000mg sensitive)
- **Acidity**: For acid reflux sufferers
- **Allergens**: Nut and fruit allergies

**Risk Levels**:
- `LOW`: < 20% of daily limit
- `MODERATE`: 20-30% of daily limit
- `HIGH`: 30-50% of daily limit
- `AVOID`: > 50% of daily limit

### 4.5 Safe Consumption Ranges

**Capability**: Calculate safe daily intake quantities

**Features**:
- Calorie-based limits (max 10% of daily calories)
- Sugar-based limits
- Potassium-based limits
- Conservative recommendations
- Reason explanations

**Example**:
```typescript
const safeRange = NutritionIntelligenceEngine.calculateSafeRange(
  nutritionData,
  userProfile
);
// Returns: { minGrams: 10, maxGrams: 50, recommendedGrams: 25, reason: '...' }
```

### 4.6 Fruit-to-Product Matching

**Capability**: Match searched fruits to available SUNYA products

**Match Types**:
- **Exact**: 100% name match
- **Synonym**: Alternative names (e.g., "kiwifruit" → "kiwi")
- **Partial**: Partial name match
- **Similar**: Nutritionally similar alternatives

**Features**:
- Synonym database
- Nutritional similarity scoring
- Availability status checking
- Safety filtering

### 4.7 Intelligent Caching

**Capability**: Cache nutrition data for performance

**Features**:
- In-memory cache for fast access
- localStorage persistence for offline use
- TTL-based expiration (24 hours default)
- Automatic cleanup of expired entries
- Cache statistics

**Example**:
```typescript
const cache = new NutritionCache(24 * 60 * 60 * 1000); // 24 hours
cache.set('kiwi', nutritionData);
const cached = cache.get('kiwi');
```

### 4.8 User Profile Management

**Capability**: Manage user health profile locally

**Features**:
- Age, height, weight tracking
- Activity level selection
- Health condition selection
- Custom sensitivities
- Validation and error handling
- Export/import functionality

**Privacy**: All data stored in localStorage, never sent to servers

---

## 5. Usage Guide

### 5.1 Basic Search Flow

1. **User enters search query**
   ```typescript
   <NutritionSearchBar onSearch={handleSearch} />
   ```

2. **System fetches nutrition data**
   ```typescript
   const api = new NutritionAPI();
   const result = await api.fetchNutrition(query);
   ```

3. **Data is normalized and cached**
   ```typescript
   const normalized = result.results[0];
   cache.set(query, normalized);
   ```

4. **Safety validation runs**
   ```typescript
   const safetyResult = SafetyValidator.getSafetyReport(
     normalized,
     userProfile
   );
   ```

5. **Product matching occurs**
   ```typescript
   const match = fruitMatcher.matchFruitToProduct(query, products);
   ```

6. **Results displayed**
   ```typescript
   <NutritionResultCard data={cardData} onAddToCart={handleAddToCart} />
   ```

### 5.2 Setting Up User Profile

1. **Open profile form**
   ```typescript
   <UserProfileForm />
   ```

2. **Fill in details**
   - Age (13-120 years)
   - Height (50-250 cm)
   - Weight (20-300 kg)
   - Activity level (sedentary, moderate, high)
   - Fitness goal (muscle-gain, weight-loss, endurance, general-wellness)
   - Health conditions (diabetes, hypertension, heart, kidney, allergies, none)
   - Custom sensitivities (optional)

3. **Profile is saved automatically**
   ```typescript
   await UserProfileManager.saveProfile(profile);
   ```

### 5.3 Understanding Results

**Nutrition Result Card displays**:
- Fruit name and icon
- Calories per 100g
- Natural sugar level (low/moderate/high)
- Key nutrients (fiber, potassium, magnesium, vitamin C)
- Suggested daily quantity
- Safety warnings (if applicable)
- Add to cart button (if safe)

**Safety Warning Banner**:
- Severity level (high/moderate)
- Specific warnings
- Consultation note for medical conditions

**Matched Product Information**:
- Product name
- Match reason
- Availability status
- Similarity score

### 5.4 Adding to Cart

1. **User clicks "Add to Cart"**
   ```typescript
   const handleAddToCart = async () => {
     await addToCart(productId, calories, productName);
     await animateCartIcon();
   };
   ```

2. **Animation plays**
   - Fruit flies to cart icon
   - Cart icon animates

3. **Item added to cart**
   - Stored in cart state
   - Persisted to localStorage

---

## 6. Integration Instructions

### 6.1 Adding to a New Page

**Step 1: Import the component**
```typescript
import NutritionSearchPanel from '@/components/nutrition-search-panel';
```

**Step 2: Add to page**
```typescript
export default function MyPage() {
  return (
    <div>
      <NutritionSearchPanel />
    </div>
  );
}
```

**Step 3: Ensure providers are set up**
```typescript
// In app/layout.tsx or root layout
import { Providers } from '@/components/providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

### 6.2 Using the Nutrition API Directly

```typescript
import { NutritionAPI } from '@/lib/nutrition-api';

// Create instance with custom options
const api = new NutritionAPI({
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 10000,
  useCache: true,
  cacheTTL: 24 * 60 * 60 * 1000 // 24 hours
});

// Fetch nutrition data
const result = await api.fetchNutrition('banana');
console.log(result.results[0]);

// Clear cache
api.clearCache();

// Get cache stats
const stats = api.getCacheStats();
```

### 6.3 Using the Intelligence Engine

```typescript
import { NutritionIntelligenceEngine } from '@/lib/nutrition-intelligence';

// Generate nutrition summary
const summary = NutritionIntelligenceEngine.generateSummary(nutritionData);
console.log(summary.description);
console.log(summary.highlights);

// Calculate safe range
const safeRange = NutritionIntelligenceEngine.calculateSafeRange(
  nutritionData,
  userProfile
);
console.log(`Safe: ${safeRange.minGrams}-${safeRange.maxGrams}g`);

// Detect risks
const risks = NutritionIntelligenceEngine.detectRisks(
  nutritionData,
  userProfile
);
risks.forEach(risk => {
  console.log(`${risk.type}: ${risk.level}`);
});
```

### 6.4 Using Safety Validator

```typescript
import { SafetyValidator } from '@/lib/safety-validator';

// Check if safe
const isSafe = SafetyValidator.isSafeForProfile(
  nutritionData,
  userProfile
);

// Get warnings
const warnings = SafetyValidator.getSafetyWarnings(
  nutritionData,
  userProfile
);

// Get alternatives
const alternatives = SafetyValidator.getSafeAlternatives(
  nutritionData,
  userProfile,
  availableProducts
);

// Get comprehensive report
const report = SafetyValidator.getSafetyReport(
  nutritionData,
  userProfile
);
```

### 6.5 Using Fruit Matcher

```typescript
import { FruitMatcher } from '@/lib/fruit-matcher';

// Create matcher
const matcher = new FruitMatcher(products, {
  minSimilarityThreshold: 50,
  includeSynonyms: true,
  considerNutritionalSimilarity: true,
  maxAlternatives: 3,
  filterUnsafe: true
});

// Match fruit to product
const match = matcher.matchFruitToProduct('kiwi', products);
console.log(match.product);
console.log(match.similarityScore);

// Find similar fruits
const similar = matcher.findSimilarFruits('banana', products);
similar.forEach(result => {
  console.log(`${result.product.name}: ${result.similarityScore}%`);
});

// Get best alternative
const alternative = matcher.getBestAlternative('apple', products, userProfile);
```

### 6.6 Managing User Profile

```typescript
import { UserProfileManager } from '@/lib/user-profile';

// Save profile
await UserProfileManager.saveProfile({
  age: 30,
  height: 175,
  weight: 70,
  activityLevel: 'moderate',
  fitnessGoal: 'muscle-gain',
  healthConditions: [],
  customSensitivities: []
});

// Get profile
const profile = UserProfileManager.getProfile();

// Update profile
const updated = await UserProfileManager.updateProfile({
  age: 31
});

// Check restrictions
const hasDiabetes = UserProfileManager.hasDietaryRestriction('DIABETES');

// Validate profile
const validation = UserProfileManager.validateProfile(profile);
if (!validation.isValid) {
  console.error(validation.errors);
}

// Export profile
const json = UserProfileManager.exportProfile();

// Import profile
await UserProfileManager.importProfile(json);
```

---

## 7. API Reference

### 7.1 NutritionAPI

**Constructor**
```typescript
constructor(options?: NutritionAPIOptions)
```

**Options**
- `maxRetries`: number (default: 3) - Maximum retry attempts
- `retryDelay`: number (default: 1000) - Delay between retries (ms)
- `timeout`: number (default: 10000) - Request timeout (ms)
- `useCache`: boolean (default: true) - Enable caching
- `cacheTTL`: number (default: 86400000) - Cache time-to-live (ms)

**Methods**

**fetchNutrition(searchTerm: string): Promise<NutritionSearchResult>**
- Fetches nutrition data with API fallback
- Returns normalized nutrition data per 100g

**clearCache(): void**
- Clears all cached nutrition data

**getCacheStats(): CacheStats**
- Returns cache statistics (size, keys, expiredCount, validCount)

### 7.2 NutritionIntelligenceEngine

**Static Methods**

**generateSummary(nutritionData: NormalizedNutritionData): NutritionSummary**
- Generates nutrition summary with highlights
- Returns description, highlights, calorieDensity, primaryMacronutrient

**calculateSafeRange(nutritionData: NormalizedNutritionData, userProfile: UserProfile | null): SafeConsumptionRange**
- Calculates safe daily consumption range
- Returns minGrams, maxGrams, recommendedGrams, reason, isConservative

**detectRisks(nutritionData: NormalizedNutritionData, userProfile: UserProfile | null): DietaryRisk[]**
- Detects dietary risks based on profile
- Returns array of risks with type, level, description, value, threshold

### 7.3 SafetyValidator

**Static Methods**

**isSafeForProfile(nutritionData: NormalizedNutritionData, userProfile: UserProfile | null): boolean**
- Checks if food is safe for user profile
- Returns boolean

**getSafetyWarnings(nutritionData: NormalizedNutritionData, userProfile: UserProfile | null): string[]**
- Gets safety warnings for a food item
- Returns array of warning messages

**shouldBlockRecommendation(nutritionData: NormalizedNutritionData, userProfile: UserProfile | null): boolean**
- Checks if recommendation should be blocked
- Returns boolean

**getSafeAlternatives(nutritionData: NormalizedNutritionData, userProfile: UserProfile | null, availableProducts: NormalizedNutritionData[]): SafeAlternative[]**
- Gets safe alternatives for a food item
- Returns array of alternatives with food, reason, comparison

**getSafetyReport(nutritionData: NormalizedNutritionData, userProfile: UserProfile | null): SafetyValidationResult & { risks: DietaryRisk[], recommendation: string }**
- Gets comprehensive safety report
- Returns validation result, risks, and recommendation

### 7.4 FruitMatcher

**Constructor**
```typescript
constructor(products: Product[], options?: MatchOptions)
```

**Options**
- `minSimilarityThreshold`: number (default: 50) - Minimum similarity score
- `includeSynonyms`: boolean (default: true) - Include synonym matching
- `considerNutritionalSimilarity`: boolean (default: true) - Consider nutrition in matching
- `maxAlternatives`: number (default: 3) - Maximum alternatives to return
- `filterUnsafe`: boolean (default: true) - Filter out unsafe items

**Methods**

**matchFruitToProduct(searchedFruit: string, availableProducts?: Product[]): FruitMatchResult**
- Matches searched fruit to products
- Returns match result with product, matchType, similarityScore, reason

**findSimilarFruits(searchedFruit: string, availableProducts?: Product[]): FruitMatchResult[]**
- Finds nutritionally similar fruits
- Returns array of similar fruits with similarity scores

**getBestAlternative(searchedFruit: string, availableProducts?: Product[], userProfile?: UserProfile): AlternativeSuggestion | undefined**
- Gets best alternative suggestion
- Returns alternative with product, similarityScore, safetyWarnings

### 7.5 UserProfileManager

**Static Methods**

**saveProfile(profile: UserProfile): Promise<void>**
- Saves user profile to localStorage
- Throws error if save fails

**getProfile(): UserProfile | null**
- Gets user profile from localStorage
- Returns profile or null if not found

**clearProfile(): Promise<void>**
- Clears user profile from localStorage
- Throws error if clear fails

**updateProfile(updates: ProfileUpdateOptions): Promise<UserProfile>**
- Updates user profile with partial data
- Returns updated profile

**validateAge(age?: number): ValidationResult**
- Validates age value
- Returns validation result with errors if invalid

**validateHeight(height?: number): ValidationResult**
- Validates height value
- Returns validation result with errors if invalid

**validateWeight(weight?: number): ValidationResult**
- Validates weight value
- Returns validation result with errors if invalid

**validateProfile(profile: UserProfile): ValidationResult**
- Validates complete profile
- Returns validation result with all errors

**hasDietaryRestriction(restriction: DietaryRestriction): boolean**
- Checks if user has specific dietary restriction
- Returns boolean

**hasCustomSensitivity(keyword: string): boolean**
- Checks if user has custom sensitivity matching keyword
- Returns boolean

**getDietaryRestrictions(): DietaryRestriction[]**
- Gets all dietary restrictions for user
- Returns array of restrictions

**hasProfile(): boolean**
- Checks if user has any profile data
- Returns boolean

**exportProfile(): string | null**
- Exports profile data as JSON string
- Returns JSON or null if no profile

**importProfile(jsonData: string): Promise<void>**
- Imports profile data from JSON string
- Throws error if import fails

### 7.6 NutritionCache

**Constructor**
```typescript
constructor(defaultTTL?: number, useLocalStorage?: boolean)
```

**Parameters**
- `defaultTTL`: number (default: 86400000) - Default time-to-live in milliseconds
- `useLocalStorage`: boolean (default: true) - Enable localStorage persistence

**Methods**

**get(searchTerm: string): NutritionSearchResult | null**
- Gets cached nutrition data
- Returns cached result or null if not found/expired

**set(searchTerm: string, data: NormalizedNutritionData, ttl?: number): void**
- Stores nutrition data in cache
- Optional custom TTL

**delete(searchTerm: string): void**
- Deletes cache entry for search term

**clear(): void**
- Clears all cache entries

**invalidateExpired(): number**
- Removes all expired cache entries
- Returns number of entries removed

**size(): number**
- Gets number of cache entries
- Returns count

**keys(): string[]**
- Gets all cache keys
- Returns array of keys

**has(searchTerm: string): boolean**
- Checks if search term is cached and not expired
- Returns boolean

**getStats(): CacheStats**
- Gets cache statistics
- Returns object with size, keys, expiredCount, validCount

---

## 8. Component Documentation

### 8.1 NutritionSearchPanel

**Main integration component** that combines all nutrition search functionality.

**Props**: None (self-contained)

**Features**:
- Search bar with debouncing
- Loading states
- Error handling
- Safety validation
- Product matching
- Cart integration
- User profile management

**Usage**:
```typescript
import NutritionSearchPanel from '@/components/nutrition-search-panel';

export default function MyPage() {
  return <NutritionSearchPanel />;
}
```

### 8.2 NutritionSearchBar

**Search input component** with loading and error states.

**Props**:
```typescript
interface NutritionSearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  error?: string | null;
  placeholder?: string;
}
```

**Features**:
- Debounced input (500ms)
- Clear button
- Loading spinner
- Error display
- Focus states

**Usage**:
```typescript
<NutritionSearchBar
  onSearch={handleSearch}
  isLoading={isLoading}
  error={error}
  placeholder="Search any fruit..."
/>
```

### 8.3 NutritionResultCard

**Result display card** showing nutrition information.

**Props**:
```typescript
interface NutritionResultCardProps {
  data: NutritionData;
  onAddToCart?: () => void;
  isAddingToCart?: boolean;
}
```

**NutritionData Interface**:
```typescript
interface NutritionData {
  name: string;
  icon?: string;
  caloriesPer100g: number;
  naturalSugarLevel: 'low' | 'moderate' | 'high';
  fiber: number;
  potassium?: number;
  magnesium?: number;
  vitaminC?: number;
  suggestedDailyQuantity: number;
  isUnsafe?: boolean;
  warningReason?: string;
}
```

**Features**:
- Fruit icon and name
- Calorie display
- Sugar level indicator
- Nutrient progress bars
- Suggested daily quantity
- Safety warnings
- Add to cart button

**Usage**:
```typescript
<NutritionResultCard
  data={cardData}
  onAddToCart={handleAddToCart}
  isAddingToCart={isAdding}
/>
```

### 8.4 SafetyWarningBanner

**Safety alert component** for displaying warnings.

**Props**:
```typescript
interface SafetyWarningBannerProps {
  data: SafetyWarningData;
  onDismiss: () => void;
}
```

**SafetyWarningData Interface**:
```typescript
interface SafetyWarningData {
  title: string;
  message: string;
  conditions: string[];
  severity: 'high' | 'moderate';
  showConsultationNote?: boolean;
}
```

**Features**:
- Severity-based styling
- Dismissible
- Consultation note for medical conditions
- Condition list

**Usage**:
```typescript
<SafetyWarningBanner
  data={safetyWarnings}
  onDismiss={() => setSafetyWarnings(null)}
/>
```

### 8.5 UserProfileForm

**User profile input form** with validation.

**Props**: None (self-contained)

**Features**:
- Age, height, weight inputs
- Activity level selector
- Fitness goal selector
- Health condition checkboxes
- Custom sensitivity input
- Real-time validation
- Auto-save to localStorage

**Usage**:
```typescript
<UserProfileForm />
```

### 8.6 AnimatedCartIcon

**Animated cart icon** with item addition animation.

**Props**: None (self-contained)

**Features**:
- Cart icon with badge
- Animation on item add
- Smooth transitions

**Usage**:
```typescript
<AnimatedCartIcon />
```

---

## 9. Safety Guidelines

### 9.1 Core Safety Principles

**1. Never Provide Medical Advice**
- The system provides nutritional information only
- Never diagnoses, treats, or prevents diseases
- Always includes consultation notes for health conditions
- Encourages users to consult healthcare professionals

**2. Conservative Approach**
- If uncertain, block the recommendation
- Use conservative thresholds for safety
- Prioritize user safety over sales
- Show warnings even for moderate risks

**3. Privacy First**
- All user data stored locally
- Never sent to external servers
- No tracking or analytics
- User has full control over their data

**4. Transparency**
- Clearly explain why items are blocked
- Show all safety warnings
- Provide alternative suggestions
- Explain risk levels and thresholds

### 9.2 Risk Thresholds

**Sugar Thresholds (grams per day)**
- Normal: 50g (WHO recommendation)
- Sugar Sensitive: 25g
- Diabetes: 15g

**Potassium Thresholds (mg per day)**
- Normal: 4700mg
- Potassium Sensitive: 2000mg
- Kidney Disease: 1500mg

**Acidity Thresholds (pH scale)**
- Normal: 4.0
- Acid Reflux: 4.5
- Severe Reflux: 5.0

**Risk Levels**
- LOW: < 20% of daily limit
- MODERATE: 20-30% of daily limit
- HIGH: 30-50% of daily limit
- AVOID: > 50% of daily limit

### 9.3 Blocking Rules

**Always Block When**:
- Risk level is AVOID
- Risk level is HIGH and applies to user profile
- Allergen matches user's allergies
- Custom sensitivity matches
- User has kidney disease and potassium > 200mg
- User has diabetes and sugar > 10g

**Show Warning When**:
- Risk level is MODERATE
- Risk level is HIGH but doesn't apply to profile
- Food is acidic and user has acid reflux

### 9.4 Alternative Suggestions

**When providing alternatives**:
- Must be safe for user profile
- Should be nutritionally similar
- Should explain why it's safer
- Should show comparison to original

**Example**:
```
Original: Dried Banana (High potassium)
Alternative: Dried Apple (Lower potassium)
Reason: Does not contain high potassium
Comparison: 500mg less potassium per 100g
```

### 9.5 Consultation Notes

**Always include consultation note when**:
- User has health conditions
- Item is blocked or has warnings
- Risk level is HIGH or AVOID

**Example text**:
```
Please consult with your healthcare provider before consuming
this product, especially if you have any health conditions.
```

### 9.6 Data Validation

**Validate All Inputs**:
- Age: 13-120 years
- Height: 50-250 cm
- Weight: 20-300 kg
- Nutrition values: Non-negative numbers

**Handle Edge Cases**:
- Missing user profile: Assume safe (no data = no restriction)
- Incomplete profile: Use available data, ignore missing
- Invalid data: Show error, don't process
- API failures: Use cached data if available

### 9.7 Ethical Considerations

**1. No Manipulation**
- Never force recommendations
- Never hide information
- Never exaggerate benefits
- Never downplay risks

**2. User Autonomy**
- User controls their profile
- User can clear their data
- User can ignore warnings
- User makes final decisions

**3. Accessibility**
- Clear, readable text
- High contrast colors
- Screen reader support
- Keyboard navigation

**4. Inclusivity**
- Support various dietary needs
- Respect cultural preferences
- Accommodate disabilities
- Provide alternatives

---

## 10. Future Enhancements

### 10.1 Planned Features

**1. Enhanced API Integration**
- Add more nutrition data sources (Edamam, Nutritionix)
- Implement API key rotation for better rate limiting
- Add support for branded products
- Include barcode scanning

**2. Advanced Personalization**
- Machine learning for preference learning
- Seasonal recommendations
- Time-of-day suggestions
- Workout-specific recommendations

**3. Expanded Food Database**
- More fruit varieties
- Nuts and seeds
- Vegetables
- Herbs and spices

**4. Enhanced Safety Features**
- Drug interaction checking
- Pregnancy/lactation considerations
- Age-specific recommendations
- Allergy cross-reactivity warnings

**5. Improved UI/UX**
- Voice search
- Image recognition for food identification
- AR nutrition labels
- Personalized dashboards

**6. Analytics & Insights**
- Nutrition tracking over time
- Goal progress visualization
- Deficiency identification
- Trend analysis

**7. Social Features**
- Share nutrition insights
- Community recipes
- Expert Q&A
- Success stories

**8. Mobile App**
- Native iOS and Android apps
- Offline mode
- Push notifications
- Barcode scanning

### 10.2 Technical Improvements

**1. Performance**
- Implement service workers for offline support
- Add Web Workers for heavy calculations
- Optimize bundle size
- Implement lazy loading

**2. Caching**
- Add IndexedDB for larger cache
- Implement cache warming
- Add cache versioning
- Smart cache invalidation

**3. Testing**
- Increase test coverage to 90%+
- Add E2E tests with Playwright
- Implement visual regression testing
- Add performance testing

**4. Monitoring**
- Error tracking (Sentry)
- Performance monitoring
- User analytics (privacy-focused)
- A/B testing framework

**5. Security**
- Implement CSP headers
- Add rate limiting
- Sanitize all inputs
- Regular security audits

### 10.3 Integration Opportunities

**1. E-commerce**
- Direct checkout integration
- Subscription management
- Loyalty program
- Gift recommendations

**2. Health Apps**
- Apple Health integration
- Google Fit integration
- Fitbit integration
- MyFitnessPal sync

**3. Smart Devices**
- Smart scale integration
- Fitness tracker sync
- Smart refrigerator
- Voice assistants (Alexa, Google Home)

**4. Healthcare**
- Telehealth platform integration
- Electronic health records (EHR)
- Prescription management
- Care coordination

### 10.4 Research & Development

**1. Nutrition Science**
- Stay updated on latest research
- Incorporate new findings
- Validate thresholds with experts
- Publish case studies

**2. User Research**
- Conduct user interviews
- Run usability tests
- Gather feedback
- Iterate based on insights

**3. Data Science**
- Analyze usage patterns
- Identify improvement areas
- Predict user needs
- Optimize recommendations

**4. Partnerships**
- Collaborate with nutritionists
- Partner with universities
- Work with health organizations
- Join industry associations

---

## Appendix

### A. Type Definitions

**Key Types**

```typescript
// Nutrition Data
interface NormalizedNutritionData {
  id: string;
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
  metadata?: {
    originalServingSize: number;
    originalServingUnit: string;
    isDried: boolean;
    category?: string;
    brand?: string;
  };
}

// User Profile
interface UserProfile {
  age?: number;
  height?: number;
  weight?: number;
  gender?: 'male' | 'female';
  activityLevel?: ActivityLevel;
  fitnessGoal?: FitnessGoal;
  healthSensitivities?: HealthSensitivity[];
  customSensitivities?: string[];
  updatedAt?: string;
}

// Dietary Risk
interface DietaryRisk {
  type: string;
  level: RiskLevel;
  description: string;
  cause: string;
  value: number;
  threshold: number;
  unit: string;
  appliesToProfile: boolean;
}

// Safe Consumption Range
interface SafeConsumptionRange {
  minGrams: number;
  maxGrams: number;
  recommendedGrams: number;
  reason: string;
  isConservative: boolean;
}
```

### B. Constants

**Activity Multipliers**
```typescript
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9
};
```

**Calorie Density Thresholds**
```typescript
const CALORIE_DENSITY = {
  low: 100,
  moderate: 250,
  high: 400
};
```

**Fiber Recommendations**
```typescript
const FIBER_RECOMMENDATIONS = {
  lowFiber: 10,
  normal: 25,
  highFiber: 35
};
```

### C. Error Handling

**Common Errors**

1. **API Fetch Failed**
   - Check internet connection
   - Verify API endpoints are accessible
   - Check rate limits
   - Fallback to cached data

2. **Cache Error**
   - Clear cache and retry
   - Check localStorage availability
   - Verify cache size limits

3. **Profile Validation Error**
   - Check input values
   - Verify data types
   - Review error messages
   - Correct invalid fields

4. **Safety Validation Error**
   - Review user profile
   - Check health conditions
   - Verify custom sensitivities
   - Consult healthcare provider

### D. Troubleshooting

**Issue: Search returns no results**
- Check spelling
- Try alternative names
- Verify internet connection
- Check API status

**Issue: Safety warnings appear incorrectly**
- Review user profile
- Check health conditions
- Verify custom sensitivities
- Clear and re-enter profile

**Issue: Cache not working**
- Check localStorage availability
- Verify browser settings
- Clear cache and retry
- Check for storage limits

**Issue: Performance issues**
- Clear expired cache
- Reduce cache size
- Check network speed
- Disable animations if needed

### E. Support & Resources

**Documentation**
- This file: Complete system documentation
- Code comments: Inline documentation
- Type definitions: TypeScript interfaces
- README files: Component-specific docs

**Community**
- GitHub Issues: Bug reports and feature requests
- Discussions: Questions and answers
- Wiki: Additional resources
- Examples: Code samples and demos

**Professional Support**
- Nutrition consultation: Healthcare providers
- Technical support: Development team
- Integration help: Solution architects
- Training: Onboarding sessions

---

## Version History

**v1.0.0** (Current)
- Initial release
- Core nutrition intelligence engine
- Safety validation system
- Fruit-to-product matching
- User profile management
- Caching system
- API integration (OpenFoodFacts, USDA)
- Complete UI components

---

## License

This system is part of the SUNYA project. All rights reserved.

---

## Contact

For questions, feedback, or support:
- Development Team: dev@sunya.com
- Documentation: docs@sunya.com
- Support: support@sunya.com

---

*Last Updated: January 2026*
