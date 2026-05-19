import type { Context } from 'hono';
import { getSignedCookie, setSignedCookie, deleteCookie } from 'hono/cookie';

export const SESSION_COOKIE = 'iemfsess';

export type Session = {
  token: string;       // Misskey access token (MiAuth check の戻り)
  userId: string;
  username: string;
  name: string | null;
  issuedAt: number;
};

/**
 * 署名付き cookie からセッション情報を取り出す。無効/未ログインなら null。
 */
export async function readSession(
  c: Context<{ Bindings: Env }>,
): Promise<Session | null> {
  const raw = await getSignedCookie(c, c.env.SESSION_SECRET, SESSION_COOKIE);
  if (typeof raw !== 'string' || raw.length === 0) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    if (!parsed.token || !parsed.userId) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * セッションを発行 (Set-Cookie ヘッダを書き込む)。
 */
export async function writeSession(
  c: Context<{ Bindings: Env }>,
  session: Session,
): Promise<void> {
  await setSignedCookie(c, SESSION_COOKIE, JSON.stringify(session), c.env.SESSION_SECRET, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export function clearSession(c: Context<{ Bindings: Env }>): void {
  deleteCookie(c, SESSION_COOKIE, { path: '/' });
}
