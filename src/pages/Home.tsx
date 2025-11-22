import { useAuth } from '@/services/authService';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

const Home: React.FC = () => {
  const { handleLogout } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-700">Delicious Restaurant - Admin</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
          <div className="w-24 h-24 bg-amber-500 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl text-white font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Chào mừng quay trở lại!
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            {user?.name || 'Quản trị viên'}
          </p>
          <p className="text-lg text-amber-600 font-medium">
            {user?.email}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;