type FolderVariant = "slate" | "blue" | "olive" | "rust" | "navy" | "readonly";

type LastAnswer = {
  questionTitle: string;
  inspector: string;
  date: string;
};

type CategoryRow = {
  variant: FolderVariant;
  title: string;
  description: string;
  subLinks?: string[];
  lastAnswer?: LastAnswer;
  questions: number | null;
  inspectorAnswers: number | null;
};

type CategorySection = {
  title: string;
  rows: CategoryRow[];
};

const NAV_LINKS = [
  { label: "Ana Sayfa", href: "#", active: false },
  { label: "Soru Bankası", href: "#", active: true },
  { label: "Duyurular", href: "#", active: false },
  { label: "Belgeler", href: "#", active: false },
  { label: "Nasıl Çalışır?", href: "#", active: false },
  { label: "Kayıt Ol", href: "#", active: false },
  { label: "Giriş", href: "#", active: false },
  { label: "Müfettiş Başvurusu", href: "#", active: false },
];

const TOOLBAR_LINKS = [
  "Soru Sor",
  "Müfettiş Başvurusu",
  "Platform Yardımı",
  "Moderasyon Süreci",
];

const CATEGORY_SECTIONS: CategorySection[] = [
  {
    title: "Platform ve Dernek",
    rows: [
      {
        variant: "readonly",
        title: "Platform Kullanım Kuralları",
        description:
          "Soru sormadan ve içerik paylaşmadan önce okuyunuz. Yayımlanan tüm sorular moderasyona tabidir.",
        questions: null,
        inspectorAnswers: null,
      },
      {
        variant: "blue",
        title: "Dernek Duyuruları",
        description:
          "Yönetim Kurulu duyuruları, etkinlikler ve resmi açıklamalar.",
        subLinks: ["Genel Kurul", "Basın Açıklamaları", "Etkinlikler"],
        lastAnswer: {
          questionTitle: "Genel kurul tarihi ne zaman?",
          inspector: "İş Mf. M.T.",
          date: "10.06.2026 09:14",
        },
        questions: 8,
        inspectorAnswers: 6,
      },
      {
        variant: "slate",
        title: "Platform Hakkında Geri Bildirim",
        description:
          "Site işleyişi, arama ve kategori önerileri. Mesleki cevap içermez.",
        lastAnswer: {
          questionTitle: "Kategori filtresi önerisi",
          inspector: "—",
          date: "08.06.2026 14:22",
        },
        questions: 14,
        inspectorAnswers: 0,
      },
    ],
  },
  {
    title: "İSG Soru Kategorileri",
    rows: [
      {
        variant: "olive",
        title: "İş Sağlığı ve Güvenliği — Genel Sorular",
        description:
          "Genel İSG uygulamaları, işveren yükümlülükleri ve saha uygulaması.",
        lastAnswer: {
          questionTitle: "Risk değerlendirme ekibi kimlerden oluşmalı?",
          inspector: "İş Mf. F.A.",
          date: "11.06.2026 16:40",
        },
        questions: 342,
        inspectorAnswers: 298,
      },
      {
        variant: "rust",
        title: "İş Kazaları ve Bildirim Süreçleri",
        description:
          "Kaza bildirimi, soruşturma süreci ve müfettiş uygulamaları.",
        lastAnswer: {
          questionTitle: "İş kazası bildirim süresi",
          inspector: "İş Mf. R.E.",
          date: "10.06.2026 11:05",
        },
        questions: 187,
        inspectorAnswers: 164,
      },
      {
        variant: "blue",
        title: "Risk Değerlendirmesi",
        description:
          "Fine-Kinney, FMEA, HAZOP ve saha uygulama soruları.",
        subLinks: ["Fine-Kinney", "FMEA", "HAZOP"],
        lastAnswer: {
          questionTitle: "Fine-Kinney puan eşiği uygulaması",
          inspector: "İş Mf. M.T.",
          date: "09.06.2026 08:30",
        },
        questions: 156,
        inspectorAnswers: 141,
      },
      {
        variant: "navy",
        title: "Kişisel Koruyucu Donanım (KKD)",
        description:
          "KKD seçimi, kullanımı ve denetimde dikkat edilecek hususlar.",
        lastAnswer: {
          questionTitle: "Yüksekte çalışmada emniyet kemeri zorunluluğu",
          inspector: "İş Mf. B.T.",
          date: "11.06.2026 08:52",
        },
        questions: 98,
        inspectorAnswers: 91,
      },
      {
        variant: "olive",
        title: "Çalışan Eğitimi ve Acil Durum",
        description:
          "Eğitim süreleri, acil durum planları ve tahliye uygulamaları.",
        subLinks: ["Eğitim Kayıtları", "Acil Durum", "Tahliye"],
        lastAnswer: {
          questionTitle: "Yangın tatbikatı periyodu",
          inspector: "İş Mf. İ.Ö.",
          date: "07.06.2026 15:18",
        },
        questions: 73,
        inspectorAnswers: 68,
      },
    ],
  },
  {
    title: "Sektörel Sorular",
    rows: [
      {
        variant: "rust",
        title: "İnşaat İşleri",
        description:
          "Yüksekte çalışma, iskele, şantiye organizasyonu ve saha denetimi.",
        lastAnswer: {
          questionTitle: "İskele periyodik kontrol süresi",
          inspector: "İş Mf. B.T.",
          date: "10.06.2026 14:11",
        },
        questions: 124,
        inspectorAnswers: 112,
      },
      {
        variant: "navy",
        title: "Maden İşleri",
        description:
          "Yer altı ve yer üstü maden işletmelerinde teftiş uygulamaları.",
        lastAnswer: {
          questionTitle: "Maden gazı ölçüm cihazı kalibrasyonu",
          inspector: "İş Mf. R.İ.",
          date: "08.06.2026 12:30",
        },
        questions: 61,
        inspectorAnswers: 54,
      },
      {
        variant: "blue",
        title: "Kimyasal Maddeler ve ATEX",
        description:
          "Tehlikeli madde depolama, patlayıcı ortam ve proses güvenliği.",
        subLinks: ["Kimya", "Petrokimya", "ATEX"],
        lastAnswer: {
          questionTitle: "ATEX bölge sınıflandırması",
          inspector: "İş Mf. R.İ.",
          date: "06.06.2026 10:20",
        },
        questions: 47,
        inspectorAnswers: 43,
      },
      {
        variant: "olive",
        title: "Diğer Sektörler",
        description:
          "Tekstil, metal, gıda, lojistik, sağlık ve diğer imalat sektörleri.",
        subLinks: ["Tekstil", "Metal", "Gıda", "Lojistik", "Sağlık"],
        lastAnswer: {
          questionTitle: "Gürültü maruziyet ölçüm periyodu",
          inspector: "İş Mf. F.A.",
          date: "05.06.2026 09:18",
        },
        questions: 89,
        inspectorAnswers: 76,
      },
    ],
  },
  {
    title: "Mevzuat ve Uygulama",
    rows: [
      {
        variant: "navy",
        title: "6331 Sayılı İSG Kanunu",
        description:
          "Kanun maddeleri, uygulama güçlükleri ve müfettiş yorumları.",
        lastAnswer: {
          questionTitle: "İşveren temsilcisi atanması zorunluluğu",
          inspector: "İş Mf. F.A.",
          date: "09.06.2026 11:30",
        },
        questions: 215,
        inspectorAnswers: 198,
      },
      {
        variant: "blue",
        title: "Yönetmelik Değişiklikleri",
        description:
          "Yeni yayımlanan ve değişen yönetmelikler; geçiş süreçleri.",
        lastAnswer: {
          questionTitle: "Elle taşıma yönetmeliği değişikliği",
          inspector: "İş Mf. M.D.",
          date: "07.06.2026 16:45",
        },
        questions: 92,
        inspectorAnswers: 84,
      },
      {
        variant: "slate",
        title: "Mahkeme Kararları ve İçtihatlar",
        description:
          "Emsal kararlar; Danıştay ve Yargıtay içtihatlarına ilişkin sorular.",
        lastAnswer: {
          questionTitle: "Yargıtay 9. HD — iş kazası tazminatı",
          inspector: "İş Mf. R.E.",
          date: "04.06.2026 15:33",
        },
        questions: 38,
        inspectorAnswers: 35,
      },
    ],
  },
];

