"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { mapAuthError } from "@/lib/auth/errors";
import {
  buildInspectorApplicationMetadata,
  hasSubmittedInspectorApplication,
} from "@/lib/inspector/application-metadata";
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

  const view = resolveInspectorApplyView(user.role, user.inspectorApplication);

  if (view !== "form") {
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

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login?next=" + encodeURIComponent("/inspector/apply"));
  }

  const existing = hasSubmittedInspectorApplication(
    user.inspectorApplication,
  );

  if (existing) {
    return { error: "Bu hesap için zaten bir müfettiş başvurusu bulunuyor." };
  }

  const { error } = await supabase.auth.updateUser({
    data: buildInspectorApplicationMetadata(parsed.data),
  });

  if (error) {
    return { error: mapAuthError(error) };
  }

  redirect("/inspector/apply?notice=application-received");
}
