import Link from "next/link";

import { PublishedQuestionList } from "@/components/questions/published-question-list";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { QuestionSearchForm } from "@/components/ui/question-search-form";
import {
  getActiveCategories,
  getPublishedQuestions,
} from "@/lib/questions/queries";
import { isSearchQueryValid, normalizeSearchQuery } from "@/lib/questions/search";

export const dynamic = "force-dynamic";

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
    getPublishedQuestions({ search, categorySlug, publishedOnly: true }),
    getActiveCategories(),
  ]);

  const activeCategory = categories.find((category) => category.slug === categorySlug);
  const hasFilters = isSearchQueryValid(search) || Boolean(categorySlug);

  let emptyTitle = "Henüz yayımlanmış soru yok";
  let emptyDescription =
    "İlk sorunuzu gönderin; editör incelemesinden sonra bu alanda yayımlanır.";

  if (hasFilters) {
    emptyTitle = "Eşleşen soru bulunamadı";
    emptyDescription =
      "Arama veya kategori filtresiyle eşleşen yayımlanmış soru yok. Farklı bir terim deneyin veya filtreyi kaldırın.";
  }

  return (
    <div className="site-container page-stack">
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
        <PublishedQuestionList questions={questions} />
      )}
    </div>
  );
}
