import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDateTR } from "@/lib/format/date";
import {
  getPublishedAnswersForQuestion,
  getPublishedQuestionById,
} from "@/lib/questions/queries";

type QuestionDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuestionDetailPage({ params }: QuestionDetailPageProps) {
  const { id } = await params;
  const question = await getPublishedQuestionById(id);

  if (!question) {
    notFound();
  }

  const answers = await getPublishedAnswersForQuestion(question.id);

  return (
    <div className="site-container py-4 pb-8">
      <p className="mb-3 text-[11px]">
        <Link href="/questions" className="text-link no-underline hover:underline">
          ← Soru listesine dön
        </Link>
      </p>

      <article className="site-panel mb-4">
        <div className="site-panel__head">Soru</div>
        <div className="site-panel__body">
          <h1 className="text-[15px] font-bold leading-snug text-navy">{question.title}</h1>

          <dl className="mt-3 grid gap-2 text-[11px] sm:grid-cols-2">
            <div>
              <dt className="font-bold text-muted">Kategori</dt>
              <dd className="text-text">{question.categoryTitle ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-bold text-muted">Yayımlanma</dt>
              <dd className="text-text">
                {formatDateTR(question.publishedAt ?? question.createdAt)}
              </dd>
            </div>
          </dl>

          {question.status === "closed" && (
            <p className="alert alert-info mt-4">
              Bu soru kapatılmıştır; yeni müfettiş cevabı kabul edilmez.
            </p>
          )}

          <div className="mt-4 whitespace-pre-wrap text-[12px] leading-relaxed text-text">
            {question.body}
          </div>
        </div>
      </article>

      <section className="site-panel">
        <div className="site-panel__head">
          Müfettiş Cevapları ({answers.length})
        </div>
        <div className="site-panel__body">
          {answers.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state__title">Henüz cevap yok</p>
              <p className="empty-state__text">
                Bu soruya henüz yayımlanmış müfettiş cevabı bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {answers.map((answer, index) => (
                <div
                  key={answer.id}
                  className="border border-border-light bg-[#fafbfc] p-3"
                >
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted">
                    Müfettiş cevabı {index + 1} — {formatDateTR(answer.publishedAt)}
                    {answer.editedAt ? " (düzenlendi)" : ""}
                  </p>
                  <div className="whitespace-pre-wrap text-[12px] leading-relaxed text-text">
                    {answer.body}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="mt-4 text-[10px] text-muted">
            Cevaplar bilgilendirme amaçlıdır; hukuki bağlayıcılık taşımaz.
          </p>
        </div>
      </section>
    </div>
  );
}
