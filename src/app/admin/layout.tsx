import { redirect } from "next/navigation";

import { AdminAccessDenied } from "@/components/admin/admin-access-denied";
import { getModeratorAccess } from "@/lib/auth/require-moderator";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const access = await getModeratorAccess();

  if (!access.allowed && access.reason === "login") {
    redirect("/login");
  }

  if (!access.allowed) {
    return <AdminAccessDenied />;
  }

  return children;
}
