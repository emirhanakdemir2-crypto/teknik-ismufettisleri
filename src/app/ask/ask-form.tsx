"use client";

import { useActionState } from "react";

import { submitQuestion, type AskActionState } from "@/app/ask/actions";
import { AuthCard } from "@/components/auth-card";
import type { ActiveCategory } from "@/lib/questions/queries";

const initialState: AskActionState = {};

type AskFormProps = {
  categories: ActiveCategory[];
};

export function AskForm({ categories }: AskFormProps) {
  const [state, formAction, isPending] = useActionState(submitQuestion, initialState);

  if (categories.length === 0) {
    return (
      <AuthCard
        title="Soru Sor"
        subtitle="Soru göndermek için önce sistemde en az bir aktif kategori tanımlanmalıdır."
      >
        <div className="empty-state">
          <p className="empty-state__title">Kategori bulunamadı</p>
          <p className="empty-state__text">
            Yönetici henüz soru kategorisi eklememiş. Lütfen daha sonra tekrar
            deneyin veya dernek ile iletişime geçin.
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Soru Sor"
      subtitle="Sorunuz moderasyon kuyruğuna alınır. Onaylanmadan yayımlanmaz. Mesleki cevap yazma yetkisi otomatik verilmez."
    >
      {state.success && <p className="alert alert-info mb-4">{state.success}</p>}

      {state.error && <p className="alert alert-error mb-4">{state.error}</p>}

      {!state.success && (
        <form action={formAction} className="flex flex-col gap-4">
          <div className="form-field">
            <label htmlFor="categoryId" className="form-label">
              Kategori
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              className="form-input"
              defaultValue=""
            >
              <option value="" disabled>
                Kategori seçin
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="title" className="form-label">
              Başlık
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              minLength={10}
              maxLength={200}
              className="form-input"
              placeholder="Sorunuzu kısa ve net bir başlıkla özetleyin"
            />
            <p className="form-hint">10–200 karakter.</p>
          </div>

          <div className="form-field">
            <label htmlFor="body" className="form-label">
              Soru metni
            </label>
            <textarea
              id="body"
              name="body"
              required
              minLength={20}
              rows={8}
              className="form-input resize-y"
              placeholder="Sorunuzu ayrıntılı ve anlaşılır şekilde yazın"
            />
            <p className="form-hint">En az 20 karakter. Kişisel veri paylaşmayın.</p>
          </div>

          <button type="submit" disabled={isPending} className="btn btn-primary btn-block">
            {isPending ? "Gönderiliyor…" : "Soruyu Gönder"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
