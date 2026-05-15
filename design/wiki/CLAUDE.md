# CLAUDE.md — Design Wiki Schema
> Operating manual for maintaining this knowledge base. Read at the start of every session.

---

## 1. WIKI PURPOSE

This is the **design team's second brain**. A persistent, compounding knowledge base that helps designers work faster, stay on-brand, and produce AI-assisted work without losing visual quality or brand coherence.

It is NOT a style guide PDF. It provides living, queryable intelligence about brand standards, design decisions, component patterns, and AI tool techniques — updated as the team learns.

Three moments it serves:
1. **Project kickoff** — get design brief, pull brand context, find relevant precedents
2. **Mid-design** — check brand consistency, get AI prompt for generative assets, find component specs
3. **Review** — run brand consistency checklist before handing off

The wiki gets richer with every brand decision, project post-mortem, and AI technique added.

---

## 2. DIRECTORY STRUCTURE

```
CLAUDE.md                    <- this file (schema + operating manual)
raw/                         <- IMMUTABLE. Read, never modify.
  brand-guidelines/          <- color, typography, logo rules, imagery standards
  design-systems/            <- component specs, spacing, patterns, tokens
  inspiration/               <- mood boards, reference projects, style direction
  assets/                    <- exported brand assets, logos, type files
wiki/                        <- LLM-owned. All wiki pages live here.
  index.md                   <- master catalog (update on every ingest)
  log.md                     <- append-only chronological record
  overview.md                <- current brand state + design system status
  persona.md                 <- Claude's persona and behavior for this wiki
  sources/                   <- one summary page per ingested source
  concepts/                  <- design principles, techniques, AI tool patterns
  entities/                  <- tools, typefaces, color systems, vendors
  synthesis/                 <- cross-source analysis, decision frameworks
templates/                   <- page templates (do not modify during sessions)
skills/                      <- bundled skill files for designers
```

---

## 3. PAGE FORMATS

### 3.1 Source Page (`wiki/sources/`)
```markdown
---
title: "Full Source Title"
type: source
source_type: [brand-doc | design-system | inspiration | project-brief | post-mortem]
author: "Author Name"
date: YYYY-MM-DD
raw_path: raw/[path/to/file]
tags: [tag1, tag2]
---

## Summary
## Key Ideas
## Design Decisions
## Concepts Introduced
## Entities Mentioned
## Open Questions
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
## Why It Matters (for design)
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
entity_type: [tool | typeface | color-system | vendor | person]
tags: []
---

## Overview
## Key Facts / Usage
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
6. Update `wiki/overview.md` if materially changes the brand state
7. Append to `wiki/log.md`
8. Flag contradictions (e.g., conflicting color values) explicitly

### 6.2 QUERY (designer asks a question)
1. Read `wiki/index.md` to find relevant pages
2. Read those pages
3. Synthesize answer with [[wiki page]] citations
4. For AI tool questions: combine wiki brand context + technique knowledge
5. For brief requests: pull brand guidelines + relevant precedents + suggested direction

### 6.3 LINT (periodic health check)
- Find outdated brand values, conflicting specs, orphan pages
- Flag deprecated component patterns

---

## 7. CONVENTIONS

- Filenames: lowercase, hyphen-separated (kebab-case)
- Links: Obsidian `[[wiki-link]]` format
- Dates: ISO format YYYY-MM-DD
- Never write "I" in wiki pages
- Contradictions: flag with `> [!warning] Contradiction:` callout
- Common tags: `brand`, `typography`, `color`, `component`, `ai-tools`, `midjourney`, `figma`, `system`

---

## 8. DESIGN-SPECIFIC QUERY BEHAVIOR

When a designer asks for help, always:
1. Pull relevant brand guidelines and component specs from wiki
2. Check if there's a precedent or prior decision that applies
3. For AI prompts: translate brand attributes into generative tool parameters
4. For consistency checks: run against brand guidelines systematically
5. Flag if request conflicts with documented brand standards

**Goal: Every design decision reinforces the brand. Every AI asset matches the system.**

---

## 9. CURRENT STATE

- **Initialized:** 2026-05-13
- **Domain:** Design — Brand, Visual Identity, AI Design Tools
- **Sources ingested:** 2 (visual identity system, component patterns)
- **Pending:** Project post-mortems, AI prompt library, typography specimens

---

## 10. INGESTION GUIDE

| Source type | Raw folder | Wiki pages to create/update |
|---|---|---|
| Brand guidelines doc | `raw/brand-guidelines/` | `sources/`, `concepts/` (principles), `entities/` (colors, type) |
| Design system spec | `raw/design-systems/` | `sources/`, `concepts/` (components), `entities/` (tokens) |
| Inspiration / mood board | `raw/inspiration/` | `sources/`, `synthesis/` (direction) |
| Project post-mortem | `raw/design-systems/` | `sources/`, `synthesis/` (lessons) |
