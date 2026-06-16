import { z } from "zod";

export const submitQuestionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, "Başlık en az 10 karakter olmalıdır.")
    .max(200, "Başlık en fazla 200 karakter olabilir."),
  body: z
    .string()
    .trim()
    .min(20, "Soru metni en az 20 karakter olmalıdır."),
  categoryId: z
    .string()
    .uuid("Geçerli bir kategori seçin."),
});

export type SubmitQuestionInput = z.infer<typeof submitQuestionSchema>;
