import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Nội dung bình luận là bắt buộc.')
    .min(3, 'Nội dung bình luận cần tối thiểu 3 ký tự.'),
  parent: z
    .union([z.string(), z.number()])
    .optional()
    .or(z.undefined()),
});

export type CreateCommentFormValues = z.infer<typeof createCommentSchema>;

