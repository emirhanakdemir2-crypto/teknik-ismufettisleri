import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageBreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Konum">
      <ol className="breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="breadcrumb__item">
              {item.href && !isLast ? (
                <Link href={item.href} className="breadcrumb__link">
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumb__current" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
