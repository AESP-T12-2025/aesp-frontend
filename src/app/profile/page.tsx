"use client";
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Camera, Mail, Phone, MapPin, Edit, Settings, LogOut, Award, Calendar, BookOpen } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();

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
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-black text-gray-900 mb-1">{user?.full_name}</h2>
                <p className="text-sm text-gray-500 font-bold mb-6">{user?.role}</p>

                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Mail size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                      <p className="text-sm font-medium text-gray-900 break-all">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Award size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Level</p>
                      <p className="text-sm font-medium text-gray-900">Intermediate B1</p>
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
                  <p className="text-2xl font-black text-gray-900">12</p>
                  <p className="text-xs font-bold text-gray-400 uppercase">Bài học</p>
                </div>
                <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-3">
                    <Calendar size={20} />
                  </div>
                  <p className="text-2xl font-black text-gray-900">42h</p>
                  <p className="text-xs font-bold text-gray-400 uppercase">Luyện tập</p>
                </div>
                <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center mb-3">
                    <Award size={20} />
                  </div>
                  <p className="text-2xl font-black text-gray-900">850</p>
                  <p className="text-xs font-bold text-gray-400 uppercase">Điểm XP</p>
                </div>
              </div>

              {/* Edit Form */}
              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-gray-900">Thông tin cá nhân</h3>
                  <button className="text-[#007bff] font-bold text-sm hover:underline">Chỉnh sửa</button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Họ và tên</label>
                      <input
                        type="text"
                        defaultValue={user?.full_name || ''}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl font-medium text-gray-900 outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Số điện thoại</label>
                      <input
                        type="text"
                        defaultValue="0987654321"
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl font-medium text-gray-900 outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Địa chỉ</label>
                    <input
                      type="text"
                      defaultValue="Ho Chi Minh City, Vietnam"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl font-medium text-gray-900 outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Mục tiêu học tập</label>
                    <textarea
                      rows={3}
                      defaultValue="Tôi muốn cải thiện kỹ năng giao tiếp để phục vụ công việc và du lịch."
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl font-medium text-gray-900 outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all">
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}