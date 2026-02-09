# Enhanced Nutritional Intelligence Panel - Implementation Guide

## Overview

This guide documents the enhanced Nutritional Intelligence panel with search functionality, smart recommendation engine, and premium UX/UI design for the SUNYA website.

## Features Implemented

### 1. Search Functionality
- **Location**: Bottom of the panel (prominent search section)
- **Input Fields**:
  - Food name search (supports global food names)
  - Quantity in grams (1-1000g range)
  - Quick search suggestions for popular foods
- **Search Types**:
  - Fresh foods
  - Dehydrated foods
  - Cooked options
- **On Search**:
  - Displays nutrition breakdown with macro and micronutrients
  - Dynamically highlights deficiencies
  - Triggers recommendation engine

### 2. Smart Recommendation Engine
- **Matching Logic**:
  - Maps search query to SUNYA product catalog
  - Calculates match score based on:
    - Direct name match (50 points)
    - Type match (dehydrated preference, 30 points)
    - Gym focus alignment (15-25 points)
- **Recommendations Include**:
  - Exact quantity meeting user's nutrition needs
  - Daily consumption suggestion
  - Comparison text (e.g., "100g of banana → 1 pack dehydrated banana = same energy + more fiber")
  - Price per serving
  - Match score percentage
- **Personalization**:
  - Stores recent searches in localStorage
  - Suggests complementary products based on search history
  - Highlights products users haven't bought yet

### 3. UX/UI Design
- **Premium Luxury Feel**:
  - Color palette: Deep green (`#0A2F1E`), muted gold (`#D4AF37`), soft ivory (`#FAF9F6`)
  - Gradient backgrounds
  - Subtle shadows and rounded corners
- **Animations**:
  - Soft glow on recommended products
  - Scale-up on hover (1.05x)
  - Smooth transitions (300-700ms)
  - Bounce animation for exit banner
- **Micro-copy Nudges**:
  - "Don't miss your daily boost!"
  - "Fuel your body with precision"
  - "Perfect for your daily wellness"
  - "Your wellness pack is waiting 🛒"
- **Visual Elements**:
  - Energy bars with color-coded nutrients
  - Macro-rings showing daily value percentages
  - Match score badges
  - Deficiency alerts with lightning bolt icon

### 4. Conversion Dynamics
- **Deficiency Detection**:
  - Highlights recommended products visually
  - Text: "Boost your X today!"
  - Shows which nutrients are low
- **Exit Intent**:
  - Floating mini-banner when user leaves without adding
  - "Your wellness pack is waiting 🛒"
- **Daily Engagement**:
  - Suggests small daily portions (30g standard)
  - Shows cumulative benefits graph over 7 days
  - Tracks daily additions

### 5. Responsive Design
- **Mobile-First**:
  - Panel adjusts to screen size
  - Recommended products stack vertically on mobile
  - Touch-friendly CTA buttons
  - Sticky recommendation panel on mobile
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### 6. Accessibility
- **Keyboard Navigation**:
  - All interactive elements are keyboard accessible
  - Enter key triggers search
  - Tab order follows logical flow
- **Screen Reader Support**:
  - ARIA labels on all buttons and inputs
  - Semantic HTML structure
  - Clear labels for recommended products
- **Visual Accessibility**:
  - High contrast ratios
  - Clear typography
  - Color-coded nutrients with text labels

## File Structure

```
lib/
├── nutrition-data.ts          # Food database with gram-based calculations
├── recommendation-engine.ts   # Smart recommendation logic
└── products.ts                # Product catalog (updated with mango & strawberry)

components/
└── enhanced-nutrition-panel.tsx  # Main component with all features
```

## Integration Guide

### Step 1: Import the Component

```tsx
import { EnhancedNutritionPanel } from "@/components/enhanced-nutrition-panel"
```

### Step 2: Wrap with Cart Provider

The component uses the existing cart system. Ensure your app is wrapped with `CartProvider`:

```tsx
import { CartProvider } from "@/lib/cart/use-cart"
import { createCartStore } from "@/lib/cart/store"

const cartStore = createCartStore()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider store={cartStore}>
      {children}
    </CartProvider>
  )
}
```

### Step 3: Add to Page

```tsx
export default function NutritionPage() {
  return (
    <main>
      <EnhancedNutritionPanel />
    </main>
  )
}
```

### Step 4: Replace Existing Panel

To replace the existing `InteractiveNutrition` component:

1. Find where `InteractiveNutrition` is imported
2. Replace with `EnhancedNutritionPanel`
3. Remove the old component file if desired

## API Reference

### Nutrition Data Functions

```typescript
// Search food database
searchFood(query: string): FoodItem[]

// Calculate nutrition based on grams
calculateNutrition(food: FoodItem, grams: number): NutritionPer100g

// Get daily value percentages
getDailyValuePercentages(nutrition: NutritionPer100g): DailyValuePercentages

// Identify deficiencies
identifyDeficiencies(nutrition: NutritionPer100g): string[]
```

### Recommendation Engine Functions

```typescript
// Get recommendations based on food search
getRecommendations(
  food: FoodItem,
  grams: number,
  searchHistory?: SearchHistory[]
): Recommendation[]

// Store search history
storeSearchHistory(search: SearchHistory): void

// Get search history
getSearchHistory(): SearchHistory[]

// Clear search history
clearSearchHistory(): void

// Get products user hasn't bought yet
getNewProductsToTry(
  purchasedProductIds: number[],
  limit?: number
): Product[]
```

