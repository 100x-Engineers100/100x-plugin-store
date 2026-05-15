---
title: "Component Pattern Library v1.4"
type: source
source_type: design-system
author: "Design System Lead"
date: 2026-05-13
raw_path: raw/design-systems/component-patterns.md
tags: [components, design-system, buttons, cards, forms, motion]
---

## Summary
Core UI component specs: buttons (primary/secondary/ghost + 3 sizes), form inputs, cards (4 variants), navigation, typography scale, toast notifications, spacing reference, motion timing.

## Key Ideas
- Primary button: Ember (#D4622A) bg, 44px height, 6px border radius, no shadows
- Cards use borders not shadows (except Elevated variant — use sparingly)
- Motion: 4 timing levels (0/100/200/350ms), 3 easing curves defined
- All spacing must snap to 8px scale: 4/8/12/16/24/32/48/64/96/128
- No native `<select>` — custom dropdown component only
- Destructive button is a separate variant (red) — not Primary button recolored

## Concepts Introduced
[[motion-principles]]
[[design-brief-framework]]

## Entities Mentioned
[[figma]]

## Open Questions
- Are there data visualization components in Figma not yet documented here?
