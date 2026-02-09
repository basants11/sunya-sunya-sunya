# SUNYA Care - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Verify Installation

All components are already created and integrated. No additional installation needed!

### Step 2: Test the Feature

1. Start your development server:
```bash
npm run dev
```

2. Open your browser to `http://localhost:3000`

3. Look for the **SUNYA Care** button in the header (green gradient button with heart icon)

4. Click the button to open the SUNYA Care panel

### Step 3: Try the User Form

1. Fill in your personal information:
   - Age: 30
   - Height: 175 cm
   - Weight: 70 kg
   - Gender: Male (optional)

2. Select your fitness goal:
   - Muscle Gain 💪
   - Weight Loss 🎯
   - Endurance 🏃
   - General Wellness ✨

3. Choose your activity level:
   - Sedentary (Little or no exercise)
   - Moderate (Exercise 3-5 days/week)
   - High (Exercise 6-7 days/week)

4. Select any health conditions (optional):
   - None
   - Diabetes
   - Hypertension
   - Heart Condition
   - Kidney Issues
   - Allergies

5. Click **"Get Personalized Recommendations"**

### Step 4: Explore Your Recommendations

After a brief loading animation, you'll see:

**Overview Tab:**
- Your profile summary
- Daily nutrition requirements with animated rings
- Macronutrient breakdown bars
- Safety advice based on your conditions
- Unsafe foods warning (if any)
- Compact daily package preview

**Products Tab:**
- Personalized product recommendations
- Each card shows:
  - Product image and name
  - Safety badge (Safe/Caution)
  - Priority level
  - Recommended daily quantity
  - Nutritional contribution
  - Add to cart button

**Daily Package Tab:**
- Complete daily package summary
- Total calories, protein, fiber
- Daily and monthly pricing
- Subscribe button
- What's included breakdown

### Step 5: Add Products to Cart

1. On any product card, adjust the quantity using +/- buttons
2. Click **"Add"** to add to cart
3. Watch the cart icon update in the header
4. Navigate to checkout to complete your purchase

### Step 6: Subscribe to Daily Package

1. Go to the **Daily Package** tab
2. Review the package contents and pricing
3. Click **"Subscribe to Your Custom Daily Package"**
4. All package items are added to cart
5. Navigate to checkout to complete subscription

## 🎨 Key Features to Explore

### 1. Nutrition Rings
- Animated circular progress indicators
- Color-coded status (green = adequate, red = deficient)
- Hover for detailed information
- Responsive grid layout

### 2. Safety Checks
- Automatic food safety analysis
- Clear warnings for unsafe foods
- Safe alternatives suggested
- Micro-copy explanations

### 3. Luxury Animations
- Smooth slide-in effects
- Pulse glow on buttons
- Shimmer effects
- Staggered card animations

### 4. Responsive Design
- Desktop: Side panel
- Mobile: Full-screen slide-up
- Touch-friendly controls
- Optimized for all screen sizes

## 🔧 Customization

### Change Colors

Edit the color values in component files:

```typescript
// In sunya-care-panel.tsx
const primaryColor = '#00C950'; // Primary green
const secondaryColor = '#00A040'; // Secondary green
```

### Modify Safety Rules

Edit [`lib/food-safety-engine.ts`](lib/food-safety-engine.ts):

```typescript
const safetyRules: SafetyRule[] = [
  {
    condition: 'your-condition',
    check: (nutrition) => {
      // Your custom logic
      return nutrition.someValue < threshold;
    },
    reason: 'Your reason',
    microCopy: 'User-facing message'
  }
];
```

### Adjust Animations

Edit [`app/globals.css`](app/globals.css):

```css
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

## 📊 Understanding the Data

### Daily Requirements

The system calculates:
- **Calories**: Based on BMR × activity multiplier ± goal adjustment
- **Protein**: 20-35% of calories (varies by goal)
- **Carbs**: 35-60% of calories (varies by goal)
- **Fat**: 20-30% of calories (varies by goal)
- **Fiber**: Base 25g + weight-based adjustment
- **Micronutrients**: Age and gender-based RDA values

### Match Score

Products are scored 0-100 based on:
- Safety (40 points max)
- Nutritional alignment (30 points max)
- Fitness goal alignment (20 points max)
- Type preference (10 points max)

### Priority Levels

- **High**: Score ≥ 80
- **Medium**: Score 60-79
- **Low**: Score < 60

## 🐛 Troubleshooting

### Panel Not Opening

**Problem**: Clicking SUNYA Care button does nothing

**Solution**:
1. Check browser console for errors
2. Verify all components are imported correctly
3. Ensure React state is updating

### Recommendations Not Generating

**Problem**: Loading animation continues indefinitely

**Solution**:
1. Check all required form fields are filled
2. Verify profile data is valid
3. Check console for calculation errors

### Cart Not Updating

**Problem**: Add to cart doesn't update cart count

**Solution**:
1. Verify cart store is initialized
2. Check product IDs match catalog
3. Ensure useCart hook is properly used

### Animations Not Smooth

**Problem**: Animations are jerky or not playing

**Solution**:
1. Check CSS is loaded
2. Verify browser supports animations
3. Check for conflicting animations

## 📱 Testing on Different Devices

### Desktop
- Panel opens from right side
- Full feature set available
- Hover effects work

### Tablet
- Panel adjusts width
- Touch-friendly controls
- Optimized layout

### Mobile
- Full-screen panel
- Slide-up animation
- Touch-optimized buttons
- Simplified navigation

## 🔒 Privacy & Safety

### Data Privacy
- All calculations happen client-side
- No data sent to external servers
- No personal information stored
- Session-based only

### Medical Disclaimer
- Educational purposes only
- Not medical advice
- Consult healthcare provider
- Evidence-based recommendations

### Food Safety
- Based on open data sources
- USDA, WHO, FAO guidelines
- No paid AI APIs
- Transparent reasoning

## 📚 Additional Resources

- [Implementation Guide](./sunya-care-implementation-guide.md) - Detailed technical documentation
- [Component Source Code](../components/) - All component files
- [Library Files](../lib/) - Calculation engines and utilities

## 🎯 Next Steps

1. **Customize**: Adjust colors, animations, and rules to match your brand
2. **Test**: Try different user profiles and conditions
3. **Integrate**: Connect to your existing systems
4. **Monitor**: Track user engagement and feedback
5. **Iterate**: Improve based on real usage data

## 💡 Tips for Best Results

1. **Be Accurate**: Provide accurate health information for better recommendations
2. **Update Regularly**: Recalculate if your health profile changes
3. **Read Safety Warnings**: Pay attention to unsafe food alerts
4. **Start Small**: Try recommended quantities before increasing
5. **Consult Professionals**: Always check with healthcare providers

## 🎉 You're Ready!

The SUNYA Care personalized health panel is now fully integrated and ready to use. Click the SUNYA Care button in the header to get started with your personalized nutrition recommendations!

---

**Need Help?** Check the [Implementation Guide](./sunya-care-implementation-guide.md) for detailed technical documentation.

**Found a Bug?** Report it with steps to reproduce and expected behavior.

**Have Suggestions?** We'd love to hear your ideas for improvements!
