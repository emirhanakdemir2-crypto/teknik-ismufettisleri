"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavMatch = "exact" | "path" | "prefix" | "hash";

export type NavItem = {
  href: string;
  label: string;
  match: NavMatch;
};

const PUBLIC_NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Ana Sayfa", match: "exact" },
  { href: "/questions", label: "Sorular", match: "prefix" },
  { href: "/ask", label: "Soru Sor", match: "path" },
];

const GUEST_NAV_ITEMS: NavItem[] = [
  { href: "/login", label: "Giriş", match: "path" },
  { href: "/register", label: "Kayıt", match: "path" },
];

const AUTH_NAV_ITEMS: NavItem[] = [{ href: "/account", label: "Hesabım", match: "path" }];

function isActive(pathname: string, href: string, match: NavMatch): boolean {
  if (match === "exact") {
    return pathname === href;
  }

  if (match === "prefix") {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  if (match === "path") {
    return pathname === href;
  }

  return pathname === "/";
}

type SiteNavProps = {
  isAuthenticated?: boolean;
  roleNavItems?: NavItem[];
  variant?: "bar" | "compact";
};

export function SiteNav({
  isAuthenticated = false,
  roleNavItems = [],
  variant = "bar",
}: SiteNavProps) {
  const pathname = usePathname();
  const navItems = [
    ...PUBLIC_NAV_ITEMS,
    ...roleNavItems,
    ...(isAuthenticated ? AUTH_NAV_ITEMS : GUEST_NAV_ITEMS),
  ];

  if (variant === "compact") {
    return (
      <nav aria-label="Ana menü" className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-[11px] text-[#c0cad6] no-underline hover:text-white hover:underline"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav aria-label="Ana menü" className="site-nav">
      <ul className="site-nav__list">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href, item.match);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`site-nav__link ${active ? "site-nav__link--active" : ""}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
