# CLAUDE.md — Marketing Wiki Schema
> Operating manual for maintaining this knowledge base. Read at the start of every session.

---

## 1. WIKI PURPOSE

This is the **marketing team's second brain**. A persistent, compounding knowledge base that helps marketers plan campaigns, write on-brand copy, analyze competitors, and brief AI tools — without starting from scratch every time.

It is NOT a content calendar. It provides brand voice intelligence, campaign frameworks, audience insights, and competitive context that marketers use to produce better work faster.

Three moments it serves:
1. **Campaign planning** — get brief, pull ICP context, find relevant past campaign learnings
2. **Content creation** — draft copy with correct brand voice, get hooks, adapt to channel
3. **Competitive response** — pull competitor intel, frame positioning, brief team quickly

The wiki gets richer with every campaign post-mortem, competitor update, and audience insight added.

---

## 2. DIRECTORY STRUCTURE

```
CLAUDE.md                    <- this file (schema + operating manual)
raw/                         <- IMMUTABLE. Read, never modify.
  campaigns/                 <- campaign briefs, results, post-mortems
  competitor-intel/          <- competitor research, positioning maps, feature comparisons
  brand-voice/               <- tone of voice guides, messaging pillars, copy examples
  assets/                    <- logos, brand assets, creative references
wiki/                        <- LLM-owned. All wiki pages live here.
  index.md                   <- master catalog (update on every ingest)
  log.md                     <- append-only chronological record
  overview.md                <- current brand positioning + campaign state
  persona.md                 <- Claude's persona and behavior for this wiki
  sources/                   <- one summary page per ingested source
  concepts/                  <- marketing frameworks, techniques, audience models
  entities/                  <- competitors, channels, tools, personas
  synthesis/                 <- cross-source analysis, positioning frameworks
templates/                   <- page templates (do not modify during sessions)
skills/                      <- bundled skill files for marketers
```

---

## 3. PAGE FORMATS

### 3.1 Source Page (`wiki/sources/`)
```markdown
---
title: "Full Source Title"
type: source
source_type: [campaign-brief | post-mortem | competitor-report | brand-doc | article]
author: "Author Name"
date: YYYY-MM-DD
raw_path: raw/[path/to/file]
tags: [tag1, tag2]
---

## Summary
## Key Ideas
## Campaign / Competitive Insights
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
## Why It Matters (for marketing)
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
entity_type: [competitor | channel | tool | persona | partner]
tags: []
---

## Overview
## Key Facts / Positioning
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
6. Update `wiki/overview.md` if materially changes positioning
7. Append to `wiki/log.md`
8. Flag contradictions (e.g., conflicting brand voice guidance) explicitly

### 6.2 QUERY (marketer asks a question)
1. Read `wiki/index.md` to find relevant pages
2. Read those pages
3. Synthesize answer with [[wiki page]] citations
4. For copy requests: apply brand voice from wiki + channel context
5. For competitor questions: combine wiki intel + Claude web search for latest updates

### 6.3 LINT (periodic health check)
- Find stale competitor intel (>3 months), outdated brand voice guidance
- Suggest missing audience persona pages

---

## 7. CONVENTIONS

- Filenames: lowercase, hyphen-separated (kebab-case)
- Links: Obsidian `[[wiki-link]]` format
- Dates: ISO format YYYY-MM-DD
- Never write "I" in wiki pages
- Contradictions: flag with `> [!warning] Contradiction:` callout
- Common tags: `brand-voice`, `campaign`, `icp`, `competitor`, `channel`, `copy`, `hook`, `funnel`

---

## 8. MARKETING-SPECIFIC QUERY BEHAVIOR

When a marketer asks for help, always:
1. Pull brand voice guidelines and audience context from wiki
2. Check for relevant past campaign learnings that apply
3. For copy: match voice pillars, avoid banned phrases, adapt to channel format
4. For competitors: combine wiki intel + live web search for freshest positioning
5. For hooks: derive from audience pain points documented in wiki

**Goal: Every piece of content sounds like us. Every campaign is informed by what worked before.**

---

## 9. CURRENT STATE

- **Initialized:** 2026-05-13
- **Domain:** Marketing — Brand Voice, Campaigns, Competitive Intelligence
- **Sources ingested:** 2 (tone of voice guide, campaign framework)
- **Pending:** Campaign post-mortems, competitor profiles, audience persona docs

---

## 10. INGESTION GUIDE

| Source type | Raw folder | Wiki pages to create/update |
|---|---|---|
| Campaign brief/results | `raw/campaigns/` | `sources/`, `concepts/` (tactics), `synthesis/` (learnings) |
| Competitor research | `raw/competitor-intel/` | `sources/`, `entities/` (competitors), `synthesis/` (positioning) |
| Brand/voice doc | `raw/brand-voice/` | `sources/`, `concepts/` (voice pillars), `entities/` (personas) |
