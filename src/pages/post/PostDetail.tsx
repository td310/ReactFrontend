import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import HomeLayout from '@/components/Home/HomeLayout';
import { usePostDetail, usePostInteraction } from '@/services/PostService/postService';
import { useCommentActions } from '@/services/CommentService/commentService';
import { resolveMediaUrl } from '@/utils/media';
import CommentList from '@/components/Comments/CommentList';
import { createCommentSchema, type CreateCommentFormValues } from '@/validation/comments/createComment.schema';

const formatDateTime = (value?: string | null) => {
  if (!value) return 'Chưa xác định';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa xác định';
  return date.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
};

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { post, isLoading, isError, refetch } = usePostDetail(postId);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const { createComment, isCreating } = useCommentActions(postId);
  const { togglePin, toggleEmote, isUpdating } = usePostInteraction();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCommentFormValues>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      content: '',
      parent: undefined,
    },
  });

  const thumbnail = useMemo(() => {
    const attachments = [
      ...(post?.file_upload ? [post.file_upload] : []),
      ...(Array.isArray(post?.file_uploads) ? post?.file_uploads : []),
    ].filter((item): item is string => Boolean(item));
    return resolveMediaUrl(attachments[0]);
  }, [post]);

  const comments = post?.comments ?? [];
  const isPinned = Number(post?.is_pinned) === 2;
  const showMissingState = !isLoading && !isError && !post;

  const onSubmitComment = async (values: CreateCommentFormValues) => {
    try {
      await createComment({
        content: values.content,
        parent: values.parent ? String(values.parent) : undefined,
      });
      reset();
      setShowCommentBox(false);
      refetch();
    } catch (error) {
      console.error('Create comment error:', error);
    }
  };

  const handleCommentAdded = () => {
    refetch();
  };

  const handleCommentUpdated = () => {
    refetch();
  };

  const handleCommentDeleted = () => {
    refetch();
  };

  return (
    <HomeLayout>
      <div className="flex flex-col min-h-screen w-full">
        <header className="w-full bg-white/80 backdrop-blur border-b border-white/60 shadow-sm">
          <div className="w-full px-6 lg:px-12 py-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              <span aria-hidden="true">←</span> Quay lại
            </button>
            <div className="text-right">
              <p className="text-sm text-gray-500">Mã bài viết</p>
              <p className="text-xl font-semibold text-amber-700">#{postId}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full px-6 lg:px-12 py-8 space-y-8">
          {isLoading && (
            <div className="rounded-3xl border border-white/70 bg-white shadow-lg p-8 space-y-6 animate-pulse">
              <div className="w-full h-64 bg-slate-100 rounded-2xl" />
              <div className="h-5 w-1/2 bg-slate-100 rounded-full" />
              <div className="h-4 w-3/4 bg-slate-100 rounded-full" />
              <div className="h-4 w-2/3 bg-slate-100 rounded-full" />
              <div className="h-32 bg-slate-100 rounded-2xl" />
            </div>
          )}

          {isError && !isLoading && (
            <div className="rounded-3xl border border-rose-100 bg-rose-50 p-8 text-rose-700 space-y-4">
              <p>Không thể tải bài viết. Vui lòng thử lại.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 transition"
              >
                Thử lại
              </button>
            </div>
          )}

          {showMissingState && (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-600">
              Không tìm thấy thông tin bài viết.
            </div>
          )}

          {!isLoading && !isError && post && (
            <section className="rounded-3xl border border-white/70 bg-white shadow-xl p-6 lg:p-10 space-y-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/4 rounded-2xl overflow-hidden bg-slate-100">
                  {thumbnail ? (
                    <img src={thumbnail} alt={`post-${post.id}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full min-h-[280px] flex items-center justify-center text-gray-500 text-sm">
                      Không có hình ảnh minh họa
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">{formatDateTime(post.created_at)}</p>
                    <h1 className="text-3xl font-bold text-gray-900 leading-snug">{post.content}</h1>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 justify-between">
                    <div className="text-sm text-gray-500">
                      {post.emotes_count ?? 0} cảm xúc • {post.comments_count ?? 0} bình luận
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => void toggleEmote(post)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition ${
                          post.is_emoted
                            ? 'bg-rose-50 border-rose-200 text-rose-600'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600'
                        } ${isUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <svg
                          className={`w-5 h-5 ${post.is_emoted ? 'fill-rose-500' : 'fill-none stroke-current'}`}
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12.1 4.64l-.1.1-.11-.11C9.24 1.89 4.91 3.11 3.6 6.28c-.74 1.82-.34 3.97 1.02 5.54 1.3 1.5 5.45 5.18 6.88 6.42.28.24.42.36.6.41.15.04.31.04.46 0 .18-.05.32-.17.6-.41 1.43-1.24 5.58-4.92 6.88-6.42 1.36-1.57 1.76-3.72 1.02-5.54C19.09 3.11 14.76 1.89 12.1 4.64z"
                          />
                        </svg>
                        <span>{post.is_emoted ? 'Bỏ thích' : 'Thích'}</span>
                      </button>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => void togglePin(post)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition ${
                          isPinned
                            ? 'bg-amber-50 border-amber-300 text-amber-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700'
                        } ${isUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <svg
                          className={`w-5 h-5 ${isPinned ? 'fill-amber-500' : 'fill-none stroke-current'}`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M16 3l-1 4 3 3-3 3 1 8-4-5-4 5 1-8-3-3 3-3-1-4h8z" />
                        </svg>
                        <span>{isPinned ? 'Bỏ ghim' : 'Ghim'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCommentBox(!showCommentBox)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 text-blue-700 font-semibold transition bg-blue-500 text-white"
                      >
                        {showCommentBox ? 'Ẩn bình luận' : 'Bình luận'}
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{post.content}</p>
                </div>
              </div>

              {showCommentBox && (
                <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 space-y-3">
                  <form onSubmit={handleSubmit(onSubmitComment)} className="space-y-3">
                    <textarea
                      {...register('content')}
                      className={`w-full min-h-[120px] rounded-xl border border-amber-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-200 ${
                        errors.content ? 'border-red-500' : ''
                      }`}
                      placeholder="Nhập bình luận"
                    />
                    {errors.content && <p className="text-sm text-red-600">{errors.content.message}</p>}
                    <div className="flex flex-wrap items-center gap-3 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCommentBox(false);
                          reset();
                        }}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-white font-semibold transition"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={isCreating}
                        className="px-5 py-2 rounded-xl bg-amber-500 text-white font-semibold transition disabled:opacity-60"
                      >
                        {isCreating ? 'Đang gửi...' : 'Gửi'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Bình luận gần đây</h2>
                <CommentList
                  comments={comments}
                  postId={postId!}
                  onCommentAdded={handleCommentAdded}
                  onCommentUpdated={handleCommentUpdated}
                  onCommentDeleted={handleCommentDeleted}
                />
              </div>
            </section>
          )}
        </main>
      </div>
    </HomeLayout>
  );
};

export default PostDetailPage;
