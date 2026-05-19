import { MyList } from '../components/my-list';

export default function MyPage() {
  return (
    <div className="space-y-6">
      <title>自分の申請 — ブキチの絵文字工場</title>
      <h1 className="text-3xl font-bold tracking-tight">自分の申請</h1>
      <p className="text-sm text-gray-600">
        過去にあなたが申請した絵文字のステータスを確認できます。
      </p>
      <MyList />
      <p className="text-sm">
        <a href="/submit" className="text-blue-600 underline">
          新しい絵文字を申請する →
        </a>
      </p>
    </div>
  );
}

export const getConfig = async () => {
  return { render: 'dynamic' } as const;
};
