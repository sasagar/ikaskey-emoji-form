import { AdminList } from '../../components/admin-list';

export default function AdminIndexPage() {
  return (
    <div className="space-y-8">
      <title>モデレーター: 申請一覧 — ブキチの絵文字工場</title>
      <header className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
          🛠 moderator console
        </span>
        <h1 className="page-title">申請一覧</h1>
        <p className="page-subtitle">
          タブで未対応・採用済・却下済を切り替えられます。詳細をクリックして編集や採用・却下を行います。
        </p>
      </header>
      <AdminList />
    </div>
  );
}

export const getConfig = async () => {
  return { render: 'dynamic' } as const;
};