const ANNOUNCEMENTS = [
  {
    title: "Platform moderasyon süreci güncellendi",
    date: "10 Haziran 2026",
    isNew: true,
  },
  {
    title: "Müfettiş doğrulama başvuruları açıldı",
    date: "02 Haziran 2026",
    isNew: false,
  },
  {
    title: "Dernek resmi kuruluşu tamamlandı",
    date: "21 Ocak 2026",
    isNew: false,
  },
];

const DOCUMENTS = [
  {
    title: "Müfettiş Başvuru Rehberi",
    meta: "PDF — kimlik/görev belgesi yükleme",
    isNew: true,
  },
  {
    title: "Platform Kullanım Kuralları",
    meta: "PDF — 4 sayfa",
    isNew: false,
  },
  {
    title: "Dernek Tüzüğü",
    meta: "PDF — 10 sayfa",
    isNew: false,
  },
];

const RECENT_QUESTIONS = [
  "Periyodik kontrol raporu geçerlilik süresi",
  "İş hijyeni ölçüm raporu saklama süresi",
  "Geçici işçi İSG eğitimi yükümlülüğü",
  "Taşeron işveren sorumluluğu",
];

function FolderIcon({ variant }: { variant: FolderVariant }) {
  return <span className={`forum-folder forum-folder--${variant}`} aria-hidden="true" />;
}

