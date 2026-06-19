import { redirect } from "next/navigation";

import { getCurrentUser, type CurrentUser } from "@/lib/auth/get-current-user";
import { canReviewInspectorApplications } from "@/lib/auth/roles";

export type AdminAccessResult =
  | { allowed: true; user: CurrentUser }
  | { allowed: false; reason: "login" | "forbidden" };

export async function getAdminAccess(): Promise<AdminAccessResult> {
  const user = await getCurrentUser();

  if (!user) {
    return { allowed: false, reason: "login" };
  }

  if (!canReviewInspectorApplications(user.role)) {
    return { allowed: false, reason: "forbidden" };
  }

  return { allowed: true, user };
}

export async function requireAdminAccess(): Promise<CurrentUser> {
  const access = await getAdminAccess();

  if (!access.allowed && access.reason === "login") {
    redirect("/login");
  }

  if (!access.allowed) {
    throw new Error("FORBIDDEN");
  }

  return access.user;
}