## Data Structures

### FoodItem

```typescript
interface FoodItem {
  id: string
  name: string
  type: 'fresh' | 'dehydrated' | 'cooked'
  description: string
  nutrition: NutritionPer100g
  benefits: string[]
  gymFocus: 'muscle-gain' | 'fat-loss' | 'endurance' | 'general'
}
```

### NutritionPer100g

```typescript
interface NutritionPer100g {
  calories: number
  protein: number        // grams
  carbs: number          // grams
  fiber: number          // grams
  fat: number            // grams
  vitaminC: number       // mg
  potassium: number      // mg
  antioxidants: number   // ORAC units
  magnesium: number      // mg
  vitaminB6: number      // mg
  bromelain?: number     // GDU (for pineapple)
}
```

### Recommendation

```typescript
interface Recommendation {
  product: Product
  matchScore: number
  suggestedQuantity: number  // in grams
  reason: string
  comparison: string
  benefits: string[]
  gymFocus: string
  pricePerServing: number
}
```

## Customization

### Adding New Foods

Edit `lib/nutrition-data.ts`:

```typescript
export const foodDatabase: FoodItem[] = [
  // ... existing foods
  {
    id: 'new-food-fresh',
    name: 'New Food (Fresh)',
    type: 'fresh',
    description: 'Description here',
    nutrition: {
      calories: 100,
      protein: 2.0,
      carbs: 20.0,
      fiber: 3.0,
      fat: 0.5,
      vitaminC: 50,
      potassium: 200,
      antioxidants: 1000,
      magnesium: 20,
      vitaminB6: 0.1,
    },
    benefits: ['Benefit 1', 'Benefit 2'],
    gymFocus: 'general',
  },
]
```

### Adding New Products

Edit `lib/products.ts`:

```typescript
export const products: Product[] = [
  // ... existing products
  {
    id: 9,
    name: "New Product",
    nrsPrice: 2999,
    description: "Product description",
    features: ["Feature 1", "Feature 2"],
    image: "/product-image.jpg",
    badge: "Badge Text",
  },
]
```

### Updating Food-to-Product Mapping

Edit `lib/recommendation-engine.ts`:

```typescript
const foodToProductMap: Record<string, number> = {
  'new-food-fresh': 9,
  'new-food-dried': 9,
}
```

### Customizing Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  'luxury-dark-green': '#0A2F1E',
  'luxury-gold': '#D4AF37',
  'soft-ivory': '#FAF9F6',
  // ... add or modify colors
}
```

## Testing

### Manual Testing Checklist

- [ ] Search for various foods (fresh, dehydrated, cooked)
- [ ] Test different gram quantities (1g, 100g, 500g, 1000g)
- [ ] Verify nutrition calculations are accurate
- [ ] Check recommendations appear correctly
- [ ] Test "Add to Cart" functionality
- [ ] Verify cart integration works
- [ ] Test exit intent banner
- [ ] Check cumulative benefits tracking
- [ ] Test on mobile devices
- [ ] Test keyboard navigation
- [ ] Test with screen reader

### Automated Testing

Create test files:

```typescript
// lib/nutrition-data.test.ts
import { calculateNutrition, searchFood } from './nutrition-data'

describe('Nutrition Data', () => {
  it('should calculate nutrition correctly', () => {
    const food = foodDatabase[0]
    const nutrition = calculateNutrition(food, 100)
    expect(nutrition.calories).toBe(food.nutrition.calories)
  })

  it('should search foods correctly', () => {
    const results = searchFood('banana')
    expect(results.length).toBeGreaterThan(0)
  })
})
```

## Performance Considerations

- **Search**: O(n) complexity where n is number of foods in database
- **Recommendations**: O(1) for direct mapping, O(m) for complementary products where m is search history length
- **LocalStorage**: Stores last 20 searches to prevent bloat
- **Animations**: CSS transitions for smooth performance
- **Images**: Lazy loading recommended for product images

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

## Future Enhancements

1. **AI-Powered Synonyms**: Integrate free AI API for better food matching
2. **User Profiles**: Store user preferences and goals
3. **Recipe Integration**: Suggest recipes based on nutrition needs
4. **Social Sharing**: Share nutrition profiles and recommendations
5. **Analytics**: Track user engagement and conversion rates
6. **A/B Testing**: Test different micro-copy and CTA variations

## Troubleshooting

### Issue: Recommendations not appearing
**Solution**: Check that food-to-product mapping exists in `recommendation-engine.ts`

### Issue: Cart integration not working
**Solution**: Ensure `CartProvider` wraps the component tree

### Issue: Search history not persisting
**Solution**: Check browser localStorage permissions

### Issue: Animations not smooth
**Solution**: Check for reduced motion preference in user settings

## Support

For issues or questions, refer to:
- Component: `components/enhanced-nutrition-panel.tsx`
- Nutrition Data: `lib/nutrition-data.ts`
- Recommendation Engine: `lib/recommendation-engine.ts`
- Product Catalog: `lib/products.ts`

## License

This implementation is part of the SUNYA project and follows the project's license terms.
