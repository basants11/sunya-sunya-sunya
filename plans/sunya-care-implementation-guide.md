# SUNYA Care Personalized Health Panel - Implementation Guide

## Overview

SUNYA Care is a comprehensive personalized nutrition and health recommendation system that provides users with tailored product suggestions based on their individual health profile, fitness goals, and dietary restrictions.

## Features Implemented

### 1. Personalized Nutrition Calculator
**File:** [`lib/nutrition-calculator.ts`](lib/nutrition-calculator.ts)

Calculates daily macro/micronutrient requirements based on:
- Age, height, weight, gender
- Fitness goals (muscle gain, weight loss, endurance, general wellness)
- Activity level (sedentary, moderate, high)
- Health conditions (diabetes, hypertension, heart, kidney, allergies)

**Key Functions:**
- `calculateDailyRequirements()` - Computes complete daily nutritional needs
- `calculateNutrientStatus()` - Tracks current vs required intake
- `calculateProductIntake()` - Suggests daily quantities per product
- `validateProfile()` - Validates user input data

### 2. Food Safety Engine
**File:** [`lib/food-safety-engine.ts`](lib/food-safety-engine.ts)

Uses open data sources to determine food safety:
- USDA FoodData Central nutrient limits
- WHO/FAO dietary guidelines
- Open Food Facts allergen database

**Key Functions:**
- `checkFoodSafety()` - Determines if a food is safe for user's conditions
- `batchCheckFoodSafety()` - Checks multiple foods at once
- `getSafetyAdvice()` - Provides personalized safety recommendations
- Caching system for performance optimization

**Safety Levels:**
- **Safe** - No restrictions for user's profile
- **Caution** - Use with moderation
- **Avoid** - Not recommended for user's conditions

### 3. Personalized Recommendation Engine
**File:** [`lib/personalized-recommendation-engine.ts`](lib/personalized-recommendation-engine.ts)

Combines nutrition calculation and food safety to generate personalized recommendations.

**Key Functions:**
- `generatePersonalizedRecommendations()` - Creates complete recommendation summary
- `generateDailyPackage()` - Creates daily subscription package
- `getRecommendationStats()` - Provides recommendation statistics

**Recommendation Components:**
- Match score (0-100) based on safety and nutritional alignment
- Priority levels (high, medium, low)
- Daily quantity suggestions in grams
- Nutritional contribution breakdown
- Safety micro-copy explanations

### 4. User Data Input Form
**File:** [`components/sunya-care-user-form.tsx`](components/sunya-care-user-form.tsx)

Beautiful, intuitive form for collecting user profile data:
- Personal information (age, gender, height, weight)
- Fitness goal selection with visual icons
- Activity level selection
- Health conditions multi-select
- Real-time validation
- Error handling and display

### 5. Nutrition Visual Rings
**File:** [`components/nutrition-rings.tsx`](components/nutrition-rings.tsx)

Animated circular progress indicators for:
- Calories, Protein, Carbs, Fiber, Fat
- Vitamin C, Potassium, Magnesium

**Features:**
- Intersection Observer for lazy loading
- Smooth animations on scroll into view
- Color-coded status indicators (deficient, adequate, excess)
- Responsive grid layout
- Progress summary with average percentage

**Additional Component:** `MacroBars` - Linear progress bars for macronutrients

### 6. Recommended Product Cards
**File:** [`components/recommended-product-card.tsx`](components/recommended-product-card.tsx)

Luxurious product cards with:
- Product image with hover zoom effect
- Priority and safety badges
- Recommendation reason and benefits
- Nutritional contribution display
- Quantity selector with +/- buttons
- Add to cart integration
- Micro-copy on hover

**Grid Component:** `RecommendedProductsGrid` - Displays multiple cards with staggered animations

### 7. Unsafe Foods Warning
**File:** [`components/unsafe-foods-warning.tsx`](components/unsafe-foods-warning.tsx)

Clear visual warnings for foods to avoid:
- Severity-based color coding (red for avoid, yellow for caution)
- Detailed reasons for each restriction
- Safe alternatives suggestions
- Safety notice with disclaimer
- Modal and compact view options

### 8. Daily Package Subscription
**File:** [`components/daily-package-subscription.tsx`](components/daily-package-subscription.tsx)

Premium subscription interface with:
- Package summary with nutritional totals
- Coverage percentage indicator
- Daily and monthly pricing
- Subscribe button with pulse animation
- Add to cart functionality
- What's included breakdown
- Benefits showcase

**Compact Version:** `CompactDailyPackage` - For quick overview

### 9. SUNYA Care Panel
**File:** [`components/sunya-care-panel.tsx`](components/sunya-care-panel.tsx)

Main panel component integrating all features:
- Tabbed interface (Overview, Products, Daily Package)
- User profile summary
- Nutrition rings and macro bars
- Safety advice display
- Unsafe foods compact view
- Modal dialogs for detailed views
- Responsive design (desktop side panel, mobile full screen)

**Button Component:** `SunyaCareButton` - Header trigger button

### 10. Header Integration
**File:** [`components/header.tsx`](components/header.tsx)

Integrated SUNYA Care button into main navigation:
- Positioned between search and cart
- Gradient styling with luxury branding
- Click opens SUNYA Care panel

### 11. Luxury Animations
**File:** [`app/globals.css`](app/globals.css)

Premium animations for enhanced UX:
- `slideInRight` - Panel entrance
- `slideIn` - Content fade-in
- `pulseGlow` - Button hover effects
- `shimmerLuxury` - Premium shimmer effect
- `float` - Subtle floating animation
- `scaleIn` - Smooth scaling
- `ringProgress` - Nutrition ring animation
- Staggered delays for sequential animations
- Custom scrollbar styling
- Smooth scrolling

