export type InspectorApplicationStatus = "pending" | "approved" | "rejected";

export type InspectorApplicationRecord = {
  id: string;
  status: InspectorApplicationStatus;
  organizationOrTitle: string | null;
  applicationNote: string | null;
  rejectionReason: string | null;
  reviewNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
};

export const APPLICANT_APPLICATION_COLUMNS =
  "id, status, organization_or_title, application_note, rejection_reason, review_note, created_at, reviewed_at";

type InspectorApplicationRow = {
  id: string;
  status: InspectorApplicationStatus;
  organization_or_title: string | null;
  application_note: string | null;
  rejection_reason: string | null;
  review_note: string | null;
  created_at: string;
  reviewed_at: string | null;
};

export function mapInspectorApplicationRow(
  row: InspectorApplicationRow,
): InspectorApplicationRecord {
  return {
    id: row.id,
    status: row.status,
    organizationOrTitle: row.organization_or_title,
    applicationNote: row.application_note,
    rejectionReason: row.rejection_reason,
    reviewNote: row.review_note,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
  };
}

export function hasPendingInspectorApplication(
  record: InspectorApplicationRecord | null,
): boolean {
  return record?.status === "pending";
}

export function hasRejectedInspectorApplication(
  record: InspectorApplicationRecord | null,
): boolean {
  return record?.status === "rejected";
}
