"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const PLUGINS = [
  {
    id: "sales",
    domain: "100x-sales-wiki",
    name: "Sales Wiki",
    tagline: "Close more deals with AI context",
    icon: (
      <svg viewBox="0 0 24 24">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    mcp: "https://100x-sales-wiki.cohort-c62.workers.dev/mcp",
    tools: ["get_call_brief", "get_objection_response", "draft_followup", "get_index", "get_page", "search_wiki", "visualize"],
    skills: ["sales-engineer", "revenue-operations", "cold-email", "sales-rep-persona"],
    third: [
      { name: "Superhuman MCP", url: "https://help.superhuman.com/hc/en-us/articles/49810745762067-Superhuman-Mail-MCP-Server" },
      { name: "Apollo.io MCP", url: "https://knowledge.apollo.io/hc/en-us/articles/43827318678541-Integrate-Apollo-with-Claude" },
    ],
    prompts: [
      "Use Sales Wiki and get me a call brief for a Series A founder skeptical about AI",
      "Use Sales Wiki and handle the \"too expensive\" objection for a ₹2L/yr product",
      "Use Sales Wiki and draft a follow-up for a lead who ghosted after the demo",
    ],
  },
  {
    id: "design",
    domain: "100x-design-wiki",
    name: "Design Wiki",
    tagline: "Ship pixel-perfect work faster",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    mcp: "https://100x-design-wiki.cohort-c62.workers.dev/mcp",
    tools: ["get_design_brief", "generate_ai_prompt", "review_design_checklist", "get_index", "get_page", "search_wiki", "visualize"],
    skills: ["brand-guidelines", "canvas-design", "frontend-design", "theme-factory"],
    third: [
      { name: "Canva MCP", url: "https://www.canva.com/help/mcp-agent-setup/" },
      { name: "Figma MCP", url: "https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server" },
    ],
    prompts: [
      "Use Design Wiki and generate an AI image prompt for our brand hero section",
      "Use Design Wiki and give me a design brief for the new onboarding flow",
      "Use Design Wiki and run a checklist on our landing page redesign",
    ],
  },
  {
    id: "marketing",
    domain: "100x-marketing-wiki",
    name: "Marketing Wiki",
    tagline: "Campaigns that convert, copy that lands",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M22 2L11 13" />
        <path d="M22 2L15 22 11 13 2 9l20-7z" />
      </svg>
    ),
    mcp: "https://100x-marketing-wiki.cohort-c62.workers.dev/mcp",
    tools: ["get_campaign_brief", "draft_copy", "get_content_hook", "get_index", "get_page", "search_wiki", "visualize"],
    skills: ["content-strategy", "copywriting", "social-media-manager", "campaign-analytics", "marketing-strategy-pmm"],
    third: [
      { name: "Google Sheets MCP", url: "https://developers.google.com/workspace/guides/configure-mcp-servers" },
      { name: "Google Drive MCP", url: "https://developers.google.com/workspace/guides/configure-mcp-servers" },
    ],
    prompts: [
      "Use Marketing Wiki and get me a campaign brief for the cohort 8 launch",
      "Use Marketing Wiki and draft LinkedIn copy for our new AI masterclass",
      "Use Marketing Wiki and find what content hooks are working for our ICP right now",
    ],
  },
  {
    id: "ops",
    domain: "100x-ops-wiki",
    name: "Ops Wiki",
    tagline: "Run tighter ops with AI-powered SOPs",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
    mcp: "https://100x-ops-wiki.cohort-c62.workers.dev/mcp",
    tools: ["get_sop", "draft_checklist", "format_meeting_notes", "get_index", "get_page", "search_wiki", "visualize"],
    skills: ["senior-pm", "internal-comms", "doc-coauthoring", "confluence-expert"],
    third: [
      { name: "Notion MCP", url: "https://www.notion.com/help/notion-mcp" },
      { name: "Linear MCP", url: "https://linear.app/docs/mcp" },
      { name: "Google Calendar MCP", url: "https://developers.google.com/workspace/guides/configure-mcp-servers" },
    ],
    prompts: [
      "Use Ops Wiki and get the onboarding SOP for a new team member joining Monday",
      "Use Ops Wiki and draft a checklist for our weekly all-hands sync",
      "Use Ops Wiki and format these raw meeting notes into our standard template",
    ],
  },
];

const WORDS = ["Sales", "Design", "Marketing", "Operations"];

