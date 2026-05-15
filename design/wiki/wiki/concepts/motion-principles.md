---
title: "Motion Principles"
type: concept
tags: [motion, animation, timing, design-system]
source_count: 1
---

## Definition
Purposeful animation system: 4 timing levels (0/100/200/350ms), 3 easing curves, explicit list of what gets and doesn't get animated.

## Why It Matters (for design)
Inconsistent motion breaks the feeling of a coherent product. Every animated element should feel like it belongs to the same physical system.

## How to Apply It
- Hover states: 100ms standard easing
- Cards: 150ms with translateY(-2px)
- Modals/panels: 200ms decelerate easing
- Never animate: text changes, error states, elements with 2+ concurrent animations

## When to Apply It (trigger)
Any interactive component or transition.

## Connections
Related: [[brand-consistency]]
Introduced by: [[component-patterns]]