## Architecture

### Data Flow

```
User Input Form
    ↓
UserProfile
    ↓
Nutrition Calculator → DailyRequirements
    ↓
Food Safety Engine → SafetyResults
    ↓
Recommendation Engine → PersonalizedRecommendations
    ↓
UI Components (Panel, Cards, Rings, etc.)
```

### Component Hierarchy

```
Header
└── SunyaCareButton
    ↓
SunyaCarePanel
├── SunyaCareUserForm
├── NutritionRings
├── MacroBars
├── RecommendedProductsGrid
│   └── RecommendedProductCard
├── UnsafeFoodsWarning
└── DailyPackageSubscription
```

## Usage

### Basic Usage

```tsx
import { SunyaCarePanel, SunyaCareButton } from '@/components/sunya-care-panel';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SunyaCareButton onClick={() => setIsOpen(true)} />
      <SunyaCarePanel 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
```

### With Initial Profile

```tsx
<SunyaCarePanel
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  initialProfile={{
    age: 30,
    height: 175,
    weight: 70,
    fitnessGoal: 'general-wellness',
    activityLevel: 'moderate',
    healthConditions: ['none']
  }}
/>
```

### Programmatic Recommendations

```tsx
import { generatePersonalizedRecommendations } from '@/lib/personalized-recommendation-engine';

const profile: UserProfile = {
  age: 30,
  height: 175,
  weight: 70,
  fitnessGoal: 'muscle-gain',
  activityLevel: 'high',
  healthConditions: ['none']
};

const recommendations = generatePersonalizedRecommendations(profile);
```

## Customization

### Colors

The SUNYA Care system uses the luxury SUNYA palette:
- Primary Green: `#00C950`
- Secondary Green: `#00A040`
- Accent Orange: `#FF6900`
- Accent Purple: `#9810FA`
- Accent Brown: `#BB4D00`

Modify these in the component files to match your brand.

### Animations

Animation speeds and effects can be customized in [`app/globals.css`](app/globals.css):
- Adjust duration in `@keyframes` definitions
- Modify easing functions
- Change delay values in `.delay-*` classes

### Safety Rules

Add or modify safety rules in [`lib/food-safety-engine.ts`](lib/food-safety-engine.ts):

```typescript
const safetyRules: SafetyRule[] = [
  {
    condition: 'your-condition',
    check: (nutrition) => {
      // Your safety logic
      return true;
    },
    reason: 'Explanation',
    microCopy: 'User-facing message'
  }
];
```

## Performance Optimizations

1. **Caching**: Food safety results are cached to avoid redundant calculations
2. **Lazy Loading**: Nutrition rings animate only when visible
3. **Debouncing**: Form inputs are debounced where appropriate
4. **Memoization**: React hooks used for expensive calculations

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Focus indicators

## Responsive Design

- **Desktop**: Side panel (max-width: 2xl)
- **Tablet**: Side panel with adjusted width
- **Mobile**: Full-screen panel with slide-up animation
- Touch-friendly buttons and controls

## Safety & Trust

### Medical Disclaimer

All components include clear disclaimers:
- "This information is for educational purposes only"
- "Should not replace professional medical advice"
- "Always consult with your healthcare provider"

### Data Privacy

- No personal data is sent to external servers
- All calculations happen client-side
- No paid AI APIs used
- Open data sources only

### Ethical Considerations

- No harmful product recommendations
- Transparent safety reasoning
- Clear indication of safe/avoid foods
- Data-driven, AI-backed recommendations
- Genuine, evidence-based advice

## Testing

### Manual Testing Checklist

- [ ] User form validates all inputs correctly
- [ ] Nutrition calculations match expected values
- [ ] Food safety checks work for all conditions
- [ ] Recommendations are personalized and relevant
- [ ] Product cards display correctly
- [ ] Add to cart functionality works
- [ ] Unsafe foods are properly highlighted
- [ ] Daily package subscription works
- [ ] Animations are smooth and performant
- [ ] Responsive design works on all devices
- [ ] Panel opens and closes correctly
- [ ] Tab navigation works
- [ ] Modals display properly

### Automated Testing

Run existing tests:
```bash
npm test
```

## Future Enhancements

### Potential Improvements

1. **Integration with Health Apps**
   - Connect to Apple Health, Google Fit
   - Import existing health data
   - Export recommendations

2. **Advanced Analytics**
   - Track user engagement
   - Measure recommendation effectiveness
   - A/B testing for UI

3. **Machine Learning**
   - Learn from user preferences
   - Improve recommendation accuracy
   - Personalize over time

4. **Social Features**
   - Share recommendations
   - Community challenges
   - Progress tracking

5. **Expanded Food Database**
   - More product categories
   - Custom food entries
   - Recipe suggestions

## Troubleshooting

### Common Issues

**Issue**: Recommendations not generating
- Check user profile is complete
- Verify all required fields are filled
- Check console for errors

**Issue**: Animations not smooth
- Check browser compatibility
- Verify CSS is loaded
- Check for conflicting animations

**Issue**: Cart integration not working
- Verify cart store is initialized
- Check product IDs match
- Ensure useCart hook is properly used

## Support

For issues or questions:
1. Check this documentation
2. Review component source code
3. Check console for errors
4. Verify data flow in React DevTools

## License

This implementation is part of the SUNYA project and follows the project's licensing terms.

---

**Last Updated:** 2026-01-26
**Version:** 1.0.0
