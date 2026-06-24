import Link from "next/link";

import { HomeAnnouncementModal } from "@/components/announcements/home-announcement-modal";
import { HomeAnnouncementCard } from "@/components/announcements/home-announcement-card";
import { HomeSidebar } from "@/components/home/home-sidebar";
import { PublishedQuestionList } from "@/components/questions/published-question-list";
import { EmptyState } from "@/components/ui/empty-state";
import { QuestionSearchForm } from "@/components/ui/question-search-form";
import { getCategoryBadge } from "@/lib/questions/category-badge";
import {
  getActiveCategories,
  getPublishedQuestionCountsByCategory,
  getPublishedQuestions,
} from "@/lib/questions/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, recentQuestions, categoryCounts] = await Promise.all([
    getActiveCategories(),
    getPublishedQuestions({ limit: 5, publishedOnly: true }),
    getPublishedQuestionCountsByCategory(),
  ]);

  return (
    <div className="site-container page-stack">
      <section className="hero-panel">
        <h1 className="hero-panel__title">Müfettişe Sor</h1>
        <p className="hero-panel__lead">
          İş sağlığı, güvenliği ve çalışma hayatına ilişkin soruların uzman görüşüyle
          değerlendirildiği bilgi platformu.
        </p>
        <p className="hero-panel__note">
          Sorular editör incelemesinden sonra yayımlanır. Mesleki değerlendirmeler yalnızca
          doğrulanmış müfettiş hesapları tarafından yapılır.
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

      <HomeAnnouncementCard />

      <HomeAnnouncementModal />

      <QuestionSearchForm
        compact
        placeholder="Yayınlanan sorularda ara…"
        className="search-panel"
      />

      <div className="home-layout">
        <div className="home-layout__main">
          <section id="kategoriler" className="home-section">
            <div className="section-heading">
              <h2 className="section-heading__title">Soru Kategorileri</h2>
              {categories.length > 0 && (
                <Link href="/categories" className="section-heading__link">
                  Bütün kategoriler
                </Link>
              )}
            </div>

            {categories.length === 0 ? (
              <EmptyState
                compact
                title="Kategori bulunamadı"
                description="Aktif kategori listesi yüklenemedi. Bağlantı veya veritabanı yapılandırmasını kontrol edin."
              />
            ) : (
              <div className="category-grid">
                {categories.map((category) => {
                  const questionCount = categoryCounts.get(category.id) ?? 0;

                  return (
                    <article key={category.id} className="category-card">
                      <div className="category-card__top">
                        <span className="category-card__badge">
                          {getCategoryBadge(category.slug, category.title)}
                        </span>
                        <span className="category-card__count">{questionCount} soru</span>
                      </div>
                      <h3 className="category-card__title">{category.title}</h3>
                      {category.description && (
                        <p className="category-card__description">{category.description}</p>
                      )}
                      <Link
                        href={`/categories/${category.slug}`}
                        className="category-card__link"
                      >
                        Kategoriye git
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section id="son-sorular" className="home-section">
            <div className="section-heading">
              <h2 className="section-heading__title">Son Yayımlanan Sorular</h2>
              {recentQuestions.length > 0 && (
                <Link href="/questions" className="section-heading__link">
                  Tümünü gör
                </Link>
              )}
            </div>

            {recentQuestions.length === 0 ? (
              <EmptyState
                title="Henüz yayımlanmış soru yok"
                description="İlk sorunuzu gönderin; editör incelemesinden sonra bu alanda yayımlanır."
              >
                <Link href="/ask" className="btn btn-primary no-underline hover:no-underline">
                  Soru Sor
                </Link>
              </EmptyState>
            ) : (
              <PublishedQuestionList questions={recentQuestions} />
            )}
          </section>
        </div>

        <HomeSidebar />
      </div>
    </div>
  );
}
