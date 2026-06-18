import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ui/empty-state";
import { InfoNotice } from "@/components/ui/info-notice";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
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

  const breadcrumbItems = [
    { label: "Ana sayfa", href: "/" },
    { label: "Sorular", href: "/questions" },
    ...(question.categorySlug && question.categoryTitle
      ? [
          {
            label: question.categoryTitle,
            href: `/categories/${question.categorySlug}`,
          },
        ]
      : []),
    { label: question.title },
  ];

  return (
    <div className="site-container page-stack page-stack--narrow">
      <PageBreadcrumb items={breadcrumbItems} />

      <article className="content-card content-card--question">
        <header className="content-card__header">
          <div className="content-card__labels">
            <StatusBadge kind="question" status={question.status} />
            {question.categorySlug && question.categoryTitle ? (
              <Link
                href={`/categories/${question.categorySlug}`}
                className="content-card__category content-card__category--link"
              >
                {question.categoryTitle}
              </Link>
            ) : (
              question.categoryTitle && (
                <span className="content-card__category">{question.categoryTitle}</span>
              )
            )}
          </div>
          <h1 className="content-card__title">{question.title}</h1>
          <p className="content-card__meta">
            Yayımlanma: {formatDateTR(question.publishedAt ?? question.createdAt)}
            <span aria-hidden="true"> · </span>
            {question.answerCount}{" "}
            {question.answerCount === 1 ? "cevap" : "cevap"}
          </p>
        </header>

        <div className="content-card__body">
          {question.status === "closed" && (
            <InfoNotice variant="warning" className="mb-4" title="Kapalı soru">
              Bu soru kapatılmıştır; yeni müfettiş cevabı kabul edilmez.
            </InfoNotice>
          )}
          <div className="prose-block">{question.body}</div>
        </div>
      </article>

      <section className="content-card">
        <header className="content-card__header content-card__header--section">
          <h2 className="content-card__section-title">
            Müfettiş cevapları
            <span className="content-card__count">{answers.length}</span>
          </h2>
        </header>

        {answers.length === 0 ? (
          <div className="content-card__body">
            <EmptyState
              compact
              title="Henüz cevap yok"
              description="Bu soruya henüz yayımlanmış müfettiş cevabı bulunmuyor."
            />
          </div>
        ) : (
          <div className="answer-stack">
            {answers.map((answer) => (
              <article key={answer.id} className="answer-card">
                <header className="answer-card__header">
                  <div className="answer-card__author">
                    <span className="answer-card__name">
                      {answer.authorDisplayName ?? "Doğrulanmış müfettiş"}
                    </span>
                    <span className="answer-card__role">Doğrulanmış Müfettiş</span>
                  </div>
                  <time className="answer-card__date" dateTime={answer.publishedAt}>
                    {formatDateTR(answer.publishedAt)}
                    {answer.editedAt ? " · düzenlendi" : ""}
                  </time>
                </header>
                <div className="prose-block answer-card__body">{answer.body}</div>
              </article>
            ))}
          </div>
        )}

        <footer className="content-card__footer">
          <p className="legal-note">
            Cevaplar bilgilendirme amaçlıdır; nihai hukuki görüş veya bağlayıcı karar
            niteliği taşımaz.
          </p>
        </footer>
      </section>
    </div>
  );
}
