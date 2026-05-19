import { Hono } from 'hono';
import { handleLogin, handleCallback, handleLogout } from './miauth';
import { readSession } from './session';
import { getEmojiCategories } from './categories';
import { getEmojiMap } from './emoji-map';
import { handleSubmit } from './submit';
import { buildAdminApi } from './admin';

/**
 * /api/* と /login, /auth/callback, /logout を扱う Hono アプリ。
 * Waku ハンドラの前に挿す。
 */
export function buildApi() {
  const app = new Hono<{ Bindings: Env }>();

  // --- 認証フロー ---
  app.get('/login', handleLogin);
  app.get('/auth/callback', handleCallback);
  app.post('/logout', handleLogout);
  app.get('/logout', handleLogout);

  // --- ヘルスチェック / セッション参照 ---
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

  // --- カテゴリ一覧 (KV キャッシュ 30 分) ---
  app.get('/api/categories', async (c) => {
    const data = await getEmojiCategories(c);
    return c.json(data);
  });

  // --- 絵文字 name → URL マップ (MFM 描画用、KV キャッシュ 30 分) ---
  app.get('/api/emoji-map', async (c) => {
    const data = await getEmojiMap(c);
    return c.json(data);
  });

  // --- 申請 ---
  app.post('/api/submit', handleSubmit);

  // --- 申請者: 自分の申請履歴 ---
  app.get('/api/my/applications', async (c) => {
    const sess = await readSession(c);
    if (!sess) return c.json({ error: 'unauthorized' }, 401);
    const limit = Math.min(parseInt(c.req.query('limit') ?? '50', 10) || 50, 200);
    const rs = await c.env.DB.prepare(
      `SELECT id, name, category, category_is_new, aliases, comment, mime_type, file_size,
              status, decided_at, decided_by_username, reject_reason,
              registered_emoji_id, registered_emoji_name, created_at
       FROM applications WHERE applicant_id = ? ORDER BY created_at DESC LIMIT ?`,
    )
      .bind(sess.userId, limit)
      .all();
    return c.json({ applications: rs.results ?? [] });
  });

  // --- モデレーター ---
  app.route('/', buildAdminApi());

  return app;
}
