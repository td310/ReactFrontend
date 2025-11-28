import { z } from 'zod';

const isFile = (value: unknown): value is File => {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof File === 'undefined') {
    return true;
  }
  return value instanceof File;
};

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, 'Nội dung bài viết là bắt buộc.'),
  fileUpload: z
    .array(z.custom<File>(isFile, 'Tệp đính kèm không hợp lệ.'))
    .nullable(),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;