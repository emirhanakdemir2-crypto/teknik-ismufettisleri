import Link from "next/link";

export function HomeSidebar() {
  return (
    <aside className="home-sidebar" aria-label="Yardımcı bilgeler">
      <div className="sidebar-panel">
        <h2 className="sidebar-panel__title">Platform Kuralları</h2>
        <ul className="sidebar-panel__list">
          <li>Yayımlanan soru ve cevaplar herkes tarafından görüntülenebilir.</li>
          <li>Sorular editör incelemesinden sonra yayımlanır.</li>
          <li>
            Mesleki değerlendirmeler yalnızca doğrulanmış müfettiş hesapları tarafından
            yapılır.
          </li>
          <li>
            Lütfen ad, telefon, T.C. kimlik numarası, açık adres ve işyeri adı gibi
            kişisel veya hassas bilgileri paylaşmayın.
          </li>
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
            <Link href="/register/inspector">Müfettiş Başvurusu</Link>
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
          Yayımlanan içerikler genel bilgilendirme amacı taşır; nihai hukuki görüş veya
          bağlayıcı karar niteliği taşımaz.
        </p>
      </div>
    </aside>
  );
}
