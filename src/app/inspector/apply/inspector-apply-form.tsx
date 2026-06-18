"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  submitInspectorApplication,
  type InspectorApplyActionState,
} from "@/app/inspector/apply/actions";
import { AuthCard } from "@/components/auth-card";

const initialState: InspectorApplyActionState = {};

type InspectorApplyFormProps = {
  defaultOrganization?: string;
  defaultNote?: string;
};

export function InspectorApplyForm({
  defaultOrganization = "",
  defaultNote = "",
}: InspectorApplyFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitInspectorApplication,
    initialState,
  );

  return (
    <AuthCard title="Müfettiş başvurusu">
      {state.error && <p className="alert alert-error mb-4">{state.error}</p>}

      <form action={formAction} className="flex flex-col gap-4">
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
            defaultValue={defaultOrganization}
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
            defaultValue={defaultNote}
            className="form-input form-textarea"
          />
        </div>

        <button type="submit" disabled={isPending} className="btn btn-primary btn-block">
          {isPending ? "Gönderiliyor…" : "Başvuruyu gönder"}
        </button>
      </form>

      <p className="mt-4 text-[12px] text-[var(--muted)]">
        Henüz hesabınız yoksa{" "}
        <Link href="/register/inspector" className="text-link hover:underline">
          müfettiş olarak kayıt olun
        </Link>
        .
      </p>
    </AuthCard>
  );
}
