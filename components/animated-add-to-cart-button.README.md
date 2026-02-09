# Animated Add to Cart Button

A premium, dopamine-optimized Add to Cart button with satisfying click animations designed for ecommerce conversion. Built with Framer Motion for smooth, GPU-accelerated animations.

## Features

### Core Animations

1. **Button Compression** (scale 0.96 → 1)
   - Soft, spring-based compression on click
   - Natural bounce-back effect
   - Duration: 200-250ms total

2. **Color Pulse/Glow Effect**
   - Subtle brightness increase on click
   - Enhanced box-shadow for premium feel
   - Smooth fade-in/out transition

3. **Cart Icon Bounce/Tick**
   - Minimal scale bounce (1.0 → 1.15 → 1.0)
   - Subtle rotation tick (0° → -8° → 8° → 0°)
   - Duration: 150ms

4. **Optional +1 Micro-Feedback**
   - Brief fade-up animation above button
   - Non-intrusive confirmation
   - Duration: 250ms total

### Performance & Accessibility

- **Instant Feedback**: <100ms initial response
- **GPU Accelerated**: 60fps animations
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **Lightweight**: <2KB additional code
- **No Layout Shift**: Uses transform and opacity only

## Installation

The component is already installed in your project. Ensure you have the required dependencies:

```bash
pnpm add framer-motion
```

## Usage

### Basic Usage

```tsx
import { AnimatedAddToCartButton } from "@/components/animated-add-to-cart-button";

function ProductCard() {
  const handleAddToCart = () => {
    // Your add to cart logic
  };

  return (
    <AnimatedAddToCartButton onClick={handleAddToCart} showPlusOne={true}>
      Add to Cart
    </AnimatedAddToCartButton>
  );
}
```

### With Custom Styling

```tsx
<AnimatedAddToCartButton
  onClick={handleAddToCart}
  showPlusOne={true}
  variant="cart"
  size="lg"
  className="flex-1 rounded-lg py-3 font-semibold"
>
  Add to Cart
</AnimatedAddToCartButton>
```

### Compact Version

For smaller spaces, use the `CompactAnimatedAddToCartButton`:

```tsx
import { CompactAnimatedAddToCartButton } from "@/components/animated-add-to-cart-button";

<CompactAnimatedAddToCartButton
  onClick={handleAddToCart}
  showPlusOne={true}
  className="w-24"
/>;
```

## Props

### AnimatedAddToCartButton

| Prop          | Type                               | Default         | Description                      |
| ------------- | ---------------------------------- | --------------- | -------------------------------- |
| `onClick`     | `() => void`                       | **Required**    | Click handler for adding to cart |
| `disabled`    | `boolean`                          | `false`         | Whether the button is disabled   |
| `showPlusOne` | `boolean`                          | `false`         | Show +1 micro-feedback animation |
| `className`   | `string`                           | `undefined`     | Additional CSS classes           |
| `children`    | `ReactNode`                        | `"Add to Cart"` | Button content (icon + text)     |
| `variant`     | `'cart' \| 'default' \| 'primary'` | `'cart'`        | Button visual variant            |
| `size`        | `'default' \| 'sm' \| 'lg'`        | `'default'`     | Button size                      |

### CompactAnimatedAddToCartButton

| Prop          | Type         | Default      | Description                      |
| ------------- | ------------ | ------------ | -------------------------------- |
| `onClick`     | `() => void` | **Required** | Click handler for adding to cart |
| `disabled`    | `boolean`    | `false`      | Whether the button is disabled   |
| `showPlusOne` | `boolean`    | `false`      | Show +1 micro-feedback animation |
| `className`   | `string`     | `undefined`  | Additional CSS classes           |

## Variants

### `cart` (Default)

Gradient orange/rose button with premium shadow:

```tsx
<AnimatedAddToCartButton variant="cart" />
```

### `default`

Primary color button:

```tsx
<AnimatedAddToCartButton variant="default" />
```

### `primary`

Primary color with shadow:

```tsx
<AnimatedAddToCartButton variant="primary" />
```

## Sizes

### `default` (Default)

Standard size: `h-9 px-4 py-2`

### `sm`

Small size: `h-8 px-3`

### `lg`

Large size: `h-10 px-6`

## Animation Timing

The complete animation sequence runs in 200-300ms:

```
0ms:    Button compresses (scale 0.96)
0ms:    Icon starts bounce
0ms:    Glow effect activates
20ms:   +1 feedback fades in (if enabled)
50ms:   Button springs back (scale 1.0)
150ms:  Icon settles
200ms:  +1 feedback fades out (if enabled)
250ms:  Animation complete
```

## Accessibility

### Reduced Motion Support

The component automatically respects the `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  /* Animations are disabled */
}
```

When reduced motion is detected:

- All animations are disabled
- Button still functions normally
- Visual feedback remains through hover states

### Keyboard Navigation

- Full keyboard support with `Tab` and `Enter`/`Space`
- Focus-visible ring for keyboard users
- ARIA labels for screen readers

### Screen Reader Support

```tsx
<motion.button
  aria-label="Add to cart"
  // ... other props
>
```

## Performance Optimization

### GPU Acceleration

All animations use GPU-accelerated properties:

