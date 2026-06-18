"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signIn, type AuthActionState } from "@/app/(auth)/actions";
import { AuthCard } from "@/components/auth-card";

const initialState: AuthActionState = {};

type LoginFormProps = {
  notice?: string | null;
  next?: string | null;
};

export function LoginForm({ notice, next }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <AuthCard
      title="Giriş Yap"
      subtitle="Kayıtlı hesabınızla platforma giriş yapın."
      footer={
        <>
          Hesabınız yok mu?{" "}
          <Link href="/register" className="font-bold text-link no-underline hover:underline">
            Kayıt olun
          </Link>
        </>
      }
    >
      {notice && <p className="alert alert-info mb-4">{notice}</p>}

      {state.error && <p className="alert alert-error mb-4">{state.error}</p>}

      <form action={formAction} className="flex flex-col gap-4">
        {next && <input type="hidden" name="next" value={next} />}
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
            autoComplete="current-password"
            required
            className="form-input"
          />
        </div>

        <button type="submit" disabled={isPending} className="btn btn-primary btn-block">
          {isPending ? "Giriş yapılıyor…" : "Giriş Yap"}
        </button>
      </form>
    </AuthCard>
  );
}
