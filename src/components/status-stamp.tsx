'use client';

export type Status = 'pending' | 'approved' | 'rejected';

export function statusLabel(status: Status): string {
  return { pending: '未対応', approved: '採用', rejected: '却下' }[status];
}

/**
 * Workshop ink-stamp style badge for application status.
 * Light rotation + uppercase letter-spacing makes it feel hand-stamped.
 */
export function StatusStamp({ status, large = false }: { status: Status; large?: boolean }) {
  const cls = {
    pending: 'badge-pending',
    approved: 'badge-approved',
    rejected: 'badge-rejected',
  }[status];
  const label = statusLabel(status);
  const rotation = {
    pending: 'rotate-[-3deg]',
    approved: 'rotate-[-1deg]',
    rejected: 'rotate-[2deg]',
  }[status];
  const sizeCls = large ? 'text-sm px-3 py-1' : '';

  return (
    <span
      className={`badge-stamp ${cls} ${rotation} ${sizeCls} select-none`}
      aria-label={`ステータス: ${label}`}
    >
      <span aria-hidden="true">{statusIcon(status)}</span>
      {label}
    </span>
  );
}

function statusIcon(status: Status): string {
  return { pending: '⌛', approved: '✓', rejected: '✕' }[status];
}
