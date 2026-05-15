# Visual Identity System

> Version 2.1 | Last updated: 2026-05 | Owner: Design Lead

---

## 1. Brand Personality

We are **bold without being aggressive. Warm without being soft. Smart without being cold.**

Our visual language reflects a company that respects the intelligence of its audience. We don't over-design. We don't shout. We earn attention through quality and intention.

**Brand pillars in visual form:**
- **Clarity** — whitespace is not emptiness, it's breath
- **Confidence** — strong type, intentional hierarchy, no decorative noise
- **Human** — warm color temperature, organic shapes over hard geometry

---

## 2. Color System

### Primary Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Ink | `#141413` | 20, 20, 19 | Primary text, dark backgrounds |
| Chalk | `#F5F3EE` | 245, 243, 238 | Light backgrounds, reversed text |
| Slate | `#4A4A48` | 74, 74, 72 | Secondary text, captions |
| Fog | `#CCCAC3` | 204, 202, 195 | Borders, dividers, subtle UI |

### Accent Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Ember | `#D4622A` | 212, 98, 42 | Primary CTA, highlights, emphasis |
| Sage | `#6B8C6F` | 107, 140, 111 | Success states, secondary accent |
| Dust | `#B8956A` | 184, 149, 106 | Warmth, editorial use only |
| Sky | `#5B8DB8` | 91, 141, 184 | Information, links, data viz primary |

### Dark Mode Adjustments
- Background: `#111110` (slightly warmer than pure black)
- Surface: `#1C1C1A`
- Text primary: `#F0EDE7`
- Text secondary: `#9C9A94`
- Accents remain the same

### What NOT to Do
- Never use pure `#000000` or `#FFFFFF` — too harsh, not on-brand
- Never use Ember for large text blocks — use for accents only
- Never combine Ember + Sage as foreground/background — insufficient contrast
- Never use more than 2 accent colors in a single composition

---

## 3. Typography

### Type System

| Role | Typeface | Weight | Size range |
|------|----------|--------|-----------|
| Display | Canela (or Playfair Display as fallback) | Light / Regular | 48-120px |
| Heading | Neue Haas Grotesk (or Inter as fallback) | Medium / Bold | 24-48px |
| Body | Neue Haas Grotesk | Regular | 14-18px |
| Caption | Neue Haas Grotesk | Regular | 11-13px |
| Mono / Code | JetBrains Mono | Regular | 12-14px |

### Typographic Principles
- **Line height:** 1.4-1.6 for body, 1.1-1.2 for display
- **Letter spacing:** -0.02em for display, 0 for body, +0.06em for all-caps labels
- **Max line length:** 65-75 characters for body text
- **Hierarchy:** Never more than 3 levels of type size in one composition

### Type Don'ts
- No decorative/script fonts except in approved campaign contexts
- No type set entirely in uppercase for body copy
- No stretching or distorting typefaces
- No shadows on body text

---

## 4. Logo Usage

### Clear Space
Minimum clear space = height of the logo's "x" character on all sides.

### Minimum Sizes
- Digital: 24px height minimum
- Print: 8mm height minimum

### Approved Variations
1. **Primary (Ink on Chalk)** — default usage
2. **Reversed (Chalk on Ink)** — dark backgrounds
3. **Single color (Ember)** — special campaign use, approved by design lead
4. **Monochrome** — Ink only, for grayscale reproduction

### Logo Don'ts
- No stretching, rotating, or distorting
- No drop shadows, gradients, or effects
- No placement on busy photography without overlay
- No recoloring outside approved variations
- Never use the wordmark and icon separately without approval

---

## 5. Imagery

### Photography Style
- **Subject:** Real people in real situations — candid, not posed
- **Lighting:** Natural or naturalistic — warm, directional light preferred
- **Color grading:** Desaturated slightly, warm tones, never cold/clinical
- **Avoid:** Stock photo smiles, obvious studio lighting, fake candid poses

### AI-Generated Imagery (Midjourney / DALL-E / Stable Diffusion)
Approved prompt parameters for brand-consistent outputs:

```
Style: editorial photography, warm natural light, 35mm film grain
Color: warm tones, desaturated, no neon, no cold blue
Mood: calm, intentional, human
Avoid: hyperrealistic CGI, cyberpunk, neon, cold clinical lighting
Aspect: 16:9 for hero, 1:1 for social, 4:5 for mobile
```

### Illustration Style (when used)
- Line weight: medium, consistent
- Color: limited palette from primary + one accent
- Style: editorial / geometric, not cartoonish
- No gradients, no drop shadows

---

## 6. Iconography

- **Style:** Outline, 1.5px stroke, rounded caps
- **Size:** 16px / 20px / 24px only (no intermediate sizes)
- **Color:** Always Ink or Slate — never Ember for icons unless in a CTA context
- **Library:** Use the approved Figma icon set. Do not create one-off icons.

---

## 7. Spacing & Layout

### Spacing Scale (8px base grid)
`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`

All spacing decisions must snap to this scale.

### Column Grid
- **Desktop:** 12 columns, 24px gutter, 80px margin
- **Tablet:** 8 columns, 16px gutter, 32px margin
- **Mobile:** 4 columns, 16px gutter, 16px margin

### Hierarchy Rule
One dominant element per screen/spread. Supporting elements should not compete with the lead.

---

## 8. Brand Voice in Design

Even without words, design communicates. Our layouts should feel:
- **Intentional** — nothing is placed arbitrarily
- **Spacious** — white space is used generously and purposefully
- **Weighted** — hierarchy is clear without needing to be loud

If a design feels busy, start by removing — not adjusting.

---

## 9. Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2024-03 | Initial brand launch |
| 2.0 | 2025-09 | Type system refresh, new accent palette |
| 2.1 | 2026-05 | AI imagery guidelines added, dark mode expanded |
