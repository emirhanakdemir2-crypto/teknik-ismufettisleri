import Link from "next/link";

import { ModerationQueueMock } from "@/components/admin/moderation-queue-mock";
import { ForumPanelTable, ForumTable } from "@/components/ui/forum-table";
import { EmptyState } from "@/components/ui/empty-state";
import { InfoNotice } from "@/components/ui/info-notice";
import { formatDateTR } from "@/lib/format/date";
import { getPublishedQuestions } from "@/lib/questions/queries";

type FolderVariant = "slate" | "blue" | "olive" | "rust" | "navy";

type CategoryRow = {
  variant: FolderVariant;
  title: string;
  description: string;
  lastAnswer?: {
    questionTitle: string;
    inspector: string;
    date: string;
  };
  questions: number;
  answers: number;
};

const FEATURED_CATEGORIES: CategoryRow[] = [
  {
    variant: "olive",
    title: "İş Sağlığı ve Güvenliği — Genel Sorular",
    description:
      "Genel İSG uygulamaları, işveren yükümlülükleri ve saha uygulaması.",
    lastAnswer: {
      questionTitle: "Risk değerlendirme ekibi kimlerden oluşmalı?",
      inspector: "İş Mf. F.A.",
      date: "11.06.2026",
    },
    questions: 342,
    answers: 298,
  },
  {
    variant: "rust",
    title: "İş Kazaları ve Bildirim Süreçleri",
    description: "Kaza bildirimi, soruşturma süreci ve müfettiş uygulamaları.",
    lastAnswer: {
      questionTitle: "İş kazası bildirim süresi",
      inspector: "İş Mf. R.E.",
      date: "10.06.2026",
    },
    questions: 187,
    answers: 164,
  },
  {
    variant: "navy",
    title: "6331 Sayılı İSG Kanunu",
    description: "Kanun maddeleri, uygulama güçlükleri ve müfettiş yorumları.",
    lastAnswer: {
      questionTitle: "İşveren temsilcisi atanması zorunluluğu",
      inspector: "İş Mf. F.A.",
      date: "09.06.2026",
    },
    questions: 215,
    answers: 198,
  },
];

function FolderIcon({ variant }: { variant: FolderVariant }) {
  return <span className={`forum-folder forum-folder--${variant}`} aria-hidden="true" />;
}

function formatCount(value: number): string {
  return value.toLocaleString("tr-TR");
}

