import Link from "next/link";

export function HomeSidebar() {
  return (
    <aside className="home-sidebar" aria-label="Yardımcı bilgiler">
      <div className="sidebar-panel">
        <h2 className="sidebar-panel__title">Platform Kuralları</h2>
        <ul className="sidebar-panel__list">
          <li>Yayımlanmış soru ve cevaplar herkese açıktır.</li>
          <li>Yeni sorular moderasyon onayından sonra yayımlanır.</li>
          <li>Mesleki cevapları yalnızca doğrulanmış müfettişler yazar.</li>
          <li>Kişisel veri paylaşmayın.</li>
        </ul>
      </div>

      <div className="sidebar-panel">
        <h2 className="sidebar-panel__title">Hızlı Erişim</h2>
        <ul className="sidebar-panel__links">
          <li>
            <Link href="/ask">Soru Sor</Link>
          </li>
          <li>
            <Link href="/questions">Yayınlanan Sorular</Link>
          </li>
          <li>
            <Link href="/categories">Kategoriler</Link>
          </li>
          <li>
            <Link href="/login">Giriş Yap</Link>
          </li>
          <li>
            <Link href="/register">Kayıt Ol</Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-panel sidebar-panel--note">
        <p className="sidebar-panel__note">
          Cevaplar bilgilendirme amaçlıdır; nihai hukuki görüş veya bağlayıcı karar
          niteliği taşımaz.
        </p>
      </div>
    </aside>
  );
}
