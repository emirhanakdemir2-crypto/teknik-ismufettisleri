export function InspectorRegisterInfoPanel() {
  return (
    <aside className="application-info-panel" aria-label="Başvuru bilgilendirmesi">
      <section className="application-info-section">
        <h2 className="application-info-section__title">Kimler başvurabilir?</h2>
        <p className="application-info-section__body">
          İş müfettişleri ve İSG alanında mesleki yetkinliği bulunan uzmanlar başvuru
          yapabilir. Başvuru, platformda mesleki cevap vermek isteyen doğrulanmış
          müfettiş adayları içindir.
        </p>
      </section>

      <section className="application-info-section">
        <h2 className="application-info-section__title">Başvuru değerlendirme süreci</h2>
        <p className="application-info-section__body">
          Başvurunuz kayıt sonrası incelemeye alınır. Kurum/unvan ve başvuru notunuz
          değerlendirme için kullanılır. Süreç tamamlanana kadar hesabınız kayıtlı
          kullanıcı yetkileriyle devam eder.
        </p>
      </section>

      <section className="application-info-section">
        <h2 className="application-info-section__title">Onay sonrası yetkilendirme</h2>
        <p className="application-info-section__body">
          Onaylanan başvurular doğrulanmış müfettiş hesabına yükseltilir. Bu aşamadan
          sonra yayımlanmış sorulara mesleki cevap yazabilirsiniz; onay öncesinde cevap
          yetkisi verilmez.
        </p>
      </section>

      <section className="application-info-section application-info-section--muted">
        <h2 className="application-info-section__title">Kişisel veri ve belgeler</h2>
        <p className="application-info-section__body">
          Başvuru formunda yalnızca gerekli bilgiler istenir. Kimlik ve görev belgeleri
          ilerleyen aşamada ayrıca talep edilebilir; belgeler yalnızca yetkili
          inceleme için saklanır.
        </p>
      </section>
    </aside>
  );
}
