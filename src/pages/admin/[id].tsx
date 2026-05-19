import { AdminDetail } from '../../components/admin-detail';

type Props = {
  id: string;
};

export default function AdminDetailPage({ id }: Props) {
  const n = parseInt(id, 10);
  if (!Number.isFinite(n) || n <= 0) {
    return (
      <div className="alert alert-error">不正な申請 ID: {id}</div>
    );
  }
  return (
    <div className="space-y-6">
      <title>申請 #{n} — ブキチの絵文字工場</title>
      <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
        <a
          href="/admin"
          className="hover:text-[var(--color-accent)] hover:underline underline-offset-2"
        >
          ← 申請一覧
        </a>
        <span className="text-[var(--color-text-faint)]">/</span>
        <span>申請 #{n}</span>
      </div>
      <AdminDetail id={n} />
    </div>
  );
}

export const getConfig = async () => {
  return { render: 'dynamic' } as const;
};
