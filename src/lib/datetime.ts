/**
 * 申請レコードの日時文字列を、閲覧端末のタイムゾーンで整形する。
 *
 * DB には 2 系統のフォーマットが混在している:
 *   - created_at: D1 の DEFAULT CURRENT_TIMESTAMP → "2026-05-20 01:14:00"
 *                 (UTC だがタイムゾーン表記なし・スペース区切り)
 *   - decided_at: new Date().toISOString()        → "2026-05-20T01:14:00.000Z"
 *                 (UTC・Z 付き)
 *
 * JS の Date はタイムゾーン表記のない文字列をローカル時刻として誤解釈するため、
 * 表記がなければ UTC とみなして補正してから、ローカル (閲覧端末) 表示に変換する。
 */
export function formatDateTime(value: string | null | undefined): string {
  const d = parseUtc(value);
  return d ? d.toLocaleString('ja-JP') : '?';
}

function parseUtc(value: string | null | undefined): Date | null {
  if (!value) return null;
  // 末尾に Z または +09:00 のようなオフセットがあればタイムゾーン表記済み
  const hasTz = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(value);
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const d = new Date(hasTz ? normalized : `${normalized}Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}
