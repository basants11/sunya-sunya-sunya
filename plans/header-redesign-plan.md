# Header Redesign Plan

## Overview
Design a clean, modern website header layout with a single horizontal structure. The header will feature a neutral color palette with a white background, ensuring high resolution and professional aesthetics. Key elements include logo on the left, search bar in the center, user account icon on the right, and a centrally positioned cart icon that integrates seamlessly.

## Existing Header Analysis
The current header (`components/header.tsx`) has:
- Logo on the left with "SUNYA" branding and "Premium Fruits" subtitle
- Desktop navigation menu in the center (hidden on mobile)
- Cart icon and mobile menu toggle on the right
- Sticky positioning with z-50
- Uses Tailwind CSS classes for styling
- Cart functionality with localStorage and event listeners
- No search bar or user account icon currently

## Layout Structure
- **Container**: Full-width header with max-width constraint for large screens
- **Grid/Flex Layout**: Use CSS Grid or Flexbox for precise positioning
  - Left: Logo section
  - Center: Search bar
  - Right: User account icon
  - Center Overlay: Cart icon positioned centrally (absolute positioning)

## Positioning of Elements
1. **Logo (Left)**:
   - Position: flex-start
   - Maintain current SUNYA branding with colored letters
   - Include "Premium Fruits" subtitle on larger screens

2. **Search Bar (Center)**:
   - Position: center
   - Full-width input with search icon
   - Placeholder text: "Search products..."
   - Responsive: collapses to icon-only on mobile

3. **User Account Icon (Right)**:
   - Position: flex-end
   - Icon: User circle from Lucide React
   - Clickable for account menu (dropdown or navigation)

4. **Cart Icon (Central)**:
   - Position: absolute center of header
   - Use transparent-background cart image from provided URL
   - Overlay on search bar area without disrupting layout
   - Maintain cart count badge
   - Clickable to open cart dropdown

## Styling Suggestions (Tailwind CSS)
- **Background**: `bg-white` (neutral white)
- **Text Colors**: `text-gray-900` for primary, `text-gray-600` for secondary
- **Borders**: `border-gray-200` for subtle separation
- **Shadows**: `shadow-sm` for depth
- **Logo**: Maintain current color scheme (`text-[#FF6900]`, etc.)
- **Search Bar**:
  - `bg-gray-50 border border-gray-300 rounded-full px-4 py-2 w-full max-w-md`
  - Focus: `focus:ring-2 focus:ring-blue-500 focus:border-transparent`
- **Icons**: `text-gray-700 hover:text-gray-900 transition-colors`
- **Cart Icon**: 
  - `absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2`
  - Size: `w-8 h-8` for high resolution
  - Badge: `absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center`

## Responsiveness
- **Desktop (lg+)**: Full layout with all elements visible
- **Tablet (md)**: Search bar width reduced, cart icon slightly smaller
- **Mobile (sm)**: 
  - Logo and user icon remain
  - Search bar becomes icon-only in top bar
  - Cart icon positioned centrally but smaller
  - Navigation moves to mobile menu
- **Breakpoints**: Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`)

## Cart Icon Integration
- **Image Source**: Use transparent-background version from `http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcSxTsHdD2jKme3RPmi1zyVgQkLK0H7njqDGt3zjUoNXE7mujq2LfED6lIH_9msFIbv8ednPnJr4JwXqX7aCKPA`
- **Implementation**: 
  - Download and save as `public/cart-icon.png` or similar
  - Use `<img>` tag with `src="/cart-icon.png"` and `alt="Cart"`
  - Maintain existing cart functionality (count, dropdown)
  - Ensure transparency allows background to show through
- **Seamless Integration**: 
  - Position absolutely to avoid layout shift
  - Z-index higher than other elements but below dropdowns
  - Hover effects: subtle scale or opacity change

## Implementation Steps
1. Update header component structure to include new layout
2. Add search bar component with input and icon
3. Add user account icon with placeholder functionality
4. Integrate cart icon image and positioning
5. Apply Tailwind styling for neutral palette
6. Implement responsive breakpoints
7. Test cart functionality remains intact
8. Add hover and focus states for accessibility

## Accessibility Considerations
- Alt text for all icons and images
- Keyboard navigation support
- ARIA labels for interactive elements
- Color contrast meets WCAG standards

## Performance Notes
- Optimize cart icon image for web (WebP format if possible)
- Lazy load non-critical elements
- Minimize re-renders with proper React hooks