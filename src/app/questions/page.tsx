import Link from "next/link";

import { ForumPanelTable, ForumTable } from "@/components/ui/forum-table";
import { EmptyState } from "@/components/ui/empty-state";
import { InfoNotice } from "@/components/ui/info-notice";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTR } from "@/lib/format/date";
import { getPublishedQuestions } from "@/lib/questions/queries";

export default async function QuestionsPage() {
  const questions = await getPublishedQuestions();

  return (
    <div className="site-container py-4 pb-8">
      <PageHeader
        eyebrow="Soru bankası"
        title="Yayımlanan Sorular"
        description="Moderasyon sonrası yayımlanmış sorular ve müfettiş cevapları. Herkes okuyabilir; yeni sorular onay bekler."
        actions={
          <Link href="/ask" className="btn btn-primary no-underline hover:no-underline">
            Soru Sor
          </Link>
        }
      />

      <InfoNotice variant="legal" className="mb-4">
        Cevaplar bilgilendirme amaçlıdır; nihai hukuki görüş veya bağlayıcı karar
        niteliği taşımaz.
      </InfoNotice>

      {questions.length === 0 ? (
        <EmptyState
          title="Henüz yayımlanmış soru yok"
          description="İlk soruyu siz sorabilirsiniz. Gönderdiğiniz sorular moderasyon onayından sonra bu listede görünecektir."
        >
          <Link href="/ask" className="btn btn-secondary no-underline hover:no-underline">
            Soru Sor
          </Link>
        </EmptyState>
      ) : (
        <ForumPanelTable title="Soru listesi">
          <ForumTable responsive className="mb-0 border-0">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Kategori</th>
                <th className="last">Yayımlanma</th>
                <th className="num">Cevap</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.id}>
                  <td>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/questions/${question.id}`}
                        className="text-[12px] font-bold text-link no-underline hover:underline"
                      >
                        {question.title}
                      </Link>
                      {question.status === "closed" && (
                        <StatusBadge kind="question" status="closed" />
                      )}
                      {question.status === "published" && (
                        <StatusBadge kind="question" status="published" />
                      )}
                    </div>
                  </td>
                  <td className="text-[11px] text-muted">
                    {question.categoryTitle ?? "—"}
                  </td>
                  <td className="last text-right text-[11px] text-muted">
                    {formatDateTR(question.publishedAt ?? question.createdAt)}
                  </td>
                  <td className="num text-[12px] font-bold">{question.answerCount}</td>
                </tr>
              ))}
            </tbody>
          </ForumTable>
        </ForumPanelTable>
      )}
    </div>
  );
}
