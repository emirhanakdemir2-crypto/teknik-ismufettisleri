"use client";

import { useActionState } from "react";

import {
  createAnswerFormAction,
  type AnswerActionState,
} from "@/app/inspector/actions";

const initialState: AnswerActionState = {};

type AnswerFormProps = {
  questionId: string;
};

export function AnswerForm({ questionId }: AnswerFormProps) {
  const [state, formAction, isPending] = useActionState(
    createAnswerFormAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="questionId" value={questionId} />
      <div>
        <label htmlFor="answer-body" className="form-label">
          Müfettiş cevabı
        </label>
        <textarea
          id="answer-body"
          name="body"
          required
          minLength={20}
          maxLength={10000}
          rows={8}
          className="form-input w-full resize-y text-[12px]"
          placeholder="Mesleki görüşünüzü yazın (en az 20 karakter)."
        />
      </div>
      <button type="submit" disabled={isPending} className="btn btn-primary">
        {isPending ? "Gönderiliyor…" : "Cevabı yayımla"}
      </button>
      {state.error && <p className="alert alert-error text-[11px]">{state.error}</p>}
      {state.success && <p className="alert alert-info text-[11px]">{state.success}</p>}
    </form>
  );
}
