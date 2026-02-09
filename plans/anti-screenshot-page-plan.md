# Anti-Screenshot Protection Web Page Design Plan

## Overview
This design plan outlines a standalone HTML web page that implements multiple layers of protection against screenshots and screen captures. The page uses CSS properties, JavaScript event detection, and obfuscation techniques to deter unauthorized capture of sensitive content. Techniques are drawn from web security research on screen capture prevention, including WebRTC detection for screen sharing and browser-specific extensions (though extensions are not implemented here as they require separate installation).

## Key Features
- **CSS Anti-Screenshot Properties**: Prevents text selection, pointer events, and context menus.
- **JavaScript Detection and Blocking**: Monitors keyboard shortcuts (Print Screen), page visibility changes, and attempts to detect screen sharing via WebRTC.
- **Obfuscation Elements**: Invisible overlays and a canvas layer for content distortion.
- **Simple Layout**: Header, main content area with sample sensitive content, and footer.
- **Cross-Browser Compatibility**: Notes provided in comments for known limitations.

## HTML Skeleton
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Protected Sensitive Content</title>
    <style>
        /* Embedded CSS styles here */
    </style>
</head>
<body>
    <header>
        <h1>Confidential Information Portal</h1>
    </header>
    <main>
        <div class="content-wrapper">
            <canvas id="distortion-canvas" class="distortion-layer"></canvas>
            <div class="invisible-overlay"></div>
            <div class="protected-content">
                <h2>Sample Sensitive Text</h2>
                <p>This is confidential information that should not be captured. It contains proprietary data and intellectual property.</p>
                <img src="sample-sensitive-image.jpg" alt="Sensitive Image" class="protected-image">
                <p>Additional sensitive details: [Redacted for security].</p>
            </div>
        </div>
    </main>
    <footer>
        <p>&copy; 2023 Protected Content Inc. All rights reserved.</p>
    </footer>
    <script>
        /* Embedded JavaScript here */
    </script>
</body>
</html>
```

## CSS Classes and Styles
All styles are embedded in the `<style>` tag for simplicity.

- **General Layout Styles**:
  - `body`: Basic styling, background color, font family.
  - `header`: Centered title, padding.
  - `main`: Flex layout for content centering.
  - `footer`: Bottom alignment, small text.

- **Anti-Screenshot Properties** (applied to `.protected-content` and `.protected-image`):
  - `user-select: none;`: Prevents text selection.
  - `pointer-events: none;`: Disables mouse interactions.
  - `-webkit-user-select: none;`: WebKit-specific for Safari/Chrome.
  - `-moz-user-select: none;`: Firefox-specific.
  - `-ms-user-select: none;`: IE/Edge-specific.
  - `contextmenu: none;`: Disables right-click context menu (though not foolproof).

- **Obfuscation Styles**:
  - `.invisible-overlay`: Positioned absolutely over content, transparent but blocks interactions; uses `pointer-events: auto;` to capture events.
  - `.distortion-layer`: Canvas positioned over content for visual distortion.

- **Sample Styling**:
  - `.content-wrapper`: Relative positioning to contain overlays.
  - `.protected-image`: Max width, border for visibility.

## JavaScript Functions Outline
All scripts are embedded in the `<script>` tag.

- **Keyboard Event Blocking**:
  - `function blockPrintScreen(event)`: Listens for keydown events, checks for Print Screen key (keyCode 44) or Ctrl+Shift+S, prevents default action, and alerts user.

- **Visibility Change Detection**:
  - `function handleVisibilityChange()`: Uses `document.addEventListener('visibilitychange')` to detect when page loses focus (potential screenshot attempt), blurs content or shows warning.

- **WebRTC/Screen Sharing Detection**:
  - `function detectScreenSharing()`: Attempts to access `navigator.mediaDevices.getDisplayMedia()` to check for screen sharing permissions; if granted, assumes sharing and triggers protection (e.g., overlay opacity increase). Note: This is experimental and may not work in all browsers.

- **Canvas Distortion**:
  - `function applyDistortion()`: Gets canvas context, draws distorted version of content (e.g., pixelate or scramble pixels) over the protected area.

- **Initialization**:
  - `window.onload`: Attaches event listeners for keydown, visibilitychange, and calls distortion function.

- **Additional Helpers**:
  - Functions to show/hide overlays based on detection.

## Obfuscation Elements
- **Invisible Overlay**: A `<div>` with `position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: transparent;` but with event capturing to block interactions.
- **Canvas Distortion**: A `<canvas>` element that overlays the content, using JavaScript to draw a distorted representation (e.g., via image manipulation or random noise).

## Sample Sensitive Content
- **Text**: Placeholder confidential text explaining the protection.
- **Images**: A sample image (e.g., "sample-sensitive-image.jpg") representing proprietary visuals. In implementation, use a real image path.

## Cross-Browser Compatibility Notes
- **Chrome/Safari**: Full support for `visibilitychange` and WebRTC detection; `user-select: none` works well.
- **Firefox**: `visibilitychange` supported; WebRTC may require user permission prompts; `-moz-user-select` needed.
- **Edge/IE**: Limited support for modern events; fall back to older event listeners if needed.
- **Mobile Browsers**: Print Screen detection may not apply; focus on visibility and touch event blocking.
- **Limitations**: No method is 100% effective against determined users (e.g., external screen capture tools); this is deterrent-based.

## Implementation Notes
- This is a design plan; implementation will require coding the full HTML file.
- Test in multiple browsers to verify detection.
- For advanced protection, consider server-side measures or browser extensions, but those are outside this standalone page scope.
- Ensure images are served securely to prevent direct access.

## Mermaid Diagram (Workflow)
```mermaid
graph TD
    A[Page Load] --> B[Initialize JS Listeners]
    B --> C[Attach Keyboard Events]
    B --> D[Attach Visibility Events]
    B --> E[Check WebRTC Screen Sharing]
    C --> F[Block Print Screen]
    D --> G[Blur Content on Visibility Loss]
    E --> H[Apply Overlay on Sharing Detection]
    I[Canvas Distortion] --> J[Overlay Content]
    J --> K[Display Protected Page]
```</content>
</xai:function_call name="update_todo_list">
<parameter name="todos">[x] Analyze anti-screenshot techniques from research (WebRTC, browser extensions, CSS properties, JS detection)
[x] Design basic HTML structure with header, main content area, and footer
[x] Define CSS classes and embedded styles for anti-screenshot properties and general styling
[x] Outline JavaScript functions for keyboard event blocking, visibility change detection, and WebRTC/screen sharing detection
[x] Incorporate obfuscation elements: invisible overlays and canvas for distortion
[x] Add sample sensitive content (text and images) to the page
[x] Include cross-browser compatibility notes in comments
[x] Compile detailed design plan document with HTML skeleton, CSS classes, and JS functions outline