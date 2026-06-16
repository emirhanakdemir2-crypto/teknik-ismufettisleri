import Link from "next/link";
import type { ReactNode } from "react";

import type { CurrentUser } from "@/lib/auth/get-current-user";
import { getRoleLabel } from "@/lib/auth/role-labels";

type AdminPanelShellProps = {
  title: string;
  description?: string;
  user: CurrentUser;
  children: ReactNode;
  activePath?: "/admin" | "/admin/questions";
};

const NAV_ITEMS = [
  { href: "/admin" as const, label: "Özet" },
  { href: "/admin/questions" as const, label: "Moderasyon kuyruğu" },
];

export function AdminPanelShell({
  title,
  description,
  user,
  children,
  activePath,
}: AdminPanelShellProps) {
  return (
    <div className="admin-shell admin-shell--live">
      <div className="admin-shell__layout">
        <aside className="admin-shell__sidebar" aria-label="Yönetim menüsü">
          <p className="admin-shell__sidebar-title">Yönetim</p>
          <ul className="admin-shell__nav">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`admin-shell__nav-item admin-shell__nav-link ${
                    activePath === item.href ? "admin-shell__nav-item--active" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="admin-shell__user-meta">
            {user.displayName ?? user.email}
            <span className="block text-[10px] font-normal text-muted">
              {getRoleLabel(user.role)}
            </span>
          </p>
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
