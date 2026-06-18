import Link from "next/link";

import { StatusBadge } from "@/components/ui/status-badge";
import { excerptText } from "@/lib/format/excerpt";
import { formatDateTR } from "@/lib/format/date";
import type { PublishedQuestionListItem } from "@/lib/questions/queries";

type PublishedQuestionListProps = {
  questions: PublishedQuestionListItem[];
  showExcerpt?: boolean;
};

export function PublishedQuestionList({
  questions,
  showExcerpt = true,
}: PublishedQuestionListProps) {
  return (
    <ul className="archive-list">
      {questions.map((item) => (
        <li key={item.id} className="archive-list__item">
          <div className="archive-list__main">
            <Link href={`/questions/${item.id}`} className="archive-list__title">
              {item.title}
            </Link>
            {item.status === "closed" && (
              <StatusBadge kind="question" status="closed" className="archive-list__badge" />
            )}
          </div>

          {showExcerpt && item.body && (
            <p className="archive-list__excerpt">{excerptText(item.body)}</p>
          )}

          <p className="archive-list__meta">
            {item.categorySlug && item.categoryTitle ? (
              <Link
                href={`/categories/${item.categorySlug}`}
                className="archive-list__category-link"
              >
                {item.categoryTitle}
              </Link>
            ) : (
              <span>{item.categoryTitle ?? "Kategori yok"}</span>
            )}
            <span aria-hidden="true">·</span>
            <span>{formatDateTR(item.publishedAt ?? item.createdAt)}</span>
            <span aria-hidden="true">·</span>
            <span>
              {item.answerCount} {item.answerCount === 1 ? "cevap" : "cevap"}
            </span>
          </p>
        </li>
      ))}
    </ul>
  );
}
