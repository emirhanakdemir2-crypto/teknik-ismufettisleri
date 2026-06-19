"use client";

import { useActionState, useState, type FormEvent } from "react";

import {
  publishQuestionFormAction,
  rejectQuestion,
  type ModerationActionState,
} from "@/app/admin/actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTR } from "@/lib/format/date";
import type { PendingQuestionItem } from "@/lib/admin/queries";

const initialState: ModerationActionState = {};
const MIN_REJECTION_LENGTH = 5;
const REJECTION_HINT =
  "Red işlemi için en az 5 karakterlik gerekçe girilmelidir.";

type ModerationQueueCardProps = {
  question: PendingQuestionItem;
};

function RejectForm({ questionId }: { questionId: string }) {
  const [state, formAction, isPending] = useActionState(rejectQuestion, initialState);
  const [clientError, setClientError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const note = String(formData.get("moderationNote") ?? "").trim();

    if (note.length < MIN_REJECTION_LENGTH) {
      event.preventDefault();
      setClientError(REJECTION_HINT);
      return;
    }

    setClientError(null);
  }

  return (
    <form
      action={formAction}
      noValidate
      onSubmit={handleSubmit}
      className="moderation-card__reject-form"
    >
      <input type="hidden" name="questionId" value={questionId} />
      <label htmlFor={`reject-note-${questionId}`} className="form-label">
        Red gerekçesi
      </label>
      <textarea
        id={`reject-note-${questionId}`}
        name="moderationNote"
        rows={3}
        maxLength={500}
        placeholder="Red gerekçesini kısaca yazın"
        className="form-input form-textarea moderation-card__reject-input"
      />
      <p className="form-hint moderation-card__reject-hint">{REJECTION_HINT}</p>
      {clientError && <p className="alert alert-error moderation-card__alert">{clientError}</p>}
      {state.error && <p className="alert alert-error moderation-card__alert">{state.error}</p>}
      {state.success && <p className="alert alert-info moderation-card__alert">{state.success}</p>}
      <button type="submit" disabled={isPending} className="btn btn-secondary moderation-card__reject-btn">
        {isPending ? "Reddediliyor…" : "Reddet"}
      </button>
    </form>
  );
}

function PublishForm({ questionId }: { questionId: string }) {
  const [state, formAction, isPending] = useActionState(
    publishQuestionFormAction,
    initialState,
  );

  return (
    <form action={formAction} className="moderation-card__publish-form">
      <input type="hidden" name="questionId" value={questionId} />
      <button type="submit" disabled={isPending} className="btn btn-primary moderation-card__publish-btn">
        {isPending ? "Yayımlanıyor…" : "Yayınla"}
      </button>
      {state.error && <p className="alert alert-error moderation-card__alert">{state.error}</p>}
      {state.success && <p className="alert alert-info moderation-card__alert">{state.success}</p>}
    </form>
  );
}

export function ModerationQueueCard({ question }: ModerationQueueCardProps) {
  return (
    <article className="moderation-card">
      <div className="moderation-card__content">
        <div className="moderation-card__head">
          <h3 className="moderation-card__title">{question.title}</h3>
          <StatusBadge kind="question" status="pending_review" />
        </div>

        <p className="moderation-card__body">{question.body}</p>

        <dl className="moderation-card__meta">
          <div className="moderation-card__meta-row">
            <dt>Kategori</dt>
            <dd>{question.categoryTitle ?? "—"}</dd>
          </div>
          <div className="moderation-card__meta-row">
            <dt>Yazar</dt>
            <dd>{question.authorDisplayName ?? "Kayıtlı kullanıcı"}</dd>
          </div>
          <div className="moderation-card__meta-row">
            <dt>Gönderim</dt>
            <dd>{formatDateTR(question.createdAt)}</dd>
          </div>
        </dl>
      </div>

      <div className="moderation-card__actions">
        <p className="moderation-card__actions-title">Moderasyon işlemi</p>
        <PublishForm questionId={question.id} />
        <RejectForm questionId={question.id} />
      </div>
    </article>
  );
}
