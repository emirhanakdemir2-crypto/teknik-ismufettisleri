"use client";

import { useActionState } from "react";

import {
  publishQuestionFormAction,
  rejectQuestion,
  type ModerationActionState,
} from "@/app/admin/actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTR } from "@/lib/format/date";
import type { PendingQuestionItem } from "@/lib/admin/queries";

const initialState: ModerationActionState = {};

type PendingQuestionRowProps = {
  question: PendingQuestionItem;
};

function RejectForm({ questionId }: { questionId: string }) {
  const [state, formAction, isPending] = useActionState(rejectQuestion, initialState);

  return (
    <form action={formAction} className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-start">
      <input type="hidden" name="questionId" value={questionId} />
      <input
        type="text"
        name="moderationNote"
        required
        minLength={5}
        maxLength={500}
        placeholder="Red gerekçesi"
        className="form-input min-w-0 flex-1 text-[11px]"
      />
      <button
        type="submit"
        disabled={isPending}
        className="btn btn-secondary shrink-0 text-[11px]"
      >
        {isPending ? "Reddediliyor…" : "Reddet"}
      </button>
      {state.error && <p className="alert alert-error w-full text-[10px]">{state.error}</p>}
      {state.success && <p className="alert alert-info w-full text-[10px]">{state.success}</p>}
    </form>
  );
}

function PublishForm({ questionId }: { questionId: string }) {
  const [state, formAction, isPending] = useActionState(
    publishQuestionFormAction,
    initialState,
  );

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="questionId" value={questionId} />
      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary text-[11px]"
      >
        {isPending ? "Yayımlanıyor…" : "Yayınla"}
      </button>
      {state.error && <p className="alert alert-error mt-2 text-[10px]">{state.error}</p>}
      {state.success && <p className="alert alert-info mt-2 text-[10px]">{state.success}</p>}
    </form>
  );
}

export function PendingQuestionRow({ question }: PendingQuestionRowProps) {
  return (
    <tr>
      <td>
        <p className="text-[12px] font-bold text-text">{question.title}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted">{question.body}</p>
      </td>
      <td className="text-[11px] text-muted">{question.categoryTitle ?? "—"}</td>
      <td className="text-[11px] text-muted">{question.authorDisplayName ?? "Kayıtlı kullanıcı"}</td>
      <td className="last text-right text-[11px] text-muted">
        {formatDateTR(question.createdAt)}
      </td>
      <td>
        <StatusBadge kind="question" status="pending_review" />
      </td>
      <td className="num">
        <PublishForm questionId={question.id} />
        <RejectForm questionId={question.id} />
      </td>
    </tr>
  );
}
