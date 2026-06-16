import type { MyQuestionStats } from "@/lib/account/queries";

type AccountQuestionStatsProps = {
  stats: MyQuestionStats;
};

const STAT_ITEMS: Array<{
  key: keyof MyQuestionStats;
  label: string;
}> = [
  { key: "pendingReview", label: "İncelemede" },
  { key: "published", label: "Yayında" },
  { key: "rejected", label: "Reddedildi" },
  { key: "revisionRequested", label: "Düzeltme istendi" },
  { key: "total", label: "Toplam" },
];

export function AccountQuestionStats({ stats }: AccountQuestionStatsProps) {
  return (
    <div className="account-stats-grid">
      {STAT_ITEMS.map((item) => (
        <div key={item.key} className="admin-stat-card">
          <p className="admin-stat-card__label">{item.label}</p>
          <p className="admin-stat-card__value">{stats[item.key]}</p>
        </div>
      ))}
    </div>
  );
}
