import { AdminShell } from "@/components/admin/admin-shell";
import { ForumTable } from "@/components/ui/forum-table";
import { StatusBadge } from "@/components/ui/status-badge";

const MOCK_QUEUE = [
  {
    id: "mock-1",
    title: "Yüksekte çalışmada emniyet kemeri periyodu",
    category: "KKD",
    submittedAt: "12.06.2026",
    status: "pending_review" as const,
  },
  {
    id: "mock-2",
    title: "Risk değerlendirme yenileme süresi",
    category: "Genel İSG",
    submittedAt: "11.06.2026",
    status: "revision_requested" as const,
  },
  {
    id: "mock-3",
    title: "İş kazası bildiriminde süre aşımı",
    category: "İş Kazaları",
    submittedAt: "10.06.2026",
    status: "pending_review" as const,
  },
];

export function ModerationQueueMock() {
  return (
    <AdminShell
      title="Moderasyon Kuyruğu"
      description="Django Admin liste + Discourse bekleyen içerik mantığına esinlenilmiş taslak görünüm."
    >
      <div className="admin-filters" aria-hidden="true">
        <span className="admin-filters__chip admin-filters__chip--active">İncelemede</span>
        <span className="admin-filters__chip">Düzenleme istendi</span>
        <span className="admin-filters__chip">Tümü</span>
      </div>

      <div className="admin-table-wrap">
        <ForumTable responsive className="mb-0 border-0">
          <thead>
            <tr>
              <th>Başlık</th>
              <th>Kategori</th>
              <th className="last">Gönderim</th>
              <th>Durum</th>
              <th className="num">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_QUEUE.map((item) => (
              <tr key={item.id}>
                <td className="text-[12px] font-bold text-text">{item.title}</td>
                <td className="text-[11px] text-muted">{item.category}</td>
                <td className="last text-right text-[11px] text-muted">
                  {item.submittedAt}
                </td>
                <td>
                  <StatusBadge kind="question" status={item.status} />
                </td>
                <td className="num">
                  <span className="admin-action-link">İncele</span>
                </td>
              </tr>
            ))}
          </tbody>
        </ForumTable>
      </div>

      <p className="mt-3 text-[10px] text-muted">
        Örnek veriler gösterilir. Onay, red ve düzenleme isteği işlemleri henüz
        bağlanmamıştır.
      </p>
    </AdminShell>
  );
}
