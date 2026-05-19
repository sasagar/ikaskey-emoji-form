import type { ReactNode } from 'react';

/**
 * モデレーター専用ページのヘッダーバナー。
 * accent 色を全面に使った「管理エリア」サインで、申請者向けページとの区別を強くする。
 * 右上に斜めスタンプ調の "MODERATOR" 表示、左下にコンテキスト見出し。
 */
type Props = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
};

export function AdminHero({ eyebrow = 'restricted area', title, subtitle, children }: Props) {
  return (
    <div className="relative overflow-hidden rounded-lg border-2 border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-fg)] shadow-md">
      {/* Diagonal caution tape strip at top */}
      <div
        aria-hidden="true"
        className="h-1.5 w-full"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, #FAF4E8 0 12px, #563d00 12px 24px)',
          opacity: 0.55,
        }}
      />

      <div className="relative px-5 py-5 sm:px-7 sm:py-6">
        {/* Background "MODERATOR" stamp, hidden on small screens */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 top-4 hidden sm:flex flex-col items-center gap-0.5 rotate-[-8deg] select-none"
        >
          <span className="font-display text-[10px] tracking-[0.4em] text-[var(--color-accent-fg)] opacity-60">
            ★ STAFF ONLY ★
          </span>
          <span className="font-display text-2xl tracking-[0.25em] border-2 border-[var(--color-accent-fg)] border-dashed px-3 py-1 rounded-md text-[var(--color-accent-fg)] opacity-90">
            MODERATOR
          </span>
        </div>

        <div className="relative space-y-2 max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-fg)] text-[var(--color-accent)] px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em]">
            <span aria-hidden="true">🛠</span>
            {eyebrow}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-[var(--color-accent-fg)]/80 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {children && <div className="relative mt-4 pt-4 border-t border-[var(--color-accent-fg)]/20">{children}</div>}
      </div>
    </div>
  );
}
