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
    <div className="admin-container">
      <AdminPanelShell
        title="Yönetim Özeti"
        description="Soru moderasyonu, müfettiş başvuruları ve yayın durumu özeti."
        user={user}
        activePath="/admin"
        pendingApplications={pendingInspectorApplications}
      >
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">İnceleme bekleyen sorular</p>
            <p className="admin-stat-card__value">{stats.pendingCount}</p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">Yayındaki sorular</p>
            <p className="admin-stat-card__value">{stats.publishedCount}</p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-card__label">Reddedilen sorular</p>
            <p className="admin-stat-card__value">{stats.rejectedCount}</p>
          </div>
          {canReviewInspectorApplications(user.role) && (
            <div className="admin-stat-card admin-stat-card--accent">
              <p className="admin-stat-card__label">Bekleyen müfettiş başvurusu</p>
              <p className="admin-stat-card__value">{pendingInspectorApplications}</p>
            </div>
          )}
        </div>

        <div className="admin-action-grid">
          <Link
            href="/admin/questions"
            className="admin-action-card no-underline hover:no-underline"
          >
            <span className="admin-action-card__title">Moderasyon Kuyruğu</span>
            <span className="admin-action-card__text">
              {stats.pendingCount > 0
                ? `${stats.pendingCount} soru inceleme bekliyor.`
                : "İncelemede soru bulunmuyor."}
            </span>
          </Link>

          {canReviewInspectorApplications(user.role) && (
            <Link
              href="/admin/inspector-applications"
              className="admin-action-card admin-action-card--accent no-underline hover:no-underline"
            >
              <span className="admin-action-card__title">
                Müfettiş Başvuruları
                {pendingInspectorApplications > 0 && (
                  <span className="admin-action-card__badge">{pendingInspectorApplications}</span>
                )}
              </span>
              <span className="admin-action-card__text">
                Başvuruları inceleyin, onaylayın veya reddedin.
              </span>
            </Link>
          )}

          <Link href="/questions" className="admin-action-card no-underline hover:no-underline">
            <span className="admin-action-card__title">Yayındaki Sorular</span>
            <span className="admin-action-card__text">
              Yayımlanmış {stats.publishedCount} soruyu görüntüleyin.
            </span>
          </Link>
        </div>
      </AdminPanelShell>
    </div>
  );
}
