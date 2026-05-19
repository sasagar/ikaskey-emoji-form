# ikaskey-emoji-form — ブキチの絵文字工場

[いかすきー](https://ikaskey.bktsk.com) のカスタム絵文字申請窓口「**ブキチの絵文字工場**」。Waku + Hono + Cloudflare Workers 構成。

## 目的

絵文字申請を、いかすきー内チャンネル「ブキチの絵文字工場」(`9djqmx7df3`) への自由投稿から、当 Web フォームによる構造化申請に置き換える。モデレーター (`isAdmin || isModerator`) が内容を確認・編集して採用すると、スーパーマンタロー (`mantaro`) 名義で `admin/emoji/add` が実行される。

## アーキテクチャ

```
[申請者] → ikaskey-emoji.bktsk.com (Waku + Hono on CF Workers)
                            ↓ MiAuth login
                  [ikaskey.bktsk.com]
                            ↓ user token (cookie 内のみ)
[申請フォーム submit]
   ↓ ① 画像を R2 に staging
   ↓ ② 申請メタを D1 に保存 (status=pending)
   ↓ ③ Discord webhook で通知
[モデレーター] → /admin (role check)
   ↓ /api/approve
[Hono] → mantaro token で
   ↓ drive/files/upload-from-url (R2 公開 URL → ikaskey ドライブ)
   ↓ admin/emoji/add
[ikaskey] 登録完了
```

## 技術スタック

- **Frontend / SSR**: [Waku](https://waku.gg/) (React Server Components)
- **API**: [Hono](https://hono.dev/) (Waku の同 Worker 内で `/api/*` をハンドル)
- **Runtime**: Cloudflare Workers
- **DB**: D1 (SQLite) — 申請レコード管理
- **Blob**: R2 — 申請画像 staging (採用 or 却下後に削除)
- **Cache**: KV — `/api/emojis` から取得した既存カテゴリ一覧キャッシュ
- **Auth**: [MiAuth](https://misskey-hub.net/ja/docs/for-developers/api/token/miauth/) (いかすきーのユーザ id/username を確認)
- **通知**: Discord Webhook

## セットアップ手順 (初回)

```sh
# 依存関係
pnpm install

# Cloudflare リソース作成
wrangler d1 create ikaskey-emoji-form          # → DB UUID をメモ
wrangler r2 bucket create ikaskey-emoji-staging
wrangler kv namespace create EMOJI_CATEGORY_CACHE  # → KV ID をメモ

# wrangler.jsonc の bindings コメントを外して ID を埋める

# シークレット投入
wrangler secret put MANTARO_TOKEN          # write:admin:emoji + write:drive 必須
wrangler secret put DISCORD_WEBHOOK_URL
wrangler secret put SESSION_SECRET         # openssl rand -hex 32

# D1 マイグレーション (Phase 2 で追加)
# wrangler d1 execute ikaskey-emoji-form --file=./migrations/0001_init.sql

# 開発
pnpm dev          # Waku dev server
pnpm start        # wrangler dev (Workers ローカル実行)

# デプロイ
pnpm build && wrangler deploy
```

## カスタムドメイン

`ikaskey-emoji.bktsk.com` を CF Worker custom domain として割り当てる。
DNS は CF 管理 (bktsk.com の CF zone 配下、orange-cloud)。

## モデレーター判定

セッション cookie の MiAuth token で `/api/i` を叩き、`isAdmin || isModerator` を見る。
独自ロール ID で絞りたい場合は `wrangler vars` に `ADMIN_ROLE_IDS` を追加。

## 開発フェーズ

- [x] **Phase 1**: Wrangler + Waku + Hono skeleton (このコミット)
- [ ] **Phase 2**: D1 スキーマ、R2 バケット、KV namespace、MiAuth (login/callback/cookie)
- [ ] **Phase 3**: 申請フォーム実装 (R2 upload + D1 insert + Discord 通知)
- [ ] **Phase 4**: モデレーター画面 (pending 一覧 / 編集 / 採用 / 却下) と `admin/emoji/add` 連携
- [ ] **Phase 5**: 仕上げ (申請者通知 note、R2 cleanup、エラーハンドリング、テスト)

## ライセンス

MIT
