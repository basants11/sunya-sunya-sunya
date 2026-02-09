# Gifting Page Visual Update Plan

## Overview
The current gifting page is text-heavy with no direct product imagery. This plan incorporates high-dopamine but elegant visual elements to evoke warmth, safety, comfort, and desire to gift, while maintaining luxury branding. Avoids medical imagery, bright red/hot pink, and loud gradients.

## 1. Specific Sections to Add/Modify with Visual Elements

### Hero Section
- **Modification**: Add a full-width background image featuring a decorated gift box with soft ribbons and tissue paper, illuminated by warm lighting.
- **Visual Elements**: Decorated gift box, soft ribbons, tissue paper, warm lighting, subtle fruit accents.

### Gift Collections Section
- **Modification**: Add product imagery to each gift option card.
- **Visual Elements**: High-quality images of gift boxes with fruits, gentle hands placing gifts.

### Why Gift Sunya Section
- **Modification**: Add illustrative images to each benefit card.
- **Visual Elements**: Calm comforting fruits, elegant packaging.

### Bulk & Corporate Section
- **Modification**: Add background imagery and icons with visual context.
- **Visual Elements**: Corporate gifting scenes with warm lighting.

### Cravings & Care Cycle Section
- **Modification**: Enhance with comforting visuals.
- **Visual Elements**: Soft, nurturing imagery of care gifts.

## 2. Image Placement and Composition Suggestions

### Hero
- **Placement**: Full-width background with text overlay.
- **Composition**: Central decorated gift box, warm golden lighting from top-left, soft shadows, blurred comforting fruits in background.

### Gift Collections Cards
- **Placement**: Top of each card, above title.
- **Composition**: Square images (300x300px), showing gift box with ribbons, warm lighting, no faces.

### Why Gift Sunya Cards
- **Placement**: Centered above text.
- **Composition**: Circular or square icons with visual elements, e.g., gift box for prestige.

### Bulk & Corporate
- **Placement**: Background overlay with low opacity.
- **Composition**: Subtle pattern of gift boxes and fruits.

### Cravings & Care Cycle
- **Placement**: Side images or background.
- **Composition**: Gentle, comforting scenes.

## 3. Color Palette Adjustments for Warm Lighting

- **Current Palette**: Primary colors (likely blues/greens), whites, grays.
- **Adjustments**:
  - Backgrounds: Shift to warm neutrals like beige (#F5F5DC), soft gold (#D4AF37), cream (#FFFDD0).
  - Accents: Warm amber (#FFBF00), soft peach (#FFDAB9).
  - Text: Maintain high contrast but with warm undertones.
  - Avoid: Bright reds, pinks, loud gradients.

## 4. Layout Changes to Accommodate Visuals

- **Hero**: Increase padding, add overlay for text readability.
- **Cards**: Add image area, adjust grid to accommodate.
- **Sections**: Introduce asymmetric layouts with image columns.
- **Overall**: Ensure mobile responsiveness, lazy loading for images.

## 5. Component Structure Recommendations

- **New Components**:
  - `GiftImage`: Reusable component for gift box images with warm lighting effects.
  - `WarmBackground`: Component for sections with warm lighting backgrounds.
  - `VisualCard`: Extended card with image support.
- **Integration**: Use Next.js Image for optimization, add CSS filters for warm lighting.
- **Structure**: Separate visual logic from content, use props for image sources.

This plan will transform the page into a visually engaging experience while preserving luxury branding.