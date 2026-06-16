import Link from "next/link";

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

const RECENT_QUESTIONS = [
  {
    title: "Periyodik kontrol raporu geçerlilik süresi",
    category: "Genel İSG",
    status: "Cevaplandı",
  },
  {
    title: "Geçici işçi İSG eğitimi yükümlülüğü",
    category: "Çalışan Eğitimi",
    status: "Cevap bekliyor",
  },
  {
    title: "Yüksekte çalışmada emniyet kemeri zorunluluğu",
    category: "KKD",
    status: "Cevaplandı",
  },
];

function FolderIcon({ variant }: { variant: FolderVariant }) {
  return <span className={`forum-folder forum-folder--${variant}`} aria-hidden="true" />;
}

function formatCount(value: number): string {
  return value.toLocaleString("tr-TR");
}

export default function Home() {
  return (
    <div className="site-container py-4 pb-8">
      <section className="hero-panel mb-4 px-4 py-4 sm:px-5">
        <h1 className="hero-panel__title">Müfettişe Sor</h1>
        <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-text">
          İş sağlığı, güvenliği ve çalışma hayatına dair sorularınızı uzmanlara iletin.
        </p>
        <p className="mt-2 max-w-3xl text-[12px] leading-relaxed text-muted">
          Teknik İşmüfettişleri Derneği bünyesinde yönetilen, moderasyonlu ve herkese
          açık bir bilgi bankasıdır.
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
              Mesleki cevapları <strong>yalnızca doğrulanmış müfettişler</strong>{" "}
              yazar. Cevaplar bilgilendirme amaçlıdır; hukuki bağlayıcılık taşımaz.
            </p>
          </div>
        </div>

        <div id="soru-sor" className="mt-4 flex flex-wrap gap-2">
          <span className="btn btn-primary pointer-events-none opacity-80">
            Soru Sor (yakında)
          </span>
          <Link href="/register" className="btn btn-secondary no-underline hover:no-underline">
            Ücretsiz Kayıt Ol
          </Link>
          <Link href="/login" className="btn btn-secondary no-underline hover:no-underline">
            Giriş Yap
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[1fr_220px]">
        <div>
          <section id="kategoriler" className="mb-4">
            <div className="mb-2 border border-border bg-navy px-3 py-1.5 text-[11px] font-bold text-white">
              Soru Kategorileri
            </div>
            <table className="forum-table forum-table--responsive">
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
            </table>
            <p className="mt-2 text-[10px] text-muted">
              Örnek veriler gösterilmektedir. Canlı kategori listesi bir sonraki sprintte
              veritabanından yüklenecektir.
            </p>
          </section>

          <section id="son-sorular" className="mb-4">
            <div className="site-panel">
              <div className="site-panel__head">Son Sorular</div>
              <div className="site-panel__body p-0">
                <table className="forum-table forum-table--responsive mb-0 border-0">
                  <thead>
                    <tr>
                      <th>Soru başlığı</th>
                      <th>Kategori</th>
                      <th className="last">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_QUESTIONS.map((item) => (
                      <tr key={item.title}>
                        <td className="text-[12px] font-bold text-link">{item.title}</td>
                        <td className="text-[11px] text-muted">{item.category}</td>
                        <td className="last text-right text-[11px] text-muted">
                          {item.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="empty-state">
            <p className="empty-state__title">Daha fazla içerik yakında</p>
            <p className="empty-state__text">
              Soru bankası, duyurular ve belgeler bölümleri sonraki geliştirme
              adımlarında eklenecektir. Şimdilik platform tanıtımı ve hesap
              işlemleri kullanılabilir durumdadır.
            </p>
          </section>
        </div>

        <aside className="text-[11px]">
          <div className="site-panel mb-3">
            <div className="site-panel__head">Platform Özeti</div>
            <div className="site-panel__body">
              <ul className="list-none space-y-2 leading-relaxed text-text">
                <li>
                  <span className="font-bold text-navy">Moderasyonlu</span> soru
                  yayımlama
                </li>
                <li>
                  <span className="font-bold text-navy">Doğrulanmış müfettiş</span>{" "}
                  cevapları
                </li>
                <li>Herkese açık okuma</li>
                <li>Cevaplar bilgilendirme amaçlıdır</li>
              </ul>
            </div>
          </div>

          <div className="site-panel mb-3">
            <div className="site-panel__head">Hızlı Erişim</div>
            <div className="site-panel__body">
              <ul className="list-none space-y-1.5">
                <li>
                  <Link href="/register" className="font-bold no-underline hover:underline">
                    Kayıt Ol
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
