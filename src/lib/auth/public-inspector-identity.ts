import "server-only";

import { resolveProperDisplayName } from "@/lib/auth/display-name";
import { INSPECTOR_APPLICATION_METADATA_KEYS } from "@/lib/inspector/application-metadata";
import { createAdminClient } from "@/lib/supabase/admin";

export const PUBLIC_INSPECTOR_NAME_FALLBACK = "Müfettiş";

export type PublicInspectorIdentity = {
  displayName: string;
  professionalTitle: string | null;
};

function readMetadataString(
  metadata: Record<string, unknown> | undefined,
  key: string,
): string | null {
  const value = metadata?.[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function resolveProfessionalTitle(
  applicationOrganizationOrTitle: string | null | undefined,
  metadata: Record<string, unknown> | undefined,
): string | null {
  const fromApplication = applicationOrganizationOrTitle?.trim();
  if (fromApplication) {
    return fromApplication;
  }

  return (
    readMetadataString(metadata, INSPECTOR_APPLICATION_METADATA_KEYS.organization) ??
    readMetadataString(metadata, "organization") ??
    readMetadataString(metadata, "title") ??
    readMetadataString(metadata, "job_title") ??
    null
  );
}

export function resolvePublicInspectorIdentity(input: {
  profileDisplayName: string | null;
  metadata: Record<string, unknown> | undefined;
  applicationOrganizationOrTitle: string | null;
}): PublicInspectorIdentity {
  const displayName =
    resolveProperDisplayName(input.profileDisplayName, input.metadata) ??
    PUBLIC_INSPECTOR_NAME_FALLBACK;

  const professionalTitle = resolveProfessionalTitle(
    input.applicationOrganizationOrTitle,
    input.metadata,
  );

  return { displayName, professionalTitle };
}

export async function fetchPublicInspectorIdentities(
  userIds: string[],
): Promise<Map<string, PublicInspectorIdentity>> {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  const result = new Map<string, PublicInspectorIdentity>();

  if (uniqueIds.length === 0) {
    return result;
  }

  const admin = createAdminClient();

  const [profilesResult, applicationsResult] = await Promise.all([
    admin.from("profiles").select("id, display_name").in("id", uniqueIds),
    admin
      .from("inspector_applications")
      .select("user_id, organization_or_title, status, updated_at")
      .in("user_id", uniqueIds)
      .order("updated_at", { ascending: false }),
  ]);

  const profileMap = new Map<string, string | null>();
  for (const row of profilesResult.data ?? []) {
    profileMap.set(row.id, row.display_name);
  }

  const applicationOrgMap = new Map<string, string | null>();
  for (const row of applicationsResult.data ?? []) {
    const existing = applicationOrgMap.get(row.user_id);
    const org = row.organization_or_title?.trim() || null;

    if (row.status === "approved" && org) {
      applicationOrgMap.set(row.user_id, org);
      continue;
    }

    if (existing === undefined) {
      applicationOrgMap.set(row.user_id, org);
    }
  }

  const metadataMap = new Map<string, Record<string, unknown>>();
  await Promise.all(
    uniqueIds.map(async (userId) => {
      const { data, error } = await admin.auth.admin.getUserById(userId);

      if (!error && data.user?.user_metadata) {
        metadataMap.set(userId, data.user.user_metadata as Record<string, unknown>);
      }
    }),
  );

  for (const userId of uniqueIds) {
    result.set(
      userId,
      resolvePublicInspectorIdentity({
        profileDisplayName: profileMap.get(userId) ?? null,
        metadata: metadataMap.get(userId),
        applicationOrganizationOrTitle: applicationOrgMap.get(userId) ?? null,
      }),
    );
  }

  return result;
}
