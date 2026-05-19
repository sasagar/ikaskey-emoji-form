import { env } from 'cloudflare:workers'; // eslint-disable-line import/no-unresolved

export default async function HomePage() {
  const host = env.MISSKEY_HOST;
  return (
    <div className="space-y-4">
      <title>ブキチの絵文字工場</title>
      <h1 className="text-4xl font-bold tracking-tight">ブキチの絵文字工場</h1>
      <p className="text-gray-700">
        いかすきー (<a href={`https://${host}`} className="underline">{host}</a>) で利用するカスタム絵文字の申請窓口です。
      </p>
      <p className="text-sm text-gray-500">
        Phase 1: skeleton — MiAuth / 申請フォーム / モデレーター画面はこれから実装します。
      </p>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
