import Link from "next/link";

import { formatDateTR } from "@/lib/format/date";
import { getPublishedQuestions } from "@/lib/questions/queries";

export default async function QuestionsPage() {
  const questions = await getPublishedQuestions();

  return (
    <div className="site-container py-4 pb-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[15px] font-bold text-navy">Yayımlanan Sorular</h1>
          <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-muted">
            Bu listede yalnızca moderasyon sonrası yayımlanmış sorular görünür.
            İnceleme bekleyen veya reddedilen sorular burada yer almaz.
          </p>
        </div>
        <Link href="/ask" className="btn btn-primary shrink-0 no-underline hover:no-underline">
          Soru Sor
        </Link>
      </div>

      {questions.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__title">Henüz yayımlanmış soru yok</p>
          <p className="empty-state__text">
            İlk soruyu siz sorabilirsiniz. Gönderdiğiniz sorular moderasyon
            onayından sonra bu listede görünecektir.
          </p>
          <div className="mt-4">
            <Link href="/ask" className="btn btn-secondary no-underline hover:no-underline">
              Soru Sor
            </Link>
          </div>
        </div>
      ) : (
        <div className="site-panel">
          <div className="site-panel__head">Soru Bankası</div>
          <div className="site-panel__body p-0">
            <table className="forum-table forum-table--responsive mb-0 border-0">
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
                      <Link
                        href={`/questions/${question.id}`}
                        className="text-[12px] font-bold text-link no-underline hover:underline"
                      >
                        {question.title}
                      </Link>
                      {question.status === "closed" && (
                        <span className="ml-2 text-[10px] font-bold uppercase text-muted">
                          Kapalı
                        </span>
                      )}
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
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
