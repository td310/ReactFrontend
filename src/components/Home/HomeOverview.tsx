import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/services/AuthService/authService';
import { usePostsList, usePostInteraction } from '@/services/PostService/postService';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { Post } from '@/types';
import { resolveMediaUrl } from '@/utils/media';

const formatDateTime = (value?: string | null) => {
  if (!value) return 'Chưa xác định';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa xác định';
  return date.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
};

const limitText = (value?: string | null, limit = 50) => {
  if (!value) return '';
  const trimmed = value.trim();
  if (trimmed.length <= limit) return trimmed;
  return `${trimmed.slice(0, limit).trimEnd()}...`;
};

const PostCard = ({ post }: { post: Post }) => {
  const attachments = [
    ...(post.file_upload ? [post.file_upload] : []),
    ...(Array.isArray(post.file_uploads) ? post.file_uploads : []),
  ].filter((item): item is string => Boolean(item));
  const thumbnail = resolveMediaUrl(attachments[0]);
  const { togglePin, toggleEmote, isUpdating } = usePostInteraction();
  const isPinned = Number(post.is_pinned) === 2;

  return (
    <Link to={`/posts/${post.id}`} className="block">
      <article className="flex gap-6 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition">
        <div className="w-full max-w-[160px] shrink-0 h-32 sm:h-36 md:h-40">
          {thumbnail ? (
            <img src={thumbnail} alt={`post-${post.id}`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-200 via-gray-100 to-white flex items-center justify-center text-xs text-gray-500 uppercase">
              Không có ảnh
            </div>
          )}
        </div>
        <div className="flex-1 py-4 pr-6 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs text-gray-500">{formatDateTime(post.created_at)}</p>
              <h4 className="text-lg font-semibold text-gray-900 leading-snug">{limitText(post.content)}</h4>
              <p className="text-sm text-gray-600 break-words">{limitText(post.content, 50)}</p>
            </div>
            {post.status_badge && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  post.status_badge === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {post.status_name}
              </span>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 text-xs text-gray-500 font-medium">
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-1 uppercase tracking-wide">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v7a2 2 0 01-2 2h-2m-4 0H7a2 2 0 01-2-2V8m12 0V6a2 2 0 00-2-2h-2m4 4H7m4-4H7a2 2 0 00-2 2v2" />
                </svg>
                {post.comments_count ?? 0} bình luận
              </span>
              <span className="flex items-center gap-1 uppercase tracking-wide">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 9l-2-2-2 2m0 6l2 2 2-2m2-4h4m-4 4h4m-4-8h4M4 9h4m-4 4h4m-4 4h4" />
                </svg>
                {post.emotes_count ?? 0} cảm xúc
              </span>
              {isPinned ? (
                <span className="flex items-center gap-1 text-amber-600 uppercase tracking-wide">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.062 3.261a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.062 3.262c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.062-3.262a1 1 0 00-.364-1.118L2.99 8.688c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.059-3.261z" />
                  </svg>
                  Đã ghim
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isUpdating}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void toggleEmote(post);
                }}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  post.is_emoted
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600'
                } ${isUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <svg
                  className={`w-4 h-4 ${post.is_emoted ? 'fill-rose-500' : 'fill-none stroke-current'}`}
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
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void togglePin(post);
                }}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  isPinned
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700'
                } ${isUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <svg
                  className={`w-4 h-4 ${isPinned ? 'fill-amber-500' : 'fill-none stroke-current'}`}
                  viewBox="0 0 24 24"
                >
                  <path d="M16 3l-1 4 3 3-3 3 1 8-4-5-4 5 1-8-3-3 3-3-1-4h8z" />
                </svg>
                <span>{isPinned ? 'Bỏ ghim' : 'Ghim'}</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

const getVisiblePages = (current: number, total: number, maxButtons = 5) => {
  const pages: number[] = [];
  if (total <= 0) return pages;

  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, current + half);

  if (end - start < maxButtons - 1) {
    if (start === 1) {
      end = Math.min(total, start + maxButtons - 1);
    } else if (end === total) {
      start = Math.max(1, end - maxButtons + 1);
    }
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
};

const HomeOverview: React.FC = () => {
  const { handleLogout } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { posts, meta, isLoading, isError, refetch } = usePostsList({
    limit,
    page,
  });

  const currentPage = meta?.current_page ?? page;
  const totalPages = Math.max(meta?.last_page ?? 1, 1);
  const totalItems = meta?.total ?? posts.length;
  const visibleRangeStart = posts.length ? limit * (currentPage - 1) + 1 : 0;
  const visibleRangeEnd = posts.length ? Math.min(limit * currentPage, totalItems) : 0;

  const visiblePages = useMemo(
    () => getVisiblePages(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const handlePageChange = (nextPage: number) => {
    if (Number.isNaN(nextPage)) return;
    setPage(Math.max(1, Math.min(nextPage, totalPages)));
  };

  const handlePrevPage = () => {
    handlePageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    handlePageChange(currentPage + 1);
  };

  return (
    <>
      <header className="w-full bg-white/80 backdrop-blur border-b border-white/60 shadow-sm">
        <div className="w-full px-6 lg:px-12 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-gray-500">Bảng điều khiển</p>
            <h1 className="text-2xl font-bold text-amber-700">Delicious Restaurant Admin</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/profile"
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Hồ sơ cá nhân
            </Link>
            <button
              onClick={handleLogout}
              className="bg-rose-400 hover:bg-rose-500 text-white px-6 py-2 rounded-xl font-semibold transition"
              type="button"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-6 lg:px-12 py-10 space-y-8">
        <section className="w-full bg-white/95 rounded-3xl shadow-xl border border-white/60 overflow-hidden">
          <div className="bg-gradient-to-r from-sky-200 via-cyan-100 to-amber-100 p-8 text-slate-900 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white/60 flex items-center justify-center text-3xl font-bold text-slate-800">
                {initials}
              </div>
              <div>
                <p className="uppercase text-slate-500 text-sm tracking-wide">Xin chào</p>
                <h2 className="text-3xl font-bold text-slate-900">{user?.name || 'Quản trị viên'}</h2>
                <p className="text-slate-600">{user?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/60 rounded-2xl p-4 text-center shadow-sm">
                <p className="text-sm uppercase text-slate-500">Trạng thái</p>
                <p className="text-xl font-semibold text-slate-900">{user?.status_name || 'Hoạt động'}</p>
              </div>
              <div className="bg-white/60 rounded-2xl p-4 text-center shadow-sm">
                <p className="text-sm uppercase text-slate-500">Quyền hạn</p>
                <p className="text-xl font-semibold text-slate-900">
                  {user?.roles?.[0]?.name || 'Nhân sự'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white/95 border border-white/70 rounded-3xl shadow-lg p-8 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Danh sách bài viết</p>
              <p className="text-sm text-gray-400">
                Trang {currentPage} / {totalPages} • Tổng {totalItems} bài viết
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/posts/create"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-center"
              >
                Tạo bài viết mới
              </Link>
            </div>
          </div>

          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={`skeleton-${index}`} className="flex gap-6 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 overflow-hidden animate-pulse">
                  <div className="w-full max-w-[160px] h-32 sm:h-36 md:h-40 bg-slate-100" />
                  <div className="flex-1 py-4 pr-6 space-y-3">
                    <div className="h-3 w-24 bg-slate-100 rounded-full" />
                    <div className="h-4 w-3/4 bg-slate-100 rounded-full" />
                    <div className="h-4 w-2/3 bg-slate-100 rounded-full" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && !isLoading && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-rose-700 flex flex-col gap-4">
              <p>Không thể tải danh sách bài viết. Vui lòng thử lại.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="self-start px-4 py-2 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 transition"
              >
                Thử lại
              </button>
            </div>
          )}

          {!isLoading && !isError && posts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 p-10 text-center space-y-4">
              <h4 className="text-xl font-semibold text-amber-800">Chưa có bài viết nào</h4>
              <Link
                to="/posts/create"
                className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
              >
                Tạo bài viết
              </Link>
            </div>
          )}

          {!isLoading && !isError && posts.length > 0 && (
            <>
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col gap-3 items-center pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-white bg-blue-500 font-semibold disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-600 transition"
                    >
                      Trang trước
                    </button>
                    {visiblePages.map((pageNumber) => (
                      <button
                        key={`page-${pageNumber}`}
                        type="button"
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 rounded-xl border font-semibold transition ${
                          pageNumber === currentPage
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-700 bg-blue-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-white bg-blue-500 font-semibold disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-600 transition"
                    >
                      Trang sau
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Hiển thị {visibleRangeStart} - {visibleRangeEnd} trong tổng số {totalItems} bài viết
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
};

export default HomeOverview;