const CONFIG_TEXT = `"mcpServers": {
  "100x-sales-wiki":     { "command": "npx", "args": ["-y", "mcp-remote", "https://100x-sales-wiki.cohort-c62.workers.dev/mcp"] },
  "100x-design-wiki":    { "command": "npx", "args": ["-y", "mcp-remote", "https://100x-design-wiki.cohort-c62.workers.dev/mcp"] },
  "100x-marketing-wiki": { "command": "npx", "args": ["-y", "mcp-remote", "https://100x-marketing-wiki.cohort-c62.workers.dev/mcp"] },
  "100x-ops-wiki":       { "command": "npx", "args": ["-y", "mcp-remote", "https://100x-ops-wiki.cohort-c62.workers.dev/mcp"] }
}`;

function CopyButton({ text, className = "copy-btn" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button className={`${className}${copied ? " copied" : ""}`} onClick={copy}>
      {copied ? "COPIED!" : "COPY"}
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 5, flexShrink: 0 }}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4, flexShrink: 0 }}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function PluginCard({ plugin }: { plugin: (typeof PLUGINS)[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="card" ref={ref}>
      <div className="card-titlebar">
        <div className="titlebar-dots">
          <div className="titlebar-dot dot-r" />
          <div className="titlebar-dot dot-y" />
          <div className="titlebar-dot dot-g" />
        </div>
        <div className="titlebar-domain">{plugin.domain}</div>
      </div>

      <div className="card-header">
        <div className="card-icon-box">{plugin.icon}</div>
        <div className="card-meta">
          <div className="card-name">{plugin.name}</div>
          <div className="card-tagline">{plugin.tagline}</div>
        </div>
      </div>

      <div className="card-body">
        <div className="mcp-box">
          <div className="mcp-tag">MCP</div>
          <a href={plugin.mcp} target="_blank" rel="noopener noreferrer" className="mcp-url-text">{plugin.mcp}</a>
          <CopyButton text={plugin.mcp} />
        </div>

        <div className="c-label">Tools ({plugin.tools.length})</div>
        <div className="chips">
          {plugin.tools.map((t) => <span key={t} className="chip chip-tool">{t}</span>)}
        </div>

        <div className="c-label">Bundled Skills — click to download</div>
        <div className="chips">
          {plugin.skills.map((s) => (
            <a
              key={s}
              href={`/skills/${plugin.id}/${s}.md`}
              download={`${s}.md`}
              className="chip chip-skill"
            >
              {s}<DownloadIcon />
            </a>
          ))}
        </div>

        <div className="c-label">Pair With — click for setup guide</div>
        <div className="chips">
          {plugin.third.map((t) => (
            <a
              key={t.name}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="chip chip-third"
            >
              {t.name}<ExternalIcon />
            </a>
          ))}
        </div>

        <div className="c-label">Add in Claude Web</div>
        <div className="steps">
          <div className="step"><div className="step-n">1</div><div className="step-t">Copy the MCP URL above</div></div>
          <div className="step"><div className="step-n">2</div><div className="step-t">Open <strong>claude.ai</strong> → Settings → Connectors → <strong>Add custom connector</strong></div></div>
          <div className="step"><div className="step-n">3</div><div className="step-t">Paste the URL, click Add, then enable it in any conversation</div></div>
        </div>

        <div className="c-label">Example Prompts</div>
        <div className="prompts">
          {plugin.prompts.map((pr) => <div key={pr} className="prompt-item">{pr}</div>)}
        </div>
      </div>
    </div>
  );
}

function Counter({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const dur = 1000;
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          setVal(Math.round(ease * target));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}</span>;
}

export default function PluginStore() {
  const [scroll, setScroll] = useState(0);
  const [typedWord, setTypedWord] = useState("Sales");

  useEffect(() => {
    const onScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      setScroll(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let wi = 0, ci = 0, deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const loop = () => {
      const word = WORDS[wi];
      if (!deleting) {
        ci++;
        setTypedWord(word.slice(0, ci));
        if (ci === word.length) {
          deleting = true;
          timer = setTimeout(loop, 1800);
        } else {
          timer = setTimeout(loop, 80);
        }
      } else {
        ci--;
        setTypedWord(word.slice(0, ci));
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % WORDS.length;
          timer = setTimeout(loop, 200);
        } else {
          timer = setTimeout(loop, 45);
        }
      }
    };

    timer = setTimeout(loop, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div id="progress" style={{ width: `${scroll}%` }} />

      <nav>
        <div className="nav-logo">
          <Image src="/logo.svg" alt="100x" width={30} height={30} className="nav-logo-img" priority />
          100x Plugin Store
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-eyebrow">100x Engineers · AI Plugin Store</div>
        <h1 className="hero-h1">
          Drop-In AI Context<br />
          <span className="line2">
            For {typedWord} Teams<span className="cursor" />
            <span className="underline-bar" />
          </span>
        </h1>
        <p className="hero-sub">
          Your team&apos;s knowledge, inside Claude. No setup friction.
        </p>
        <a href="#plugins" className="hero-cta">
          Explore Plugins
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>

        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-val"><Counter target={4} /></div>
            <div className="stat-lbl">Live Plugins</div>
          </div>
          <div className="stat-item">
            <div className="stat-val">60<span className="accent">s</span></div>
            <div className="stat-lbl">Setup Time</div>
          </div>
          <div className="stat-item">
            <div className="stat-val stat-val-text">CDN</div>
            <div className="stat-lbl">Cloudflare Hosted</div>
          </div>
        </div>

        <div className="scroll-hint">↓</div>
      </section>

      <hr />

      {/* PLUGINS */}
      <div className="section" id="plugins">
        <div className="section-label">Available Now</div>
        <div className="section-title">4 Domain Wikis, Live on Cloudflare</div>
        <div className="plugins-grid">
          {PLUGINS.map((p) => <PluginCard key={p.id} plugin={p} />)}
        </div>
      </div>

      <hr />

      {/* SETUP BANNER */}
      <div className="section" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="setup-heading-outer">
          <div className="section-label">Claude Desktop Setup</div>
          <div className="setup-heading-title">Add All 4 Plugins at Once</div>
          <div className="setup-heading-steps">
            <div className="setup-pre-step"><span className="setup-step-n">1</span> Open Claude Desktop → top-left menu → <strong>Settings</strong></div>
            <div className="setup-pre-step"><span className="setup-step-n">2</span> Go to <strong>Developer</strong> → click <strong>Edit Config</strong> — this opens <code>claude_desktop_config.json</code></div>
            <div className="setup-pre-step"><span className="setup-step-n">3</span> Paste the block below inside the file, save, then <strong>restart Claude Desktop</strong></div>
          </div>
        </div>
        <div className="setup-section">
          <div className="setup-inner">
            <div className="setup-eyebrow">config snippet — paste this</div>
            <div className="code-block">
              <pre>
                <span className="ck">&quot;mcpServers&quot;</span>: {"{"}
                {"\n"}{"  "}<span className="ck">&quot;100x-sales-wiki&quot;</span>:     {"{"} <span className="ck">&quot;command&quot;</span>: <span className="cv">&quot;npx&quot;</span>, <span className="ck">&quot;args&quot;</span>: [<span className="cv">&quot;-y&quot;</span>, <span className="cv">&quot;mcp-remote&quot;</span>, <span className="cv">&quot;https://100x-sales-wiki.cohort-c62.workers.dev/mcp&quot;</span>] {"}"},{"\n"}
                {"  "}<span className="ck">&quot;100x-design-wiki&quot;</span>:    {"{"} <span className="ck">&quot;command&quot;</span>: <span className="cv">&quot;npx&quot;</span>, <span className="ck">&quot;args&quot;</span>: [<span className="cv">&quot;-y&quot;</span>, <span className="cv">&quot;mcp-remote&quot;</span>, <span className="cv">&quot;https://100x-design-wiki.cohort-c62.workers.dev/mcp&quot;</span>] {"}"},{"\n"}
                {"  "}<span className="ck">&quot;100x-marketing-wiki&quot;</span>: {"{"} <span className="ck">&quot;command&quot;</span>: <span className="cv">&quot;npx&quot;</span>, <span className="ck">&quot;args&quot;</span>: [<span className="cv">&quot;-y&quot;</span>, <span className="cv">&quot;mcp-remote&quot;</span>, <span className="cv">&quot;https://100x-marketing-wiki.cohort-c62.workers.dev/mcp&quot;</span>] {"}"},{"\n"}
                {"  "}<span className="ck">&quot;100x-ops-wiki&quot;</span>:       {"{"} <span className="ck">&quot;command&quot;</span>: <span className="cv">&quot;npx&quot;</span>, <span className="ck">&quot;args&quot;</span>: [<span className="cv">&quot;-y&quot;</span>, <span className="cv">&quot;mcp-remote&quot;</span>, <span className="cv">&quot;https://100x-ops-wiki.cohort-c62.workers.dev/mcp&quot;</span>] {"}"}{"\n"}
                {"}"}
              </pre>
              <CopyButton text={CONFIG_TEXT} className="code-copy" />
            </div>
          </div>
        </div>
      </div>

      <hr />

      <footer>
        <div className="footer-brand">
          <Image src="/logo.svg" alt="100x" width={22} height={22} />
          100x <span>Plugin Store</span>
        </div>
        <div className="footer-right">Powered by Cloudflare Workers + MCP Protocol</div>
      </footer>
    </>
  );
}
