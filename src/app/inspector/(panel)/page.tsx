import Link from "next/link";

import { InspectorPanelShell } from "@/components/inspector/inspector-panel-shell";
import { getInspectorDashboardStats } from "@/lib/inspector/queries";
import { requireInspectorAccess } from "@/lib/auth/require-inspector";

export default async function InspectorDashboardPage() {
  const user = await requireInspectorAccess();
  const stats = await getInspectorDashboardStats(user.id);

  return (
    <div className="site-container py-4 pb-8">
      <InspectorPanelShell
        title="Müfettiş Özeti"
        description="Yayındaki sorular ve cevap durumu."
        user={user}
        activePath="/inspector"
      >
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">Yayındaki sorular</p>
            <p className="admin-stat-card__value">{stats.publishedQuestionCount}</p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">Cevap bekleyen</p>
            <p className="admin-stat-card__value">{stats.unansweredQuestionCount}</p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">Yazdığım cevaplar</p>
            <p className="admin-stat-card__value">{stats.ownAnswerCount}</p>
          </div>
        </div>

        <div className="mt-4">
          <Link
            href="/inspector/questions"
            className="btn btn-primary no-underline hover:no-underline"
          >
            Yayındaki sorulara git
          </Link>
        </div>
      </InspectorPanelShell>
    </div>
  );
}
