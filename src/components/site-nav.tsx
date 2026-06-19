"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavMatch = "exact" | "path" | "prefix" | "hash";

export type NavItem = {
  href: string;
  label: string;
  match: NavMatch;
};

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
  items: NavItem[];
  variant?: "bar" | "compact" | "inline";
};

export function SiteNav({ items, variant = "bar" }: SiteNavProps) {
  const pathname = usePathname();

  if (variant === "compact") {
    return (
      <nav aria-label="Ana menü" className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="site-nav__compact-link"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  if (variant === "inline") {
    return (
      <nav aria-label="Ana menü" className="site-header__nav">
        <ul className="site-header__nav-list">
          {items.map((item) => {
            const active = isActive(pathname, item.href, item.match);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`site-header__nav-link ${active ? "site-header__nav-link--active" : ""}`}
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

  return (
    <nav aria-label="Ana menü" className="site-nav">
      <ul className="site-nav__list">
        {items.map((item) => {
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
