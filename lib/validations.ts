import { z } from "zod"

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "이름은 2자 이상이어야 합니다")
    .max(50, "이름은 50자 이하여야 합니다"),
  email: z.string().email("유효한 이메일 주소를 입력해주세요"),
  bio: z.string().max(200, "바이오는 200자 이하여야 합니다").optional(),
  notifications: z.boolean(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export const contactSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상이어야 합니다"),
  email: z.string().email("유효한 이메일을 입력해주세요"),
  subject: z.string().min(5, "제목은 5자 이상이어야 합니다"),
  message: z.string().min(10, "메시지는 10자 이상이어야 합니다").max(500, "500자 이하로 입력해주세요"),
  agree: z.boolean().refine((v) => v === true, { message: "수신 동의가 필요합니다" }),
})

export type ContactFormValues = z.infer<typeof contactSchema>

export const loginSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해주세요"),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
})

export type LoginFormValues = z.infer<typeof loginSchema>
