"use client";
import React, { useEffect, useState } from 'react';
import { adminService, AdminStats } from '@/services/adminService';
import { Users, DollarSign, CreditCard, BookOpen, Mic2, UserCheck, Calendar, MessageCircle, FileText, TrendingUp, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await adminService.getStats();
            setStats(data);
        } catch (e) {
            console.error("Failed to load stats", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    if (!stats) {
        return <div className="text-center text-gray-500 py-20">Không thể tải dữ liệu thống kê.</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-500">Tổng quan hệ thống AESP</p>
            </div>

            {/* User Stats */}
            <div>
                <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Users size={20} /> Người dùng
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard icon={<Users />} label="Tổng Users" value={stats.users.total} color="blue" />
                    <StatCard icon={<Users />} label="Learners" value={stats.users.learners} color="green" />
                    <StatCard icon={<UserCheck />} label="Mentors" value={stats.users.mentors} color="purple" />
                    <StatCard icon={<TrendingUp />} label="Mới (7 ngày)" value={stats.users.new_7d} color="orange" />
                </div>
            </div>

            {/* Revenue & Subscriptions */}
            <div>
                <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <DollarSign size={20} /> Doanh thu & Đăng ký
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard icon={<DollarSign />} label="Tổng Doanh thu" value={`${(stats.revenue.total || 0).toLocaleString()} đ`} color="green" large />
                    <StatCard icon={<DollarSign />} label="7 ngày qua" value={`${(stats.revenue.last_7d || 0).toLocaleString()} đ`} color="blue" />
                    <StatCard icon={<CreditCard />} label="Gói đang hoạt động" value={stats.subscriptions.active} color="purple" />
                </div>
            </div>

            {/* Content Stats */}
            <div>
                <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <BookOpen size={20} /> Nội dung học tập
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard icon={<BookOpen />} label="Topics" value={stats.content.topics} color="indigo" />
                    <StatCard icon={<FileText />} label="Scenarios" value={stats.content.scenarios} color="cyan" />
                    <StatCard icon={<Mic2 />} label="Sessions (Total)" value={stats.content.sessions_total} color="pink" />
                    <StatCard icon={<Mic2 />} label="Sessions (7 ngày)" value={stats.content.sessions_7d} color="orange" />
                </div>
            </div>

            {/* Mentor & Social */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <UserCheck size={20} /> Mentors
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard icon={<UserCheck />} label="Verified" value={stats.mentors.verified} color="green" />
                        <StatCard icon={<Calendar />} label="Bookings" value={stats.mentors.total_bookings} color="blue" />
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <MessageCircle size={20} /> Cộng đồng
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard icon={<FileText />} label="Bài viết" value={stats.social.posts} color="purple" />
                        <StatCard icon={<MessageCircle />} label="Bình luận" value={stats.social.comments} color="pink" />
                    </div>
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
    large?: boolean;
}

function StatCard({ icon, label, value, color, large }: StatCardProps) {
    const colorMap: { [key: string]: string } = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
        pink: 'bg-pink-50 text-pink-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        cyan: 'bg-cyan-50 text-cyan-600',
    };

    return (
        <div className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${large ? 'col-span-1' : ''}`}>
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color] || colorMap.blue}`}>
                    {icon}
                </div>
                <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">{label}</span>
            </div>
            <p className={`font-black text-gray-900 ${large ? 'text-3xl' : 'text-2xl'}`}>{value}</p>
        </div>
    );
}
