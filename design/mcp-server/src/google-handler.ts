// TEMPLATE: Google OAuth Handler for 100x-design-wiki
//
// This file ships as a commented-out template. The deployed endpoint is PUBLIC (no auth).
//
// To enable Google OAuth:
//   1. Uncomment ALL code below
//   2. Add to package.json dependencies: "@cloudflare/workers-oauth-provider": "^0.4.0"
//   3. In wrangler.jsonc, add a second KV binding: { "binding": "OAUTH_KV", "id": "..." }
//   4. In src/index.ts, uncomment the OAuthProvider import and replace the default export
//   5. Set secrets: wrangler secret put GOOGLE_CLIENT_ID && wrangler secret put GOOGLE_CLIENT_SECRET
//   6. In Env (worker-configuration.d.ts), add: OAUTH_KV: KVNamespace; GOOGLE_CLIENT_ID: string; GOOGLE_CLIENT_SECRET: string;

// import type { AuthRequest, OAuthHelpers } from "@cloudflare/workers-oauth-provider";
//
// type HandlerEnv = Env & {
//   OAUTH_PROVIDER: OAuthHelpers;
//   GOOGLE_CLIENT_ID: string;
//   GOOGLE_CLIENT_SECRET: string;
// };
//
// const CALLBACK_PATH = "/callback";
//
// function callbackUri(request: Request): string {
//   return new URL(CALLBACK_PATH, request.url).href;
// }
//
// export const GoogleHandler = {
//   async fetch(request: Request, env: HandlerEnv): Promise<Response> {
//     const url = new URL(request.url);
//
//     if (url.pathname === "/authorize") {
//       let oauthReqInfo;
//       try {
//         oauthReqInfo = await env.OAUTH_PROVIDER.parseAuthRequest(request);
//       } catch (err) {
//         return new Response(`OAuth error: ${err instanceof Error ? err.message : String(err)}`, { status: 400 });
//       }
//       if (!oauthReqInfo.clientId) {
//         return new Response("Invalid OAuth request — missing client_id", { status: 400 });
//       }
//       const state = btoa(JSON.stringify(oauthReqInfo));
//       const params = new URLSearchParams({
//         client_id: env.GOOGLE_CLIENT_ID,
//         redirect_uri: callbackUri(request),
//         response_type: "code",
//         scope: "openid email profile",
//         state,
//         prompt: "select_account",
//       });
//       return Response.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`, 302);
//     }
//
//     if (url.pathname === CALLBACK_PATH) {
//       const code = url.searchParams.get("code");
//       const stateParam = url.searchParams.get("state");
//       const error = url.searchParams.get("error");
//       if (error) return new Response(`Google auth error: ${error}`, { status: 400 });
//       if (!code || !stateParam) return new Response("Missing code or state from Google", { status: 400 });
//       let oauthReqInfo: AuthRequest;
//       try {
//         oauthReqInfo = JSON.parse(atob(stateParam)) as AuthRequest;
//       } catch {
//         return new Response("Invalid state parameter", { status: 400 });
//       }
//       const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams({
//           code,
//           client_id: env.GOOGLE_CLIENT_ID,
//           client_secret: env.GOOGLE_CLIENT_SECRET,
//           redirect_uri: callbackUri(request),
//           grant_type: "authorization_code",
//         }),
//       });
//       if (!tokenRes.ok) return new Response("Failed to authenticate with Google", { status: 502 });
//       const { access_token } = await tokenRes.json() as { access_token: string };
//       const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
//         headers: { Authorization: `Bearer ${access_token}` },
//       });
//       if (!userRes.ok) return new Response("Failed to fetch Google profile", { status: 502 });
//       const user = await userRes.json() as { id: string; email: string; name: string; picture?: string };
//       const { redirectTo } = await env.OAUTH_PROVIDER.completeAuthorization({
//         request: oauthReqInfo,
//         userId: user.id,
//         scope: oauthReqInfo.scope,
//         props: { claims: { sub: user.id, email: user.email, name: user.name, picture: user.picture ?? "" } },
//         metadata: { label: user.email },
//       });
//       return Response.redirect(redirectTo, 302);
//     }
//
//     return new Response(
//       JSON.stringify({ name: "Design Wiki MCP", status: "ok", auth: "Google OAuth 2.0", mcp_endpoint: "/mcp" }),
//       { headers: { "Content-Type": "application/json" } }
//     );
//   },
// };
