"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signUpInspector, type AuthActionState } from "@/app/(auth)/actions";
import { AuthCard } from "@/components/auth-card";

const initialState: AuthActionState = {};

export function InspectorRegisterForm() {
  const [state, formAction, isPending] = useActionState(signUpInspector, initialState);

  return (
    <AuthCard
      title="Müfettiş olarak kayıt ol"
      subtitle="Bu alan, iş müfettişi veya yetkili uzman olarak başvuru yapmak isteyen kullanıcılar içindir. Başvurular incelendikten sonra doğrulanmış müfettiş yetkisi verilir."
      footer={
        <>
          Kayıtlı kullanıcı olarak mı üye olmak istiyorsunuz?{" "}
          <Link href="/register" className="font-bold text-link no-underline hover:underline">
            Normal kayıt
          </Link>
          {" · "}
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
            Ad soyad
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

        <div className="form-field">
          <label htmlFor="organization" className="form-label">
            Kurum / unvan
          </label>
          <input
            id="organization"
            name="organization"
            type="text"
            required
            maxLength={120}
            className="form-input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="applicationNote" className="form-label">
            Kısa başvuru notu
          </label>
          <textarea
            id="applicationNote"
            name="applicationNote"
            required
            minLength={20}
            maxLength={1000}
            rows={4}
            className="form-input form-textarea"
          />
          <p className="form-hint">Mesleki geçmişinizi ve başvuru gerekçenizi kısaca yazın.</p>
        </div>

        <button type="submit" disabled={isPending} className="btn btn-primary btn-block">
          {isPending ? "Başvuru gönderiliyor…" : "Müfettiş başvurusu ile kayıt ol"}
        </button>
      </form>
    </AuthCard>
  );
}
