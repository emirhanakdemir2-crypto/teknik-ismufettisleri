export const INSPECTOR_APPLICATION_METADATA_KEYS = {
  status: "inspector_application_status",
  organization: "inspector_organization",
  note: "inspector_application_note",
  submittedAt: "inspector_application_submitted_at",
} as const;

export type InspectorApplicationStatus = "submitted";

export type InspectorApplicationMetadata = {
  status: InspectorApplicationStatus | null;
  organization: string | null;
  note: string | null;
  submittedAt: string | null;
};

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

export function readInspectorApplicationMetadata(
  metadata: Record<string, unknown> | undefined,
): InspectorApplicationMetadata {
  const status = metadata?.[INSPECTOR_APPLICATION_METADATA_KEYS.status];

  return {
    status: status === "submitted" ? "submitted" : null,
    organization: readString(metadata?.[INSPECTOR_APPLICATION_METADATA_KEYS.organization]),
    note: readString(metadata?.[INSPECTOR_APPLICATION_METADATA_KEYS.note]),
    submittedAt: readString(metadata?.[INSPECTOR_APPLICATION_METADATA_KEYS.submittedAt]),
  };
}

export function buildInspectorApplicationMetadata(input: {
  organization: string;
  applicationNote: string;
}): Record<string, string> {
  return {
    [INSPECTOR_APPLICATION_METADATA_KEYS.status]: "submitted",
    [INSPECTOR_APPLICATION_METADATA_KEYS.organization]: input.organization,
    [INSPECTOR_APPLICATION_METADATA_KEYS.note]: input.applicationNote,
    [INSPECTOR_APPLICATION_METADATA_KEYS.submittedAt]: new Date().toISOString(),
  };
}

export function hasSubmittedInspectorApplication(
  metadata: InspectorApplicationMetadata,
): boolean {
  return metadata.status === "submitted";
}
