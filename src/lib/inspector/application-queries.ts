import "server-only";

import {
  APPLICANT_APPLICATION_COLUMNS,
  mapInspectorApplicationRow,
  type InspectorApplicationRecord,
} from "@/lib/inspector/application-record";
import {
  hasSubmittedInspectorApplication,
  type InspectorApplicationMetadata,
} from "@/lib/inspector/application-metadata";
import { createInspectorApplicationForUser } from "@/lib/inspector/create-application";
import type { UserRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

export async function getInspectorApplicationForUser(
  userId: string,
): Promise<InspectorApplicationRecord | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inspector_applications")
    .select(APPLICANT_APPLICATION_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapInspectorApplicationRow(data);
}

export async function syncInspectorApplicationFromMetadata(
  userId: string,
  role: UserRole | null,
  metadata: InspectorApplicationMetadata,
): Promise<InspectorApplicationRecord | null> {
  const existing = await getInspectorApplicationForUser(userId);

  if (existing) {
    return existing;
  }

  if (!hasSubmittedInspectorApplication(metadata)) {
    return null;
  }

  if (!metadata.organization || !metadata.note) {
    return null;
  }

  const result = await createInspectorApplicationForUser(userId, role, {
    organizationOrTitle: metadata.organization,
    applicationNote: metadata.note,
  });

  if (result.error) {
    return null;
  }

  return getInspectorApplicationForUser(userId);
}
