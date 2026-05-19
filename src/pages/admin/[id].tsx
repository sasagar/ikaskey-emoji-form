import { AdminDetail } from '../../components/admin-detail';
import { AdminHero } from '../../components/admin-hero';

type Props = {
  id: string;
};

export default function AdminDetailPage({ id }: Props) {
  const n = parseInt(id, 10);
  if (!Number.isFinite(n) || n <= 0) {
    return <div className="alert alert-error">不正な申請 ID: {id}</div>;
  }
  return (
    <div className="space-y-6">
      <title>申請 #{n} — ブキチの絵文字工場</title>
      <AdminHero
        eyebrow={`moderator · application #${n}`}
        title={
          <>
            申請の決裁<span className="opacity-60 text-2xl ml-2">#{n}</span>
          </>
        }
        subtitle="採用するとスーパーマンタロー名義でいかすきーに登録されます。決裁前にカテゴリ・name・エイリアスを編集できます。"
      >
        <a
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-accent-fg)]/90 hover:text-[var(--color-accent-fg)] hover:underline underline-offset-2"
        >
          ← 申請一覧に戻る
        </a>
      </AdminHero>
      <AdminDetail id={n} />
    </div>
  );
}

export const getConfig = async () => {
  return { render: 'dynamic' } as const;
};
