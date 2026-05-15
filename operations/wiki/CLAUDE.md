# CLAUDE.md — Operations Wiki Schema
> Operating manual for maintaining this knowledge base. Read at the start of every session.

---

## 1. WIKI PURPOSE

This is the **operations team's second brain**. A persistent, compounding knowledge base that stores SOPs, runbooks, processes, and operational intelligence — so the team doesn't reinvent the wheel or escalate the wrong thing.

It is NOT a static document library. It provides queryable operational knowledge: who does what, how it's done, what to do when things break, and lessons from past incidents.

Three moments it serves:
1. **Process lookup** — find the right SOP or runbook before starting a task
2. **Incident response** — pull the correct escalation path and checklist during an incident
3. **Process creation** — draft a new SOP or checklist from a description

The wiki gets richer with every new SOP, resolved incident, and process improvement added.

---

## 2. DIRECTORY STRUCTURE

```
CLAUDE.md                    <- this file (schema + operating manual)
raw/                         <- IMMUTABLE. Read, never modify.
  sops/                      <- standard operating procedures
  runbooks/                  <- incident response, system runbooks
  processes/                 <- general process documentation, meeting notes
  assets/                    <- diagrams, org charts, architecture maps
wiki/                        <- LLM-owned. All wiki pages live here.
  index.md                   <- master catalog (update on every ingest)
  log.md                     <- append-only chronological record
  overview.md                <- current operational state + active processes
  persona.md                 <- Claude's persona and behavior for this wiki
  sources/                   <- one summary page per ingested source
  concepts/                  <- operational frameworks, principles, escalation logic
  entities/                  <- teams, tools, vendors, systems
  synthesis/                 <- cross-process analysis, improvement frameworks
templates/                   <- page templates (do not modify during sessions)
skills/                      <- bundled skill files for ops team
```

---

## 3. PAGE FORMATS

### 3.1 Source Page (`wiki/sources/`)
```markdown
---
title: "Full Source Title"
type: source
source_type: [sop | runbook | process | incident-report | meeting-notes]
author: "Author Name"
date: YYYY-MM-DD
raw_path: raw/[path/to/file]
tags: [tag1, tag2]
---

## Summary
## Key Steps / Process
## Owners / Responsibilities
## Concepts Introduced
## Entities Mentioned
## Open Questions / Gaps
```

### 3.2 Concept Page (`wiki/concepts/`)
```markdown
---
title: "Concept Name"
type: concept
tags: []
source_count: N
---

## Definition
## Why It Matters (for operations)
## How to Apply It
## When to Apply It (trigger)
## Examples
## Connections
## Open Questions / Unknowns
```

### 3.3 Entity Page (`wiki/entities/`)
```markdown
---
title: "Entity Name"
type: entity
entity_type: [team | tool | vendor | system | person]
tags: []
---

## Overview
## Key Facts / Responsibilities
## Connections
## Notes
```

### 3.4 Synthesis Page (`wiki/synthesis/`)
```markdown
---
title: "Synthesis Title"
type: synthesis
sources: [source1, source2]
tags: []
---

## Question / Framing
## Analysis
## Conclusions
## Contradictions
## Further Research
```

---

## 4. INDEX FORMAT (`wiki/index.md`)

Format per entry: `- [[page-name]] — one-line description`
Update on every ingest. Never rewrite from scratch — append.

---

## 5. LOG FORMAT (`wiki/log.md`)

Append-only. Format: `## [YYYY-MM-DD] action | description`
Valid actions: `ingest`, `query`, `lint`, `update`

---

## 6. OPERATIONS

### 6.1 INGEST (new source added to raw/)
1. Read the source file
2. Create `wiki/sources/[name].md`
3. Create or update `wiki/concepts/` pages
4. Create or update `wiki/entities/` pages
5. Update `wiki/index.md`
6. Update `wiki/overview.md` if materially changes operational state
7. Append to `wiki/log.md`
8. Flag conflicts with existing processes explicitly

### 6.2 QUERY (ops team member asks a question)
1. Read `wiki/index.md` to find relevant SOPs/runbooks
2. Read those pages
3. Return step-by-step guidance with [[wiki page]] citations
4. For incident queries: surface escalation path + severity criteria immediately
5. For new process creation: use existing SOPs as structural templates

### 6.3 LINT (periodic health check)
- Find outdated SOPs (check dates), unclear ownership, missing runbooks
- Flag processes with no assigned owner

---

## 7. CONVENTIONS

- Filenames: lowercase, hyphen-separated (kebab-case)
- Links: Obsidian `[[wiki-link]]` format
- Dates: ISO format YYYY-MM-DD
- Never write "I" in wiki pages
- Contradictions: flag with `> [!warning] Contradiction:` callout
- Common tags: `sop`, `runbook`, `incident`, `onboarding`, `escalation`, `owner`, `checklist`, `p0`, `p1`

---

## 8. OPS-SPECIFIC QUERY BEHAVIOR

When a team member asks for help, always:
1. Find the most relevant SOP or runbook first
2. Surface owner and escalation path if it's an incident
3. For checklist requests: derive steps from documented process, add verification points
4. For new SOPs: use existing SOPs as format templates, ask for owner and trigger before writing
5. Keep responses action-oriented — ops team needs to act, not read

**Goal: No one wastes time figuring out how something works. The answer is always in the wiki.**

---

## 9. CURRENT STATE

- **Initialized:** 2026-05-13
- **Domain:** Operations — SOPs, Runbooks, Process Documentation
- **Sources ingested:** 2 (employee onboarding SOP, incident response runbook)
- **Pending:** Vendor management process, meeting templates, org chart

---

## 10. INGESTION GUIDE

| Source type | Raw folder | Wiki pages to create/update |
|---|---|---|
| SOP document | `raw/sops/` | `sources/`, `concepts/` (principles), `entities/` (owners, tools) |
| Runbook | `raw/runbooks/` | `sources/`, `concepts/` (incident patterns), `entities/` (systems) |
| Process doc | `raw/processes/` | `sources/`, `concepts/` (workflow patterns) |
| Incident post-mortem | `raw/runbooks/` | `sources/`, `synthesis/` (lessons learned) |
