-- 申請に「他鯖からインポート」種別を追加するためのスキーマ拡張
-- 既存レコードは source_type='upload' 扱い、新規申請は upload / remote_copy のいずれか。

ALTER TABLE applications ADD COLUMN source_type TEXT NOT NULL DEFAULT 'upload'
  CHECK (source_type IN ('upload', 'remote_copy'));

-- remote_copy 用フィールド (upload 申請では NULL)
ALTER TABLE applications ADD COLUMN source_host TEXT;
ALTER TABLE applications ADD COLUMN source_remote_name TEXT;
ALTER TABLE applications ADD COLUMN source_emoji_id TEXT;   -- ikaskey 上の cached emoji id
ALTER TABLE applications ADD COLUMN source_remote_url TEXT;  -- preview 用 URL (ikaskey cache or origin)
