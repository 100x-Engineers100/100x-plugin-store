---
title: "Incident Response Runbook v1.3"
type: source
source_type: runbook
author: "Engineering Lead + Operations Manager"
date: 2026-05-13
raw_path: raw/runbooks/incident-response-runbook.md
tags: [incident, runbook, p0, p1, escalation, on-call, post-mortem]
---

## Summary
P0-P3 severity framework, 3 incident roles (IC/Tech Lead/Comms Lead), 4 response phases (detection→response→resolution→post-mortem), communication templates, on-call rotation structure.

## Key Steps / Process
- P0: immediate page IC + Eng Lead + CEO, 15-min external updates, 10-min internal
- P1: <15 min response, Eng Lead + on-call, 30-min external updates
- Detection → Triage → Declare in #incidents → Open war room → Scribe log → Fix → Verify → Resolve
- Post-mortem: P0 within 24h, P1 within 48h — blameless, systems-focused

## Owners / Responsibilities
- IC (Incident Commander): Engineering Lead — coordinates, communicates, does NOT touch the fix
- Tech Lead: on-call engineer — diagnoses and implements fix
- Comms Lead: Operations Manager — status page + external comms

## Concepts Introduced
[[incident-severity-levels]]
[[escalation-matrix]]
[[blameless-post-mortem]]

## Entities Mentioned
[[incident-tools]]
[[ops-team]]

## Open Questions / Gaps
- PagerDuty rotation link not in wiki yet
- On-call compensation policy needs HR doc link
