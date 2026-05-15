import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  registerAppTool,
  registerAppResource,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";

// google-handler.ts ships as a commented-out OAuth template — see src/google-handler.ts to enable.

// ── Security: prompt injection sanitization ───────────────────────────────────
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/gi,
  /<\s*\/?(?:SYSTEM|INST|SYS|HUMAN|ASSISTANT)\s*>/gi,
  /\[SYSTEM\]/gi,
  /###\s*SYSTEM/gi,
  /you are now\s+/gi,
  /act as\s+(a\s+)?(?:DAN|jailbreak|unrestricted)/gi,
];

function sanitizeOutput(text: string): string {
  let safe = text;
  for (const pattern of INJECTION_PATTERNS) {
    safe = safe.replace(pattern, "[removed]");
  }
  return `--- BEGIN WIKI DATA ---\n${safe}\n--- END WIKI DATA ---`;
}

function extractTitle(md: string): string | null {
  const m = md.match(/^---[\s\S]*?^title:\s*["']?(.+?)["']?\s*$/m);
  return m ? m[1] : null;
}

async function fetchPages(kv: KVNamespace, keys: string[]): Promise<string> {
  const results = await Promise.all(
    keys.map(async (key) => {
      const content = await kv.get(key);
      if (!content) return null;
      const title = extractTitle(content) ?? key;
      return `### ${title}\n\n${content}`;
    })
  );
  return results.filter((r): r is string => r !== null).join("\n\n---\n\n");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function detectDiagramType(s: string): string {
  const f = s.trim().toLowerCase();
  if (f.startsWith("flowchart") || f.startsWith("graph")) return "Flowchart";
  if (f.startsWith("sequencediagram")) return "Sequence";
  if (f.startsWith("classdiagram")) return "Class Diagram";
  if (f.startsWith("erdiagram")) return "ER Diagram";
  if (f.startsWith("gantt")) return "Gantt";
  if (f.startsWith("mindmap")) return "Mind Map";
  if (f.startsWith("timeline")) return "Timeline";
  if (f.startsWith("statediagram")) return "State Diagram";
  if (f.startsWith("pie")) return "Pie Chart";
  if (f.startsWith("xychart")) return "XY Chart";
  return "Diagram";
}

function buildVisualizerHTML(syntax: string, title: string): string {
  const safeTitle = escapeHtml(title);
  const diagramType = detectDiagramType(syntax);
  const syntaxJson = JSON.stringify(syntax);
  const titleJson = JSON.stringify(title);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${safeTitle}</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
:root{--bg:#0D0D0D;--surface:#161616;--surface2:#1E1E1E;--primary:#F96846;--primary-h:#FF7A5C;--primary-dim:rgba(249,104,70,0.14);--text:#F2F2F2;--muted:#777;--border:#282828;--font:"Space Grotesk",system-ui,sans-serif;}
html,body{width:100%;height:100%;min-height:480px;background:var(--bg);color:var(--text);font-family:var(--font);overflow:hidden;}
#app{display:flex;flex-direction:column;height:100%;min-height:480px;}
header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--surface);border-bottom:1px solid var(--border);flex-shrink:0;gap:8px;}
.hl{display:flex;align-items:center;gap:8px;min-width:0;flex:1;}
.logo{width:24px;height:24px;background:var(--primary);border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.logo svg{width:13px;height:13px;fill:#fff;}
.htitle{font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.badge{font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--primary);background:var(--primary-dim);border:1px solid rgba(249,104,70,.3);padding:2px 7px;border-radius:20px;flex-shrink:0;}
.hr{display:flex;gap:5px;flex-shrink:0;}
#wrap{flex:1;position:relative;overflow:hidden;background:var(--bg);background-image:radial-gradient(circle,#1E1E1E 1px,transparent 1px);background-size:20px 20px;cursor:grab;}
#wrap.dragging{cursor:grabbing;}
#canvas{position:absolute;top:50%;left:50%;transform-origin:0 0;display:flex;align-items:center;justify-content:center;}
.mermaid{display:block;}.mermaid svg{display:block;max-width:none;}
#err{display:none;position:absolute;inset:0;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--muted);font-size:13px;text-align:center;padding:32px;}
#zctrl{position:absolute;bottom:12px;right:12px;display:flex;align-items:center;gap:2px;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:3px;}
.zbtn{width:26px;height:26px;background:transparent;border:none;border-radius:5px;color:var(--muted);font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .12s;line-height:1;}
.zbtn:hover{background:var(--surface2);color:var(--text);}
#zlvl{font-size:10px;font-weight:600;color:var(--muted);min-width:36px;text-align:center;}
.panel{display:none;position:absolute;inset:0;background:var(--bg);z-index:60;flex-direction:column;padding:14px;overflow:auto;}
.panel.open{display:flex;}
.panel-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-shrink:0;}
.panel-title{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;}
#syn-code{font-family:"Courier New",monospace;font-size:11px;color:var(--text);line-height:1.65;background:var(--surface);padding:14px;border-radius:8px;border:1px solid var(--border);white-space:pre-wrap;word-break:break-all;flex:1;overflow:auto;}
footer{display:flex;align-items:center;justify-content:space-between;padding:8px 14px;background:var(--surface);border-top:1px solid var(--border);flex-shrink:0;gap:8px;}
.btn-g{display:flex;gap:5px;}
.btn{height:28px;padding:0 12px;border-radius:7px;font-family:var(--font);font-size:11px;font-weight:500;cursor:pointer;transition:all .12s;display:flex;align-items:center;gap:5px;white-space:nowrap;border:none;}
.btn-o{background:transparent;border:1px solid var(--border);color:var(--muted);}
.btn-o:hover{border-color:var(--muted);color:var(--text);background:var(--surface2);}
.btn-p{background:var(--primary);color:#fff;font-weight:600;}
.btn-p:hover{background:var(--primary-h);}
#toast{position:fixed;bottom:52px;left:50%;transform:translateX(-50%) translateY(6px);background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:11px;padding:6px 13px;border-radius:8px;opacity:0;transition:opacity .18s,transform .18s;pointer-events:none;white-space:nowrap;z-index:200;}
#toast.on{opacity:1;transform:translateX(-50%) translateY(0);}
</style>
</head>
<body>
<div id="app">
<header>
  <div class="hl">
    <div class="logo"><svg viewBox="0 0 16 16"><path d="M2 3h12v2H2zM2 7h8v2H2zM2 11h10v2H2z"/></svg></div>
    <span class="htitle">${safeTitle}</span>
    <span class="badge">${escapeHtml(diagramType)}</span>
  </div>
  <div class="hr">
    <button class="btn btn-o" id="btn-syn"><svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M5 3L1 8l4 5-1.4 1.1L-.6 8 3.6 1.9 5 3zm6 0l1.4-1.1L16.6 8l-4.2 6.1L11 13l4-5-4-5z"/></svg>Source</button>
  </div>
</header>
<div id="wrap">
  <div id="canvas"><div class="mermaid" id="mel"></div></div>
  <div id="err"><div style="font-size:26px">⚠</div><div id="errmsg">Render error</div></div>
  <div id="zctrl">
    <button class="zbtn" id="z-out">−</button>
    <span id="zlvl">100%</span>
    <button class="zbtn" id="z-in">+</button>
    <button class="zbtn" id="z-rst" style="font-size:11px;font-weight:700;">⟳</button>
  </div>
  <div class="panel" id="syn-panel">
    <div class="panel-hd">
      <span class="panel-title">Mermaid Source</span>
      <button class="btn btn-o" id="btn-syn-close" style="height:24px;padding:0 9px;font-size:10px;">✕ Close</button>
    </div>
    <pre id="syn-code"></pre>
  </div>
</div>
<footer>
  <div class="btn-g">
    <button class="btn btn-o" id="btn-svg"><svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M8 11L3 6h3V1h4v5h3L8 11zM1 13h14v2H1z"/></svg>Export SVG</button>
  </div>
  <button class="btn btn-p" id="btn-copy-syn">Copy Syntax</button>
</footer>
</div>
<div id="toast"></div>
<script>
var D=${syntaxJson};var T=${titleJson};
document.getElementById("syn-code").textContent=D;
var _tt;function toast(m){var el=document.getElementById("toast");el.textContent=m;el.classList.add("on");clearTimeout(_tt);_tt=setTimeout(function(){el.classList.remove("on");},2200);}
function copyText(txt){if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).catch(function(){execCopy(txt);});}else{execCopy(txt);}}
function execCopy(txt){var ta=document.createElement("textarea");ta.value=txt;ta.style.cssText="position:fixed;top:-999px;left:-999px;opacity:0;";document.body.appendChild(ta);ta.select();try{document.execCommand("copy");}catch(e){}document.body.removeChild(ta);}
mermaid.initialize({startOnLoad:false,theme:"base",securityLevel:"loose",themeVariables:{background:"#0D0D0D",mainBkg:"#161616",primaryColor:"#F96846",primaryBorderColor:"#F96846",primaryTextColor:"#F2F2F2",lineColor:"#555",textColor:"#F2F2F2",fontFamily:"Space Grotesk,system-ui,sans-serif",fontSize:"14px"}});
var mel=document.getElementById("mel");var errEl=document.getElementById("err");mel.textContent=D;
mermaid.run({nodes:[mel]}).then(function(){var svg=mel.querySelector("svg");if(!svg)return;svg.removeAttribute("height");svg.removeAttribute("width");svg.style.display="block";fitTransform();}).catch(function(e){mel.style.display="none";errEl.style.display="flex";document.getElementById("errmsg").textContent="Error: "+(e&&e.message?e.message:"Invalid syntax");});
var scale=1,tx=0,ty=0,dragging=false,startX=0,startY=0,startTx=0,startTy=0;
var wrap=document.getElementById("wrap");var canvas=document.getElementById("canvas");
function applyTransform(){canvas.style.transform="translate(calc(-50% + "+tx+"px), calc(-50% + "+ty+"px)) scale("+scale+")";document.getElementById("zlvl").textContent=Math.round(scale*100)+"%";}
function fitTransform(){var svg=mel.querySelector("svg");if(!svg){scale=1;tx=0;ty=0;applyTransform();return;}var vb=svg.getAttribute("viewBox");var svgW=0,svgH=0;if(vb){var p=vb.trim().split(/[\s,]+/);svgW=parseFloat(p[2])||0;svgH=parseFloat(p[3])||0;}if(!svgW||!svgH){var r=svg.getBoundingClientRect();svgW=r.width||400;svgH=r.height||300;}var wr=wrap.getBoundingClientRect();var fit=Math.min((wr.width*0.88)/svgW,(wr.height*0.88)/svgH,1);scale=Math.max(0.05,fit);tx=0;ty=0;applyTransform();}
wrap.addEventListener("wheel",function(e){e.preventDefault();var rect=wrap.getBoundingClientRect();var cx=e.clientX-rect.left-rect.width/2;var cy=e.clientY-rect.top-rect.height/2;var delta=e.deltaY<0?1.12:0.89;var ns=Math.min(8,Math.max(0.1,scale*delta));tx=cx+(tx-cx)*(ns/scale);ty=cy+(ty-cy)*(ns/scale);scale=ns;applyTransform();},{passive:false});
wrap.addEventListener("pointerdown",function(e){if(e.target.closest("button,a"))return;dragging=true;startX=e.clientX;startY=e.clientY;startTx=tx;startTy=ty;wrap.setPointerCapture(e.pointerId);wrap.classList.add("dragging");});
wrap.addEventListener("pointermove",function(e){if(!dragging)return;tx=startTx+(e.clientX-startX);ty=startTy+(e.clientY-startY);applyTransform();});
wrap.addEventListener("pointerup",function(){dragging=false;wrap.classList.remove("dragging");});
document.getElementById("z-in").onclick=function(){scale=Math.min(8,scale*1.2);applyTransform();};
document.getElementById("z-out").onclick=function(){scale=Math.max(0.1,scale/1.2);applyTransform();};
document.getElementById("z-rst").onclick=function(){fitTransform();};
document.getElementById("btn-svg").onclick=function(){var svg=mel.querySelector("svg");if(!svg){toast("No diagram rendered");return;}var clone=svg.cloneNode(true);clone.setAttribute("xmlns","http://www.w3.org/2000/svg");clone.style.background="#0D0D0D";var str=new XMLSerializer().serializeToString(clone);var enc="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(str);var a=document.createElement("a");a.href=enc;a.download=T.replace(/[^a-z0-9]/gi,"-").toLowerCase()+".svg";document.body.appendChild(a);a.click();document.body.removeChild(a);toast("SVG downloaded");};
document.getElementById("btn-syn").onclick=function(){document.getElementById("syn-panel").classList.add("open");};
document.getElementById("btn-syn-close").onclick=function(){document.getElementById("syn-panel").classList.remove("open");};
document.getElementById("btn-copy-syn").onclick=function(){copyText(D);toast("Syntax copied");};
</script>
</body>
</html>`;
}

// ── MCP Agent ─────────────────────────────────────────────────────────────────

const VISUALIZER_URI = "ui://ops-wiki/visualizer.html";

export class OpsWikiMCP extends McpAgent<Env, unknown, Record<string, unknown>> {
  server = new McpServer({ name: "Operations Wiki", version: "1.0.0" });

  private diagramSyntax = "";
  private diagramTitle = "Operations Wiki Diagram";

  private async track(event: string, props: Record<string, unknown> = {}): Promise<void> {
    const key = this.env.POSTHOG_API_KEY;
    if (!key) return;
    try {
      await fetch("https://us.i.posthog.com/capture/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: key,
          distinct_id: "anonymous",
          event,
          properties: { ...props, $lib: "ops-wiki-mcp", server: "ops-wiki" },
          timestamp: new Date().toISOString(),
        }),
      });
    } catch { /* analytics must never crash a tool call */ }
  }

  async init() {

    // ── 1. get_index ──────────────────────────────────────────────────────────
    this.server.tool(
      "get_index",
      "Returns the full operations wiki index — catalog of all pages by category. Call this first to discover what exists before using get_page or search_wiki.",
      {},
      async () => {
        const t0 = Date.now();
        try {
          const content = await this.env.OPS_WIKI.get("__index__");
          const text = content ?? "Index not found. Run sync.js.";
          await this.track("tool_called", { tool: "get_index", duration_ms: Date.now() - t0, found: !!content });
          return { content: [{ type: "text" as const, text }] };
        } catch (err) {
          await this.track("tool_error", { tool: "get_index", error: String(err) });
          return { content: [{ type: "text" as const, text: "Wiki index temporarily unavailable." }] };
        }
      }
    );

    // ── 2. get_page ───────────────────────────────────────────────────────────
    this.server.tool(
      "get_page",
      "Fetches the full content of a single wiki page by key, e.g. 'concepts/sop-framework'. Use get_index first to find valid keys.",
      { path: z.string().describe("KV key of the page. No .md extension needed.") },
      async ({ path }) => {
        const t0 = Date.now();
        const safePath = path.replace(/\.md$/, "");
        if (!/^[a-z0-9/_-]+$/.test(safePath)) {
          await this.track("input_rejected", { tool: "get_page", reason: "invalid_path", path });
          return { content: [{ type: "text" as const, text: `Invalid path: '${path}'. Use lowercase letters, numbers, hyphens, slashes only.` }] };
        }
        try {
          const content = await this.env.OPS_WIKI.get(safePath);
          const found = !!content;
          await this.track("tool_called", { tool: "get_page", duration_ms: Date.now() - t0, path, found });
          return { content: [{ type: "text" as const, text: found ? sanitizeOutput(content!) : `Not found: '${path}'. Use get_index to see valid keys.` }] };
        } catch (err) {
          await this.track("tool_error", { tool: "get_page", error: String(err) });
          return { content: [{ type: "text" as const, text: `Unable to fetch '${path}' right now.` }] };
        }
      }
    );

    // ── 3. search_wiki ────────────────────────────────────────────────────────
    this.server.tool(
      "search_wiki",
      "Full-text search across all operations wiki pages. Returns keys, titles, and excerpts.",
      {
        query: z.string().min(2).max(200).describe("Search term"),
        type: z.enum(["concepts", "sources", "entities", "synthesis"]).optional().describe("Restrict to page type"),
      },
      async ({ query, type }) => {
        const t0 = Date.now();
        try {
          const listed = await this.env.OPS_WIKI.list({ prefix: type ? `${type}/` : undefined });
          const q = query.toLowerCase();
          const matches: string[] = [];
          for (const k of listed.keys) {
            const md = await this.env.OPS_WIKI.get(k.name);
            if (!md) continue;
            const idx = md.toLowerCase().indexOf(q);
            if (idx === -1) continue;
            const title = extractTitle(md) ?? k.name;
            const start = Math.max(0, idx - 40);
            const excerpt = md.slice(start, idx + query.length + 60).replace(/\n/g, " ").trim();
            matches.push(`[${k.name}] ${title}\n  "...${excerpt}..."`);
          }
          const resultText = matches.length
            ? `${matches.length} result(s) for '${query}':\n\n${matches.join("\n\n")}`
            : `No results for '${query}'.`;
          await this.track("tool_called", { tool: "search_wiki", duration_ms: Date.now() - t0, results_count: matches.length });
          return { content: [{ type: "text" as const, text: resultText }] };
        } catch (err) {
          await this.track("tool_error", { tool: "search_wiki", error: String(err) });
          return { content: [{ type: "text" as const, text: "Search temporarily unavailable." }] };
        }
      }
    );

    // ── 4. get_sop ────────────────────────────────────────────────────────────
    this.server.tool(
      "get_sop",
      "Fetches the SOP (Standard Operating Procedure) framework and any relevant runbook context for a named process. Returns a structured SOP template grounded in wiki content.",
      {
        process_name: z.string().describe("The process or task to get an SOP for, e.g. 'employee onboarding', 'incident response', 'new hire setup', 'offboarding'"),
        severity: z.enum(["P0", "P1", "P2", "P3"]).optional().describe("Incident severity level — only relevant for incident response SOPs"),
      },
      async ({ process_name, severity }) => {
        const t0 = Date.now();
        try {
          const corePages = [
            "concepts/sop-framework",
            "concepts/escalation-matrix",
            "sources/employee-onboarding-sop",
            "sources/incident-response-runbook",
          ];
          if (severity) {
            corePages.push("concepts/incident-severity-levels");
          }
          const [bundled, wikiIndex] = await Promise.all([
            fetchPages(this.env.OPS_WIKI, corePages),
            this.env.OPS_WIKI.get("__index__"),
          ]);
          const context = `
=== PROCESS CONTEXT ===
process_name="${process_name}"${severity ? `\nseverity="${severity}"` : ""}

=== MANDATORY PRE-OUTPUT STEPS ===

STEP 1 — Look at the WIKI INDEX. Find any pages specifically relevant to "${process_name}".
Call get_page for EACH relevant page now, before writing the SOP.

STEP 2 — Write a complete SOP using EXACTLY this structure:

**SOP: ${process_name}**
**Owner:** [role responsible]
**Trigger:** [what initiates this process]
**Time required:** [estimated duration]
${severity ? `**Severity:** ${severity}\n` : ""}
**Pre-requisites:**
- [what must be in place before starting]

**Steps:**
1. [step — action + responsible role + expected output]
2. [step]
3. [step]
... (include all critical steps, no skipping)

**Decision points:**
- IF [condition] → THEN [action/escalation]
- IF [condition] → THEN [action/escalation]

**Escalation path:**
[role] → [role] → [role] (after X minutes if unresolved)

**Definition of done:**
[ ] [criterion 1]
[ ] [criterion 2]
[ ] [criterion 3]

**Common failure modes:** [what usually goes wrong + how to prevent]

=== OPS WIKI DATA ===
${bundled}

=== WIKI INDEX ===
${wikiIndex ?? "Index not available."}`;
          await this.track("tool_called", { tool: "get_sop", duration_ms: Date.now() - t0, process_name });
          return { content: [{ type: "text" as const, text: sanitizeOutput(context) }] };
        } catch (err) {
          await this.track("tool_error", { tool: "get_sop", error: String(err) });
          return { content: [{ type: "text" as const, text: "Unable to fetch SOP right now." }] };
        }
      }
    );

    // ── 5. draft_checklist ────────────────────────────────────────────────────
    this.server.tool(
      "draft_checklist",
      "Creates an operational checklist for a specific task or process. Grounded in SOP framework and any relevant runbooks in the wiki.",
      {
        task_type: z.string().describe("What the checklist is for, e.g. 'weekly team standup', 'deploy to production', 'new contractor setup', 'sprint retrospective', 'incident post-mortem'"),
        context: z.string().optional().describe("Additional context, e.g. 'for a 5-person team using Slack and Linear' or 'for a P1 incident that lasted 3 hours'"),
        format: z.enum(["markdown", "notion", "slack"]).optional().describe("Output format for the checklist"),
      },
      async ({ task_type, context, format }) => {
        const t0 = Date.now();
        try {
          const corePages = [
            "concepts/sop-framework",
            "concepts/blameless-post-mortem",
            "concepts/onboarding-principles",
          ];
          const bundled = await fetchPages(this.env.OPS_WIKI, corePages);
          const fmt = format ?? "markdown";
          const checklistContext = `
=== CHECKLIST REQUEST ===
task_type="${task_type}"${context ? `\ncontext="${context}"` : ""}
format="${fmt}"

=== INSTRUCTIONS ===
Generate a complete operational checklist for "${task_type}".

Rules:
- Every item is actionable (starts with a verb)
- Group items into logical phases (Prep → Execution → Wrap-up or Before → During → After)
- Include time estimates where helpful
- Flag items that are blocking (can't proceed without these)
- Flag items that are parallel (can happen simultaneously)

Format for ${fmt}:
- markdown: standard [ ] checkbox items with ## phase headers
- notion: same as markdown (Notion renders markdown checkboxes)
- slack: plain text with ☐ for unchecked, group with bold **Phase Name** headers

Output the checklist now, formatted for ${fmt}. Nothing else after the checklist.

=== OPS FRAMEWORK DATA ===
${bundled}`;
          await this.track("tool_called", { tool: "draft_checklist", duration_ms: Date.now() - t0, task_type });
          return { content: [{ type: "text" as const, text: sanitizeOutput(checklistContext) }] };
        } catch (err) {
          await this.track("tool_error", { tool: "draft_checklist", error: String(err) });
          return { content: [{ type: "text" as const, text: "Unable to draft checklist right now." }] };
        }
      }
    );

    // ── 6. format_meeting_notes ───────────────────────────────────────────────
    this.server.tool(
      "format_meeting_notes",
      "Structures raw meeting notes into a clean, shareable format with decisions, action items, owners, and deadlines extracted. Paste raw notes in any format.",
      {
        notes: z.string().describe("Raw meeting notes — paste as-is, any format (bullet points, stream-of-consciousness, partial sentences all work)"),
        meeting_type: z.enum(["standup", "sprint-planning", "retrospective", "incident-review", "1on1", "all-hands", "client-call", "general"]).optional().describe("Type of meeting — affects output structure"),
        attendees: z.string().optional().describe("Comma-separated list of attendees for action item assignment"),
      },
      async ({ notes, meeting_type, attendees }) => {
        const t0 = Date.now();
        if (notes.length > 10_000) {
          return { content: [{ type: "text" as const, text: "Notes too long. Max 10,000 characters. Split into sections and call separately." }] };
        }
        try {
          const mt = meeting_type ?? "general";
          const context = `
=== MEETING NOTES INPUT ===
meeting_type="${mt}"${attendees ? `\nattendees="${attendees}"` : ""}

RAW NOTES:
${notes}

=== INSTRUCTIONS ===
Structure these meeting notes into the following format. Extract all information from the raw notes — do not invent anything not present.

**Meeting Type:** ${mt}
**Date:** [extract from notes if present, otherwise "[date]"]
**Attendees:** ${attendees ?? "[extract from notes]"}

---

**Summary** (2-3 sentences — what was discussed and decided)
[summary]

---

**Decisions Made**
- [decision 1 — be specific, include context]
- [decision 2]
[if none clearly stated: "No formal decisions recorded."]

---

**Action Items**
| # | Action | Owner | Due Date | Priority |
|---|--------|-------|----------|----------|
| 1 | [specific action] | [person or role] | [date or "ASAP"] | [High/Med/Low] |
[continue for all action items]
[if none: "No action items captured."]

---

**Blockers & Risks**
- [blocker 1 — what's blocked, who needs to unblock, by when]
[if none: "None identified."]

---

**Next Meeting**
[date/time if mentioned, or "Not scheduled"]
[agenda items carried forward]

---
${mt === "retrospective" ? `
**Retro Notes**
Went well:
- [item]

Could improve:
- [item]

Experiments to try:
- [item]

` : ""}${mt === "incident-review" ? `
**Incident Review Notes**
Timeline: [extract timeline from notes]
Root cause: [extract if discussed]
Follow-up items: [captured above in action items]

` : ""}Write the formatted notes now. Only the formatted output — no preamble.`;
          await this.track("tool_called", { tool: "format_meeting_notes", duration_ms: Date.now() - t0, meeting_type: mt, notes_length: notes.length });
          return { content: [{ type: "text" as const, text: sanitizeOutput(context) }] };
        } catch (err) {
          await this.track("tool_error", { tool: "format_meeting_notes", error: String(err) });
          return { content: [{ type: "text" as const, text: "Unable to format meeting notes right now." }] };
        }
      }
    );

    // ── 7. visualize ─────────────────────────────────────────────────────────
    registerAppTool(
      this.server,
      "visualize",
      {
        title: "Wiki Visualizer",
        description: "Renders an interactive Mermaid diagram in the chat. Generate valid Mermaid syntax from wiki content, then call this tool. Supports zoom, pan, SVG export.",
        inputSchema: {
          diagram: z.string().describe("Complete Mermaid diagram syntax to render"),
          title: z.string().optional().describe("Short title for the diagram"),
        },
        _meta: { ui: { resourceUri: VISUALIZER_URI } },
      },
      async (args: { diagram: string; title?: string }) => {
        const t0 = Date.now();
        try {
          this.diagramSyntax = args.diagram;
          this.diagramTitle = args.title ?? "Operations Wiki Diagram";
          await this.track("tool_called", { tool: "visualize", duration_ms: Date.now() - t0 });
          return { content: [{ type: "text" as const, text: `Diagram ready: "${this.diagramTitle}"` }] };
        } catch (err) {
          await this.track("tool_error", { tool: "visualize", error: String(err) });
          return { content: [{ type: "text" as const, text: "Unable to render diagram right now." }] };
        }
      }
    );

    registerAppResource(
      this.server,
      VISUALIZER_URI,
      VISUALIZER_URI,
      { mimeType: RESOURCE_MIME_TYPE },
      async () => ({
        contents: [{
          uri: VISUALIZER_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: buildVisualizerHTML(this.diagramSyntax, this.diagramTitle),
        }],
      })
    );
  }
}

// ── Security headers ──────────────────────────────────────────────────────────
const SECURITY_HEADERS: HeadersInit = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Content-Security-Policy": "default-src 'none'",
};

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

// ── Worker fetch handler (public — no auth) ───────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mcpHandler = OpsWikiMCP.serve("/mcp") as any;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const contentLength = parseInt(request.headers.get("Content-Length") ?? "0", 10);
    if (contentLength > 1_048_576) {
      return withSecurityHeaders(new Response(
        JSON.stringify({ error: "Request too large." }),
        { status: 413, headers: { "Content-Type": "application/json" } }
      ));
    }

    if (url.pathname === "/" || url.pathname === "") {
      return withSecurityHeaders(new Response(
        JSON.stringify({ name: "Operations Wiki MCP", status: "ok", mcp_endpoint: "/mcp", auth: "none" }),
        { headers: { "Content-Type": "application/json" } }
      ));
    }

    if (url.pathname.startsWith("/mcp")) {
      const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
      const { success } = await env.MCP_RATE_LIMITER.limit({ key: ip });
      if (!success) {
        return withSecurityHeaders(new Response(
          JSON.stringify({ error: "Too many requests. Please wait a moment." }),
          { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "60" } }
        ));
      }
    }

    const response = await mcpHandler.fetch(request, env, ctx);
    return withSecurityHeaders(response);
  },
};
