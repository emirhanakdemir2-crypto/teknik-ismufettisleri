import { z } from "zod";

export const registerSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Görünen ad en az 2 karakter olmalıdır.")
    .max(80, "Görünen ad en fazla 80 karakter olabilir."),
  email: z
    .string()
    .trim()
    .email("Geçerli bir e-posta adresi girin."),
  password: z
    .string()
    .min(6, "Şifre en az 6 karakter olmalıdır.")
    .max(72, "Şifre en fazla 72 karakter olabilir."),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Geçerli bir e-posta adresi girin."),
  password: z.string().min(1, "Şifre gereklidir."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
