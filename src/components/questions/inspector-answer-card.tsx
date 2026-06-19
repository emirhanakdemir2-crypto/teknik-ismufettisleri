import { formatDateTR } from "@/lib/format/date";
import type { PublishedAnswerItem } from "@/lib/questions/queries";

type InspectorAnswerCardProps = {
  answer: PublishedAnswerItem;
};

export function InspectorAnswerCard({ answer }: InspectorAnswerCardProps) {
  return (
    <article className="answer-card">
      <header className="answer-card__header">
        <div className="answer-card__author-block">
          <div className="answer-card__identity">
            <p className="answer-card__name">{answer.author.displayName}</p>
            {answer.author.professionalTitle && (
              <p className="answer-card__title">{answer.author.professionalTitle}</p>
            )}
            <span className="answer-card__badge">Doğrulanmış Müfettiş</span>
          </div>
        </div>
        <time className="answer-card__date" dateTime={answer.publishedAt}>
          {formatDateTR(answer.publishedAt)}
          {answer.editedAt ? " · düzenlendi" : ""}
        </time>
      </header>
      <div className="prose-block answer-card__body">{answer.body}</div>
    </article>
  );
}
