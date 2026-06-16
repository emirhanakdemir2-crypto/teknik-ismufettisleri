import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { QuestionSearchForm } from "@/components/ui/question-search-form";
import { formatDateTR } from "@/lib/format/date";
import { getCategoryBadge } from "@/lib/questions/category-badge";
import {
  getActiveCategories,
  getPublishedQuestions,
} from "@/lib/questions/queries";

export default async function Home() {
  const [categories, recentQuestions] = await Promise.all([
    getActiveCategories(),
    getPublishedQuestions({ limit: 5 }),
  ]);

  return (
    <div className="site-container py-4 pb-8">
      <section className="hero-panel mb-4 px-4 py-3 sm:px-4">
        <h1 className="hero-panel__title">Müfettişe Sor</h1>
        <p className="hero-panel__lead">
          İş sağlığı, güvenliği ve çalışma hayatına ilişkin soruların uzman görüşüyle
          değerlendirildiği bilgi platformu.
        </p>
        <p className="hero-panel__note">
          Yayınlanan soru ve cevaplar herkes tarafından okunabilir. Yeni sorular moderasyon
          kontrolünden sonra yayına alınır.
        </p>

        <div id="soru-sor" className="hero-panel__actions">
          <Link href="/ask" className="btn btn-primary no-underline hover:no-underline">
            Soru Sor
          </Link>
          <Link href="/questions" className="btn btn-secondary no-underline hover:no-underline">
            Yayınlanan Sorular
          </Link>
        </div>
      </section>

      <QuestionSearchForm
        compact
        placeholder="Yayınlanan sorularda ara…"
        className="mb-5"
      />

      <section id="kategoriler" className="home-section mb-5">
        <div className="home-section__head">
          <h2 className="home-section__title">Soru Kategorileri</h2>
        </div>

        {categories.length === 0 ? (
          <EmptyState
            compact
            title="Kategori bulunamadı"
            description="Soru kategorileri henüz tanımlanmamış. Lütfen daha sonra tekrar deneyin."
          />
        ) : (
          <div className="category-grid">
            {categories.map((category) => (
              <article key={category.id} className="category-card">
                <span className="category-card__badge">
                  {getCategoryBadge(category.slug, category.title)}
                </span>
                <h3 className="category-card__title">{category.title}</h3>
                {category.description && (
                  <p className="category-card__description">{category.description}</p>
                )}
                <Link
                  href={`/questions?category=${encodeURIComponent(category.slug)}`}
                  className="category-card__link"
                >
                  Bu kategorideki soruları görüntüle
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="son-sorular" className="home-section">
        <div className="home-section__head">
          <h2 className="home-section__title">Son Yayımlanan Sorular</h2>
          {recentQuestions.length > 0 && (
            <Link href="/questions" className="home-section__link">
              Tümünü gör
            </Link>
          )}
        </div>

        {recentQuestions.length === 0 ? (
          <EmptyState
            title="Henüz yayımlanmış soru yok"
            description="İlk sorunuzu gönderin; moderasyon sonrası burada yayımlanır."
          >
            <Link href="/ask" className="btn btn-primary no-underline hover:no-underline">
              Soru Sor
            </Link>
          </EmptyState>
        ) : (
          <ul className="home-question-list">
            {recentQuestions.map((item) => (
              <li key={item.id} className="home-question-list__item">
                <Link href={`/questions/${item.id}`} className="home-question-list__title">
                  {item.title}
                </Link>
                <p className="home-question-list__meta">
                  <span>{item.categoryTitle ?? "Kategori yok"}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatDateTR(item.publishedAt ?? item.createdAt)}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {item.answerCount} cevap
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
