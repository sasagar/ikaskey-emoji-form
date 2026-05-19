import { MyList } from '../components/my-list';

export default function MyPage() {
  return (
    <div className="space-y-8">
      <title>自分の申請 — ブキチの絵文字工場</title>
      <header className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
          your submissions
        </span>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="page-title">自分の申請</h1>
          <a href="/submit" className="btn btn-primary btn-sm">
            <span aria-hidden="true">✎</span>
            新しい申請
          </a>
        </div>
        <p className="page-subtitle">
          過去にあなたが申請した絵文字のステータスを確認できます。
        </p>
      </header>
      <MyList />
    </div>
  );
}

export const getConfig = async () => {
  return { render: 'dynamic' } as const;
};
