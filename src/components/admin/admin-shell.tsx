import type { ReactNode } from "react";

type AdminShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  previewLabel?: string;
};

const ADMIN_NAV_ITEMS = [
  "Moderasyon kuyruğu",
  "Yayımlanan sorular",
  "Müfettiş başvuruları",
  "Audit kayıtları",
];

export function AdminShell({
  title,
  description,
  children,
  previewLabel = "Taslak önizleme",
}: AdminShellProps) {
  return (
    <div className="admin-shell">
      <div className="admin-shell__banner">
        <span className="admin-shell__preview-tag">{previewLabel}</span>
        <p className="admin-shell__banner-text">
          Bu alan yalnızca arayüz taslağıdır. Gerçek yönetim işlemleri ve veri
          erişimi sonraki sprintlerde eklenecektir.
        </p>
      </div>

      <div className="admin-shell__layout">
        <aside className="admin-shell__sidebar" aria-label="Admin menü taslağı">
          <p className="admin-shell__sidebar-title">Yönetim</p>
          <ul className="admin-shell__nav">
            {ADMIN_NAV_ITEMS.map((item, index) => (
              <li key={item}>
                <span
                  className={`admin-shell__nav-item ${
                    index === 0 ? "admin-shell__nav-item--active" : ""
                  }`}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </aside>

        <section className="admin-shell__content">
          <header className="admin-shell__header">
            <h2 className="admin-shell__title">{title}</h2>
            {description && <p className="admin-shell__description">{description}</p>}
          </header>
          {children}
        </section>
      </div>
    </div>
  );
}
