"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Ana Sayfa", match: "exact" as const },
  { href: "/#kategoriler", label: "Sorular", match: "hash" as const },
  { href: "/#soru-sor", label: "Soru Sor", match: "hash" as const },
  { href: "/login", label: "Giriş", match: "path" as const },
  { href: "/register", label: "Kayıt", match: "path" as const },
  { href: "/account", label: "Hesabım", match: "path" as const },
];

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
  variant?: "bar" | "compact";
};

export function SiteNav({ variant = "bar" }: SiteNavProps) {
  const pathname = usePathname();

  if (variant === "compact") {
    return (
      <nav aria-label="Ana menü" className="flex flex-wrap gap-2">
        {NAV_ITEMS.map((item) => (
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
        {NAV_ITEMS.map((item) => {
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
