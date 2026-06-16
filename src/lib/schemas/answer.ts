import { z } from "zod";

export const createAnswerSchema = z.object({
  questionId: z.string().uuid("Geçersiz soru kimliği."),
  body: z
    .string()
    .trim()
    .min(20, "Cevap metni en az 20 karakter olmalıdır.")
    .max(10000, "Cevap metni en fazla 10000 karakter olabilir."),
});

export type CreateAnswerInput = z.infer<typeof createAnswerSchema>;
