import Link from "next/link";

import { ForumPanelTable, ForumTable } from "@/components/ui/forum-table";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { QuestionSearchForm } from "@/components/ui/question-search-form";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTR } from "@/lib/format/date";
import {
  getActiveCategories,
  getPublishedQuestions,
} from "@/lib/questions/queries";
import { isSearchQueryValid, normalizeSearchQuery } from "@/lib/questions/search";

type QuestionsPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
};

export default async function QuestionsPage({ searchParams }: QuestionsPageProps) {
  const params = await searchParams;
  const search = normalizeSearchQuery(params.q);
  const categorySlug = params.category?.trim() ?? "";

  const [questions, categories] = await Promise.all([
    getPublishedQuestions({ search, categorySlug }),
    getActiveCategories(),
  ]);

  const activeCategory = categories.find((category) => category.slug === categorySlug);
  const hasFilters = isSearchQueryValid(search) || Boolean(categorySlug);

  let emptyTitle = "Henüz yayımlanmış soru yok";
  let emptyDescription =
    "İlk sorunuzu gönderin; moderasyon onayından sonra bu listede görünecektir.";

  if (hasFilters) {
    emptyTitle = "Eşleşen soru bulunamadı";
    emptyDescription =
      "Arama veya kategori filtresiyle eşleşen yayımlanmış soru yok. Farklı bir terim deneyin veya filtreyi kaldırın.";
  }

  return (
    <div className="site-container py-4 pb-8">
      <PageHeader
        title="Yayımlanan Sorular"
        description="Moderasyon sonrası yayımlanmış sorular ve müfettiş cevapları."
        actions={
          <Link href="/ask" className="btn btn-primary no-underline hover:no-underline">
            Soru Sor
          </Link>
        }
      />

      <QuestionSearchForm
        defaultQuery={search}
        categorySlug={categorySlug}
        className="mb-4"
      />

      {hasFilters && (
        <div className="filter-tags mb-4">
          {isSearchQueryValid(search) && (
            <span className="filter-tag">
              Arama: <strong>{search}</strong>
            </span>
          )}
          {activeCategory && (
            <span className="filter-tag">
              Kategori: <strong>{activeCategory.title}</strong>
            </span>
          )}
          <Link href="/questions" className="filter-tag filter-tag--clear">
            Filtreleri temizle
          </Link>
        </div>
      )}

      {questions.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription}>
          {!hasFilters && (
            <Link href="/ask" className="btn btn-secondary no-underline hover:no-underline">
              Soru Sor
            </Link>
          )}
        </EmptyState>
      ) : (
        <ForumPanelTable title="Soru listesi" tone="soft">
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
