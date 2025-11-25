import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ message: 'Email không hợp lệ.' }),

  password: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc.')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.')
    .regex(/[a-z]/, { message: 'Mật khẩu phải chứa ít nhất một chữ cái thường.' })
    .regex(/[A-Z]/, { message: 'Mật khẩu phải chứa ít nhất một chữ cái hoa.' })
    .regex(/[0-9]/, { message: 'Mật khẩu phải chứa ít nhất một số.' })
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { message: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt.' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
