import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { createPostSchema, type CreatePostFormValues } from '@/validation/posts/createPost.schema';
import { usePostActions } from '@/services/PostService/postService';

const CreatePostForm: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { createPost, isCreating } = usePostActions();
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: '',
      fileUpload: [],
    },
  });

  const uploads = watch('fileUpload') ?? [];

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const selectedFiles = Array.from(files);
    const nextUploads = [...uploads, ...selectedFiles];
    setValue('fileUpload', nextUploads, { shouldValidate: true, shouldDirty: true });
    setToast({ type: 'success', message: `Đã thêm ${selectedFiles.length} tệp đính kèm.` });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setTimeout(() => setToast(null), 2500);
  };

  const removeFile = (index: number) => {
    const filtered = uploads.filter((_, idx) => idx !== index);
    setValue('fileUpload', filtered, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (values: CreatePostFormValues) => {
    setToast(null);
    try {
      await createPost({
        content: values.content.trim(),
        fileUpload: values.fileUpload && values.fileUpload.length > 0 ? values.fileUpload : [],
      });
      setToast({ type: 'success', message: 'Tạo bài viết thành công! Đang chuyển hướng...' });
      reset();
      setTimeout(() => {
        navigate('/home');
      }, 1200);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Tạo bài viết thất bại. Vui lòng thử lại.';
      setToast({ type: 'error', message });
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-amber-50 flex flex-col">
      <header className="w-full border-b border-white/60 bg-white/80 backdrop-blur shadow-sm">
        <div className="w-full px-6 lg:px-12 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide">Trình soạn thảo</p>
            <h1 className="text-2xl font-bold">Tạo bài viết mới</h1>
          </div>
          <Link
            to="/home"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </header>

      {toast && (
        <div
          className={`mx-6 lg:mx-auto mt-4 max-w-5xl w-full rounded-2xl border px-4 py-3 text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          {toast.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 w-full max-w-5xl mx-6 lg:mx-auto my-6 bg-white rounded-3xl shadow-2xl border border-white/60 p-8 flex flex-col space-y-6"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="content" className="text-sm font-semibold text-gray-700">
            Nội dung bài viết *
          </label>
          <textarea
            id="content"
            {...register('content')}
            className={`w-full min-h-[260px] rounded-2xl border bg-gray-50 px-4 py-3 text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-4 focus:outline-none transition ${
              errors.content
                ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                : 'border-gray-200 focus:border-amber-400 focus:ring-amber-100'
            }`}
            placeholder="Nhập nội dung bài viết"
          />
          {errors.content && <p className="text-sm text-rose-600">{errors.content.message}</p>}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">Tệp đính kèm</p>
              <p className="text-xs text-gray-500">Hỗ trợ nhiều tệp cùng lúc, tối ưu cho hình ảnh.</p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition disabled:opacity-60"
            >
              Tải tệp lên
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            multiple
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />
          {uploads.length > 0 ? (
            <ul className="space-y-3">
              {uploads.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-amber-50/40 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {file.type || 'Định dạng không xác định'} • {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-sm text-white font-medium hover:text-rose-700"
                  >
                    Xóa
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/40 px-6 py-8 text-center text-amber-700 text-sm">
              Chưa có tệp nào được đính kèm.
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:items-center border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="px-5 py-3 rounded-2xl border border-gray-200 text-white font-semibold hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className="px-6 py-3 rounded-2xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition disabled:opacity-60"
          >
            {isCreating ? 'Đang đăng...' : 'Đăng bài viết'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;