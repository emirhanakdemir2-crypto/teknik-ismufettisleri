import { redirect } from "next/navigation";

import { getCurrentUser, type CurrentUser } from "@/lib/auth/get-current-user";
import { canAnswerQuestion } from "@/lib/auth/roles";

export type InspectorAccessResult =
  | { allowed: true; user: CurrentUser }
  | { allowed: false; reason: "login" | "forbidden" };

export async function getInspectorAccess(): Promise<InspectorAccessResult> {
  const user = await getCurrentUser();

  if (!user) {
    return { allowed: false, reason: "login" };
  }

  if (!canAnswerQuestion(user.role)) {
    return { allowed: false, reason: "forbidden" };
  }

  return { allowed: true, user };
}

export async function requireInspectorAccess(): Promise<CurrentUser> {
  const access = await getInspectorAccess();

  if (!access.allowed && access.reason === "login") {
    redirect("/login");
  }

  if (!access.allowed) {
    throw new Error("FORBIDDEN");
  }

  return access.user;
}
