# Component Pattern Library

> Version 1.4 | Last updated: 2026-05 | Owner: Design System Lead

---

## Overview

This document specifies the core UI components used across all product surfaces. All components are available in the Figma Design System file (link in Notion). This doc is the source of truth for specs — Figma is the source of truth for assets.

---

## 1. Buttons

### Primary Button
```
Background: Ember (#D4622A)
Text: Chalk (#F5F3EE)
Font: Neue Haas Grotesk Medium, 14px, 0 letter-spacing
Height: 44px
Padding: 0 20px
Border radius: 6px
Border: none

Hover: background lighten 10% (#DB7040)
Active: background darken 10% (#BF5526)
Disabled: background Fog (#CCCAC3), text Slate (#4A4A48), no pointer
```

### Secondary Button
```
Background: transparent
Text: Ink (#141413)
Border: 1.5px solid Ink (#141413)
Font: Neue Haas Grotesk Medium, 14px
Height: 44px
Padding: 0 20px
Border radius: 6px

Hover: background Ink (#141413), text Chalk (#F5F3EE)
Active: background #2A2A28
Disabled: border Fog, text Fog, no pointer
```

### Ghost Button (dark backgrounds)
```
Background: transparent
Text: Chalk (#F5F3EE)
Border: 1.5px solid rgba(245,243,238,0.4)
Font: Neue Haas Grotesk Medium, 14px
Height: 44px
Border radius: 6px

Hover: border opacity 1.0, background rgba(245,243,238,0.08)
```

### Button Sizes
| Size | Height | Font size | Padding |
|------|--------|-----------|---------|
| Small | 32px | 12px | 0 12px |
| Default | 44px | 14px | 0 20px |
| Large | 52px | 16px | 0 24px |

### Don'ts
- No buttons with shadows
- No buttons with gradients
- Do not use Primary button for destructive actions — use a separate destructive variant (red, only in deletion contexts)

---

## 2. Form Inputs

### Text Input
```
Height: 44px
Background: Chalk (#F5F3EE)
Border: 1.5px solid Fog (#CCCAC3)
Border radius: 6px
Padding: 0 12px
Font: Neue Haas Grotesk Regular, 14px, color Ink (#141413)
Placeholder: color Fog (#CCCAC3)

Focus: border Ink (#141413), no outline ring
Error: border #C0392B, error message below in 12px Neue Haas, color #C0392B
Disabled: background #ECEAE5, text Slate (#4A4A48)
```

### Textarea
Same as Text Input but:
```
Min height: 96px
Padding: 12px
Resize: vertical only
```

### Select / Dropdown
Same as Text Input with right-side chevron icon (20px, Slate color). Custom dropdown component — do not use native `<select>`.

### Label Spec
```
Font: Neue Haas Grotesk Medium, 12px
Color: Slate (#4A4A48)
Letter spacing: +0.04em
Text transform: uppercase
Margin bottom: 6px
```

---

## 3. Cards

### Default Card
```
Background: Chalk (#F5F3EE) [light mode] / #1C1C1A [dark mode]
Border: 1px solid Fog (#CCCAC3) [light] / rgba(255,255,255,0.08) [dark]
Border radius: 12px
Padding: 24px
Box shadow: none (cards use borders, not shadows)
```

### Interactive Card (hover state)
```
Hover: border-color Slate (#4A4A48) [light] / rgba(255,255,255,0.2) [dark]
Transform: translateY(-2px)
Transition: 150ms ease
```

### Card Variants
| Variant | Difference |
|---------|-----------|
| Flat | No border, background only |
| Outlined | Border, transparent background |
| Elevated | 0 4px 16px rgba(0,0,0,0.08) shadow — use sparingly |
| Feature | Ember left-border (3px), used for highlighted content |

---

## 4. Navigation

### Top Nav
```
Height: 64px
Background: Chalk (#F5F3EE) [default] or transparent [over hero]
Border bottom: 1px solid Fog (#CCCAC3) when scrolled
Logo: left-aligned, 24px margin from edge
Nav links: Neue Haas Grotesk Regular, 14px, color Ink, right-aligned
CTA button: Primary button, right-most
```

### Mobile Nav (< 768px)
Hamburger menu (24px icon, Ink color). Drawer slides from right. Full-height, 280px wide. Background Ink, text Chalk.

---

## 5. Typography Components

### Heading Scale (in-product)
```
H1: 36px / 42px line-height / Medium
H2: 28px / 34px / Medium
H3: 22px / 28px / Medium
H4: 18px / 24px / Medium
H5: 14px / 20px / Medium / uppercase / +0.04em tracking
```

### Body Text
```
Body L: 18px / 28px line-height
Body M: 16px / 25px line-height (default)
Body S: 14px / 22px line-height
Caption: 12px / 18px / color Slate
```

---

## 6. Feedback Components

### Toast Notifications
```
Width: max 360px
Position: bottom-right, 24px from edge
Background: Ink (#141413)
Text: Chalk, 14px
Border radius: 8px
Padding: 12px 16px
Auto-dismiss: 4 seconds
```

### Variants
| Type | Left border | Icon |
|------|------------|------|
| Info | Sky (#5B8DB8) | info-circle |
| Success | Sage (#6B8C6F) | check-circle |
| Warning | Dust (#B8956A) | alert-triangle |
| Error | #C0392B | x-circle |

---

## 7. Spacing Reference

All margins and padding must use the 8px scale: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`

### Component Internal Spacing
| Component | Internal padding |
|-----------|----------------|
| Button (default) | 0 20px |
| Card | 24px |
| Input | 0 12px |
| Modal | 32px |
| Tooltip | 8px 12px |

---

## 8. Motion

### Timing
```
Instant: 0ms (no animation — state changes that shouldn't be noticed)
Fast: 100ms (hover states, micro-interactions)
Default: 200ms (most transitions)
Slow: 350ms (panels, modals, page transitions)
```

### Easing
```
Standard: cubic-bezier(0.4, 0, 0.2, 1)
Decelerate (enter): cubic-bezier(0, 0, 0.2, 1)
Accelerate (exit): cubic-bezier(0.4, 0, 1, 1)
```

### What Gets Animated
- Button hover/active: background color (100ms)
- Card hover: transform + border (150ms)
- Modal: opacity + translateY (200ms decelerate)
- Dropdowns: opacity + scaleY (150ms)
- Page transitions: opacity (200ms)

### What Does NOT Get Animated
- Text content changes
- Error states (should appear immediately)
- Any element with more than 2 concurrent animations

---

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2024-06 | Initial component library |
| 1.2 | 2025-02 | Dark mode variants added |
| 1.3 | 2025-11 | Motion system defined |
| 1.4 | 2026-05 | Destructive button variant, toast component added |
