"use server";

import { redirect } from "next/navigation";

import { mapAuthError } from "@/lib/auth/errors";
import { loginSchema, registerSchema } from "@/lib/schemas/auth";
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

  redirect("/account");
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
