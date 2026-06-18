"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signUpInspector, type AuthActionState } from "@/app/(auth)/actions";
import { InspectorRegisterInfoPanel } from "@/app/(auth)/register/inspector/inspector-register-info-panel";
import { PageHeader } from "@/components/ui/page-header";

const initialState: AuthActionState = {};

export function InspectorRegisterForm() {
  const [state, formAction, isPending] = useActionState(signUpInspector, initialState);

  return (
    <div className="inspector-register-page">
      <PageHeader
        eyebrow="Teknik İşmüfettişleri Derneği"
        title="Müfettiş olarak kayıt ol"
        description="İş müfettişi veya yetkili uzman olarak başvuru yapın. Başvurular incelendikten sonra doğrulanmış müfettiş yetkisi verilir."
      />

      <div className="inspector-register-layout">
        <div className="inspector-register-form">
          <div className="auth-card inspector-register-form__card">
            <div className="auth-card__head">
              <h2 className="auth-card__title">Başvuru formu</h2>
              <p className="auth-card__subtitle">
                Hesap bilgilerinizi ve başvuru notunuzu eksiksiz doldurun.
              </p>
            </div>

            <div className="auth-card__body inspector-register-form__body">
              {state.error && <p className="alert alert-error mb-4">{state.error}</p>}

              <form action={formAction} className="inspector-register-form__fields">
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
                    rows={5}
                    className="form-input form-textarea"
                  />
                  <p className="form-hint">
                    Mesleki geçmişinizi ve başvuru gerekçenizi özetleyin.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="btn btn-primary btn-block inspector-register-form__submit"
                >
                  {isPending ? "Başvuru gönderiliyor…" : "Müfettiş başvurusu ile kayıt ol"}
                </button>
              </form>
            </div>
          </div>

          <p className="inspector-register-form__alt">
            Kayıtlı kullanıcı olarak mı üye olmak istiyorsunuz?{" "}
            <Link href="/register" className="text-link font-semibold no-underline hover:underline">
              Normal kayıt
            </Link>
            {" · "}
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="text-link font-semibold no-underline hover:underline">
              Giriş yapın
            </Link>
          </p>
        </div>

        <InspectorRegisterInfoPanel />
      </div>
    </div>
  );
}
