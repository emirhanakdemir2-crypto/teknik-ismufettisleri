import { z } from "zod";

import { registerSchema } from "@/lib/schemas/auth";

export const inspectorApplicationFieldsSchema = z.object({
  organization: z
    .string()
    .trim()
    .min(2, "Kurum veya unvan en az 2 karakter olmalıdır.")
    .max(120, "Kurum veya unvan en fazla 120 karakter olabilir."),
  applicationNote: z
    .string()
    .trim()
    .min(20, "Başvuru notu en az 20 karakter olmalıdır.")
    .max(1000, "Başvuru notu en fazla 1000 karakter olabilir."),
});

export const inspectorRegisterSchema = registerSchema.merge(
  inspectorApplicationFieldsSchema,
);

export const inspectorApplySchema = inspectorApplicationFieldsSchema;

export type InspectorRegisterInput = z.infer<typeof inspectorRegisterSchema>;
export type InspectorApplyInput = z.infer<typeof inspectorApplySchema>;
