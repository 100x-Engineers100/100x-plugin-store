// Env interface for 100x-sales-wiki Cloudflare Worker.
// KV IDs are placeholders — replace with real IDs after: wrangler kv namespace create "SALES_WIKI"
interface Env {
  SALES_WIKI: KVNamespace;
  MCP_OBJECT: DurableObjectNamespace;
  MCP_RATE_LIMITER: RateLimit;
  POSTHOG_API_KEY: string;
}
