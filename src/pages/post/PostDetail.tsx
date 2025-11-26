import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HomeLayout from '@/components/Home/HomeLayout';
import { usePostDetail } from '@/services/PostService/postService';
import { resolveMediaUrl } from '@/utils/media';

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
  const [commentText, setCommentText] = useState('');


  const thumbnail = useMemo(() => {
    const attachments = [
      ...(post?.file_upload ? [post.file_upload] : []),
      ...(Array.isArray(post?.file_uploads) ? post?.file_uploads : []),
    ].filter((item): item is string => Boolean(item));
    return resolveMediaUrl(attachments[0]);
  }, [post]);

  const comments = post?.comments ?? [];
  const showMissingState = !isLoading && !isError && !post;

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
                <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden bg-slate-100">
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
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="text-sm text-gray-500">
                      {post.emotes_count ?? 0} cảm xúc • {post.comments_count ?? 0} bình luận
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{post.content}</p>
                </div>
              </div>

              {showCommentBox && (
                <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 space-y-3">
                  <textarea
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder="Nhập bình luận của bạn..."
                    className="w-full min-h-[120px] rounded-xl border border-amber-200 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />
                  <div className="flex flex-wrap items-center gap-3 justify-end">
                    <button
                      type="button"
                      disabled
                      className="px-5 py-2 rounded-xl bg-amber-500 text-white font-semibold opacity-60 cursor-not-allowed"
                    >
                      Gửi
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Bình luận gần đây</h2>
                {comments.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-gray-500 text-center">
                    Chưa có bình luận nào.
                  </div>
                )}
                {comments.length > 0 && (
                  <ul className="space-y-4">
                    {comments.map((comment) => (
                      <li key={comment.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="font-semibold text-gray-800">{comment.user_name || 'Ẩn danh'}</span>
                          <span>{formatDateTime(comment.created_at)}</span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </HomeLayout>
  );
};

export default PostDetailPage;


