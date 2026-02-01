"use client";
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Camera, Mail, Phone, MapPin, Edit, Settings, LogOut, Award, Calendar, BookOpen, Save, Loader2 } from 'lucide-react';
import { userService } from '@/services/userService';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, login, logout } = useAuth();
  const [stats, setStats] = React.useState<any>(null);
  const [profile, setProfile] = React.useState<any>(null);

  // Edit states
  const [fullName, setFullName] = React.useState('');
  const [dailyGoal, setDailyGoal] = React.useState(15);
  const [learningTarget, setLearningTarget] = React.useState('General English');
  const [targetLevel, setTargetLevel] = React.useState('B1');
  const [preferredTime, setPreferredTime] = React.useState('Anytime');

  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const statsData = await userService.getStats();
      setStats(statsData);

      const profileData = await userService.getMyProfile();
      setProfile(profileData);

      // Init states
      if (profileData.full_name) setFullName(profileData.full_name);
      if (profileData.daily_learning_goal) setDailyGoal(profileData.daily_learning_goal);
      if (profileData.learning_target) setLearningTarget(profileData.learning_target);
      if (profileData.preferred_practice_time) setPreferredTime(profileData.preferred_practice_time);

      // Target level priority: Profile (stored user preference) > Stats (assessed level) > Default B1
      if (profileData.target_level) {
        setTargetLevel(profileData.target_level);
      } else if (statsData && statsData.level) {
        setTargetLevel(statsData.level === 'Unassessed' ? 'B1' : statsData.level);
      }
    } catch (e: any) {
      console.error("Failed to load profile data", e);
      // Auto-logout if token is invalid (401)
      if (e.response && e.response.status === 401) {
        toast.error("Phiên đăng nhập hết hạn");
        logout();
      }
    }
  };


  const handleUpdate = async () => {
    setLoading(true);
    try {
      await userService.updateMe({
        full_name: fullName,
        daily_learning_goal: dailyGoal,
        learning_target: learningTarget,
        preferred_practice_time: preferredTime,
        target_level: targetLevel
      });
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      loadData(); // Reload
    } catch (error) {
      toast.error("Lỗi khi cập nhật hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['LEARNER', 'MENTOR', 'ADMIN']}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-black text-gray-900">Hồ sơ cá nhân</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${isEditing ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-[#007bff] text-white shadow-md hover:bg-blue-600'}`}
              >
                {isEditing ? <><LogOut size={16} /> Hủy</> : <><Edit size={16} /> Chỉnh sửa hồ sơ</>}
              </button>
            </div>
          </div>

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
                        {fullName?.charAt(0) || user?.full_name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-black text-gray-900 mb-1">{fullName || profile?.full_name || 'Học viên'}</h2>
                <p className="text-sm text-gray-400 font-bold mb-6 tracking-widest uppercase">{user?.role}</p>

                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Mail size={18} className="text-gray-400" />
                    <div className="overflow-hidden">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{profile?.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Award size={18} className="text-gray-400" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Trình độ hiện tại</p>
                      <p className="text-sm font-bold text-gray-900">{stats?.level || 'Chưa kiểm tra'}</p>
                    </div>
                  </div>
                </div>

                <button onClick={logout} className="w-full mt-8 py-3 border-2 border-red-50 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                  <LogOut size={18} /> Đăng xuất
                </button>
              </div>
            </div>

            {/* RIGHT: Details & Settings */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 text-[#007bff] rounded-xl flex items-center justify-center mb-3">
                    <BookOpen size={20} />
                  </div>
                  <p className="text-2xl font-black text-gray-900">{stats?.lessons_completed || 0}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase">Từ vựng đã học</p>
                </div>
                <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-3">
                    <Calendar size={20} />
                  </div>
                  <p className="text-2xl font-black text-gray-900">{stats?.practice_hours || 0}h</p>
                  <p className="text-xs font-bold text-gray-400 uppercase">Giờ luyện tập</p>
                </div>
                <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm col-span-2 md:col-span-1">
                  <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center mb-3">
                    <Award size={20} />
                  </div>
                  <p className="text-2xl font-black text-gray-900">{stats?.xp || 0}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase">Điểm XP</p>
                </div>
              </div>

              {/* Edit Form */}
              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                <div className="space-y-8">
                  {/* Personal Section */}
                  <section>
                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                      <Settings size={20} className="text-[#007bff]" /> Thông tin cơ bản
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Họ và tên</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={!isEditing}
                          placeholder="Nhập họ và tên của bạn"
                          className={`w-full px-4 py-3 rounded-xl font-bold text-gray-900 outline-none border transition-all ${isEditing ? 'bg-white border-blue-200 focus:ring-4 focus:ring-blue-50' : 'bg-gray-50 border-transparent cursor-not-allowed'}`}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Learning Goals Section */}
                  <section>
                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                      <Award size={20} className="text-green-600" /> Mục tiêu học tập
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Mục tiêu hàng ngày (phút)</label>
                        <input
                          type="number"
                          value={dailyGoal}
                          onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                          disabled={!isEditing}
                          min="5"
                          max="120"
                          className={`w-full px-4 py-3 rounded-xl font-bold text-gray-900 outline-none border transition-all ${isEditing ? 'bg-white border-blue-200 focus:ring-4 focus:ring-blue-50' : 'bg-gray-50 border-transparent cursor-not-allowed'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Trình độ mong muốn</label>
                        <select
                          value={targetLevel}
                          onChange={(e) => setTargetLevel(e.target.value)}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 rounded-xl font-bold text-gray-900 outline-none border transition-all ${isEditing ? 'bg-white border-blue-200 focus:ring-4 focus:ring-blue-50' : 'bg-gray-50 border-transparent cursor-not-allowed'}`}
                        >
                          {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Mục đích học tập</label>
                        <select
                          value={learningTarget}
                          onChange={(e) => setLearningTarget(e.target.value)}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 rounded-xl font-bold text-gray-900 outline-none border transition-all ${isEditing ? 'bg-white border-blue-200 focus:ring-4 focus:ring-blue-50' : 'bg-gray-50 border-transparent cursor-not-allowed'}`}
                        >
                          <option value="General English">Tiếng Anh giao tiếp tổng quát</option>
                          <option value="IELTS Speaking">Luyện thi IELTS Speaking</option>
                          <option value="Business English">Tiếng Anh công sở / Kinh doanh</option>
                          <option value="Travel">Tiếng Anh du lịch</option>
                          <option value="Academic">Tiếng Anh học thuật</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* Preferences Section */}
                  <section>
                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                      <Calendar size={20} className="text-purple-600" /> Sở thích
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Thời gian luyện tập ưu tiên</label>
                        <select
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 rounded-xl font-bold text-gray-900 outline-none border transition-all ${isEditing ? 'bg-white border-blue-200 focus:ring-4 focus:ring-blue-50' : 'bg-gray-50 border-transparent cursor-not-allowed'}`}
                        >
                          <option value="Anytime">Bất cứ khi nào rảnh</option>
                          <option value="Morning">Buổi sáng (6h - 12h)</option>
                          <option value="Afternoon">Buổi chiều (12h - 18h)</option>
                          <option value="Evening">Buổi tối (18h - 22h)</option>
                          <option value="Night">Ban đêm (Sau 22h)</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  {isEditing && (
                    <div className="pt-8 flex justify-end">
                      <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="w-full md:w-auto px-12 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl hover:translate-y-[-2px] active:translate-y-0"
                      >
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} Lưu tất cả thay đổi
                      </button>
                    </div>
                  )}

                  {!isEditing && (
                    <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-sm text-blue-700 font-bold flex items-center gap-2">
                        💡 Mẹo: Thiết lập mục tiêu hàng ngày giúp bạn duy trì động lực tốt hơn!
                      </p>
                    </div>
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
