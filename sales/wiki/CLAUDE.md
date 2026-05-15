# CLAUDE.md — Sales Wiki Schema
> Operating manual for maintaining this knowledge base. Read at the start of every session.

---

## 1. WIKI PURPOSE

This is the **100xEngineers sales team's second brain**. A persistent, compounding knowledge base that helps sales reps sell the Applied AI cohort to any kind of lead — engineers, designers, marketers, founders, managers, doctors, animators, game designers, and anyone else.

It is NOT a script library. It provides nuances, framings, facts, and domain intelligence that reps use to make a better case in their own voice.

Three moments it serves:
1. **Pre-call** — understand the lead, prepare angle and relevant story
2. **Mid-call** — map cohort to their domain, handle objections with intelligence
3. **Post-call** — draft personalized WhatsApp follow-up

The wiki gets richer with every source added. Cross-references should already exist when answering rep questions.

---

## 2. DIRECTORY STRUCTURE

```
CLAUDE.md                    <- this file (schema + operating manual)
raw/                         <- IMMUTABLE. Read, never modify.
  transcripts/               <- call transcripts
  playbooks/                 <- objection handling, scripts, playbooks
  documents/                 <- program info, success stories, pricing
  assets/                    <- images, PDFs
wiki/                        <- LLM-owned. All wiki pages live here.
  index.md                   <- master catalog (update on every ingest)
  log.md                     <- append-only chronological record
  overview.md                <- high-level synthesis of the sales system
  persona.md                 <- Claude's persona and behavior for this wiki
  sources/                   <- one summary page per ingested source
  concepts/                  <- sales frameworks, techniques, framings
  entities/                  <- companies, people, tools, products
  synthesis/                 <- cross-source analysis, domain playbooks
templates/                   <- page templates (do not modify during sessions)
skills/                      <- bundled skill files for sales reps
```

---

## 3. PAGE FORMATS

### 3.1 Source Page (`wiki/sources/`)
```markdown
---
title: "Full Source Title"
type: source
source_type: [transcript | playbook | document | article]
author: "Author Name"
date: YYYY-MM-DD
raw_path: raw/[path/to/file]
tags: [tag1, tag2]
---

## Summary
## Key Ideas
## Notable Quotes / Moments
## Concepts Introduced
## Entities Mentioned
## Contradictions / Tensions
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
## Why It Matters (for sales)
## How to Use It
## When to Use It (trigger)
## Examples from Calls
## Connections
## Open Questions / Unknowns
```

### 3.3 Entity Page (`wiki/entities/`)
```markdown
---
title: "Entity Name"
type: entity
entity_type: [company | person | product | competitor]
tags: []
---

## Overview
## Key Facts / Role
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
6. Update `wiki/overview.md` if materially changes the picture
7. Append to `wiki/log.md`
8. Flag contradictions explicitly

### 6.2 QUERY (rep asks a question)
1. Read `wiki/index.md` to find relevant pages
2. Read those pages
3. Synthesize answer with [[wiki page]] citations
4. For domain-specific questions: combine wiki knowledge + Claude web search for current AI trends in that domain
5. Return nuances, framings, facts — NOT scripts. Rep delivers in their own voice.

### 6.3 LINT (periodic health check)
- Find orphan pages, outdated claims, missing cross-references
- Suggest missing pages for frequently-mentioned concepts

---

## 7. CONVENTIONS

- Filenames: lowercase, hyphen-separated (kebab-case)
- Links: Obsidian `[[wiki-link]]` format
- Dates: ISO format YYYY-MM-DD
- Never write "I" in wiki pages
- Contradictions: flag with `> [!warning] Contradiction:` callout
- Common tags: `sales`, `framing`, `objection`, `domain`, `cohort`, `100x`, `persona`

---

## 8. SALES-SPECIFIC QUERY BEHAVIOR

When a rep describes a lead situation, always:
1. Pull the most specific matching domain/persona context
2. Combine with web search for current AI trends in their domain
3. Map relevant cohort modules to their world
4. Suggest the closest matching success story
5. Identify likely objections and relevant framings
6. Keep response brief — rep may be on a call

**The goal is never to give a script. Give the ammunition. The rep fires it in their own voice.**

---

## 9. CURRENT STATE

- **Initialized:** 2026-05-13
- **Domain:** Sales — 100xEngineers Applied AI Cohort
- **Sources ingested:** 2 (objection playbook, program overview)
- **Pending:** Call transcripts, success stories by domain, competitor intel

---

## 10. INGESTION GUIDE

| Source type | Raw folder | Wiki pages to create/update |
|---|---|---|
| Call transcript | `raw/transcripts/` | `sources/`, `concepts/` (patterns), `entities/` (people, companies) |
| Playbook/script | `raw/playbooks/` | `sources/`, `concepts/` (objection handling) |
| Program docs | `raw/documents/` | `sources/`, `entities/`, `synthesis/domain-to-cohort-mapping.md` |
| Success story | `raw/documents/` | `sources/`, `synthesis/success-stories.md` |
