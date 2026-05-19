export const Footer = () => {
  return (
    <footer className="mt-8 border-t border-[var(--color-border)] bg-[var(--color-surface-sunken)]/40">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-2 text-xs text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-[var(--color-accent)] text-sm">
              ブキチの絵文字工場
            </span>
            <span className="text-[var(--color-text-faint)]">
              · ikaskey custom emoji portal
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/sasagar/ikaskey-emoji-form"
              target="_blank"
              rel="noreferrer"
              className="no-underline hover:text-[var(--color-accent)] transition-colors"
            >
              GitHub
            </a>
            <span className="text-[var(--color-text-faint)]">·</span>
            <span>
              built with{' '}
              <a
                href="https://waku.gg/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--color-accent)] transition-colors"
              >
                Waku
              </a>{' '}
              on Cloudflare Workers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
