import Link from "next/link";

import { AdminPanelShell } from "@/components/admin/admin-panel-shell";
import { getPendingInspectorApplicationCount } from "@/lib/admin/inspector-application-queries";
import { getModerationDashboardStats } from "@/lib/admin/queries";
import { requireModeratorAccess } from "@/lib/auth/require-moderator";
import { canReviewInspectorApplications } from "@/lib/auth/roles";

export default async function AdminDashboardPage() {
  const user = await requireModeratorAccess();
  const stats = await getModerationDashboardStats();
  const pendingInspectorApplications = canReviewInspectorApplications(user.role)
    ? await getPendingInspectorApplicationCount()
    : 0;

  return (
    <div className="site-container py-4 pb-8">
      <AdminPanelShell
        title="Yönetim Özeti"
        description="Soru moderasyonu ve yayın durumu özeti."
        user={user}
        activePath="/admin"
      >
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">İnceleme bekleyen</p>
            <p className="admin-stat-card__value">{stats.pendingCount}</p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">Yayındaki sorular</p>
            <p className="admin-stat-card__value">{stats.publishedCount}</p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">Reddedilen</p>
            <p className="admin-stat-card__value">{stats.rejectedCount}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/questions" className="btn btn-primary no-underline hover:no-underline">
            Moderasyon kuyruğuna git
          </Link>
          {canReviewInspectorApplications(user.role) && (
            <Link
              href="/admin/inspector-applications"
              className="btn btn-secondary no-underline hover:no-underline"
            >
              Müfettiş başvuruları ({pendingInspectorApplications})
            </Link>
          )}
        </div>
      </AdminPanelShell>
    </div>
  );
}
