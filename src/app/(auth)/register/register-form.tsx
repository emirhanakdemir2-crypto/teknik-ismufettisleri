"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signUp, type AuthActionState } from "@/app/(auth)/actions";
import { AuthCard } from "@/components/auth-card";

const initialState: AuthActionState = {};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  return (
    <AuthCard
      title="Kayıt Ol"
      subtitle="Vatandaş olarak kayıt olun. Mesleki cevap veya moderasyon yetkisi otomatik verilmez."
      footer={
        <>
          Zaten hesabınız var mı?{" "}
          <Link href="/login" className="font-bold text-link no-underline hover:underline">
            Giriş yapın
          </Link>
        </>
      }
    >
      {state.error && <p className="alert alert-error mb-4">{state.error}</p>}

      <form action={formAction} className="flex flex-col gap-4">
        <div className="form-field">
          <label htmlFor="displayName" className="form-label">
            Görünen ad
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            className="form-input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="email" className="form-label">
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="form-input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="password" className="form-label">
            Şifre
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className="form-input"
          />
          <p className="form-hint">En az 6 karakter.</p>
        </div>

        <button type="submit" disabled={isPending} className="btn btn-primary btn-block">
          {isPending ? "Kayıt yapılıyor…" : "Kayıt Ol"}
        </button>
      </form>
    </AuthCard>
  );
}
