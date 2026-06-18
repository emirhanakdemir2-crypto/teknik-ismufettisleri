import { createClient } from "@/lib/supabase/server";
import { isUserRole, type UserRole } from "@/lib/auth/roles";
import {
  readInspectorApplicationMetadata,
  type InspectorApplicationMetadata,
} from "@/lib/inspector/application-metadata";

export type CurrentUser = {
  id: string;
  email: string;
  displayName: string | null;
  role: UserRole | null;
  createdAt: string | null;
  inspectorApplication: InspectorApplicationMetadata;
};

function readDisplayNameFromMetadata(
  metadata: Record<string, unknown> | undefined,
): string | null {
  const value = metadata?.display_name;
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const role =
    profile?.role && isUserRole(profile.role) ? profile.role : null;

  const displayName =
    profile?.display_name?.trim() ||
    readDisplayNameFromMetadata(user.user_metadata) ||
    null;

  return {
    id: user.id,
    email: user.email,
    displayName,
    role,
    createdAt: profile?.created_at ?? null,
    inspectorApplication: readInspectorApplicationMetadata(user.user_metadata),
  };
}
