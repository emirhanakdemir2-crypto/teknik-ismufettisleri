import { AdminPanelShell } from "@/components/admin/admin-panel-shell";
import { ForumPanelTable, ForumTable } from "@/components/ui/forum-table";
import { EmptyState } from "@/components/ui/empty-state";
import { getPendingReviewQuestions } from "@/lib/admin/queries";
import { requireModeratorAccess } from "@/lib/auth/require-moderator";

import { PendingQuestionRow } from "@/app/admin/questions/pending-question-row";

export default async function AdminQuestionsPage() {
  const user = await requireModeratorAccess();
  const pendingQuestions = await getPendingReviewQuestions();

  return (
    <div className="site-container py-4 pb-8">
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
          <ForumPanelTable title={`Bekleyen sorular (${pendingQuestions.length})`}>
            <ForumTable responsive className="mb-0 border-0 admin-moderation-table">
              <thead>
                <tr>
                  <th>Soru</th>
                  <th>Kategori</th>
                  <th>Yazar</th>
                  <th className="last">Gönderim</th>
                  <th>Durum</th>
                  <th className="num">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {pendingQuestions.map((question) => (
                  <PendingQuestionRow key={question.id} question={question} />
                ))}
              </tbody>
            </ForumTable>
          </ForumPanelTable>
        )}
      </AdminPanelShell>
    </div>
  );
}
