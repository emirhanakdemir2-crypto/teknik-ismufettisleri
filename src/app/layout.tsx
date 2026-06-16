import type { Metadata } from "next";

import { SiteShell } from "@/components/site-shell";

import "./globals.css";

export const metadata: Metadata = {
  title: "Müfettişe Sor | Teknik İşmüfettişleri Derneği",
  description:
    "İş sağlığı ve güvenliği hakkında moderasyonlu soru-cevap platformu. Sorularınızı sorun; yanıtlar yalnızca doğrulanmış müfettişlerden gelir.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
