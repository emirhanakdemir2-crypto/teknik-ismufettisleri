"use server";

import { redirect } from "next/navigation";

import { mapAuthError } from "@/lib/auth/errors";
import { buildInspectorApplicationMetadata } from "@/lib/inspector/application-metadata";
import { loginSchema, registerSchema } from "@/lib/schemas/auth";
import { inspectorRegisterSchema } from "@/lib/schemas/inspector-application";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
};

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz giriş bilgileri." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: mapAuthError(error) };
  }

  const nextRaw = formData.get("next");
  const nextPath =
    typeof nextRaw === "string" && nextRaw.startsWith("/") && !nextRaw.startsWith("//")
      ? nextRaw
      : "/account";

  redirect(nextPath);
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz kayıt bilgileri." };
  }

  const { displayName, email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    return { error: mapAuthError(error) };
  }

  if (data.user && data.session) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", data.user.id);

    if (profileError) {
      return {
        error:
          "Hesap oluşturuldu ancak profil bilgisi kaydedilemedi. Lütfen hesap sayfasından tekrar deneyin.",
      };
    }

    redirect("/account");
  }

  redirect("/login?notice=email-confirmation");
}

export async function signUpInspector(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = inspectorRegisterSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
    organization: formData.get("organization"),
    applicationNote: formData.get("applicationNote"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz başvuru bilgileri." };
  }

  const { displayName, email, password, organization, applicationNote } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        ...buildInspectorApplicationMetadata({
          organization,
          applicationNote,
        }),
      },
    },
  });

  if (error) {
    return { error: mapAuthError(error) };
  }

  if (data.user && data.session) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", data.user.id);

    if (profileError) {
      return {
        error:
          "Hesap oluşturuldu ancak profil bilgisi kaydedilemedi. Lütfen hesap sayfasından tekrar deneyin.",
      };
    }

    redirect("/inspector/apply?notice=application-received");
  }

  redirect(
    "/login?notice=inspector-email-confirmation&next=" +
      encodeURIComponent("/inspector/apply"),
  );
}
