import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export type PendingInspectorApplicationItem = {
  id: string;
  userId: string;
  displayName: string | null;
  email: string;
  organizationOrTitle: string | null;
  applicationNote: string | null;
  createdAt: string;
};

export async function getPendingInspectorApplications(): Promise<
  PendingInspectorApplicationItem[]
> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("inspector_applications")
    .select(
      `
      id,
      user_id,
      organization_or_title,
      application_note,
      created_at,
      profiles!inspector_applications_user_id_fkey ( display_name )
    `,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  const items: PendingInspectorApplicationItem[] = [];

  for (const row of data) {
    const profileRaw = row.profiles as { display_name: string | null } | { display_name: string | null }[] | null;
    const profile = Array.isArray(profileRaw) ? profileRaw[0] ?? null : profileRaw;
    const { data: authData } = await admin.auth.admin.getUserById(row.user_id);
    const email = authData.user?.email ?? "—";

    items.push({
      id: row.id,
      userId: row.user_id,
      displayName: profile?.display_name ?? null,
      email,
      organizationOrTitle: row.organization_or_title,
      applicationNote: row.application_note,
      createdAt: row.created_at,
    });
  }

  return items;
}

export async function getPendingInspectorApplicationCount(): Promise<number> {
  const admin = createAdminClient();

  const { count, error } = await admin
    .from("inspector_applications")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) {
    return 0;
  }

  return count ?? 0;
}
