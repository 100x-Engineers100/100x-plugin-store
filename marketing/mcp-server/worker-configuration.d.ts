// Env interface for 100x-marketing-wiki Cloudflare Worker.
// KV IDs are placeholders — replace with real IDs after: wrangler kv namespace create "MARKETING_WIKI"
interface Env {
  MARKETING_WIKI: KVNamespace;
  MCP_OBJECT: DurableObjectNamespace;
  MCP_RATE_LIMITER: RateLimit;
  POSTHOG_API_KEY: string;
}
