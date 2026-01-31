"use client";
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Camera, Mail, Phone, MapPin, Edit, Settings, LogOut, Award, Calendar, BookOpen, Save, Loader2 } from 'lucide-react';
import { userService } from '@/services/userService';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, login, logout } = useAuth(); // login to refresh context
  const [stats, setStats] = React.useState<any>(null);
  const [fullName, setFullName] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    loadStats();
    if (user?.full_name) setFullName(user.full_name);
  }, [user]);

  const loadStats = async () => {
    try {
      const data = await userService.getStats();
      setStats(data);
    } catch (e) {
      console.error("Failed to load stats");
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updated = await userService.updateMe({ full_name: fullName });
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      // Refresh context (hacky: we could expose a direct refresh method, 
      // but re-login with token is one way, or just let context drift until refresh.
      // Better: Context user state should update. Assuming 'login' or manual set needed.
      // Ideally AuthContext should provide 'refreshUser'. For now, we rely on page reload or just UI state update.)
    } catch (error) {
      toast.error("Lỗi khi cập nhật hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['LEARNER', 'MENTOR', 'ADMIN']}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-black text-gray-900 mb-8">Hồ sơ cá nhân</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: User Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[32px] p-8 shadow-lg border border-gray-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#007bff] to-blue-400"></div>

                <div className="relative z-10 mx-auto w-28 h-28 bg-white p-1 rounded-full -mt-4 mb-4 shadow-md">
                  <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden relative group">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="Avt" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-3xl">
                        {user?.full_name?.charAt(0) || 'U'}
                      </div>
                    )}
                    {/* Upload feature not yet implemented back-end fully for files, using URL only */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-black text-gray-900 mb-1">{fullName || user?.full_name}</h2>
                <p className="text-sm text-gray-500 font-bold mb-6">{user?.role}</p>

                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Mail size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                      <p className="text-sm font-medium text-gray-900 break-all">{stats?.email || user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Award size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Level</p>
                      <p className="text-sm font-medium text-gray-900">{stats?.level || 'Chưa kiểm tra'}</p>
                    </div>
                  </div>
                </div>

                <button onClick={logout} className="w-full mt-8 py-3 border-2 border-red-100 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                  <LogOut size={18} /> Đăng xuất
                </button>
              </div>
            </div>

            {/* RIGHT: Details & Settings */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 text-[#007bff] rounded-xl flex items-center justify-center mb-3">
                    <BookOpen size={20} />
                  </div>
                  <p className="text-2xl font-black text-gray-900">{stats?.lessons_completed || 0}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase">Bài học</p>
                </div>
                <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-3">
                    <Calendar size={20} />
                  </div>
                  <p className="text-2xl font-black text-gray-900">{stats?.practice_hours || 0}h</p>
                  <p className="text-xs font-bold text-gray-400 uppercase">Luyện tập</p>
                </div>
                <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center mb-3">
                    <Award size={20} />
                  </div>
                  <p className="text-2xl font-black text-gray-900">{stats?.xp || 0}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase">Điểm XP</p>
                </div>
              </div>

              {/* Edit Form */}
              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-gray-900">Thông tin tài khoản</h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-[#007bff] font-bold text-sm hover:underline flex items-center gap-1"
                  >
                    <Edit size={16} /> {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Họ và tên</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl font-medium text-gray-900 outline-none border transition-all ${isEditing ? 'bg-white border-blue-200 focus:ring-2 focus:ring-blue-100' : 'bg-gray-50 border-transparent'}`}
                    />
                  </div>

                  {/* REMOVED: Fake Phone, Address, Goal - Backend does not support these yet */}

                  {isEditing && (
                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all flex items-center gap-2"
                      >
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} Lưu thay đổi
                      </button>
                    </div>
                  )}

                  {!isEditing && (
                    <p className="text-xs text-gray-400 italic text-center mt-4">
                      Để cập nhật thêm thông tin, vui lòng liên hệ Admin hoặc chờ phiên bản cập nhật tiếp theo.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}