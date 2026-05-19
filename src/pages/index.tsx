import { env } from 'cloudflare:workers'; // eslint-disable-line import/no-unresolved

export default async function HomePage() {
  const host = env.MISSKEY_HOST;
  return (
    <div className="space-y-10">
      <title>ブキチの絵文字工場</title>

      {/* Hero */}
      <section className="card relative overflow-hidden p-8 sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[var(--color-accent-soft)] opacity-60 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[var(--color-pending-bg)] opacity-70 blur-2xl"
        />
        <div className="relative space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            ikaskey custom emoji
          </span>
          <h1 className="page-title">
            あなたが作った絵文字を、<br />
            いかすきーに届けよう。
          </h1>
          <p className="page-subtitle max-w-xl">
            「ブキチの絵文字工場」は{' '}
            <a
              href={`https://${host}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[var(--color-link)] underline-offset-2 hover:text-[var(--color-link-hover)] hover:underline"
            >
              {host}
            </a>{' '}
            のカスタム絵文字を申請するための窓口です。フォームに沿って情報を入力すれば、モデレーターが内容を確認して採用します。
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a href="/submit" className="btn btn-primary btn-lg">
              <span aria-hidden="true">✎</span>
              絵文字を申請する
            </a>
            <a href="/my" className="btn btn-ghost btn-lg">
              自分の申請を見る
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="font-display text-xl text-[var(--color-text)]">
          申請の流れ
        </h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {[
            {
              n: 1,
              title: '画像と情報を入力',
              body: '絵文字名 (半角英数+_)、カテゴリ、エイリアス、画像 (2 MiB 以下) を入力します。',
            },
            {
              n: 2,
              title: 'モデレーターが確認',
              body: '内容を確認・必要に応じて編集し、Discord にも通知が飛びます。',
            },
            {
              n: 3,
              title: '採用 or 却下',
              body: 'いかすきー本体に登録されたら、申請者宛にメンションでお知らせします。',
            },
          ].map((s) => (
            <li key={s.n} className="card p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="logomark !w-7 !h-7 !text-base !rounded-md">
                  {s.n}
                </span>
                <h3 className="font-display text-base text-[var(--color-text)]">
                  {s.title}
                </h3>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Moderator hint */}
      <section className="card-sunken p-4 text-sm text-[var(--color-text-muted)]">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="text-base">🛠</span>
          <p>
            モデレーターの方は{' '}
            <a
              href="/admin"
              className="font-semibold text-[var(--color-link)] underline-offset-2 hover:underline"
            >
              /admin
            </a>{' '}
            から申請一覧 (未対応 / 採用済 / 却下済) を確認・編集できます。
          </p>
        </div>
      </section>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
