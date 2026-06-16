"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PUBLIC_NAV_ITEMS = [
  { href: "/", label: "Ana Sayfa", match: "exact" as const },
  { href: "/questions", label: "Sorular", match: "path" as const },
  { href: "/ask", label: "Soru Sor", match: "path" as const },
];

const GUEST_NAV_ITEMS = [
  { href: "/login", label: "Giriş", match: "path" as const },
  { href: "/register", label: "Kayıt", match: "path" as const },
];

const AUTH_NAV_ITEMS = [{ href: "/account", label: "Hesabım", match: "path" as const }];

function isActive(pathname: string, href: string, match: "exact" | "path" | "hash"): boolean {
  if (match === "exact") {
    return pathname === href;
  }

  if (match === "path") {
    return pathname === href;
  }

  return pathname === "/";
}

type SiteNavProps = {
  isAuthenticated?: boolean;
  variant?: "bar" | "compact";
};

export function SiteNav({ isAuthenticated = false, variant = "bar" }: SiteNavProps) {
  const pathname = usePathname();
  const navItems = [
    ...PUBLIC_NAV_ITEMS,
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
    <nav aria-label="Ana menü">
      <ul className="mx-auto flex max-w-[1280px] list-none overflow-x-auto px-3">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href, item.match);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block whitespace-nowrap px-3 py-2 text-[11px] no-underline transition-colors hover:bg-[var(--nav-hover)] hover:text-white hover:no-underline ${
                  active
                    ? "border-b-2 border-[var(--header-accent)] bg-[var(--nav-hover)] font-bold text-white"
                    : "text-[var(--nav-text)]"
                }`}
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
