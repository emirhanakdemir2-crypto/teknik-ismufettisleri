import { redirect } from "next/navigation";

import { getCurrentUser, type CurrentUser } from "@/lib/auth/get-current-user";
import { canModerateQuestions } from "@/lib/auth/roles";

export type ModeratorAccessResult =
  | { allowed: true; user: CurrentUser }
  | { allowed: false; reason: "login" | "forbidden" };

export async function getModeratorAccess(): Promise<ModeratorAccessResult> {
  const user = await getCurrentUser();

  if (!user) {
    return { allowed: false, reason: "login" };
  }

  if (!canModerateQuestions(user.role)) {
    return { allowed: false, reason: "forbidden" };
  }

  return { allowed: true, user };
}

export async function requireModeratorAccess(): Promise<CurrentUser> {
  const access = await getModeratorAccess();

  if (!access.allowed && access.reason === "login") {
    redirect("/login");
  }

  if (!access.allowed) {
    throw new Error("FORBIDDEN");
  }

  return access.user;
}
