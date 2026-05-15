// Env interface for 100x-ops-wiki Cloudflare Worker.
// KV IDs are placeholders — replace with real IDs after: wrangler kv namespace create "OPS_WIKI"
interface Env {
  OPS_WIKI: KVNamespace;
  MCP_OBJECT: DurableObjectNamespace;
  MCP_RATE_LIMITER: RateLimit;
  POSTHOG_API_KEY: string;
}
