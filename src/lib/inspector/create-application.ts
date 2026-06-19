import "server-only";

import type { UserRole } from "@/lib/auth/roles";
import { notifyInspectorApplicationPending } from "@/lib/notifications/events";
import { createAdminClient } from "@/lib/supabase/admin";

export type CreateInspectorApplicationInput = {
  organizationOrTitle: string;
  applicationNote: string;
};

const BLOCKED_APPLICANT_ROLES: UserRole[] = [
  "inspector_pending",
  "verified_inspector",
  "moderator",
  "admin",
];

function mapCreateError(message: string): string {
  if (message.includes("inspector_applications_one_pending_per_user_idx")) {
    return "Zaten incelemede bir müfettiş başvurunuz bulunuyor.";
  }

  return "Başvuru kaydedilemedi. Lütfen daha sonra tekrar deneyin.";
}

export async function createInspectorApplicationForUser(
  userId: string,
  role: UserRole | null,
  input: CreateInspectorApplicationInput,
): Promise<{ error?: string }> {
  if (!role || BLOCKED_APPLICANT_ROLES.includes(role)) {
    return { error: "Bu hesap için müfettiş başvurusu gönderilemez." };
  }

  const admin = createAdminClient();

  const { data: pendingApplication } = await admin
    .from("inspector_applications")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "pending")
    .maybeSingle();

  if (pendingApplication) {
    return { error: "Zaten incelemede bir müfettiş başvurunuz bulunuyor." };
  }

  const { data: application, error: insertError } = await admin
    .from("inspector_applications")
    .insert({
      user_id: userId,
      status: "pending",
      organization_or_title: input.organizationOrTitle,
      application_note: input.applicationNote,
      document_storage_path: null,
    })
    .select("id")
    .single();

  if (insertError || !application) {
    return {
      error: mapCreateError(insertError?.message ?? "Başvuru kaydedilemedi."),
    };
  }

  const { error: roleError } = await admin
    .from("profiles")
    .update({ role: "inspector_pending" })
    .eq("id", userId);

  if (roleError) {
    await admin
      .from("inspector_applications")
      .delete()
      .eq("user_id", userId)
      .eq("status", "pending");

    return { error: "Başvuru kaydedildi ancak rol güncellenemedi. Lütfen destek ile iletişime geçin." };
  }

  await notifyInspectorApplicationPending({ applicationId: application.id });

  return {};
}
