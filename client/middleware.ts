import { next } from "@vercel/edge";

/**
 * Markdown for Agents.
 *
 * When an agent requests a page with `Accept: text/markdown`, serve a markdown
 * representation of the page instead of the SPA HTML shell. Browsers (which do
 * not send that Accept value) keep getting the normal HTML app.
 *
 * See https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
 */
export const config = {
  // Only intercept public, content routes. The SPA and assets are untouched.
  matcher: ["/", "/sign-in", "/sign-up"],
};

const HOME_MARKDOWN = `# VoiceyBill

Personal financial platform — track income and expenses with voice input, AI
receipt scanning, analytics charts, and scheduled email reports.

## What you can do

- **Voice input** — add transactions by speaking naturally.
- **AI receipt scanning** — snap a receipt and let VoiceyBill categorize it.
- **Transactions** — record, edit, and delete income and expenses.
- **Budgets** — set budgets and track spending against them.
- **Analytics** — spending insights and charts over any period.
- **Reports** — generate and schedule financial reports by email.

## For agents

- API base: \`https://voiceybill-server.vercel.app/api\`
- Authentication: [/auth.md](https://voiceybill.com/auth.md)
- MCP server card: [/.well-known/mcp/server-card.json](https://voiceybill.com/.well-known/mcp/server-card.json)
- API catalog: [/.well-known/api-catalog](https://voiceybill.com/.well-known/api-catalog)
- Agent skills: [/.well-known/agent-skills/index.json](https://voiceybill.com/.well-known/agent-skills/index.json)

## Get started

Create an account at [/sign-up](https://voiceybill.com/sign-up) or sign in at
[/sign-in](https://voiceybill.com/sign-in).
`;

const SIGN_IN_MARKDOWN = `# Sign in to VoiceyBill

Authenticate with your verified email and password to access your VoiceyBill
account.

Agents: authenticate programmatically via \`POST https://voiceybill-server.vercel.app/api/auth/login\`.
See [/auth.md](https://voiceybill.com/auth.md) for the full flow.
`;

const SIGN_UP_MARKDOWN = `# Create a VoiceyBill account

Sign up with your email and a password, then verify the one-time code sent to
your inbox.

Agents: register via \`POST https://voiceybill-server.vercel.app/api/auth/register\`
then verify with \`POST /api/auth/verify-otp\`. See [/auth.md](https://voiceybill.com/auth.md).
`;

const MARKDOWN_BY_PATH: Record<string, string> = {
  "/": HOME_MARKDOWN,
  "/sign-in": SIGN_IN_MARKDOWN,
  "/sign-up": SIGN_UP_MARKDOWN,
};

function wantsMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  // Only when markdown is explicitly requested — never for browsers that send
  // "text/html,...;q=0.9,text/markdown" as a low-priority afterthought.
  return /(^|,)\s*text\/markdown\b/i.test(accept);
}

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const markdown = MARKDOWN_BY_PATH[url.pathname];

  if (
    request.method === "GET" &&
    markdown &&
    wantsMarkdown(request.headers.get("accept"))
  ) {
    return new Response(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "x-markdown-tokens": String(Math.ceil(markdown.length / 4)),
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
        Vary: "Accept",
      },
    });
  }

  return next();
}
