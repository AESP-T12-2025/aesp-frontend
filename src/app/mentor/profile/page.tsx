"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mentorService, MentorProfile } from '@/services/mentorService';
import toast from 'react-hot-toast';
import { Loader2, Save, User, Award, Users, BookOpen } from 'lucide-react';

export default function MentorProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<MentorProfile>({ full_name: '', bio: '', skills: '' });
    const [isSaving, setIsSaving] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await mentorService.createOrUpdateProfile(profile);
            toast.success("Cập nhật hồ sơ thành công!");
        } catch (error) {
            toast.error("Lỗi cập nhật hồ sơ");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#007bff]">Mentor Dashboard</h1>
                <p className="text-gray-600 mt-2 font-medium">Quản lý thông tin cá nhân và hồ sơ giảng dạy</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Tổng buổi học</p>
                            <p className="text-3xl font-black text-gray-900 mt-2">0</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-2xl">
                            <BookOpen className="w-8 h-8 text-[#007bff]" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Đánh giá TB</p>
                            <p className="text-3xl font-black text-gray-900 mt-2">0.0</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-2xl">
                            <Award className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Học viên</p>
                            <p className="text-3xl font-black text-gray-900 mt-2">0</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-2xl">
                            <Users className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-50 rounded-2xl">
                        <User className="w-6 h-6 text-[#007bff]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Thông Tin Cá Nhân</h2>
                        <p className="text-sm text-gray-500 font-medium">Cập nhật hồ sơ Mentor của bạn</p>
                    </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={profile.full_name}
                            onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007bff] focus:border-transparent outline-none transition font-medium"
                            placeholder="Ví dụ: Nguyễn Văn A"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Kỹ năng chuyên môn <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={profile.skills}
                            onChange={e => setProfile({ ...profile, skills: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007bff] focus:border-transparent outline-none transition font-medium"
                            placeholder="Ví dụ: IELTS, TOEIC, Business English"
                        />
                        <p className="text-xs text-gray-500 mt-2 font-medium">Phân cách bằng dấu phẩy</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Giới thiệu bản thân
                        </label>
                        <textarea
                            value={profile.bio}
                            onChange={e => setProfile({ ...profile, bio: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007bff] focus:border-transparent outline-none transition resize-none font-medium"
                            rows={4}
                            placeholder="Chia sẻ kinh nghiệm giảng dạy, chứng chỉ, và phương pháp giảng dạy của bạn..."
                        />
                    </div>

                    <button
                        disabled={isSaving}
                        type="submit"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#007bff] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {isSaving ? 'Đang lưu...' : 'Lưu Hồ Sơ'}
                    </button>
                </form>
            </div>
        </div>
    );
}
