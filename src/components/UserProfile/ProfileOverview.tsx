import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetProfileQuery,
  useUpdateAvatarMutation,
  useUpdateBackgroundMutation,
} from '@/api/User/userApi';

const formatDate = (value?: string | null, withTime = false) => {
  if (!value) return 'Chưa cập nhật';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa cập nhật';
  return withTime
    ? date.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })
    : date.toLocaleDateString('vi-VN', { dateStyle: 'medium' });
};

const InfoRow = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex items-start justify-between text-sm sm:text-base">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900 text-right">{value || 'Chưa cập nhật'}</span>
  </div>
);

const PillList = ({ title, items }: { title: string; items: string[] }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
    <h3 className="text-base font-semibold text-gray-800 mb-4">{title}</h3>
    {items.length ? (
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-medium"
          >
            {item}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-500">Chưa cập nhật</p>
    )}
  </div>
);

const ProfileOverview: React.FC = () => {
  const { data, isLoading, isError, refetch } = useGetProfileQuery();
  const profile = data?.data;
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [updateAvatar, { isLoading: avatarUpdating }] = useUpdateAvatarMutation();
  const [updateBackground, { isLoading: backgroundUpdating }] = useUpdateBackgroundMutation();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const bgInputRef = useRef<HTMLInputElement | null>(null);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleUpload = async (file: File, type: 'avatar' | 'background') => {
    try {
      const base64Data = await fileToBase64(file);
      if (type === 'avatar') {
        await updateAvatar({
          user_avatar: {
            name: file.name,
            data: base64Data,
          },
        }).unwrap();
      } else {
        await updateBackground({
          background: {
            name: file.name,
            data: base64Data,
          },
        }).unwrap();
      }
      setToast({ type: 'success', message: 'Cập nhật thành công! Đang làm mới dữ liệu...' });
      await refetch();
    } catch (error) {
      console.error('Update media failed', error);
      setToast({ type: 'error', message: 'Cập nhật thất bại. Vui lòng thử lại.' });
    } finally {
      setTimeout(() => setToast(null), 2500);
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'background') => {
    const file = event.target.files?.[0];
    if (file) {
      void handleUpload(file, type);
    }
    event.target.value = '';
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur rounded-2xl px-8 py-6 shadow-lg text-amber-700 font-semibold">
          Đang tải thông tin người dùng...
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Không thể tải thông tin</h2>
          <p className="text-gray-600">
            Vui lòng kiểm tra kết nối hoặc thử đăng nhập lại.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => refetch()}
              className="px-6 py-2 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
            >
              Thử lại
            </button>
            <Link
              to="/home"
              className="px-6 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { departments, titles, roles, profile: detail } = profile;

  return (
    <div className="flex-1 py-12 px-4 lg:px-0">
      {toast && (
        <div
          className={`max-w-5xl mx-auto mb-6 rounded-2xl border px-4 py-3 text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          {toast.message}
        </div>
      )}
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/60 relative">
          <div
            className="h-56 w-full bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(120deg, rgba(255, 229, 162, 0.8), rgba(255, 219, 219, 0.7)), url(${profile.background || ''})`,
            }}
          />
          <input
            ref={bgInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFileChange(e, 'background')}
          />
          <button
            type="button"
            onClick={() => bgInputRef.current?.click()}
            className="absolute right-4 top-4 bg-white/80 backdrop-blur border border-white/60 rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-white transition flex items-center gap-2"
            disabled={backgroundUpdating}
          >
            {backgroundUpdating && (
              <svg
                className="w-4 h-4 animate-spin text-amber-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            <span>{backgroundUpdating ? 'Đang cập nhật' : 'Đổi background'}</span>
          </button>
          <div className="px-8 pb-8 -mt-16">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="relative">
                <img
                  src={profile.avatar_url || 'https://ui-avatars.com/api/?name=User'}
                  alt={profile.name}
                  className="w-32 h-32 rounded-3xl border-4 border-white shadow-lg object-cover"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow text-center">
                  {profile.status_name || 'Hoạt động'}
                </span>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute -right-2 -top-2 bg-white shadow-md border border-gray-100 rounded-full p-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  title="Cập nhật avatar"
                  disabled={avatarUpdating}
                >
                  {avatarUpdating ? (
                    <svg
                      className="w-4 h-4 animate-spin text-amber-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 15.25A3.25 3.25 0 0017.75 12h-11.5A3.25 3.25 0 003 15.25v2.5A3.25 3.25 0 006.25 21h11.5A3.25 3.25 0 0021 17.75v-2.5z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 10.5V6.75A4.75 4.75 0 0112.25 2h.5A4.75 4.75 0 0117.5 6.75V10.5"
                      />
                    </svg>
                  )}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onFileChange(e, 'avatar')}
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold capitalize">
                    {roles?.[0]?.name || 'Nhân viên'}
                  </span>
                </div>
                <p className="text-gray-600 text-lg">{profile.email}</p>
                <p className="text-sm text-gray-500">
                  Đăng nhập gần nhất: {formatDate(profile.login_at, true)}
                </p>
                <div className="flex gap-3">
                  <Link
                    to="/home"
                    className="px-5 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Trang chủ
                  </Link>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="px-5 py-2 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
                  >
                    Làm mới dữ liệu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Thông tin liên hệ</h3>
            <InfoRow label="Họ & tên" value={`${profile.last_name || ''} ${profile.first_name || ''}`.trim() || profile.name} />
            <InfoRow label="Email" value={profile.email} />
            <InfoRow label="Số điện thoại" value={profile.phone_number} />
            <InfoRow label="Giới tính" value={detail?.gender} />
            <InfoRow label="Ngày sinh" value={formatDate(detail?.birth)} />
            <InfoRow label="Nơi sinh" value={detail?.birth_place} />
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Thông tin công việc</h3>
            <InfoRow label="Trạng thái" value={profile.status_name} />
            <InfoRow label="Chức danh hiện tại" value={titles?.[0]?.description || titles?.[0]?.level} />
            <InfoRow label="Ngày cấp CCCD" value={formatDate(detail?.identification_date)} />
            <InfoRow label="Nơi cấp CCCD" value={detail?.identification_place} />
            <InfoRow label="Số CCCD" value={detail?.identification_number} />
            <InfoRow label="Ngày vào công ty" value={formatDate(detail?.company_entry_date)} />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PillList title="Phòng ban" items={departments?.map((dept) => dept.name) || []} />
          <PillList
            title="Chức danh"
            items={titles?.map((title) => title.description || title.level) || []}
          />
        </div>

        <PillList title="Quyền hạn" items={roles?.map((role) => role.name) || []} />

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Thông tin tài chính & liên hệ khẩn</h3>
          <InfoRow label="Ngân hàng" value={detail?.bank_name} />
          <InfoRow label="Số tài khoản" value={detail?.bank_number} />
          <InfoRow label="Thuế thu nhập cá nhân" value={detail?.personal_income_tax} />
          <InfoRow label="Bảo hiểm" value={detail?.insurance_number} />
          <InfoRow label="Người liên hệ" value={detail?.relative_name} />
          <InfoRow label="Quan hệ" value={detail?.relative_role} />
          <InfoRow label="Số liên hệ khẩn" value={detail?.relative_number} />
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;

