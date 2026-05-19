-- ikaskey-emoji-form: 申請レコード管理
-- 作成日: 2026-05-19

CREATE TABLE IF NOT EXISTS applications (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,

  -- 申請者 (MiAuth で確認した Misskey user)
  applicant_id         TEXT NOT NULL,            -- ikaskey user id (例: a3vje2o4l1)
  applicant_username   TEXT NOT NULL,            -- @username
  applicant_name       TEXT,                     -- 表示名 (nullable)

  -- 絵文字メタ
  name                 TEXT NOT NULL,            -- 絵文字 name (a-zA-Z0-9_)
  category             TEXT,                     -- 既存 or 新規カテゴリ
  category_is_new      INTEGER NOT NULL DEFAULT 0, -- 0=既存, 1=新規 (申請時 or モデレーター編集時に立つ)
  aliases              TEXT NOT NULL DEFAULT '[]', -- JSON 配列文字列
  comment              TEXT,                     -- 申請者からのコメント

  -- ファイル
  r2_key               TEXT NOT NULL,            -- R2 staging 上の object key
  mime_type            TEXT NOT NULL,
  file_size            INTEGER NOT NULL,
  original_filename    TEXT,

  -- ステータス
  status               TEXT NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'approved', 'rejected')),
  decided_by           TEXT,                     -- モデレーター user id
  decided_by_username  TEXT,
  decided_at           TEXT,                     -- ISO8601 string
  reject_reason        TEXT,

  -- 採用結果
  registered_emoji_id  TEXT,                     -- admin/emoji/add の戻り id
  registered_emoji_name TEXT,                    -- 最終登録名 (モデレーター編集後の name)

  created_at           TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_applications_status_created
  ON applications(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_applications_applicant
  ON applications(applicant_id, created_at DESC);
