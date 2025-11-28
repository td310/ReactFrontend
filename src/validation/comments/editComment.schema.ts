import { z } from 'zod';

export const editCommentSchema = z.object({
  comment_id: z.number().int().positive('ID bình luận không hợp lệ.'),
  content: z
    .string()
    .min(1, 'Nội dung bình luận là bắt buộc.')
    .min(3, 'Nội dung bình luận cần tối thiểu 3 ký tự.'),
});

export type EditCommentFormValues = z.infer<typeof editCommentSchema>;

