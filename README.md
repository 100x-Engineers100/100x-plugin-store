# 100x Plugin Store

**Domain-specific AI knowledge plugins for teams using Claude.**

Four production-ready plugins — Sales, Design, Marketing, Operations — each combining a structured knowledge base, a live MCP server, and curated skill files. Connect any plugin to Claude and your AI instantly has access to your team's playbooks, frameworks, and SOPs.

**Live store →** https://100x-plugin-store.vercel.app

---

## Overview

Standard AI assistants start from zero. They don't know your sales objection framework, your brand voice, or your incident runbook — you re-explain context every session.

The 100x Plugin Store solves this. Each plugin packages:

| Component | What it does |
|-----------|-------------|
| **Knowledge Base** | Obsidian vault with domain-specific raw docs, processed concept pages, entities, and synthesis |
| **MCP Server** | Live Cloudflare Worker exposing domain tools over the Model Context Protocol |
| **Skill Files** | Curated open-source prompt skills that teach Claude how to operate in each domain |

---

## How It Works

```
Raw Documents (playbooks, SOPs, briefs, transcripts)
        │
        ▼
  Obsidian Vault          ← structured knowledge: concepts, entities, sources
  /{domain}/wiki/
        │
        ▼
  sync.js                 ← pushes processed pages to Cloudflare KV
        │
        ▼
  Cloudflare KV           ← key-value store, all wiki pages indexed
        │
        ▼
  MCP Server              ← Cloudflare Worker, tools exposed over MCP
  https://{domain}.cohort-c62.workers.dev/mcp
        │
        ▼
  Claude (web / desktop / API)
  ← calls domain tools on demand, response grounded in your knowledge base
```

---

## Live MCP Endpoints

| Domain | MCP Endpoint |
|--------|-------------|
| Sales | `https://100x-sales-wiki.cohort-c62.workers.dev/mcp` |
| Design | `https://100x-design-wiki.cohort-c62.workers.dev/mcp` |
| Marketing | `https://100x-marketing-wiki.cohort-c62.workers.dev/mcp` |
| Operations | `https://100x-ops-wiki.cohort-c62.workers.dev/mcp` |

All endpoints are public. No authentication required.

---

## Available Tools Per Domain

Each server exposes 7 tools: 4 shared base tools + 3 domain-specific tools.

### Shared (all domains)
- `get_page` — fetch a specific wiki page by path
- `search_wiki` — full-text search across the knowledge base
- `get_index` — list all available pages
- `visualize` — render a knowledge graph of related pages

### Sales
- `get_call_brief` — structured prep brief for a sales call
- `get_objection_response` — fetch objection handling for a specific pushback
- `draft_followup` — generate a follow-up email from call notes

### Design
- `get_design_brief` — structured brief with brand constraints and goals
- `generate_ai_prompt` — produce an image/UI generation prompt from brand guidelines
- `review_design_checklist` — validate a design against stored design principles

### Marketing
- `get_campaign_brief` — campaign structure with ICP, channels, and hooks
- `draft_copy` — write on-brand copy from wiki voice guidelines
- `get_content_hook` — pull proven hook patterns by content type

### Operations
- `get_sop` — retrieve a standard operating procedure by name
- `draft_checklist` — generate a process checklist from runbook content
- `format_meeting_notes` — structure raw notes into the team's standard format

---

## Setup: Claude Web (Integrations)

1. Go to **claude.ai** → Profile → **Settings** → **Integrations**
2. Click **Add Integration** → select **Custom MCP**
3. Paste the endpoint URL for your chosen domain:
   ```
   https://100x-sales-wiki.cohort-c62.workers.dev/mcp
   ```
4. Name it (e.g. `100x Sales Wiki`) → **Save**
5. Open a new conversation — tools are immediately available

Repeat for each domain you want active. All 4 can run simultaneously.

**Verify:** Type `Use the sales wiki to get the index of pages.` — Claude should call `get_index` and return the page list.

---

