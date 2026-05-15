---
title: "Escalation Matrix"
type: concept
tags: [escalation, incident, roles, on-call]
source_count: 1
---

## Definition
Who gets paged for what, in what order, with what response time expectations. Prevents both under-escalation (too few people) and over-escalation (paging CEO for a P3).

## Why It Matters (for operations)
Unclear escalation paths during incidents cause delay, duplicated effort, and missed notifications. The matrix removes the "who do I call?" question.

## How to Apply It
| Severity | Page immediately |
|----------|-----------------|
| P0 | On-call engineer + Engineering Lead + CEO |
| P1 | On-call engineer + Engineering Lead |
| P2 | On-call engineer only |
| P3 | Create ticket, no page |

IC never touches the fix — that's Tech Lead's role.

## Connections
Related: [[incident-severity-levels]], [[sop-framework]]
