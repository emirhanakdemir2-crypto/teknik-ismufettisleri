import { redirect } from "next/navigation";

import { InspectorAccessDenied } from "@/components/inspector/inspector-access-denied";
import { getInspectorAccess } from "@/lib/auth/require-inspector";

export default async function InspectorPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const access = await getInspectorAccess();

  if (!access.allowed && access.reason === "login") {
    redirect("/login");
  }

  if (!access.allowed) {
    return <InspectorAccessDenied />;
  }

  return children;
}