function formatCount(value: number): string {
  return value.toLocaleString("tr-TR");
}

function CategoryTable({ section }: { section: CategorySection }) {
  return (
    <section className="mb-3">
      <div className="border border-border bg-navy px-2 py-1 text-[11px] font-bold text-white">
        {section.title}
      </div>
      <table className="forum-table">
        <thead>
          <tr>
            <th>Kategori</th>
            <th className="last">Son müfettiş cevabı</th>
            <th className="num">Soru</th>
            <th className="num">Cevap</th>
          </tr>
        </thead>
        <tbody>
          {section.rows.map((row) => (
            <tr key={row.title}>
              <td>
                <div className="flex gap-2">
                  <FolderIcon variant={row.variant} />
                  <div className="min-w-0">
                    <a
                      href="#"
                      className="text-[12px] font-bold text-link no-underline hover:underline"
                    >
                      {row.title}
                    </a>
                    <div className="mt-px text-[11px] leading-snug text-muted">
                      {row.description}
                    </div>
                    {row.subLinks && (
                      <div className="mt-1 text-[10px] leading-relaxed text-muted">
                        Alt konular:{" "}
                        {row.subLinks.map((link, i) => (
                          <span key={link}>
                            {i > 0 && " · "}
                            <a href="#" className="text-link no-underline hover:underline">
                              {link}
                            </a>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="last text-right text-[10px] leading-snug text-muted">
                {row.lastAnswer ? (
                  row.lastAnswer.inspector === "—" ? (
                    "—"
                  ) : (
                    <>
                      <a
                        href="#"
                        className="block text-[11px] font-normal text-link no-underline hover:underline"
                      >
                        {row.lastAnswer.questionTitle}
                      </a>
                      <span>{row.lastAnswer.inspector}</span>
                      <span className="block">{row.lastAnswer.date}</span>
                    </>
                  )
                ) : (
                  "—"
                )}
              </td>
              <td className="num text-[12px] font-bold text-text">
                {row.questions !== null ? formatCount(row.questions) : "—"}
              </td>
              <td className="num text-[12px] font-bold text-text">
                {row.inspectorAnswers !== null
                  ? formatCount(row.inspectorAnswers)
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <header className="border-b-2 border-[#8899aa] bg-navy">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-3 py-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#8899aa] bg-navy-dark text-[15px] font-bold text-white">
              Tİ
            </div>
            <div>
              <h1 className="text-[14px] font-bold leading-tight text-white">
                Teknik İşmüfettişleri Derneği
              </h1>
              <span className="text-[10px] text-[#a8b4c4]">
                teknikismufettisleri.org.tr — Müfettişe Sor
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-1.5 border border-[#4a5f7a] bg-navy-dark p-1.5 md:flex">
            <input
              type="text"
              placeholder="E-posta"
              className="w-[120px] border border-[#4a5f7a] bg-[#0f1a2a] px-1.5 py-1 text-[11px] text-white outline-none placeholder:text-[#6a7a8f]"
              readOnly
            />
            <input
              type="password"
              placeholder="Şifre"
              className="w-[90px] border border-[#4a5f7a] bg-[#0f1a2a] px-1.5 py-1 text-[11px] text-white outline-none placeholder:text-[#6a7a8f]"
              readOnly
            />
            <button
              type="button"
              className="border border-[#4a5f7a] bg-[#2a3f5c] px-2.5 py-1 text-[11px] font-bold text-white"
            >
              Giriş
            </button>
            <button
              type="button"
              className="border border-[#4a5f7a] bg-transparent px-2 py-1 text-[11px] text-[#c0cad6]"
            >
              Beni hatırla
            </button>
          </div>
        </div>

        <nav className="border-t border-[#1a2840] bg-cat-bar">
          <ul className="mx-auto flex max-w-[1280px] list-none overflow-x-auto px-3">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`block whitespace-nowrap px-2.5 py-1.5 text-[11px] no-underline hover:bg-[#2e4260] hover:text-white hover:no-underline ${
                    link.active
                      ? "border-b-2 border-[#8899aa] bg-[#2e4260] font-bold text-white"
                      : "text-[#b8c4d4]"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-3 py-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px]">
            {TOOLBAR_LINKS.map((label) => (
              <a key={label} href="#" className="font-normal text-link no-underline hover:underline">
                {label}
              </a>
            ))}
          </div>
          <div className="flex gap-1">
            <input
              type="search"
              placeholder="Soru bankasında ara…"
              className="w-full border border-border bg-white px-1.5 py-0.5 text-[11px] outline-none sm:w-[180px]"
              readOnly
            />
            <button
              type="button"
              className="border border-border bg-[#dde3ec] px-2 py-0.5 text-[11px] font-bold text-navy"
            >
              Ara
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-3 pt-2">
        <div className="mb-2 border border-border border-l-[3px] border-l-navy bg-surface px-3 py-2">
          <h2 className="mb-1 text-[12px] font-bold text-navy">
            Müfettişe Sor — İSG Soru-Cevap Platformu
          </h2>
          <p className="mb-1 text-[11px] leading-relaxed text-text">
            Bu platform, iş sağlığı ve güvenliği alanındaki soruların yayımlanmadan
            önce kontrol edildiği, yanıtların yalnızca doğrulanmış teknik iş
            müfettişleri tarafından verildiği bir bilgi bankasıdır. Misafir veya
            kayıtlı kullanıcı olarak soru gönderebilirsiniz; sorular moderasyon
            sonrası yayımlanır.
          </p>
          <p className="text-[11px] leading-relaxed text-text">
            <strong>Normal kullanıcılar mesleki cevap yazamaz.</strong> Müfettiş
            olmak isteyenler kimlik/görev belgesi ile başvurur; belgeler özel
            alanda tutulur ve yalnızca admin tarafından görülür. Yayımlanan soru
            ve müfettiş cevapları herkese açıktır.
          </p>
          <div className="mt-1.5 text-[11px]">
            {[
              "Soru Sor",
              "Platform Yardımı",
              "Müfettiş Başvurusu",
              "Kullanım Kuralları",
            ].map((label) => (
              <a
                key={label}
                href="#"
                className="mr-3 font-bold text-link no-underline hover:underline"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-3 px-3 py-2 pb-6 xl:grid-cols-[1fr_200px]">
        <main>
          {CATEGORY_SECTIONS.map((section) => (
            <CategoryTable key={section.title} section={section} />
          ))}
        </main>

        <aside className="text-[11px]">
          <div className="mb-2 border border-border bg-surface">
            <div className="border-b border-border bg-cat-bar px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Platform İstatistikleri
            </div>
            <div className="p-2">
              <table className="w-full border-collapse text-center">
                <tbody>
                  <tr>
                    <td className="border border-border-light bg-[#eef1f6] p-1.5">
                      <div className="text-[16px] font-bold leading-none text-navy">1.247</div>
                      <div className="mt-0.5 text-[9px] uppercase text-muted">Kayıtlı kullanıcı</div>
                    </td>
                    <td className="border border-border-light bg-[#eef1f6] p-1.5">
                      <div className="text-[16px] font-bold leading-none text-navy">842</div>
                      <div className="mt-0.5 text-[9px] uppercase text-muted">Yayımlanan soru</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border-light bg-[#eef1f6] p-1.5">
                      <div className="text-[16px] font-bold leading-none text-navy">1.956</div>
                      <div className="mt-0.5 text-[9px] uppercase text-muted">Müfettiş cevabı</div>
                    </td>
                    <td className="border border-border-light bg-[#eef1f6] p-1.5">
                      <div className="text-[16px] font-bold leading-none text-navy">38</div>
                      <div className="mt-0.5 text-[9px] uppercase text-muted">Doğrulanmış müfettiş</div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-1.5 text-[10px] text-muted">
                <span className="mr-1 inline-block h-1.5 w-1.5 bg-online" />
                Çevrimiçi müfettiş:{" "}
                <a href="#" className="text-link no-underline hover:underline">B.T.</a>,{" "}
                <a href="#" className="text-link no-underline hover:underline">F.A.</a>,{" "}
                <a href="#" className="text-link no-underline hover:underline">R.İ.</a>
              </p>
            </div>
          </div>

          <div className="mb-2 border border-border bg-surface">
            <div className="border-b border-border bg-cat-bar px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Son Duyurular
            </div>
            <div className="px-2 py-1">
              {ANNOUNCEMENTS.map((item) => (
                <div
                  key={item.title}
                  className="border-b border-border-light py-1.5 last:border-b-0"
                >
                  <a
                    href="#"
                    className="block text-[11px] font-bold leading-snug text-text no-underline hover:underline"
                  >
                    {item.title}
                    {item.isNew && <span className="badge-new">Yeni</span>}
                  </a>
                  <div className="text-[10px] text-muted">{item.date}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-2 border border-border bg-surface">
            <div className="border-b border-border bg-cat-bar px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Son Belgeler
            </div>
            <div className="px-2 py-1">
              {DOCUMENTS.map((doc) => (
                <div
                  key={doc.title}
                  className="border-b border-border-light py-1.5 last:border-b-0"
                >
                  <a
                    href="#"
                    className="block text-[11px] font-bold text-text no-underline hover:underline"
                  >
                    {doc.title}
                    {doc.isNew && <span className="badge-new">Yeni</span>}
                  </a>
                  <div className="text-[10px] text-muted">{doc.meta}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-border bg-surface">
            <div className="border-b border-border bg-cat-bar px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Cevap Bekleyen Sorular
            </div>
            <div className="px-2 py-1">
              {RECENT_QUESTIONS.map((q) => (
                <div
                  key={q}
                  className="border-b border-border-light py-1 last:border-b-0"
                >
                  <a href="#" className="text-[11px] text-link no-underline hover:underline">
                    {q}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="mx-auto max-w-[1280px] px-3 pb-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border border-border bg-surface px-2 py-1.5 text-[11px]">
          <span>
            <b className="text-navy">842</b> yayımlanmış soru
          </span>
          <span className="text-border">|</span>
          <span>
            <b className="text-navy">1.956</b> müfettiş cevabı
          </span>
          <span className="text-border">|</span>
          <span>
            <b className="text-navy">38</b> doğrulanmış müfettiş
          </span>
          <span className="text-border">|</span>
          <span>
            Son soru:{" "}
            <a href="#" className="font-bold text-link no-underline hover:underline">
              KKD denetiminde uygunluk kriterleri
            </a>
          </span>
          <span className="text-border">|</span>
          <span>
            <span className="mr-1 inline-block h-1.5 w-1.5 bg-online" />
            <b className="text-navy">12</b> çevrimiçi
          </span>
        </div>
      </div>

      <footer className="border-t border-[#1a2840] bg-navy px-3 py-2 text-center text-[10px] text-[#8a9bb0]">
        <p>© 2026 Teknik İşmüfettişleri Derneği — Kütük No: 06/161/039 — Ankara</p>
        <p className="mt-1">
          {["Ana Sayfa", "Gizlilik", "KVKK", "İletişim"].map((label) => (
            <a
              key={label}
              href="#"
              className="mx-2 text-[#b0bcc8] no-underline hover:underline"
            >
              {label}
            </a>
          ))}
        </p>
      </footer>
    </>
  );
}
