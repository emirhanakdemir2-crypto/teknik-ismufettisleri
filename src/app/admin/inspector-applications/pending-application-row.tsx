"use client";

import { useActionState } from "react";

import {
  approveInspectorApplicationAction,
  rejectInspectorApplicationAction,
  type InspectorApplicationActionState,
} from "@/app/admin/inspector-applications/actions";
import { formatDateTR } from "@/lib/format/date";
import type { PendingInspectorApplicationItem } from "@/lib/admin/inspector-application-queries";

const initialState: InspectorApplicationActionState = {};

type PendingApplicationRowProps = {
  application: PendingInspectorApplicationItem;
};

function ApproveForm({ applicationId }: { applicationId: string }) {
  const [state, formAction, isPending] = useActionState(
    approveInspectorApplicationAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="applicationId" value={applicationId} />
      <input
        type="text"
        name="reviewNote"
        maxLength={500}
        placeholder="Onay notu (isteğe bağlı)"
        className="form-input min-w-0 text-[11px]"
      />
      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary text-[11px]"
      >
        {isPending ? "Onaylanıyor…" : "Onayla"}
      </button>
      {state.error && <p className="alert alert-error text-[10px]">{state.error}</p>}
      {state.success && <p className="alert alert-info text-[10px]">{state.success}</p>}
    </form>
  );
}

function RejectForm({ applicationId }: { applicationId: string }) {
  const [state, formAction, isPending] = useActionState(
    rejectInspectorApplicationAction,
    initialState,
  );

  return (
    <form action={formAction} className="mt-2 flex flex-col gap-2">
      <input type="hidden" name="applicationId" value={applicationId} />
      <input
        type="text"
        name="rejectionReason"
        required
        minLength={5}
        maxLength={500}
        placeholder="Red gerekçesi"
        className="form-input min-w-0 text-[11px]"
      />
      <button
        type="submit"
        disabled={isPending}
        className="btn btn-secondary text-[11px]"
      >
        {isPending ? "Reddediliyor…" : "Reddet"}
      </button>
      {state.error && <p className="alert alert-error text-[10px]">{state.error}</p>}
      {state.success && <p className="alert alert-info text-[10px]">{state.success}</p>}
    </form>
  );
}

export function PendingApplicationRow({ application }: PendingApplicationRowProps) {
  return (
    <tr>
      <td className="text-[11px] text-muted">
        {application.displayName ?? "—"}
        <span className="mt-1 block text-[10px] text-muted">{application.email}</span>
      </td>
      <td className="text-[11px] text-muted">{application.organizationOrTitle ?? "—"}</td>
      <td>
        <p className="text-[11px] leading-relaxed text-text">
          {application.applicationNote ?? "—"}
        </p>
      </td>
      <td className="last text-right text-[11px] text-muted">
        {formatDateTR(application.createdAt)}
      </td>
      <td className="num">
        <ApproveForm applicationId={application.id} />
        <RejectForm applicationId={application.id} />
      </td>
    </tr>
  );
}
