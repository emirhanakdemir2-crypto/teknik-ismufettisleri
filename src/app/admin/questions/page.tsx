import { AdminPanelShell } from "@/components/admin/admin-panel-shell";
import { ModerationQueueCard } from "@/components/admin/moderation-queue-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getPendingReviewQuestions } from "@/lib/admin/queries";
import { requireModeratorAccess } from "@/lib/auth/require-moderator";

export default async function AdminQuestionsPage() {
  const user = await requireModeratorAccess();
  const pendingQuestions = await getPendingReviewQuestions();

  return (
    <div className="admin-container">
      <AdminPanelShell
        title="Moderasyon Kuyruğu"
        description="İnceleme bekleyen sorular. Yayınla veya gerekçeli red uygulayın."
        user={user}
        activePath="/admin/questions"
      >
        {pendingQuestions.length === 0 ? (
          <EmptyState
            title="İnceleme bekleyen soru yok"
            description="Yeni soru gönderildiğinde bu kuyrukta görünecektir."
          />
        ) : (
          <div className="moderation-queue">
            <p className="moderation-queue__summary">
              Bekleyen sorular ({pendingQuestions.length})
            </p>
            <div className="moderation-queue__list">
              {pendingQuestions.map((question) => (
                <ModerationQueueCard key={question.id} question={question} />
              ))}
            </div>
          </div>
        )}
      </AdminPanelShell>
    </div>
  );
}
