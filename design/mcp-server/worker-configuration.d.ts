// Env interface for 100x-design-wiki Cloudflare Worker.
// KV IDs are placeholders — replace with real IDs after: wrangler kv namespace create "DESIGN_WIKI"
interface Env {
  DESIGN_WIKI: KVNamespace;
  MCP_OBJECT: DurableObjectNamespace;
  MCP_RATE_LIMITER: RateLimit;
  POSTHOG_API_KEY: string;
}
