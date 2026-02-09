# Comparison Table Design Specifications

## Overview
This document outlines the detailed design specifications for a comparison table contrasting junk food with healthy snacks. The table will be integrated into the homepage as per the existing integration plan, positioned after the Featured Products section and before the InteractiveNutrition component. The design emphasizes conciseness, engagement, and user-friendliness, using visual cues like colors, icons, and tooltips to highlight differences.

## Table Structure
The table will use a simple 3-column layout for clarity:
- **Column 1: Aspect** - The category being compared (e.g., Nutritional Value).
- **Column 2: Junk Food** - Negative aspects with red highlighting.
- **Column 3: Healthy Snack** - Positive aspects with green highlighting.

Rows correspond to the specified aspects: Nutritional Value, Health Benefits, Ingredients, Taste, Price, and Environmental Impact.

## Content Specifications
Each cell contains 2-3 bullet points contrasting the negatives of junk food with the positives of healthy snacks. Content is factual, balanced, and engaging.

### Nutritional Value
- **Junk Food**: High in empty calories, sugars, and unhealthy fats; low in vitamins and minerals; contributes to weight gain.
- **Healthy Snack**: Rich in vitamins, minerals, and fiber; supports energy and metabolism; promotes overall health.

### Health Benefits
- **Junk Food**: Increases risk of obesity, diabetes, and heart disease; poor digestion and nutrient absorption.
- **Healthy Snack**: Boosts immunity, improves digestion, and reduces disease risk; provides sustained energy without crashes.

### Ingredients
- **Junk Food**: Artificial additives, preservatives, and high-fructose corn syrup; often genetically modified or processed.
- **Healthy Snack**: Natural, whole ingredients like fruits, nuts, and vegetables; minimal processing and no artificial additives.

### Taste
- **Junk Food**: Initially satisfying but leads to cravings and dissatisfaction; often overly salty or sweet.
- **Healthy Snack**: Naturally flavorful with subtle sweetness; develops appreciation over time and satisfies without guilt.

### Price
- **Junk Food**: Cheap upfront but costly in health expenses and long-term medical bills.
- **Healthy Snack**: Slightly higher initial cost but saves money on healthcare and provides better value for nutrition.

### Environmental Impact
- **Junk Food**: High carbon footprint from industrial farming and packaging; contributes to pollution and waste.
- **Healthy Snack**: Lower environmental impact with sustainable sourcing; supports eco-friendly practices and reduces waste.

## HTML Structure
The table will be built using semantic HTML for accessibility. Use a `<table>` element with `<thead>` and `<tbody>` for structure.

```html
<section class="comparison-section">
  <h2>Why Choose Healthy Snacks Over Junk Food?</h2>
  <table class="comparison-table">
    <thead>
      <tr>
        <th>Aspect</th>
        <th class="junk-header">🍔 Junk Food</th>
        <th class="healthy-header">🥦 Healthy Snack</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Nutritional Value</td>
        <td class="negative" title="Tooltip: Detailed explanation...">• High in empty calories...<br>• Low in vitamins...</td>
        <td class="positive" title="Tooltip: Detailed explanation...">• Rich in vitamins...<br>• Supports energy...</td>
      </tr>
      <!-- Repeat for other rows -->
    </tbody>
  </table>
</section>
```

## CSS Classes and Styling
Use Tailwind CSS classes for consistency with the project (assuming Tailwind is used based on config files).

- **.comparison-section**: Container with padding, background (e.g., `bg-gray-50 p-6 rounded-lg`).
- **.comparison-table**: Full width, bordered, with `border-collapse: collapse`.
- **.negative**: Red highlight (e.g., `bg-red-100 text-red-800`).
- **.positive**: Green highlight (e.g., `bg-green-100 text-green-800`).
- **Headers**: Bold, centered (e.g., `font-bold text-center`).
- **Cells**: Padding for readability (e.g., `p-4`).

Additional styling for engagement: Subtle animations on hover (e.g., `hover:bg-opacity-75`).

## Icons and Emojis Usage
- **Junk Food Column Header**: 🍔 (hamburger emoji) to represent unhealthy eating.
- **Healthy Snack Column Header**: 🥦 (broccoli emoji) to represent nutritious options.
- **Inline in Content**: Use relevant emojis sparingly, e.g., ⚠️ for warnings in negatives, ✅ for positives.
- Ensure emojis are accessible; consider alt text if needed.

## Tooltip Implementation
Use native HTML `title` attribute for simple tooltips. For enhanced UX, integrate a library like Tippy.js or Bootstrap tooltips.
- **Trigger**: Hover over cells.
- **Content**: Expanded explanations, e.g., "Junk food often contains trans fats that raise bad cholesterol levels."
- **Styling**: Match theme colors; position above/below for mobile compatibility.

## Responsive Design
Ensure the table stacks on mobile for readability. Use media queries in CSS.

- **Desktop (>1024px)**: Full table display.
- **Tablet (768px-1023px)**: Reduce padding; keep table but adjust font size.
- **Mobile (<768px)**: Convert to stacked cards or accordion.
  ```css
  @media (max-width: 767px) {
    .comparison-table {
      display: block;
    }
    .comparison-table thead {
      display: none;
    }
    .comparison-table tbody tr {
      display: block;
      margin-bottom: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .comparison-table td {
      display: block;
      text-align: left;
      padding: 0.5rem;
    }
    .comparison-table td:before {
      content: attr(data-label) ": ";
      font-weight: bold;
    }
  }
  ```

## User-Friendliness and Engagement
- **Conciseness**: Limit to 2-3 bullets per cell; use short, impactful sentences.
- **Engagement**: Color coding, emojis, and tooltips draw attention; consider adding a call-to-action below the table.
- **Accessibility**: Use semantic HTML, alt text for emojis, and ensure color contrast (WCAG AA compliant).
- **Testing**: Verify on various devices; gather user feedback for improvements.