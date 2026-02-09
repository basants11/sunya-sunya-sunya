# Cravings & Care Cycle UI Design Plan

## Overview
Design UI components for the Cravings & Care Cycle feature in the website header, focusing on three gift boxes with premium styling, hover animations, and a modal for menstruation days and delivery information selection. Align with SUNYA's luxury branding using premium colors, artistic elements, and elegant styling. No product images; use abstract icons and luxury effects.

## Existing Design Patterns Analysis
- **Layout**: Uses WarmBackground sections with max-w-7xl containers
- **Cards**: VisualCard component with image placement (top/background), premium styling
- **Grid**: 1-3 column responsive grids for options
- **Colors**: gentle-green (#gentle-green), muted-rose (#muted-rose), soft-ivory, warm-beige
- **Typography**: Large headings (text-5xl), light font weights, elegant spacing
- **Interactions**: Hover effects, selection states with ring borders
- **Calendar**: SoftCalendar component for date selection with min date constraints

## Header Integration
- **Placement**: Integrate into the website header as a collapsible section or dropdown menu triggered by a "Cravings & Care Cycle™" button in the navigation.
- **Layout**: Horizontal row of three gift boxes in the header area, with premium spacing and alignment.
- **Trigger Mechanism**: On hover (desktop) or click (mobile), expand to show the gift boxes. Selecting a box opens the modal.
- **Responsive Behavior**: On mobile devices, use a full-screen modal or stacked vertical layout within the header dropdown.
- **State Management**: Use React state to handle visibility, selection, and modal opening.

## Gift Box Selection UI Design

### Component Structure
- **Container**: WarmBackground section with centered content
- **Grid**: 3-column responsive grid (1 on mobile, 3 on md+)
- **Cards**: Custom themed VisualCard variants for each gift box option

### Gift Box Options

#### 1. Energy & Vitality
- **Theme Color**: Vibrant Orange (#ff6b35 or similar premium orange)
- **Wrapper**: Energetic orange gradient wrapper with subtle patterns
- **Illustration**: Abstract sun/moon cycle icon or energy waves (SVG)
- **Title**: "Energy & Vitality"
- **Description**: "Energizing fruits to boost vitality during your cycle"
- **Styling**: Warm orange accents, dynamic hover animations

#### 2. Calm & Comfort
- **Theme Color**: Soft Lavender (#c8a2c8 or elegant lavender)
- **Wrapper**: Soft lavender gradient with calming patterns
- **Illustration**: Gentle wave or flower icon representing comfort (SVG)
- **Title**: "Calm & Comfort"
- **Description**: "Soothing selections for peaceful comfort and relaxation"
- **Styling**: Soft purple tones, subtle floating animations

#### 3. Luxury Indulgence
- **Theme Color**: Deep Burgundy (#722f37 or rich burgundy)
- **Wrapper**: Deep burgundy gradient with elegant textures
- **Illustration**: Crown or gem icon representing luxury (SVG)
- **Title**: "Luxury Indulgence"
- **Description**: "Premium indulgence with the finest artisanal treats"
- **Styling**: Rich red tones, premium shadow effects

### Card Specifications
- **Size**: Compact cards for header placement (height ~120px, width ~150px), with padding p-4
- **Selection State**: Automatic state changes with ring border (ring-2 ring-theme-color) and background highlight
- **Hover Effects**: Scale 1.05x, glow effect (box-shadow with theme color), premium 3D shadow elevation
- **Content Layout**:
  - Top: Artistic illustration (SVG icon, 48x48px) with small ribbon accent (positioned top-right)
  - Center: Title and description (compact typography)
  - Bottom: Price badge (positioned bottom-left) and selection indicator
- **Special Highlight**: Middle box (Calm & Comfort) marked as "Most Loved Choice" with a subtle badge or star icon
- **Tooltips**: Optional tooltips on hover showing additional details (e.g., key ingredients or benefits)

### Styling Details
- **Background**: White cards with subtle border border-border/30, premium 3D shadows (box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06))
- **Ribbon Accents**: Small SVG ribbons in theme colors, positioned as decorative elements
- **Price Badges**: Rounded badges with theme color background, displaying price (e.g., "$49.99")
- **Typography**: Bold titles (font-semibold), light descriptions (text-sm), elegant fonts
- **Spacing**: Compact padding, space-y-2 for content
- **Animations**: Smooth transitions (transition-all duration-300), hover scale and glow (shadow-lg with color tint)
- **Accessibility**: Proper contrast ratios, focus states, tooltip ARIA attributes

## Menstruation Days Selection UI Design

### Options Considered
1. **Dropdown Approach**:
   - Month dropdown (Jan-Dec)
   - Day dropdown (1-31, filtered by month)
   - Multi-select with checkboxes for up to 3 days
   - Pros: Simple, compact
   - Cons: Less intuitive for date selection

2. **Calendar Picker Approach** (Recommended):
   - Modified SoftCalendar allowing multiple date selection
   - Limit to 3 selections maximum
   - Visual indicators for selected days
   - Pros: Intuitive, visual, prevents invalid dates
   - Cons: More complex implementation

### Recommended Implementation: Enhanced Calendar Picker
- **Base Component**: Extend SoftCalendar for multi-selection
- **Selection Limit**: Maximum 3 dates
- **Visual Feedback**:
  - Selected days: Theme color background with white text
  - Hover: Highlight potential selections
  - Limit reached: Disable further selections with tooltip
- **Layout**: Centered calendar with month navigation
- **Styling**: Match premium theme with subtle shadows and borders

### Component Specifications
- **Container**: Card with padding p-6, background white/95 backdrop-blur
- **Label**: "Select up to 3 menstruation days per month"
- **Helper Text**: "Choose the days that typically align with your cycle"
- **Validation**: Error state if no days selected (for submission)

## Modal/Dropdown Design

### Structure
- **Trigger**: Selecting a gift box in the header opens the modal
- **Layout**: Overlay modal with backdrop blur, centered content
- **Sections**:
  1. Selected Gift Box Display (confirmation)
  2. Menstruation Days Selection (calendar picker)
  3. Delivery Information Form
  4. Confirm Button

### Menstruation Days Selection
- **Calendar Picker**: Enhanced SoftCalendar with multi-select capability (up to 3 days)
- **UI Elements**: Selected days in theme color, selection counter, visual feedback for limit reached
- **Validation**: Prevent selection beyond 3 days, show tooltip if attempted

### Delivery Information Form
- **Fields**:
  - Full Name: Text input with validation
  - Address/Location: Textarea for detailed address
  - Phone Number: Tel input with format validation
  - WhatsApp: Optional checkbox (pre-fill with phone if checked)
- **Styling**: Luxury inputs with subtle borders, focus glow in theme color
- **Validation**: Real-time validation with error messages

### Confirm Button
- **Placement**: Fixed at bottom of modal
- **Styling**: Large, prominent button with selected theme color background, hover effects
- **Action**: Validate form, submit data, close modal, redirect to confirmation or checkout

### Responsive Design
- **Mobile**: Full-screen modal, stacked sections
- **Desktop**: Centered modal (max-width 600px), side-by-side calendar and form if space allows

## Integration with Header and Existing Components

### Placement
- **Location**: Header dropdown/modal triggered from gift box selection
- **Flow**: Header gift boxes → Modal (days + delivery) → Confirmation
- **State Management**: React state for selected box, dates, form data

### Component Hierarchy
```
Header
├── Navigation
├── CravingsCareCycleTrigger
│   └── GiftBoxRow
│       ├── GiftBoxCard (x3, with middle highlighted)
│       └── ModalTrigger
└── CravingsCareCycleModal
    ├── SelectedBoxDisplay
    ├── EnhancedCalendarPicker
    ├── DeliveryForm
    └── ConfirmButton
```

### Responsive Design
- **Mobile**: Single column cards, stacked calendar
- **Tablet/Desktop**: 3-column grid, side-by-side layout
- **Breakpoints**: Consistent with existing design (md: 768px, lg: 1024px)

## Technical Specifications

### New Components Needed
1. **HeaderCravingsCareCycle**: Header section with gift box row and modal trigger
2. **GiftBoxCard**: Updated themed card with 3D shadows, ribbons, price badges, tooltips, and middle highlight
3. **CravingsCareCycleModal**: Modal container with sections for confirmation, calendar, form, and confirm button
4. **EnhancedCalendarPicker**: Multi-select calendar (up to 3 days) with selection counter
5. **DeliveryForm**: Form component for delivery information with validation

### Styling Approach
- **Colors**: Define luxury theme colors as CSS variables:
  - --vibrant-orange: #ff6b35
  - --soft-lavender: #c8a2c8
  - --deep-burgundy: #722f37
- **Tailwind Classes**: Extend with custom classes for shadows, glows, ribbons
- **Animations**: CSS transitions for hover (scale, glow), modal entrance (fade/slide)
- **Fonts**: Use elegant serif or custom luxury fonts for titles, ensure readability
- **Icons**: SVG ribbons, badges, and illustrations; no product images
- **Responsive**: Mobile-first design with breakpoints for header layout

### CSS Classes and Animations
- **Gift Box Hover**: `hover:scale-105 hover:shadow-2xl hover:shadow-theme-color/50 transition-all duration-300`
- **3D Shadows**: `shadow-lg shadow-black/10` with additional depth on hover
- **Ribbon Accents**: Custom SVG classes with `absolute top-2 right-2 w-6 h-6`
- **Price Badges**: `absolute bottom-2 left-2 bg-theme-color text-white px-2 py-1 rounded-full text-xs font-semibold`
- **Tooltips**: Use `title` attribute or custom tooltip component with `group-hover:visible`
- **Middle Highlight**: Add `relative` with star icon `absolute top-2 left-2 text-yellow-400`
- **Modal**: `fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center`
- **Form Inputs**: `border border-gray-300 focus:border-theme-color focus:ring-2 focus:ring-theme-color/20 rounded-lg px-4 py-2`

### Accessibility
- **Keyboard Navigation**: Full keyboard support for selections
- **Screen Readers**: Proper ARIA labels and descriptions
- **Color Contrast**: Ensure WCAG AA compliance
- **Focus Management**: Visible focus indicators

## Implementation Preparation
This design provides complete specifications for the header-integrated Cravings & Care Cycle UI, including gift boxes with premium effects, modal for selection and delivery, and responsive luxury styling. Key integration points include updating the Header component to include the new section, creating new modal and form components, and ensuring automatic state changes on selection. Ready for implementation with focus on accessibility, performance, and seamless user experience.