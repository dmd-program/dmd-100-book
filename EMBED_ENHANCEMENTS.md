# VitePress Embed Mode Enhancements

## Summary of Changes

The embed URL parameter functionality (`?embed=true`) has been enhanced to hide additional elements for a cleaner embedded experience.

## What Was Enhanced

### 1. Enhanced CSS Rules in `embed.css`

Added new CSS rules to hide additional VitePress elements:

#### Next/Previous Navigation
- `.VPDocFooter` - VitePress document footer container
- `.prev-next`, `.pager-link`, `.pagination` - Standard pagination elements
- `[class*="pager"]`, `[class*="prev-next"]` - Any class containing "pager" or "prev-next"
- `.next`, `.prev` - Individual next/previous buttons

#### License Footer Component
- `.license-footer` - The custom LicenseFooter component added via the theme

#### Additional VitePress Navigation Elements
- `.VPLocalNav` - Local navigation (table of contents, etc.)
- `.VPDocOutline`, `.VPOutline` - Document outline/table of contents

#### Mobile Navigation Improvements
- Fixed empty CSS ruleset for mobile navigation elements
- Properly hide mobile-specific navigation containers

### 2. Theme Integration

Updated `/docs/.vitepress/theme/index.js` to import the `embed.css` file:
```javascript
import './embed.css'
```

### 3. Documentation Updates

Updated `README.md` to reflect the additional elements that are now hidden in embed mode:
- Next/previous page navigation
- License footer
- Edit links and additional VitePress navigation elements

## Complete List of Hidden Elements in Embed Mode

When `?embed=true` is added to a URL, the following elements are now hidden:

### Navigation Elements
- Main navigation bar (`.VPNav`, `.VPNavBar`, `header.VPNav`)
- Sidebar (`.VPSidebar`, `aside.VPSidebar`)
- Local navigation and table of contents (`.VPLocalNav`, `.VPDocOutline`, `.VPOutline`)

### Mobile Elements
- Hamburger menu (`.VPNavBarHamburger`)
- Mobile navigation screen (`.VPNavScreen`, `.VPNavScreenMenu`)
- Mobile navigation container (`.VPMobileNav`)
- Menu buttons and icons

### Footer Elements
- Main footer (`.VPFooter`, `footer`)
- License footer component (`.license-footer`)
- Document footer (`.DocFooter`)

### Navigation Controls
- Edit links (`.edit-link`)
- Next/previous page navigation (`.VPDocFooter`, `.prev-next`, `.pager-link`, etc.)
- Pagination controls

### Content Area Adjustments
- Removed all padding and margins from content area
- Ensured full width display
- Disabled horizontal scrolling

## Usage

To use the enhanced embed mode, append `?embed=true` to any page URL:

```
https://example.com/lessons/lesson-1/topics/design_thinking.html?embed=true
```

This creates a clean, distraction-free view suitable for embedding in iframes or other contexts where you want to display only the main content without any navigation elements.

## Testing

1. Start the development server: `npm run docs:dev`
2. Navigate to any page with `?embed=true` parameter
3. Verify that all navigation elements, footers, and pagination controls are hidden
4. Confirm that only the main content is visible

## Files Modified

1. `/docs/.vitepress/theme/embed.css` - Enhanced CSS rules
2. `/docs/.vitepress/theme/index.js` - Added embed.css import
3. `/README.md` - Updated documentation

## Technical Implementation

The embed functionality works through:

1. **JavaScript Detection**: Embedded script in `config.mjs` detects the `?embed=true` parameter
2. **CSS Targeting**: Uses `body[data-embed="true"]` selector to apply hiding rules
3. **Theme Integration**: CSS file is imported in the theme configuration
4. **Responsive Design**: Includes media queries for different screen sizes

The implementation is robust and handles:
- Single Page Application (SPA) navigation
- Mobile and desktop layouts
- Dynamic content loading
- Browser back/forward navigation
