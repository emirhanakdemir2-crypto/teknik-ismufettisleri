"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { mapAuthError } from "@/lib/auth/errors";
import { createInspectorApplicationForUser } from "@/lib/inspector/create-application";
import { resolveInspectorApplyView } from "@/lib/inspector/apply-state";
import { inspectorApplySchema } from "@/lib/schemas/inspector-application";
import { createClient } from "@/lib/supabase/server";

export type InspectorApplyActionState = {
  error?: string;
  success?: string;
};

export async function submitInspectorApplication(
  _prevState: InspectorApplyActionState,
  formData: FormData,
): Promise<InspectorApplyActionState> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=" + encodeURIComponent("/inspector/apply"));
  }

  const view = resolveInspectorApplyView(
    user.role,
    user.inspectorApplication,
    user.inspectorApplicationRecord,
  );

  if (view !== "form" && view !== "complete_metadata") {
    return { error: "Bu hesap için yeni müfettiş başvurusu gönderilemez." };
  }

  const parsed = inspectorApplySchema.safeParse({
    organization: formData.get("organization"),
    applicationNote: formData.get("applicationNote"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Geçersiz başvuru bilgileri.",
    };
  }

  const applicationResult = await createInspectorApplicationForUser(
    user.id,
    user.role,
    {
      organizationOrTitle: parsed.data.organization,
      applicationNote: parsed.data.applicationNote,
    },
  );

  if (applicationResult.error) {
    return { error: applicationResult.error };
  }

  const supabase = await createClient();
  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      inspector_application_status: "submitted",
      inspector_organization: parsed.data.organization,
      inspector_application_note: parsed.data.applicationNote,
      inspector_application_submitted_at: new Date().toISOString(),
    },
  });

  if (metadataError) {
    return { error: mapAuthError(metadataError) };
  }

  revalidatePath("/inspector/apply");
  revalidatePath("/account");
  redirect("/inspector/apply?notice=application-received");
}
