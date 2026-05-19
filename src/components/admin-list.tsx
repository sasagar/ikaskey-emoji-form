'use client';

import { useEffect, useState } from 'react';
import { Mfm } from './mfm';
import { StatusStamp } from './status-stamp';

type Application = {
  id: number;
  applicant_username: string;
  applicant_name: string | null;
  name: string;
  category: string | null;
  category_is_new: number;
  aliases: string;
  comment: string | null;
  status: 'pending' | 'approved' | 'rejected';
  decided_by_username: string | null;
  decided_at: string | null;
  reject_reason: string | null;
  registered_emoji_name: string | null;
  created_at: string;
};

const TABS = [
  { key: 'pending', label: '未対応' },
  { key: 'approved', label: '採用済' },
  { key: 'rejected', label: '却下済' },
] as const;

export function AdminList() {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/admin/applications?status=${status}`)
      .then(async (r) => {
        if (r.status === 401) throw new Error('ログインが必要です');
        if (r.status === 403) throw new Error('モデレーター権限が必要です');
        if (!r.ok) throw new Error(`fetch failed: ${r.status}`);
        return r.json() as Promise<{ applications: Application[] }>;
      })
      .then((d) => setApps(d.applications))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div role="tablist" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            onClick={() => setStatus(t.key)}
            data-active={status === t.key}
            className="tab"
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-[var(--color-text-muted)] text-sm">読み込み中…</p>
      )}
      {error && (
        <div className="alert alert-error">
          {error}
          {error.includes('ログイン') && (
            <a href="/login" className="ml-2 font-semibold underline">
              ログイン
            </a>
          )}
        </div>
      )}

      {!loading && !error && apps.length === 0 && (
        <div className="card p-8 text-center space-y-2">
          <div className="text-4xl opacity-40" aria-hidden="true">📭</div>
          <p className="text-[var(--color-text-muted)] text-sm">
            該当する申請はありません。
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {apps.map((a) => (
          <li
            key={a.id}
            className="card flex gap-4 p-4 transition-all hover:shadow-md hover:border-[var(--color-border-strong)]"
          >
            <a
              href={`/admin/${a.id}`}
              className="shrink-0 group"
              title={`詳細を開く (#${a.id})`}
            >
              <img
                src={`/api/admin/applications/${a.id}/image`}
                alt={a.name}
                className="h-16 w-16 rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] object-contain p-1.5 group-hover:border-[var(--color-accent)] transition-colors"
              />
            </a>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <a
                  href={`/admin/${a.id}`}
                  className="font-mono text-lg font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] hover:underline underline-offset-2 break-all leading-tight"
                >
                  :{a.name}:
                </a>
                <StatusStamp status={a.status} />
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                <span className="text-[var(--color-text-faint)]">申請者:</span>{' '}
                <span className="font-mono text-[var(--color-text)]">@{a.applicant_username}</span>
                {a.applicant_name ? (
                  <>
                    {' '}
                    <span className="text-[var(--color-text-faint)]">·</span>{' '}
                    <Mfm text={a.applicant_name} />
                  </>
                ) : null}{' '}
                <span className="text-[var(--color-text-faint)]">·</span>{' '}
                {new Date(a.created_at).toLocaleString('ja-JP')}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                <span className="text-[var(--color-text-faint)]">カテゴリ:</span>{' '}
                {a.category ?? <span className="italic">未指定</span>}
                {a.category_is_new ? (
                  <span className="ml-1 text-[10px] rounded bg-[var(--color-pending-bg)] text-[var(--color-pending)] px-1.5 py-0.5">
                    新規
                  </span>
                ) : null}{' '}
                <span className="text-[var(--color-text-faint)]">·</span>{' '}
                <span className="text-[var(--color-text-faint)]">エイリアス:</span>{' '}
                {prettyAliases(a.aliases)}
              </p>
              {a.status === 'approved' && a.registered_emoji_name && (
                <p className="text-xs text-[var(--color-approved)]">
                  ✓ 採用 <code className="font-mono">:{a.registered_emoji_name}:</code>
                  {a.decided_by_username && (
                    <span className="text-[var(--color-text-faint)] ml-1">
                      by @{a.decided_by_username}
                    </span>
                  )}
                </p>
              )}
              {a.status === 'rejected' && (
                <p className="text-xs text-[var(--color-rejected)]">
                  ✕ 却下
                  {a.decided_by_username && (
                    <span className="text-[var(--color-text-faint)] ml-1">
                      by @{a.decided_by_username}
                    </span>
                  )}
                  {a.reject_reason ? `: ${a.reject_reason}` : ''}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function prettyAliases(raw: string): string {
  try {
    const arr = JSON.parse(raw) as string[];
    return arr.length > 0 ? arr.join(', ') : '(なし)';
  } catch {
    return raw;
  }
}
