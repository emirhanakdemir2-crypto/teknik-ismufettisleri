import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

function mapReviewError(): string {
  return "Başvuru güncellenemedi. Lütfen tekrar deneyin.";
}

export async function approveInspectorApplication(
  applicationId: string,
  reviewerId: string,
  reviewNote?: string | null,
): Promise<{ error?: string }> {
  const admin = createAdminClient();
  const reviewedAt = new Date().toISOString();

  const { data: application, error: fetchError } = await admin
    .from("inspector_applications")
    .select("id, user_id, status")
    .eq("id", applicationId)
    .maybeSingle();

  if (fetchError || !application) {
    return { error: "Başvuru bulunamadı." };
  }

  if (application.status !== "pending") {
    return { error: "Yalnızca incelemede olan başvurular onaylanabilir." };
  }

  const { error: applicationError } = await admin
    .from("inspector_applications")
    .update({
      status: "approved",
      reviewed_by: reviewerId,
      reviewed_at: reviewedAt,
      review_note: reviewNote?.trim() || null,
      rejection_reason: null,
    })
    .eq("id", applicationId)
    .eq("status", "pending");

  if (applicationError) {
    return { error: mapReviewError() };
  }

  const { error: roleError } = await admin
    .from("profiles")
    .update({ role: "verified_inspector" })
    .eq("id", application.user_id);

  if (roleError) {
    return { error: "Başvuru onaylandı ancak rol güncellenemedi. Lütfen destek ile iletişime geçin." };
  }

  return {};
}

export async function rejectInspectorApplication(
  applicationId: string,
  reviewerId: string,
  rejectionReason: string,
): Promise<{ error?: string }> {
  const admin = createAdminClient();
  const reviewedAt = new Date().toISOString();
  const trimmedReason = rejectionReason.trim();

  const { data: application, error: fetchError } = await admin
    .from("inspector_applications")
    .select("id, user_id, status")
    .eq("id", applicationId)
    .maybeSingle();

  if (fetchError || !application) {
    return { error: "Başvuru bulunamadı." };
  }

  if (application.status !== "pending") {
    return { error: "Yalnızca incelemede olan başvurular reddedilebilir." };
  }

  const { error: applicationError } = await admin
    .from("inspector_applications")
    .update({
      status: "rejected",
      reviewed_by: reviewerId,
      reviewed_at: reviewedAt,
      rejection_reason: trimmedReason,
      review_note: trimmedReason,
    })
    .eq("id", applicationId)
    .eq("status", "pending");

  if (applicationError) {
    return { error: mapReviewError() };
  }

  const { error: roleError } = await admin
    .from("profiles")
    .update({ role: "citizen" })
    .eq("id", application.user_id);

  if (roleError) {
    return { error: "Başvuru reddedildi ancak rol güncellenemedi. Lütfen destek ile iletişime geçin." };
  }

  return {};
}
