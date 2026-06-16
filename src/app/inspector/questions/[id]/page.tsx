import Link from "next/link";
import { notFound } from "next/navigation";

import { AnswerForm } from "@/app/inspector/questions/answer-form";
import { InspectorPanelShell } from "@/components/inspector/inspector-panel-shell";
import { InfoNotice } from "@/components/ui/info-notice";
import { getPublishedQuestionForInspector } from "@/lib/inspector/queries";
import { requireInspectorAccess } from "@/lib/auth/require-inspector";
import { formatDateTR } from "@/lib/format/date";

type InspectorQuestionDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function InspectorQuestionDetailPage({
  params,
}: InspectorQuestionDetailPageProps) {
  const user = await requireInspectorAccess();
  const { id } = await params;
  const question = await getPublishedQuestionForInspector(id);

  if (!question) {
    notFound();
  }

  return (
    <div className="site-container py-4 pb-8">
      <InspectorPanelShell
        title="Cevap Yaz"
        description="Yayımlanmış soruya müfettiş cevabı ekleyin."
        user={user}
        activePath="/inspector/questions"
      >
        <p className="mb-3 text-[11px]">
          <Link
            href="/inspector/questions"
            className="text-link no-underline hover:underline"
          >
            ← Soru listesine dön
          </Link>
        </p>

        <article className="site-panel mb-4">
          <div className="site-panel__head">Soru</div>
          <div className="site-panel__body">
            <h2 className="qa-question-card__title">{question.title}</h2>
            <dl className="qa-question-card__meta">
              <div>
                <dt>Kategori</dt>
                <dd>{question.categoryTitle ?? "—"}</dd>
              </div>
              <div>
                <dt>Yayımlanma</dt>
                <dd>{formatDateTR(question.publishedAt ?? question.createdAt)}</dd>
              </div>
              <div>
                <dt>Mevcut cevap</dt>
                <dd>{question.answerCount}</dd>
              </div>
            </dl>
            <div className="qa-question-card__body">{question.body}</div>
          </div>
        </article>

        <div className="site-panel">
          <div className="site-panel__head">Müfettiş cevabı</div>
          <div className="site-panel__body">
            <AnswerForm questionId={question.id} />
            <InfoNotice variant="legal" className="mt-4">
              Cevaplar bilgilendirme amaçlıdır; nihai hukuki görüş veya bağlayıcı karar
              niteliği taşımaz.
            </InfoNotice>
          </div>
        </div>
      </InspectorPanelShell>
    </div>
  );
}
