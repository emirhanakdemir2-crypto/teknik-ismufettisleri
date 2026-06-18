import Link from "next/link";

import { ForumTable } from "@/components/ui/forum-table";
import { formatDateTR } from "@/lib/format/date";
import type { CategoryIndexItem } from "@/lib/categories/queries";

type CategoryIndexTableProps = {
  categories: CategoryIndexItem[];
};

export function CategoryIndexTable({ categories }: CategoryIndexTableProps) {
  return (
    <ForumTable>
      <thead>
        <tr>
          <th>Kategori</th>
          <th className="num">Soru</th>
          <th className="num last">Son yayın</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <tr key={category.id}>
            <td>
              <Link
                href={`/categories/${category.slug}`}
                className="category-index__title text-link hover:underline"
              >
                {category.title}
              </Link>
              {category.description && (
                <p className="category-index__description">{category.description}</p>
              )}
            </td>
            <td className="num" data-label="Soru">
              {category.publishedCount}
            </td>
            <td className="num last" data-label="Son yayın">
              {formatDateTR(category.lastPublishedAt)}
            </td>
          </tr>
        ))}
      </tbody>
    </ForumTable>
  );
}
