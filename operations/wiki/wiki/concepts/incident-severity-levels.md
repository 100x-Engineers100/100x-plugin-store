---
title: "Incident Severity Levels"
type: concept
tags: [incident, severity, p0, p1, escalation]
source_count: 1
---

## Definition
P0-P3 classification: P0=full outage/data loss/breach, P1=major feature broken/>20% users, P2=partial degradation with workaround, P3=cosmetic/non-critical.

## Why It Matters (for operations)
Wrong severity = wrong response speed = either under-reaction (P0 treated as P2) or team burnout (P3 treated as P1). Classification must happen in <5 min.

## How to Apply It
Default up when uncertain. P0: page IC+EngLead+CEO immediately. P1: page IC+EngLead <15min. P2: on-call handles <1hr. P3: ticket only.

## When to Apply It (trigger)
First 5 minutes of any incident. Classification drives everything else.

## Connections
Related: [[escalation-matrix]], [[blameless-post-mortem]]
Introduced by: [[incident-response-runbook]]
