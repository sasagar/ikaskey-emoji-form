import { SubmitForm } from '../components/submit-form';

export default function SubmitPage() {
  return (
    <div className="space-y-8">
      <title>絵文字を申請する — ブキチの絵文字工場</title>
      <header className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
          new submission
        </span>
        <h1 className="page-title">絵文字を申請する</h1>
        <p className="page-subtitle">
          登録したい絵文字の情報を入力してください。モデレーターが内容を確認し、必要に応じて編集の上で採用します。
        </p>
      </header>
      <div className="card p-6 sm:p-8">
        <SubmitForm />
      </div>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
