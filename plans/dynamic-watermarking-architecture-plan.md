# Dynamic User-Specific Watermarking Architecture Plan

## Overview
This plan outlines the implementation of a dynamic, user-specific watermarking system for the Next.js application. The watermark serves as a security overlay for premium content, displaying personalized information and employing anti-screenshot measures similar to exam portals and premium content platforms.

## Project Context
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Context (with potential for Zustand if complexity increases)

## Core Requirements
- Semi-transparent overlay using Canvas/SVG
- Displays: user email/phone, live timestamp, session/user ID
- Random movement every 5-8 seconds
- Rotation between -15° to +15°
- Diagonal repetition pattern
- Non-selectable, ignores pointer events
- High z-index overlay
- Persists on scroll, resize, and route changes
- Security features: regeneration on refresh, content blurring on focus loss/minimize
- Backend logging integration
- SEO and accessibility compliance

## Component Architecture

### 1. WatermarkProvider (`lib/contexts/WatermarkContext.tsx`)
- React Context for global watermark state management
- Provides user data (email, phone, sessionId) to child components
- Handles user data fetching from API
- Manages security state (blur active/inactive)

### 2. Watermark Component (`components/Watermark.tsx`)
- Client-side component using Canvas for dynamic rendering
- Props: userData from context
- Features:
  - Canvas element with full viewport coverage
  - Dynamic text rendering with user info and live timestamp
  - Random position updates (5-8 second intervals)
  - Rotation animation (-15° to +15°)
  - Diagonal tiling pattern
  - CSS: `position: fixed; z-index: 9999; pointer-events: none; user-select: none;`

### 3. Security Overlay (`components/SecurityOverlay.tsx`)
- Manages content blurring on security events
- Applies CSS filter blur to main content area
- Triggers on tab focus loss, window minimize

## State Management

### WatermarkContext State
```typescript
interface WatermarkState {
  user: {
    email: string;
    phone?: string;
    sessionId: string;
  };
  isBlurred: boolean;
  lastActivity: Date;
}
```

### Component Local State
- Position coordinates (x, y)
- Rotation angle
- Current timestamp
- Animation interval ID

## API Endpoints

### 1. GET `/api/user`
- Retrieves authenticated user data
- Response: `{ email: string, phone?: string, sessionId: string }`

### 2. POST `/api/watermark/log`
- Logs security events and watermark interactions
- Request body: `{ event: string, timestamp: Date, sessionId: string, details?: object }`
- Events: 'focus_lost', 'window_minimized', 'watermark_rendered', 'page_refresh'

## Security Implementation

### Regeneration on Refresh
- Generate new sessionId on page load
- Update timestamp on component mount
- Log refresh events to backend

### Content Blurring
- Listen to `visibilitychange` event
- Listen to `blur` event on window
- Apply `filter: blur(5px)` to body content
- Remove blur on focus regain

### Anti-Screenshot Measures
- Dynamic positioning prevents static captures
- Live timestamp makes captures time-sensitive
- User-specific data deters sharing

## Integration Points

### Global Layout Integration
- Add WatermarkProvider to `app/layout.tsx`
- Conditionally render Watermark component based on user authentication
- Position after main content but before footer

### Route Persistence
- Watermark remains active across all routes due to layout placement
- Context persists user data across navigation

### Event Handling
- Window resize: Redraw canvas to fit new dimensions
- Scroll: Maintain overlay positioning
- Route changes: No interruption due to client-side persistence

## SEO and Accessibility Considerations

### SEO Impact
- Canvas element is not indexed by search engines
- No impact on page content or metadata
- Watermark is purely visual overlay

### Accessibility Compliance
- Canvas marked with `aria-hidden="true"`
- Does not interfere with keyboard navigation
- Screen readers ignore decorative overlay
- No focus trapping or interaction conflicts

## Implementation Phases

1. **Phase 1**: Core Watermark Component
   - Implement Canvas rendering
   - Add dynamic positioning and rotation
   - Integrate user data display

2. **Phase 2**: Security Features
   - Add content blurring
   - Implement event logging
   - Add regeneration logic

3. **Phase 3**: Integration and Testing
   - Integrate with layout
   - Test across routes and devices
   - Performance optimization

4. **Phase 4**: Backend Integration
   - Implement API endpoints
   - Add authentication checks
   - Deploy and monitor

## Performance Considerations
- Canvas rendering optimized for 60fps animations
- Minimal DOM impact (single canvas element)
- Event listeners cleaned up on unmount
- Lazy loading for authenticated users only

## Security Best Practices
- Server-side session validation
- Encrypted user data transmission
- Rate limiting on logging endpoints
- Audit logging for security events
- Compliance with data protection regulations

## Testing Strategy
- Unit tests for component logic
- Integration tests for API endpoints
- E2E tests for security features
- Cross-browser compatibility testing
- Performance benchmarking

## Mermaid Diagram: System Architecture

```mermaid
graph TD
    A[User Authentication] --> B[WatermarkProvider]
    B --> C[Watermark Component]
    B --> D[Security Overlay]
    C --> E[Canvas Rendering]
    E --> F[Dynamic Text]
    E --> G[Animation Loop]
    D --> H[Event Listeners]
    H --> I[Content Blurring]
    C --> J[API Logging]
    J --> K[/api/watermark/log]
    B --> L[/api/user]
```

This architecture ensures a robust, secure, and performant watermarking system that protects premium content while maintaining user experience and accessibility standards.