## Setup: Claude Desktop App

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "100x-sales-wiki": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://100x-sales-wiki.cohort-c62.workers.dev/mcp"]
    },
    "100x-design-wiki": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://100x-design-wiki.cohort-c62.workers.dev/mcp"]
    },
    "100x-marketing-wiki": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://100x-marketing-wiki.cohort-c62.workers.dev/mcp"]
    },
    "100x-ops-wiki": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://100x-ops-wiki.cohort-c62.workers.dev/mcp"]
    }
  }
}
```

Config file location:
- **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Restart Claude Desktop after saving.

---

## Example Prompts

### Sales
```
Before my call with a fintech founder, use the sales wiki to get a call brief.
```
```
They pushed back on pricing. Use get_objection_response to handle the ROI objection.
```
```
Call went well — here are my notes. Draft a follow-up email using the sales wiki.
```

### Design
```
Use the design wiki to generate an AI image prompt for a B2B SaaS hero section.
```
```
Review my landing page against the design principles in the wiki.
```

### Marketing
```
Use the marketing wiki to build a campaign brief for our next cohort launch.
```
```
Draft LinkedIn copy for our new AI course using the brand voice from the marketing wiki.
```

### Operations
```
Pull the employee onboarding SOP from the ops wiki.
```
```
We have a production incident. Get the incident response runbook from the wiki.
```

---

## Repository Structure

```
100x-plugin-store/
├── sales/
│   ├── wiki/
│   │   ├── raw/             ← source documents (playbooks, transcripts, documents)
│   │   ├── wiki/            ← processed knowledge (concepts, entities, sources, synthesis)
│   │   ├── skills/          ← skill files (sales-engineer, cold-email, revenue-ops, etc.)
│   │   └── templates/       ← Obsidian page templates
│   └── mcp-server/
│       ├── src/
│       │   ├── index.ts     ← MCP server + all tool implementations
│       │   └── google-handler.ts  ← OAuth template (disabled by default)
│       ├── sync.js          ← syncs wiki/ folder to Cloudflare KV
│       └── wrangler.jsonc   ← Cloudflare deployment configuration
├── design/                  ← identical structure
├── marketing/               ← identical structure
├── operations/              ← identical structure
└── website/
    └── index.html           ← plugin store frontend (deployed on Vercel)
```

---

## Skill Files Reference

Each domain ships with curated open-source skill files that shape Claude's behavior in that domain.

| Domain | Included Skills |
|--------|----------------|
| **Sales** | `sales-engineer` · `revenue-operations` · `cold-email` · `sales-rep-persona` |
| **Design** | `brand-guidelines` · `canvas-design` · `frontend-design` · `theme-factory` |
| **Marketing** | `content-strategy` · `copywriting` · `social-media-manager` · `campaign-analytics` · `marketing-strategy-pmm` |
| **Operations** | `senior-pm` · `internal-comms` · `doc-coauthoring` · `confluence-expert` |

To activate a skill in Claude Code, reference the `SKILL.md` path in your project's `CLAUDE.md`.

---

## Updating Your Knowledge Base

When you add new raw documents to `{domain}/wiki/raw/`:

1. Process them into wiki pages (concepts, entities, sources) using Claude with the domain `CLAUDE.md`
2. Re-sync to Cloudflare KV — no redeployment needed:
   ```bash
   cd {domain}/mcp-server
   node sync.js
   ```

Changes are live immediately after sync.

---

## Self-Hosting

Fork and deploy your own servers in 5 steps.

**Prerequisites:** Cloudflare account · Node.js 18+ · Wrangler CLI (`npm i -g wrangler`)

```bash
# 1. Install dependencies
cd {domain}/mcp-server && npm install

# 2. Create KV namespace
wrangler kv namespace create "{DOMAIN}_WIKI"
# Copy the namespace ID from output into wrangler.jsonc

# 3. Deploy worker
wrangler deploy

# 4. Sync wiki content to KV
node sync.js

# 5. Verify
curl https://your-worker.workers.dev/
# { "status": "ok", "service": "100x-{domain}-wiki", ... }
```

---

## Security

All MCP servers enforce:

- **Prompt injection detection** — regex pattern matching on all user inputs
- **Output sanitization** — wiki content wrapped in `--- BEGIN WIKI DATA ---` / `--- END WIKI DATA ---` delimiters
- **Input validation** — `get_page` accepts alphanumeric + `/` + `-` only; `search_wiki` capped at 200 characters
- **Security headers** — `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `CSP: default-src 'none'`
- **Rate limiting** — 30 requests / 60 seconds per IP via Cloudflare binding

---

## Recommended Companion MCPs

| Domain | Pair with |
|--------|-----------|
| Sales | Superhuman MCP · Apollo.io MCP |
| Design | Canva MCP (official) · Figma MCP |
| Marketing | Google Sheets MCP · Google Drive MCP |
| Operations | Notion MCP · Linear MCP · Google Calendar MCP |

---

## Contributing

Open an issue or PR. When adding a new domain plugin, follow the existing structure: `{domain}/wiki/` for the knowledge base and `{domain}/mcp-server/` for the Worker. All servers must pass the security checklist in `IMPLEMENTATION_PLAN.md` before merge.

---

*Built by [100x Engineers](https://100xengineers.com)*
