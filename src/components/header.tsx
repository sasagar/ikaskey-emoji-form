import { Link } from 'waku';

export const Header = () => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="group flex items-center gap-3 no-underline text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
        >
          <span className="logomark group-hover:rotate-[-6deg] transition-transform duration-200">
            工
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg sm:text-xl">
              ブキチの絵文字工場
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-faint)]">
              ikaskey emoji workshop
            </span>
          </span>
        </Link>
        <nav className="hidden sm:flex items-center gap-1 text-sm font-medium text-[var(--color-text-muted)]">
          <Link
            to="/submit"
            className="rounded-md px-3 py-1.5 no-underline hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)] transition-colors"
          >
            申請する
          </Link>
          <Link
            to="/my"
            className="rounded-md px-3 py-1.5 no-underline hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)] transition-colors"
          >
            自分の申請
          </Link>
          <Link
            to="/admin"
            className="rounded-md px-3 py-1.5 no-underline border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1"
            title="モデレーター専用エリア"
          >
            <span aria-hidden="true">🛠</span>
            管理
          </Link>
        </nav>
      </div>
    </header>
  );
};
