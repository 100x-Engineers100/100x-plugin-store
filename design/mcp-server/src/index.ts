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

const VISUALIZER_URI = "ui://design-wiki/visualizer.html";

export class DesignWikiMCP extends McpAgent<Env, unknown, Record<string, unknown>> {
  server = new McpServer({ name: "Design Wiki", version: "1.0.0" });

  private diagramSyntax = "";
  private diagramTitle = "Design Wiki Diagram";

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
          properties: { ...props, $lib: "design-wiki-mcp", server: "design-wiki" },
          timestamp: new Date().toISOString(),
        }),
      });
    } catch { /* analytics must never crash a tool call */ }
  }

  async init() {

    // ── 1. get_index ──────────────────────────────────────────────────────────
    this.server.tool(
      "get_index",
      "Returns the full design wiki index — catalog of all pages by category. Call this first to discover what exists before using get_page or search_wiki.",
      {},
      async () => {
        const t0 = Date.now();
        try {
          const content = await this.env.DESIGN_WIKI.get("__index__");
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
      "Fetches the full content of a single wiki page by key, e.g. 'concepts/visual-hierarchy'. Use get_index first to find valid keys.",
      { path: z.string().describe("KV key of the page. No .md extension needed.") },
      async ({ path }) => {
        const t0 = Date.now();
        const safePath = path.replace(/\.md$/, "");
        if (!/^[a-z0-9/_-]+$/.test(safePath)) {
          await this.track("input_rejected", { tool: "get_page", reason: "invalid_path", path });
          return { content: [{ type: "text" as const, text: `Invalid path: '${path}'. Use lowercase letters, numbers, hyphens, slashes only.` }] };
        }
        try {
          const content = await this.env.DESIGN_WIKI.get(safePath);
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
      "Full-text search across all design wiki pages. Returns keys, titles, and excerpts.",
      {
        query: z.string().min(2).max(200).describe("Search term"),
        type: z.enum(["concepts", "sources", "entities", "synthesis"]).optional().describe("Restrict to page type"),
      },
      async ({ query, type }) => {
        const t0 = Date.now();
        try {
          const listed = await this.env.DESIGN_WIKI.list({ prefix: type ? `${type}/` : undefined });
          const q = query.toLowerCase();
          const matches: string[] = [];
          for (const k of listed.keys) {
            const md = await this.env.DESIGN_WIKI.get(k.name);
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

    // ── 4. get_design_brief ───────────────────────────────────────────────────
    this.server.tool(
      "get_design_brief",
      "Fetches brand guidelines, visual identity rules, and component patterns to structure a complete design brief for a project. Use before starting any design task.",
      {
        project_type: z.string().describe("Type of design project, e.g. 'landing page', 'social post', 'email header', 'brand kit'"),
        style_keywords: z.string().optional().describe("Style direction keywords, e.g. 'bold minimal dark' or 'warm editorial'"),
      },
      async ({ project_type, style_keywords }) => {
        const t0 = Date.now();
        try {
          const corePages = [
            "sources/visual-identity-system",
            "sources/component-patterns",
            "concepts/brand-consistency",
            "concepts/visual-hierarchy",
            "concepts/design-brief-framework",
          ];
          const [bundled, wikiIndex] = await Promise.all([
            fetchPages(this.env.DESIGN_WIKI, corePages),
            this.env.DESIGN_WIKI.get("__index__"),
          ]);
          const context = `
=== PROJECT CONTEXT ===
project_type="${project_type}"${style_keywords ? `\nstyle_keywords="${style_keywords}"` : ""}

=== MANDATORY PRE-OUTPUT STEPS ===

STEP 1 — Look at the WIKI INDEX below. Pick 2-3 additional pages relevant to "${project_type}".
Call get_page for EACH one now, before writing the brief.

STEP 2 — Write a complete design brief using EXACTLY this structure:

**Project:** ${project_type}
**Brand constraints:** [extract from visual identity — colors, type, logo rules, spacing]
**Visual direction:** [specific aesthetic direction based on brand guidelines${style_keywords ? ` and style keywords: ${style_keywords}` : ""}]
**Component rules:** [relevant component patterns from wiki — buttons, cards, layout grid]
**Hierarchy priorities:** [what the eye should hit first, second, third]
**Do NOT use:** [banned patterns from brand guidelines — e.g. specific colors, fonts, gradients]
**AI generation notes:** [if AI tools will be used — describe visual style in prompt-ready language]
**Checklist before handoff:** [5-7 brand compliance checks specific to this project type]

=== BRAND & DESIGN SYSTEM DATA ===
${bundled}

=== WIKI INDEX ===
${wikiIndex ?? "Index not available."}`;
          await this.track("tool_called", { tool: "get_design_brief", duration_ms: Date.now() - t0, project_type });
          return { content: [{ type: "text" as const, text: sanitizeOutput(context) }] };
        } catch (err) {
          await this.track("tool_error", { tool: "get_design_brief", error: String(err) });
          return { content: [{ type: "text" as const, text: "Unable to fetch design brief right now." }] };
        }
      }
    );

    // ── 5. generate_ai_prompt ─────────────────────────────────────────────────
    this.server.tool(
      "generate_ai_prompt",
      "Generates a detailed AI image/design generation prompt grounded in the brand's visual identity. Use for Midjourney, DALL-E, Stable Diffusion, Firefly, or Canva AI.",
      {
        asset_type: z.string().describe("What to generate, e.g. 'hero image', 'icon set', 'background texture', 'product mockup', 'social post'"),
        brand_context: z.string().optional().describe("Specific context for this asset, e.g. 'for a fintech landing page' or 'celebrating product launch'"),
        ai_tool: z.enum(["midjourney", "dalle", "stable-diffusion", "firefly", "canva", "generic"]).optional().describe("Target AI tool — affects prompt syntax"),
      },
      async ({ asset_type, brand_context, ai_tool }) => {
        const t0 = Date.now();
        try {
          const corePages = [
            "sources/visual-identity-system",
            "concepts/ai-design-prompt-patterns",
            "concepts/brand-consistency",
          ];
          const bundled = await fetchPages(this.env.DESIGN_WIKI, corePages);
          const tool = ai_tool ?? "generic";
          const context = `
=== ASSET REQUEST ===
asset_type="${asset_type}"${brand_context ? `\nbrand_context="${brand_context}"` : ""}
target_tool="${tool}"

=== INSTRUCTIONS ===
Using the brand guidelines below, generate a production-ready AI prompt for "${asset_type}".

Rules:
- Lead with the subject and composition
- Include exact brand colors in hex or descriptive form (e.g. "deep orange #F96846")
- Specify typography style if text appears in the asset
- Include lighting, mood, and texture descriptors consistent with brand
- End with technical parameters appropriate for ${tool}:
  - midjourney: --ar, --style, --v parameters
  - dalle: size specification, quality setting
  - stable-diffusion: negative prompt block, CFG guidance note
  - firefly: style reference, content type
  - canva/generic: style description in plain language

Output format:
**Prompt:** [complete prompt text — copy-paste ready]
**Negative prompt (if applicable):** [what to exclude]
**Parameters:** [tool-specific settings]
**Brand compliance check:** [3 quick checks before submitting]

=== BRAND VISUAL DATA ===
${bundled}`;
          await this.track("tool_called", { tool: "generate_ai_prompt", duration_ms: Date.now() - t0, asset_type, ai_tool: tool });
          return { content: [{ type: "text" as const, text: sanitizeOutput(context) }] };
        } catch (err) {
          await this.track("tool_error", { tool: "generate_ai_prompt", error: String(err) });
          return { content: [{ type: "text" as const, text: "Unable to generate AI prompt right now." }] };
        }
      }
    );

    // ── 6. review_design_checklist ────────────────────────────────────────────
    this.server.tool(
      "review_design_checklist",
      "Returns a brand-compliance and quality checklist for reviewing a completed design. Grounded in brand guidelines and design system rules.",
      {
        design_type: z.string().optional().describe("Type of design being reviewed, e.g. 'landing page', 'email', 'social post', 'presentation'"),
        focus_areas: z.string().optional().describe("Specific areas to focus on, e.g. 'typography and color' or 'mobile responsiveness'"),
      },
      async ({ design_type, focus_areas }) => {
        const t0 = Date.now();
        try {
          const corePages = [
            "concepts/brand-consistency",
            "concepts/visual-hierarchy",
            "sources/visual-identity-system",
            "sources/component-patterns",
            "concepts/motion-principles",
          ];
          const bundled = await fetchPages(this.env.DESIGN_WIKI, corePages);
          const context = `
=== REVIEW CONTEXT ===
${design_type ? `design_type="${design_type}"` : "design_type=general"}${focus_areas ? `\nfocus_areas="${focus_areas}"` : ""}

=== INSTRUCTIONS ===
Using the brand guidelines and design system below, generate a review checklist.

Structure EXACTLY as:

**Brand Identity (must-pass)**
[ ] [check 1]
[ ] [check 2]
[ ] [check 3]

**Typography**
[ ] [check 1]
[ ] [check 2]

**Color Usage**
[ ] [check 1]
[ ] [check 2]
[ ] [check 3]

**Layout & Hierarchy**
[ ] [check 1]
[ ] [check 2]

**Component Consistency**
[ ] [check 1]
[ ] [check 2]

${focus_areas ? `**${focus_areas} (focus area)**\n[ ] [check 1]\n[ ] [check 2]\n[ ] [check 3]\n` : ""}**Accessibility**
[ ] Contrast ratio meets WCAG AA minimum
[ ] Touch targets minimum 44x44px (if interactive)
[ ] Text readable at 100% zoom without overflow

**Final gate:** [1-sentence summary of what makes this design pass or fail for brand]

=== BRAND & DESIGN SYSTEM DATA ===
${bundled}`;
          await this.track("tool_called", { tool: "review_design_checklist", duration_ms: Date.now() - t0, design_type: design_type ?? "general" });
          return { content: [{ type: "text" as const, text: sanitizeOutput(context) }] };
        } catch (err) {
          await this.track("tool_error", { tool: "review_design_checklist", error: String(err) });
          return { content: [{ type: "text" as const, text: "Unable to fetch design checklist right now." }] };
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
          this.diagramTitle = args.title ?? "Design Wiki Diagram";
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
const mcpHandler = DesignWikiMCP.serve("/mcp") as any;

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
        JSON.stringify({ name: "Design Wiki MCP", status: "ok", mcp_endpoint: "/mcp", auth: "none" }),
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
