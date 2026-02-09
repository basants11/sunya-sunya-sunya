# Payment Gateway UI Design Specification

## Overview
Design a user-friendly, comfortable payment gateway UI that integrates Khalti and eSewa payment options. The UI will be triggered by "Buy Now" buttons, providing a seamless checkout experience with solid backgrounds for optimal readability and usability.

## Layout Structure

### Modal Container
- **Type**: Full-screen overlay modal
- **Positioning**: Centered on screen with flexbox
- **Dimensions**: Responsive width (max-width: 28rem on desktop, full width on mobile with padding)
- **Z-index**: 50 to ensure it appears above other content

### Modal Content Structure (Top to Bottom)
1. **Header Section**
   - Title: "Secure Checkout"
   - Close button (X icon) in top-right corner

2. **Order Summary Section**
   - Background: Solid dark green
   - Displays cart items with quantities and prices
   - Total amount prominently displayed

3. **Customer Information Form**
   - Three input fields: Full Name, Email, Phone Number
   - Labels above each field
   - Validation error messages below fields

4. **Payment Methods Section**
   - Two payment buttons: Khalti and eSewa
   - Stacked vertically with spacing

5. **Toast Notifications** (for success/error feedback)
   - Positioned at bottom of modal or top of screen

## Colors and Theming

### Primary Color Palette
- **Background Overlay**: Solid black (`#000000`) instead of transparent for better readability
- **Modal Background**: Luxury dark green (`bg-luxury-dark-green`)
- **Text**: Luxury off-white (`text-luxury-off-white`)
- **Accent**: Luxury gold (`text-luxury-gold`) for headings and highlights
- **Secondary Backgrounds**: Luxury dark green light (`bg-luxury-dark-green-light`) for sections

### Payment Button Colors
- **Khalti Button**: Gradient from orange to darker orange (`linear-gradient(135deg, #CC5500 0%, #C95A3E 100%)`)
- **eSewa Button**: Solid blue or matching brand colors (to be confirmed)

### Form Elements
- **Input Backgrounds**: Luxury dark green light
- **Input Borders**: Luxury gold with 30% opacity
- **Placeholder Text**: Luxury charcoal with 50% opacity

## Components

### Core Components
- **Card**: Container for modal content with rounded corners and padding
- **Button**: Custom CTA variant with hover effects, shadows, and scaling animation
- **Input**: Styled text inputs with focus states
- **Icons**: CreditCard icon for payment buttons, X for close

### Payment Method Buttons
- **Size**: Full width with padding (py-3)
- **Typography**: Large font (text-lg), semibold weight
- **Effects**: Shadow, hover shadow increase, scale transform on hover
- **Icons**: CreditCard icon with margin
- **Accessibility**: Clear labels and descriptions

### Form Validation
- **Real-time Validation**: Check fields on blur/change
- **Error Display**: Red text below inputs for invalid fields
- **Success States**: Green checkmarks or borders for valid inputs
- **Required Indicators**: Asterisks on labels

## Integration with "Buy Now" Buttons

### Current Implementation
- Existing "Buy Now" buttons in `components/product-showcase.tsx` and `app/products/products-client.tsx` link to WhatsApp
- These will be modified to open the checkout modal instead

### Integration Approach
1. **State Management**: Add modal open/close state to parent components
2. **Props Passing**: Pass cart data (items, total) to modal
3. **Event Handling**: Change button onClick to set modal open state
4. **Cart Logic**: Implement cart functionality if not present (quantity selection, item addition)

### Button Modification
```tsx
// Before: WhatsApp link
<a href={`https://wa.me/...`}>Buy Now</a>

// After: Modal trigger
<button onClick={() => setIsCheckoutOpen(true)}>Buy Now</button>
```

## Usability Features

### Readability Improvements
- **Solid Backgrounds**: No transparency in overlay or modal elements
- **High Contrast**: Gold accents on dark green for clear hierarchy
- **Typography**: Clear font weights and sizes for different content types

### Form Usability
- **Clear Labels**: Descriptive labels above inputs
- **Placeholders**: Helpful placeholder text
- **Validation Feedback**: Immediate error messages
- **Keyboard Navigation**: Proper tab order and focus management

### Payment Method Clarity
- **Descriptive Text**: "Pay with Khalti" and "Pay with eSewa"
- **Visual Distinction**: Different colors and gradients for each method
- **Trust Indicators**: "Secure Checkout" title and lock icons if available

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoint Adjustments**: Different padding and sizing for desktop
- **Touch Targets**: Adequate button sizes for touch interaction
- **Text Scaling**: Readable font sizes across devices

### Accessibility
- **Screen Reader Support**: Proper ARIA labels and roles
- **Keyboard Support**: Full keyboard navigation
- **Color Contrast**: WCAG compliant color ratios
- **Focus Indicators**: Visible focus states

## Technical Implementation Notes

### Modal Behavior
- **Animation**: Smooth fade-in/out transitions
- **Backdrop Click**: Close modal when clicking outside
- **Escape Key**: Close modal on Escape key press

### Payment Integration
- **Khalti**: Uses KhaltiCheckout SDK with configuration object
- **eSewa**: Form submission to eSewa endpoint
- **Error Handling**: Toast notifications for payment success/failure
- **Redirect Handling**: Proper success/failure URL handling

### State Management
- **Customer Info**: Local state for form data
- **Validation Errors**: Object to track field errors
- **Loading States**: Disable buttons during payment processing
- **Toast State**: Temporary messages for user feedback

## Success Metrics
- Reduced bounce rate on payment page
- Higher conversion rate for completed purchases
- Positive user feedback on checkout experience
- Improved mobile usability scores