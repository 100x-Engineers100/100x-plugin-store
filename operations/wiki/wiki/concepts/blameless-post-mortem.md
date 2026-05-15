---
title: "Blameless Post-Mortem"
type: concept
tags: [post-mortem, incident, learning, culture]
source_count: 1
---

## Definition
Incident analysis focused on systems and processes, not individuals. If a person made a mistake, the question is: what system allowed that mistake to happen?

## Why It Matters (for operations)
Blame-based post-mortems produce self-protection, not learning. Blameless ones surface the actual system gaps that need fixing.

## How to Apply It
- Never name individuals as root causes
- Ask: "What made this failure mode possible?"
- Action items target systems, processes, monitoring — not people
- Timeline is factual, not evaluative
- P0: publish within 24h. P1: 48h. P2: 1 week.

## When to Apply It (trigger)
After every P0/P1/P2 incident resolution.

## Connections
Related: [[incident-severity-levels]], [[sop-framework]]
Introduced by: [[incident-response-runbook]]
