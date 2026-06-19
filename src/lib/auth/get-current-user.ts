import { createClient } from "@/lib/supabase/server";
import { resolveUserDisplayName } from "@/lib/auth/display-name";
import { isUserRole, type UserRole } from "@/lib/auth/roles";
import {
  hasSubmittedInspectorApplication,
  readInspectorApplicationMetadata,
  type InspectorApplicationMetadata,
} from "@/lib/inspector/application-metadata";
import {
  getInspectorApplicationForUser,
  syncInspectorApplicationFromMetadata,
} from "@/lib/inspector/application-queries";
import type { InspectorApplicationRecord } from "@/lib/inspector/application-record";

export type CurrentUser = {
  id: string;
  email: string;
  displayName: string;
  role: UserRole | null;
  createdAt: string | null;
  inspectorApplication: InspectorApplicationMetadata;
  inspectorApplicationRecord: InspectorApplicationRecord | null;
};

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

  const displayName = resolveUserDisplayName(
    profile?.display_name,
    user.user_metadata,
    user.email,
  );

  const inspectorApplication = readInspectorApplicationMetadata(user.user_metadata);

  let inspectorApplicationRecord = await getInspectorApplicationForUser(user.id);

  if (!inspectorApplicationRecord && hasSubmittedInspectorApplication(inspectorApplication)) {
    inspectorApplicationRecord = await syncInspectorApplicationFromMetadata(
      user.id,
      role,
      inspectorApplication,
    );

    if (inspectorApplicationRecord) {
      const { data: refreshedProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const refreshedRole =
        refreshedProfile?.role && isUserRole(refreshedProfile.role)
          ? refreshedProfile.role
          : role;

      return {
        id: user.id,
        email: user.email,
        displayName,
        role: refreshedRole,
        createdAt: profile?.created_at ?? null,
        inspectorApplication,
        inspectorApplicationRecord,
      };
    }
  }

  return {
    id: user.id,
    email: user.email,
    displayName,
    role,
    createdAt: profile?.created_at ?? null,
    inspectorApplication,
    inspectorApplicationRecord,
  };
}