export default async function Home() {
  const recentQuestions = await getPublishedQuestions(5);

  return (
    <div className="site-container py-4 pb-8">
      <section className="hero-panel mb-4 px-4 py-4 sm:px-5">
        <h1 className="hero-panel__title">Müfettişe Sor</h1>
        <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-text">
          İş sağlığı, güvenliği ve çalışma hayatına dair sorularınızı uzmanlara iletin.
        </p>
        <p className="mt-2 max-w-3xl text-[12px] leading-relaxed text-muted">
          Sorular moderasyon sonrası yayımlanır. Mesleki cevapları yalnızca doğrulanmış
          müfettişler yazar. İçerikler bilgilendirme amaçlıdır.
        </p>

        <div className="hero-steps mt-4">
          <div className="hero-step">
            <span className="hero-step__num">1 — Okuma</span>
            <p className="hero-step__text">
              <strong>Herkes</strong> yayımlanmış soru ve cevapları okuyabilir.
            </p>
          </div>
          <div className="hero-step">
            <span className="hero-step__num">2 — Moderasyon</span>
            <p className="hero-step__text">
              Sorular moderasyondan geçer; onaylanmadan yayımlanmaz.
            </p>
          </div>
          <div className="hero-step">
            <span className="hero-step__num">3 — Cevap</span>
            <p className="hero-step__text">
              Mesleki cevapları <strong>yalnızca doğrulanmış müfettişler</strong> yazar.
            </p>
          </div>
        </div>

        <div id="soru-sor" className="mt-4 flex flex-wrap gap-2">
          <Link href="/ask" className="btn btn-primary no-underline hover:no-underline">
            Soru Sor
          </Link>
          <Link href="/questions" className="btn btn-secondary no-underline hover:no-underline">
            Soruları İncele
          </Link>
          <Link href="/register" className="btn btn-secondary no-underline hover:no-underline">
            Ücretsiz Kayıt Ol
          </Link>
        </div>
      </section>

      <InfoNotice variant="legal" className="mb-4">
        Platformdaki cevaplar bilgilendirme amaçlıdır; nihai hukuki görüş veya bağlayıcı
        karar niteliği taşımaz.
      </InfoNotice>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[1fr_220px]">
        <div>
          <section id="kategoriler" className="mb-4">
            <ForumPanelTable
              title="Soru Kategorileri"
              footer="Örnek veriler — canlı kategori listesi veritabanından yüklenecektir."
            >
              <ForumTable responsive className="mb-0 border-0">
                <thead>
                  <tr>
                    <th>Kategori</th>
                    <th className="last">Son müfettiş cevabı</th>
                    <th className="num">Soru</th>
                    <th className="num">Cevap</th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURED_CATEGORIES.map((row) => (
                    <tr key={row.title}>
                      <td>
                        <div className="flex gap-2">
                          <FolderIcon variant={row.variant} />
                          <div className="min-w-0">
                            <span className="text-[12px] font-bold text-link">{row.title}</span>
                            <p className="mt-0.5 text-[11px] leading-snug text-muted">
                              {row.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="last text-right text-[10px] leading-snug text-muted">
                        {row.lastAnswer ? (
                          <>
                            <span className="block text-[11px] text-link">
                              {row.lastAnswer.questionTitle}
                            </span>
                            <span>{row.lastAnswer.inspector}</span>
                            <span className="block">{row.lastAnswer.date}</span>
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="num text-[12px] font-bold">{formatCount(row.questions)}</td>
                      <td className="num text-[12px] font-bold">{formatCount(row.answers)}</td>
                    </tr>
                  ))}
                </tbody>
              </ForumTable>
            </ForumPanelTable>
          </section>

          <section id="son-sorular" className="mb-4">
            <ForumPanelTable title="Son Yayımlanan Sorular">
              {recentQuestions.length === 0 ? (
                <EmptyState
                  compact
                  title="Henüz yayımlanmış soru yok"
                  description="İlk soruyu siz gönderebilirsiniz; moderasyon sonrası burada listelenecektir."
                />
              ) : (
                <ForumTable responsive className="mb-0 border-0">
                  <thead>
                    <tr>
                      <th>Soru başlığı</th>
                      <th>Kategori</th>
                      <th className="last">Tarih</th>
                      <th className="num">Cevap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentQuestions.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <Link
                            href={`/questions/${item.id}`}
                            className="text-[12px] font-bold text-link no-underline hover:underline"
                          >
                            {item.title}
                          </Link>
                        </td>
                        <td className="text-[11px] text-muted">
                          {item.categoryTitle ?? "—"}
                        </td>
                        <td className="last text-right text-[11px] text-muted">
                          {formatDateTR(item.publishedAt ?? item.createdAt)}
                        </td>
                        <td className="num text-[12px] font-bold">{item.answerCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </ForumTable>
              )}
            </ForumPanelTable>
            {recentQuestions.length > 0 && (
              <p className="mt-2 text-right text-[11px]">
                <Link
                  href="/questions"
                  className="font-bold text-link no-underline hover:underline"
                >
                  Tüm soruları gör →
                </Link>
              </p>
            )}
          </section>

          <section className="mb-4">
            <ModerationQueueMock />
          </section>
        </div>

        <aside className="text-[11px]">
          <div className="site-panel mb-3">
            <div className="site-panel__head">Platform Kuralları</div>
            <div className="site-panel__body space-y-2">
              <InfoNotice variant="info">Herkes yayımlanmış içeriği okuyabilir.</InfoNotice>
              <InfoNotice variant="warning">
                Sorular moderasyon onayı olmadan yayımlanmaz.
              </InfoNotice>
              <InfoNotice variant="legal">
                Cevaplar bilgilendirme amaçlıdır; hukuki bağlayıcılık taşımaz.
              </InfoNotice>
            </div>
          </div>

          <div className="site-panel mb-3">
            <div className="site-panel__head">Hızlı Erişim</div>
            <div className="site-panel__body">
              <ul className="list-none space-y-1.5">
                <li>
                  <Link href="/ask" className="font-bold no-underline hover:underline">
                    Soru Sor
                  </Link>
                </li>
                <li>
                  <Link href="/questions" className="font-bold no-underline hover:underline">
                    Sorular
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="font-bold no-underline hover:underline">
                    Giriş Yap
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="font-bold no-underline hover:underline">
                    Hesabım
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="site-panel">
            <div className="site-panel__head">İstatistikler (örnek)</div>
            <div className="site-panel__body">
              <table className="w-full border-collapse text-center">
                <tbody>
                  <tr>
                    <td className="border border-border-light bg-[#eef1f6] p-2">
                      <div className="text-[15px] font-bold text-navy">842</div>
                      <div className="mt-0.5 text-[9px] uppercase text-muted">Soru</div>
                    </td>
                    <td className="border border-border-light bg-[#eef1f6] p-2">
                      <div className="text-[15px] font-bold text-navy">1.956</div>
                      <div className="mt-0.5 text-[9px] uppercase text-muted">Cevap</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
