import { fsRouter } from 'waku';
import adapter from 'waku/adapters/cloudflare';
import { buildApi } from './server/api';

// Waku の Cloudflare adapter 戻り値は ExportedHandler 互換 + SSG 用 INTERNAL_* も含むため
// spread で全 export を保持しつつ fetch のみ上書きする。
const wakuHandler = adapter(
  fsRouter(import.meta.glob('./pages/**/*.{tsx,ts}')),
  {
    handlers: {} satisfies ExportedHandler<Env>,
  },
) as ExportedHandler<Env> & Record<string, unknown>;

const api = buildApi();

// Hono ルーターで先に処理するパス
const API_PATH_PATTERNS = [
  /^\/login$/,
  /^\/auth\/callback$/,
  /^\/logout$/,
  /^\/api(\/|$)/,
];

export default {
  ...wakuHandler,
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);
    if (API_PATH_PATTERNS.some((p) => p.test(url.pathname))) {
      return api.fetch(req, env, ctx);
    }
    if (!wakuHandler.fetch) {
      return new Response('Waku handler missing fetch', { status: 500 });
    }
    return wakuHandler.fetch(req, env, ctx);
  },
} as typeof wakuHandler;
