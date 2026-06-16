import Link from "next/link";
import { notFound } from "next/navigation";

import { ForumPanelTable } from "@/components/ui/forum-table";
import { EmptyState } from "@/components/ui/empty-state";
import { InfoNotice } from "@/components/ui/info-notice";
import { StatusBadge } from "@/components/ui/status-badge";
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
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusBadge kind="question" status={question.status} />
          </div>

          <h1 className="qa-question-card__title">{question.title}</h1>

          <dl className="qa-question-card__meta">
            <div>
              <dt>Kategori</dt>
              <dd>{question.categoryTitle ?? "—"}</dd>
            </div>
            <div>
              <dt>Yayımlanma</dt>
              <dd>{formatDateTR(question.publishedAt ?? question.createdAt)}</dd>
            </div>
          </dl>

          {question.status === "closed" && (
            <InfoNotice variant="warning" className="mt-4" title="Kapalı soru">
              Bu soru kapatılmıştır; yeni müfettiş cevabı kabul edilmez.
            </InfoNotice>
          )}

          <div className="qa-question-card__body">{question.body}</div>
        </div>
      </article>

      <ForumPanelTable title={`Müfettiş Cevapları (${answers.length})`}>
        {answers.length === 0 ? (
          <EmptyState
            compact
            title="Henüz cevap yok"
            description="Bu soruya henüz yayımlanmış müfettiş cevabı bulunmuyor."
          />
        ) : (
          <div className="space-y-3 p-3">
            {answers.map((answer) => (
              <div key={answer.id} className="qa-answer-card">
                <p className="qa-answer-card__meta">
                  {answer.authorDisplayName ?? "Doğrulanmış müfettiş"}
                  <span className="ml-2 inline-block rounded border border-border-light bg-row-alt px-1.5 py-0.5 text-[10px] font-bold text-navy">
                    Doğrulanmış Müfettiş
                  </span>
                  <span className="mx-2 text-muted">—</span>
                  {formatDateTR(answer.publishedAt)}
                  {answer.editedAt ? " (düzenlendi)" : ""}
                  <span className="ml-2 inline-block align-middle">
                    <StatusBadge kind="answer" status="published" />
                  </span>
                </p>
                <div className="qa-answer-card__body">{answer.body}</div>
              </div>
            ))}
          </div>
        )}
        <div className="site-panel__footer">
          <InfoNotice variant="legal">
            Cevaplar bilgilendirme amaçlıdır; nihai hukuki görüş veya bağlayıcı karar
            niteliği taşımaz.
          </InfoNotice>
        </div>
      </ForumPanelTable>
    </div>
  );
}
