import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { CategoryIndexTable } from "@/components/categories/category-index-table";
import { EmptyState } from "@/components/ui/empty-state";
import { getCategoryIndexItems } from "@/lib/categories/queries";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategoryIndexItems();

  return (
    <div className="site-container page-stack pb-8">
      <PageBreadcrumb
        items={[
          { label: "Ana sayfa", href: "/" },
          { label: "Kategoriler" },
        ]}
      />

      <PageHeader
        title="Soru Kategorileri"
        description="İş sağlığı ve güvenliği konularına göre yayımlanmış soruları kategori bazında inceleyin."
      />

      {categories.length === 0 ? (
        <EmptyState
          title="Kategori bulunamadı"
          description="Aktif kategori listesi yüklenemedi veya henüz tanımlı kategori yok."
        />
      ) : (
        <CategoryIndexTable categories={categories} />
      )}
    </div>
  );
}
