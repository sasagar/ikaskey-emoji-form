# ikaskey-emoji-form — ブキチの絵文字工場

[いかすきー](https://ikaskey.bktsk.com) のカスタム絵文字申請窓口「**ブキチの絵文字工場**」。
構造化フォームで申請を受け、モデレーターが内容を確認・編集した上で、スーパーマンタロー (`mantaro`) 名義で `admin/emoji/add` を実行する Web アプリ。

[![Built with Waku](https://img.shields.io/badge/built%20with-Waku-563d00)](https://waku.gg/)
[![Cloudflare Workers](https://img.shields.io/badge/runs%20on-Cloudflare%20Workers-f48120)](https://workers.cloudflare.com/)
[![MIT License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## なぜ作ったか

絵文字申請を、いかすきー内チャンネル「ブキチの絵文字工場」(`9djqmx7df3`) への自由投稿から、当 Web フォームによる**構造化申請**に置き換えるため。

旧運用 (チャンネル投稿) の問題:

- 絵文字名・カテゴリ・エイリアスのフォーマットが申請ごとに違い、モデレーターが毎回読み解く必要があった
- 申請者がファイルを後で消すと、登録された emoji が壊れる
- ステータス (受付中 / 採用 / 却下) が申請者に見えない

このアプリで解決すること:

- フォームでカテゴリは既存 dropdown から選択 (or「新しいカテゴリ」チェックで手入力)、エイリアスはカンマ区切りなどフォーマット強制
- 画像は申請時点で **mantaro のドライブ** に再アップロード (採用時)。元ファイルが消えても壊れない
- `/my` で自分の申請を一覧、ステータス確認可能
- 採用 / 却下時に申請者へ mantaro 名義で通知 note + Discord webhook で画像付き通知

## アーキテクチャ

```
[申請者ブラウザ]
   │
   ├─ MiAuth login ─→ ikaskey.bktsk.com ─→ token (cookie 化、HttpOnly + 署名)
   │
   ▼
[ikaskey-emoji.bktsk.com] — Cloudflare Workers
   ├─ Waku (React Server Components) でページレンダリング
   ├─ Hono で /login /auth/callback /logout /api/* /admin パス分岐
   │
   ├─ /submit → POST /api/submit
   │     ├─ 画像を R2 (ikaskey-emoji-staging) に staging
   │     ├─ 申請メタを D1 (applications) に INSERT
   │     └─ Discord webhook で通知 (画像 attach + 承認画面リンク)
   │
   ├─ /my → GET /api/my/applications
   │     └─ 自分の申請履歴 + ステータス
   │
   └─ /admin → モデレーターのみ (MiAuth token で isAdmin || isModerator 判定)
         ├─ GET /api/admin/applications?status=...
         ├─ POST /api/admin/applications/:id        (編集)
         ├─ POST /api/admin/applications/:id/approve
         │     R2 取得 → mantaro 経由 drive/files/create → admin/emoji/add
         │     → D1 更新 → 申請者通知 note + Discord 通知
         ├─ POST /api/admin/applications/:id/reject
         └─ DELETE /api/admin/applications/:id      (レコード削除)
```

## 技術スタック

| 層 | 採用 | 用途 |
|---|---|---|
| Frontend SSR | [Waku](https://waku.gg/) 1.0 beta (React Server Components) | ページレンダリング |
| API ルータ | [Hono](https://hono.dev/) 4 | `/api/*` 系を同一 Worker 内で処理 |
| Runtime | Cloudflare Workers | エッジ実行 |
| DB | D1 (SQLite) | 申請レコード管理 (`applications` テーブル) |
| Blob | R2 (`ikaskey-emoji-staging`) | 申請画像の staging。採用 / 却下後に削除 |
| Cache | KV (`EMOJI_CATEGORY_CACHE`) | `/api/emojis` から取得した既存カテゴリ・emoji URL マップを 30 分 TTL でキャッシュ |
| Auth | [MiAuth](https://misskey-hub.net/ja/docs/for-developers/api/token/miauth/) | いかすきー側で承認、token を cookie 化 |
| MFM | [mfm-js](https://github.com/misskey-dev/mfm.js) 0.26 | 申請者の表示名を Misskey 記法でレンダリング |
| 通知 | Discord Webhook | 申請 / 採用 / 却下時に画像 attach + 承認画面リンク付き |
| Styling | Tailwind CSS v4 (`@theme` トークン) | デザインシステム (light / dark 自動対応) |

## デザインシステム

「**craftsman's workbench** (職人の工房)」をテーマに、warm browns + cream paper + ink-stamp の組み合わせ。
ikaskey のチャンネル色 `#563d00` (ブキチ茶) をアクセントに、status badge は手押しスタンプ風 (微回転 + 太枠) で視認性を確保。

- **Display**: Reggae One (Google Fonts、Japanese 対応、工房看板のような chunky 字面)
- **Body**: Zen Kaku Gothic New
- **Mono**: JetBrains Mono (emoji name や user mention に)

トークンは `src/styles.css` の `@theme` ブロックに集約。ダークモードは `prefers-color-scheme: dark` で自動切替。

## ファイル構成

```
ikaskey-emoji-form/
├── src/
│   ├── pages/
│   │   ├── _layout.tsx           — レイアウト、フォント読み込み
│   │   ├── index.tsx             — トップ (ヒーロー + フロー説明)
│   │   ├── submit.tsx            — 申請フォームページ
│   │   ├── my.tsx                — 自分の申請履歴
│   │   └── admin/
│   │       ├── index.tsx         — モデレーター: 申請一覧
│   │       └── [id].tsx          — モデレーター: 申請詳細
│   ├── components/
│   │   ├── header.tsx, footer.tsx
│   │   ├── submit-form.tsx       — 申請フォーム (クライアント)
│   │   ├── my-list.tsx           — 申請履歴 (クライアント)
│   │   ├── admin-list.tsx, admin-detail.tsx
│   │   ├── status-stamp.tsx      — ステータス stamp バッジ
│   │   └── mfm.tsx               — MFM (Markup For Misskey) React レンダラー
│   ├── server/
│   │   ├── api.ts                — Hono ルータ集約
│   │   ├── miauth.ts             — MiAuth フロー
│   │   ├── session.ts            — 署名 cookie セッション
│   │   ├── moderator.ts          — モデレーター認可 (isAdmin || isModerator)
│   │   ├── categories.ts         — /api/emojis から既存カテゴリ集計 (KV キャッシュ)
│   │   ├── emoji-map.ts          — name → URL マップ (KV キャッシュ、MFM 用)
│   │   ├── submit.ts             — 申請受付 (R2 + D1 + Discord)
│   │   ├── admin.ts              — モデレーター操作 (編集/採用/却下/削除)
│   │   ├── mantaro.ts            — mantaro 名義の Misskey API client
│   │   ├── discord.ts            — webhook 通知 (画像 attach 対応)
│   │   └── validate.ts           — フォーム検証
│   ├── waku.server.tsx           — Waku adapter を Hono と統合する entry
│   └── styles.css                — Tailwind v4 + @theme トークン
├── migrations/
│   └── 0001_init.sql             — applications テーブル
├── wrangler.jsonc                — D1/R2/KV bindings + vars + secret 説明
├── package.json
└── README.md
```

## セットアップ (初回)

```sh
# 依存
pnpm install

# Cloudflare リソース (必要に応じて: 既に作成済なら skip)
wrangler d1 create ikaskey-emoji-form              # → DB UUID
wrangler r2 bucket create ikaskey-emoji-staging
wrangler kv namespace create EMOJI_CATEGORY_CACHE  # → KV ID
# wrangler.jsonc の bindings 部分の ID を書き換える

# Secret 投入
wrangler secret put MANTARO_TOKEN          # write:admin:emoji + write:drive + write:notes + read:account 必須
wrangler secret put DISCORD_WEBHOOK_URL    # Discord チャンネル webhook URL
wrangler secret put SESSION_SECRET         # openssl rand -hex 32

# D1 マイグレーション (リモートとローカル両方)
pnpm migrate:remote
pnpm migrate:local

# ローカルでも .dev.vars に同じ値を入れておくと `pnpm start` で実環境同等の挙動になる
# (.dev.vars は .gitignore 済)
```

## 開発

```sh
pnpm dev            # waku dev (Workers bindings なし、最速 HMR)
pnpm start          # pnpm build && wrangler dev (Workers bindings 込み)
pnpm start:nobuild  # 直近の build 成果物を再利用して wrangler dev だけ起動
pnpm build          # waku build (CLOUDFLARE adapter 経由で dist/server/index.js を生成)
pnpm cf-typegen     # wrangler.jsonc を変更したら Env 型を再生成
```

`pnpm start` は build を毎回かけるので 30 秒程度かかる点に注意。コードを連続して触るときは `pnpm dev`、bindings が必要な確認時は `pnpm start` を使い分ける。

## デプロイ

```sh
pnpm build && wrangler deploy
```

カスタムドメイン (`ikaskey-emoji.bktsk.com`) は Cloudflare の Workers 設定 → Triggers → Custom Domain で割り当てる (bktsk.com を CF zone に置いている前提)。

## モデレーター判定

セッション cookie に保管した MiAuth token で `/api/i` を叩き、`isAdmin || isModerator` を見るだけ。
特定の role ID で絞りたい場合は `src/server/moderator.ts` に判定追加。

## MFM レンダラー

`src/components/mfm.tsx` は mfm-js の AST を React に落とす最小実装。サポート対象:

- text / bold / italic / strike / small / center / quote / plain
- link / url / mention / hashtag
- emojiCode (`:hanko_sumi:`) / unicodeEmoji
- inlineCode / blockCode / mathInline / mathBlock / search
- fn: `$[x2 ...]` `$[x3 ...]` `$[x4 ...]` `$[tada ...]` `$[rainbow ...]` のみ簡易対応 (装飾だけ、アニメ無し)

emojiCode の画像は `/api/emoji-map` で取得した name → URL マップから解決。
ikaskey-s3 のホットリンク防止対策として `<img referrerPolicy="no-referrer" />` で読み込む。

## トラブルシュート

| 症状 | 原因 | 対処 |
|---|---|---|
| `/api/submit` が 500 ("Internal Server Error" を返す → クライアントで `SyntaxError`) | ローカル D1 に migration 未適用 | `pnpm migrate:local` を実行 |
| `/api/categories` や `/api/me` が 404 | wrangler dev が古い build を読んでいる | `pnpm build` を実行してから `pnpm start:nobuild`、もしくは `pnpm start` |
| 申請者表示名の emoji 画像が壊れる (×) | ikaskey-s3 のホットリンク防止が Referer 検査で 403 | `<img referrerPolicy="no-referrer">` 済 (`mfm.tsx`)。それでも出ない場合は emoji-map cache を `wrangler kv key delete --binding=KV emoji_map_v1` で削除 |
| Discord 通知が来ない | DISCORD_WEBHOOK_URL secret 未設定 or webhook 削除済 | `wrangler secret put DISCORD_WEBHOOK_URL` で再投入 |
| 採用ボタンを押すと "drive upload failed" | mantaro token に `write:drive` scope がない | mantaro 設定 → API → 該当トークンを `write:admin:emoji + write:drive + write:notes + read:account` で再発行 |

## 開発フェーズ (済)

- [x] **Phase 1** — Wrangler + Waku + Hono skeleton
- [x] **Phase 2** — D1/R2/KV bindings + MiAuth (login → callback → cookie)
- [x] **Phase 3** — 申請フォーム + R2 upload + D1 insert + Discord 通知 (画像 attach)
- [x] **Phase 4** — モデレーター画面 (一覧 / 編集 / 採用 / 却下 / 削除) + 本物の `admin/emoji/add` 連携
- [x] **Phase 5** — 申請者画面 `/my` (画像サムネ含む) + MFM 表示 + UI デザイン仕上げ

## ライセンス

MIT
