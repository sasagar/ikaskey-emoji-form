import { Hono } from 'hono';
import { handleLogin, handleCallback, handleLogout } from './miauth';
import { readSession } from './session';

/**
 * /api/* と /login, /auth/callback, /logout を扱う Hono アプリ。
 * Waku ハンドラの前に挿す。
 */
export function buildApi() {
  const app = new Hono<{ Bindings: Env }>();

  app.get('/login', handleLogin);
  app.get('/auth/callback', handleCallback);
  app.post('/logout', handleLogout);
  app.get('/logout', handleLogout); // 利便のため GET も許可

  app.get('/api/health', (c) => c.json({ ok: true, ts: Date.now() }));

  app.get('/api/me', async (c) => {
    const sess = await readSession(c);
    if (!sess) return c.json({ loggedIn: false }, 401);
    return c.json({
      loggedIn: true,
      userId: sess.userId,
      username: sess.username,
      name: sess.name,
      issuedAt: sess.issuedAt,
    });
  });

  return app;
}
