import { AdminList } from '../../components/admin-list';
import { AdminHero } from '../../components/admin-hero';

export default function AdminIndexPage() {
  return (
    <div className="space-y-6">
      <title>モデレーター: 申請一覧 — ブキチの絵文字工場</title>
      <AdminHero
        eyebrow="moderator console"
        title="申請一覧"
        subtitle="申請の最終決裁を行う、モデレーター専用エリアです。タブで未対応 / 採用済 / 却下済を切り替え、詳細から編集・採用・却下を行います。"
      />
      <AdminList />
    </div>
  );
}

export const getConfig = async () => {
  return { render: 'dynamic' } as const;
};
