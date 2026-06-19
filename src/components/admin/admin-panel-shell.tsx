import Link from "next/link";
import type { ReactNode } from "react";

import type { CurrentUser } from "@/lib/auth/get-current-user";
import { getRoleLabel } from "@/lib/auth/role-labels";
import { canReviewInspectorApplications } from "@/lib/auth/roles";

export type AdminNavPath =
  | "/admin"
  | "/admin/questions"
  | "/admin/inspector-applications";

type AdminNavItem = {
  href: AdminNavPath | "/questions";
  label: string;
  external?: boolean;
};

type AdminPanelShellProps = {
  title: string;
  description?: string;
  user: CurrentUser;
  children: ReactNode;
  activePath?: AdminNavPath;
  pendingApplications?: number;
};

function buildAdminNavItems(user: CurrentUser): AdminNavItem[] {
  const items: AdminNavItem[] = [
    { href: "/admin", label: "Özet" },
    { href: "/admin/questions", label: "Moderasyon Kuyruğu" },
  ];

  if (canReviewInspectorApplications(user.role)) {
    items.push({ href: "/admin/inspector-applications", label: "Müfettiş Başvuruları" });
  }

  items.push({ href: "/questions", label: "Yayındaki Sorular", external: true });

  return items;
}

export function AdminPanelShell({
  title,
  description,
  user,
  children,
  activePath,
  pendingApplications = 0,
}: AdminPanelShellProps) {
  const navItems = buildAdminNavItems(user);

  return (
    <div className="admin-shell admin-shell--live">
      <div className="admin-shell__layout">
        <aside className="admin-shell__sidebar" aria-label="Yönetim menüsü">
          <p className="admin-shell__sidebar-title">Yönetim</p>
          <ul className="admin-shell__nav">
            {navItems.map((item) => {
              const isActive = !item.external && activePath === item.href;
              const showBadge =
                item.href === "/admin/inspector-applications" && pendingApplications > 0;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`admin-shell__nav-item admin-shell__nav-link ${
                      isActive ? "admin-shell__nav-item--active" : ""
                    } ${item.external ? "admin-shell__nav-link--external" : ""}`}
                  >
                    <span>{item.label}</span>
                    {showBadge && (
                      <span className="admin-shell__nav-badge">{pendingApplications}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div
            className="admin-shell__user-meta"
            title={user.identity.usesEmailFallback ? user.email : undefined}
          >
            <span className="admin-shell__user-name">{user.identity.primaryName}</span>
            <span className="admin-shell__user-role">{getRoleLabel(user.role)}</span>
          </div>
        </aside>

        <section className="admin-shell__content">
          <header className="admin-shell__header">
            <h1 className="admin-shell__title">{title}</h1>
            {description && <p className="admin-shell__description">{description}</p>}
          </header>
          {children}
        </section>
      </div>
    </div>
  );
}
