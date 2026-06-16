import Link from "next/link";

import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTR } from "@/lib/format/date";
import type { PublishedQuestionListItem } from "@/lib/questions/queries";

type PublishedQuestionListProps = {
  questions: PublishedQuestionListItem[];
};

export function PublishedQuestionList({ questions }: PublishedQuestionListProps) {
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
          <p className="archive-list__meta">
            <span>{item.categoryTitle ?? "Kategori yok"}</span>
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
