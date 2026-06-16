import Link from "next/link";

import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ForumTable } from "@/components/ui/forum-table";
import type { MyQuestionItem } from "@/lib/account/queries";
import { formatDateTR } from "@/lib/format/date";

type MyQuestionsSectionProps = {
  questions: MyQuestionItem[];
};

const PUBLIC_DETAIL_STATUSES = new Set(["published", "closed"]);

const MODERATION_NOTE_MAX = 120;

function truncateNote(note: string): string {
  const trimmed = note.trim();

  if (trimmed.length <= MODERATION_NOTE_MAX) {
    return trimmed;
  }

  return `${trimmed.slice(0, MODERATION_NOTE_MAX).trimEnd()}…`;
}

function getStatusHint(question: MyQuestionItem): string | null {
  if (question.status === "rejected" && question.moderationNote) {
    return truncateNote(question.moderationNote);
  }

  return null;
}

export function MyQuestionsSection({ questions }: MyQuestionsSectionProps) {
  if (questions.length === 0) {
    return (
      <EmptyState
        title="Henüz soru göndermediniz"
        description="İş sağlığı, güvenliği veya çalışma hayatına ilişkin sorunuzu müfettişlere iletebilirsiniz."
      >
        <Link href="/ask" className="btn btn-primary no-underline hover:no-underline">
          Soru Sor
        </Link>
      </EmptyState>
    );
  }

  return (
    <ForumTable>
      <thead>
        <tr>
          <th>Başlık</th>
          <th className="num">Kategori</th>
          <th className="num">Durum</th>
          <th className="num last">Tarih</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((question) => {
          const canViewPublicDetail = PUBLIC_DETAIL_STATUSES.has(question.status);
          const statusHint = getStatusHint(question);

          return (
            <tr key={question.id}>
              <td>
                {canViewPublicDetail ? (
                  <Link
                    href={`/questions/${question.id}`}
                    className="text-link hover:underline"
                  >
                    {question.title}
                  </Link>
                ) : (
                  <span className="account-question-title">{question.title}</span>
                )}
                {statusHint && (
                  <p className="account-question-hint">{statusHint}</p>
                )}
              </td>
              <td className="num" data-label="Kategori">
                {question.categoryTitle ?? "—"}
              </td>
              <td className="num" data-label="Durum">
                <StatusBadge kind="question" status={question.status} />
              </td>
              <td className="num last" data-label="Tarih">
                {formatDateTR(question.createdAt)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </ForumTable>
  );
}
