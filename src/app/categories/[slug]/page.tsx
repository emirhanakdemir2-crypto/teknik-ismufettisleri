import Link from "next/link";
import { notFound } from "next/navigation";

import { PublishedQuestionList } from "@/components/questions/published-question-list";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import {
  getActiveCategoryBySlug,
  getPublicQuestionCountForCategory,
} from "@/lib/categories/queries";
import { getPublishedQuestions } from "@/lib/questions/queries";

export const dynamic = "force-dynamic";

type CategoryDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { slug } = await params;
  const category = await getActiveCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [questions, questionCount] = await Promise.all([
    getPublishedQuestions({ categorySlug: slug }),
    getPublicQuestionCountForCategory(category.id),
  ]);

  return (
    <div className="site-container page-stack pb-8">
      <PageBreadcrumb
        items={[
          { label: "Ana sayfa", href: "/" },
          { label: "Kategoriler", href: "/categories" },
          { label: category.title },
        ]}
      />

      <PageHeader
        title={category.title}
        description={category.description ?? undefined}
        actions={
          <Link href="/ask" className="btn btn-primary no-underline hover:no-underline">
            Soru Sor
          </Link>
        }
      />

      <p className="category-detail__stats">
        <strong>{questionCount}</strong>{" "}
        {questionCount === 1 ? "yayımlanmış soru" : "yayımlanmış soru"}
      </p>

      {questions.length === 0 ? (
        <EmptyState
          title="Bu kategoride henüz yayımlanmış soru yok"
          description="İlk sorunuzu gönderin; moderasyon sonrası bu kategoride yayımlanır."
        >
          <Link href="/ask" className="btn btn-primary no-underline hover:no-underline">
            Soru Sor
          </Link>
        </EmptyState>
      ) : (
        <PublishedQuestionList questions={questions} showExcerpt />
      )}
    </div>
  );
}
