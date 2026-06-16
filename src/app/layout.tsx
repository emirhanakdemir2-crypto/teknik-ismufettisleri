import type { Metadata } from "next";

import { SiteShell } from "@/components/site-shell";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Müfettişe Sor",
    template: "%s | Müfettişe Sor",
  },
  description:
    "İş sağlığı, güvenliği ve çalışma hayatına dair uzman soru-cevap platformu. Sorular moderasyon sonrası yayımlanır; cevaplar doğrulanmış müfettişlerden gelir.",
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
