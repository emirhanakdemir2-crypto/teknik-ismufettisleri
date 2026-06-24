import type { Metadata } from "next";

import { GeneralAssembly2026Detail } from "@/components/announcements/general-assembly-2026-detail";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { GENERAL_ASSEMBLY_2026 } from "@/lib/announcements/general-assembly-2026";

export const metadata: Metadata = {
  title: GENERAL_ASSEMBLY_2026.title,
  description: GENERAL_ASSEMBLY_2026.summary,
};

export default function GeneralAssembly2026Page() {
  return (
    <div className="site-container page-stack page-stack--narrow">
      <PageBreadcrumb
        items={[
          { label: "Ana sayfa", href: "/" },
          { label: GENERAL_ASSEMBLY_2026.title },
        ]}
      />

      <PageHeader
        eyebrow="Duyuru"
        title={GENERAL_ASSEMBLY_2026.title}
        description="Teknik İşmüfettişleri Derneği Olağan Genel Kurul toplantısı ile ilgili resmi duyuru metni."
      />

      <GeneralAssembly2026Detail />
    </div>
  );
}
