import { Link } from 'react-router-dom';
import { useAuth } from '@/services/AuthService/authService';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

const upcomingPosts = [
  {
    title: 'Chiến dịch Tết 2026',
    excerpt: 'Tổng hợp idea truyền thông, chương trình ưu đãi và timeline triển khai.',
    category: 'Marketing',
    status: 'Đang chuẩn bị',
    color: 'from-rose-100 to-orange-100',
  },
  {
    title: 'Thực đơn mùa hè',
    excerpt: 'Danh sách món signature cùng concept trình bày mới.',
    category: 'Ẩm thực',
    status: 'Chờ duyệt',
    color: 'from-sky-100 to-cyan-100',
  },
  {
    title: 'Bản tin nhân sự tuần này',
    excerpt: 'Cập nhật lịch làm việc, đào tạo và hoạt động nội bộ.',
    category: 'Vận hành',
    status: 'Sắp đăng',
    color: 'from-emerald-100 to-lime-100',
  },
];

const HomeOverview: React.FC = () => {
  const { handleLogout } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';

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
              <p className="text-sm text-gray-500 uppercase tracking-wide">Bài viết sắp đăng</p>
              <h3 className="text-2xl font-semibold text-gray-900">Không gian chia sẻ ý tưởng</h3>
            </div>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
            >
              Tạo bài viết mới
            </button>
          </div>
          <div className="grid gap-6 lg:grid-cols-3 sm:grid-cols-2">
            {upcomingPosts.map((post) => (
              <article
                key={post.title}
                className={`p-6 rounded-2xl bg-gradient-to-br ${post.color} border border-white/60 shadow-md`}
              >
                <p className="text-xs uppercase tracking-wide text-gray-500">{post.category}</p>
                <h4 className="text-xl font-semibold text-gray-900 mt-2">{post.title}</h4>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.excerpt}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">{post.status}</span>
                  <button
                    type="button"
                    className="text-sm font-semibold text-sky-700 hover:text-slate-900 transition"
                  >
                    Xem nháp
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default HomeOverview;

