import type { Context } from 'hono';

const CACHE_KEY = 'emoji_map_v1';
const CACHE_TTL_SECONDS = 60 * 30; // 30 min

export type EmojiMap = {
  /** key: emoji name (host なし local), value: 直接アクセス URL */
  map: Record<string, string>;
  fetchedAt: number;
};

/**
 * ikaskey の公開 /api/emojis をキャッシュして {name: url} に変換。
 * MFM の :emoji_name: 部分の描画に使う。Context / Env どちらからも呼べる。
 */
export async function getEmojiMap(
  arg: Context<{ Bindings: Env }> | Env,
): Promise<EmojiMap> {
  const env: Env = isContext(arg) ? arg.env : arg;
  const cached = await env.KV.get<EmojiMap>(CACHE_KEY, 'json');
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_SECONDS * 1000) {
    return cached;
  }
  const r = await fetch(`https://${env.MISSKEY_HOST}/api/emojis`);
  if (!r.ok) return cached ?? { map: {}, fetchedAt: 0 };
  const data = (await r.json()) as { emojis: { name: string; url: string }[] };
  const map: Record<string, string> = {};
  for (const e of data.emojis) {
    if (e.name && e.url) map[e.name] = e.url;
  }
  const fresh: EmojiMap = { map, fetchedAt: Date.now() };
  await env.KV.put(CACHE_KEY, JSON.stringify(fresh), {
    expirationTtl: CACHE_TTL_SECONDS,
  });
  return fresh;
}

/** 指定 name が ikaskey 本体にすでに存在するか (キャッシュ経由)。 */
export async function emojiNameExists(env: Env, name: string): Promise<boolean> {
  const m = await getEmojiMap(env);
  return Object.prototype.hasOwnProperty.call(m.map, name);
}

function isContext(x: unknown): x is Context<{ Bindings: Env }> {
  return typeof x === 'object' && x !== null && 'env' in x && 'req' in x;
}
