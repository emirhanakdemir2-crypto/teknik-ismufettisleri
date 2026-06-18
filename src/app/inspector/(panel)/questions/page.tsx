import Link from "next/link";

import { InspectorPanelShell } from "@/components/inspector/inspector-panel-shell";
import { ForumPanelTable, ForumTable } from "@/components/ui/forum-table";
import { EmptyState } from "@/components/ui/empty-state";
import { getPublishedQuestionsForInspector } from "@/lib/inspector/queries";
import { requireInspectorAccess } from "@/lib/auth/require-inspector";
import { formatDateTR } from "@/lib/format/date";

export default async function InspectorQuestionsPage() {
  const user = await requireInspectorAccess();
  const questions = await getPublishedQuestionsForInspector();

  return (
    <div className="site-container py-4 pb-8">
      <InspectorPanelShell
        title="Yayındaki Sorular"
        description="Yayımlanmış sorulara müfettiş cevabı yazın. Cevapsız sorular önce listelenir."
        user={user}
        activePath="/inspector/questions"
      >
        {questions.length === 0 ? (
          <EmptyState
            title="Yayındaki soru yok"
            description="Moderasyon sonrası yayımlanan sorular burada görünecektir."
          />
        ) : (
          <ForumPanelTable title={`Yayındaki sorular (${questions.length})`}>
            <ForumTable responsive className="mb-0 border-0 admin-moderation-table">
              <thead>
                <tr>
                  <th>Soru</th>
                  <th>Kategori</th>
                  <th>Cevap</th>
                  <th className="last">Yayımlanma</th>
                  <th className="num">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question) => (
                  <tr key={question.id}>
                    <td>
                      <p className="text-[12px] font-bold text-text">{question.title}</p>
                      {question.answerCount === 0 && (
                        <span className="mt-1 inline-block text-[10px] font-bold text-amber">
                          Cevap bekliyor
                        </span>
                      )}
                    </td>
                    <td className="text-[11px] text-muted">
                      {question.categoryTitle ?? "—"}
                    </td>
                    <td className="text-[11px] text-muted">{question.answerCount}</td>
                    <td className="last text-right text-[11px] text-muted">
                      {formatDateTR(question.publishedAt ?? question.createdAt)}
                    </td>
                    <td className="num">
                      <Link
                        href={`/inspector/questions/${question.id}`}
                        className="btn btn-primary text-[11px] no-underline hover:no-underline"
                      >
                        Cevap yaz
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ForumTable>
          </ForumPanelTable>
        )}
      </InspectorPanelShell>
    </div>
  );
}