- `transform` (scale, rotate, translate)
- `opacity`
- `box-shadow`

Avoids animating:

- `width`, `height`
- `margin`, `padding`
- `top`, `left`, `right`, `bottom`

### Will-Change

The component uses `will-change: transform` to hint to the browser:

```css
.will-change-transform {
  will-change: transform;
}
```

### Bundle Size

- Framer Motion: ~40KB gzipped
- Additional code: <2KB
- Total impact: Minimal

## Best Practices

### 1. Use Sparingly

The +1 micro-feedback should be used selectively:

- ✅ Product cards
- ✅ Quick add buttons
- ❌ Bulk add operations
- ❌ Cart page (already in cart)

### 2. Respect User Preferences

Always respect reduced-motion settings. The component handles this automatically.

### 3. Test on Real Devices

Test animations on:

- Desktop (mouse)
- Mobile (touch)
- Tablet (hybrid)
- Different browsers

### 4. Monitor Performance

Use Chrome DevTools Performance tab to ensure:

- 60fps animations
- No jank
- Low CPU usage

## Integration Examples

### Product Card

```tsx
import { AnimatedAddToCartButton } from "@/components/animated-add-to-cart-button";

function ProductCard({ product, onAddToCart }) {
  return (
    <Card>
      {/* Product details */}
      <AnimatedAddToCartButton
        onClick={() => onAddToCart(product.id, 1)}
        showPlusOne={true}
        variant="cart"
        size="lg"
        className="flex-1 rounded-lg py-3 font-semibold"
      >
        Add to Cart
      </AnimatedAddToCartButton>
    </Card>
  );
}
```

### Quick Add Button

```tsx
import { CompactAnimatedAddToCartButton } from "@/components/animated-add-to-cart-button";

function QuickAddButton({ product, onAddToCart }) {
  return (
    <CompactAnimatedAddToCartButton
      onClick={() => onAddToCart(product.id, 1)}
      showPlusOne={true}
    />
  );
}
```

### With Quantity Selector

```tsx
function ProductWithQuantity({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
}) {
  return (
    <div className="flex gap-2">
      <QuantitySelector value={quantity} onChange={onQuantityChange} />
      <AnimatedAddToCartButton
        onClick={() => onAddToCart(product.id, quantity)}
        showPlusOne={true}
      >
        Add {quantity} to Cart
      </AnimatedAddToCartButton>
    </div>
  );
}
```

## Troubleshooting

### Animations Not Working

1. **Check Framer Motion Installation**

   ```bash
   pnpm list framer-motion
   ```

2. **Verify Browser Support**
   - Modern browsers (Chrome, Firefox, Safari, Edge)
   - IE11 not supported

3. **Check Reduced Motion**
   - Animations disabled if `prefers-reduced-motion` is set

### Performance Issues

1. **Reduce Animation Complexity**
   - Disable +1 feedback if not needed
   - Use compact version for small spaces

2. **Check GPU Acceleration**
   - Ensure `transform` and `opacity` are used
   - Avoid animating layout properties

3. **Monitor Frame Rate**
   - Use Chrome DevTools Performance tab
   - Target 60fps

### TypeScript Errors

1. **Check Import Path**

   ```tsx
   import { AnimatedAddToCartButton } from "@/components/animated-add-to-cart-button";
   ```

2. **Verify Props**
   - Ensure `onClick` is provided
   - Check prop types match interface

## Customization

### Custom Animation Timing

Modify the animation variants in the component:

```tsx
const buttonVariants = {
  idle: { scale: 1 },
  pressed: {
    scale: 0.96,
    transition: { duration: 0.05, ease: "easeOut" },
  },
  released: {
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400, // Adjust spring stiffness
      damping: 17, // Adjust spring damping
    },
  },
};
```

### Custom Colors

Override using Tailwind classes:

```tsx
<AnimatedAddToCartButton
  className="bg-blue-500 hover:bg-blue-600"
  variant="default"
/>
```

### Custom Glow Effect

Modify the `glowVariants` in the component:

```tsx
const glowVariants = {
  idle: {
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  active: {
    boxShadow: "0 2px 4px rgba(0,0,0,0.1), 0 0 20px rgba(59,130,246,0.5)",
    transition: { duration: 0.075 },
  },
};
```

## Testing

### Unit Tests

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { AnimatedAddToCartButton } from "@/components/animated-add-to-cart-button";

describe("AnimatedAddToCartButton", () => {
  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<AnimatedAddToCartButton onClick={handleClick} />);

    const button = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    const handleClick = jest.fn();
    render(<AnimatedAddToCartButton onClick={handleClick} disabled />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
```

### Visual Regression Tests

Use tools like:

- Percy
- Chromatic
- Storybook

## License

This component is part of the SUNYA project.

## Support

For issues or questions:

1. Check this documentation
2. Review the implementation plan: `plans/add-to-cart-animation-enhancement-plan.md`
3. Contact the development team

## Changelog

### Version 1.0.0 (2026-01-27)

- Initial release
- Button compression animation
- Color pulse/glow effect
- Cart icon bounce/tick
- Optional +1 micro-feedback
- Reduced motion support
- GPU-accelerated animations
- TypeScript support
- Full accessibility features
