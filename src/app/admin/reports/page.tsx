"use client";
import React, { useEffect, useState } from 'react';
import { adminService, AdminStats } from '@/services/adminService';
import toast from 'react-hot-toast';
import { Loader2, BarChart3, TrendingUp, Users, DollarSign, Calendar, Download } from 'lucide-react';

export default function AdminReportsPage() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30'); // days
    const [dailyRevenue, setDailyRevenue] = useState<{ date: string, day_name: string, revenue: number }[]>([]);

    useEffect(() => {
        loadStats();
    }, [dateRange]);

    const loadStats = async () => {
        try {
            const [statsData, revenueData] = await Promise.all([
                adminService.getStats(),
                adminService.getRevenueStats()
            ]);
            setStats(statsData);
            setDailyRevenue(revenueData.daily_breakdown || []);
        } catch (e) {
            console.error(e);
            toast.error("Lỗi tải dữ liệu thống kê");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;
    }

    // Extract data from nested structure
    const totalUsers = stats?.users?.total || 0;
    const learnersCount = stats?.users?.learners || 0;
    const mentorsCount = stats?.users?.mentors || 0;
    const adminsCount = totalUsers - learnersCount - mentorsCount;
    const newUsersThisMonth = stats?.users?.new_7d || 0;
    const totalRevenue = stats?.revenue?.total || 0;
    const speakingSessions = stats?.content?.sessions_total || 0;
    const topicsCount = stats?.content?.topics || 0;
    const scenariosCount = stats?.content?.scenarios || 0;
    const activeSubs = stats?.subscriptions?.active || 0;

    // Calculate max revenue for chart scaling
    const maxDailyRevenue = Math.max(...dailyRevenue.map(d => d.revenue), 1);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Báo cáo & Thống kê</h1>
                    <p className="text-slate-500 mt-1">Phân tích chi tiết hoạt động hệ thống</p>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
                    <Users className="mb-3" size={28} />
                    <p className="text-blue-100 text-sm font-bold">Tổng người dùng</p>
                    <p className="text-4xl font-black mt-1">{totalUsers}</p>
                    <p className="text-blue-100 text-sm mt-2">+{newUsersThisMonth} tuần này</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white">
                    <DollarSign className="mb-3" size={28} />
                    <p className="text-green-100 text-sm font-bold">Doanh thu</p>
                    <p className="text-4xl font-black mt-1">{totalRevenue.toLocaleString()}đ</p>
                    <p className="text-green-100 text-sm mt-2">{activeSubs} gói đang hoạt động</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white">
                    <BarChart3 className="mb-3" size={28} />
                    <p className="text-purple-100 text-sm font-bold">Learners Active</p>
                    <p className="text-4xl font-black mt-1">{learnersCount}</p>
                    <p className="text-purple-100 text-sm mt-2">{mentorsCount} mentors</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white">
                    <TrendingUp className="mb-3" size={28} />
                    <p className="text-orange-100 text-sm font-bold">Sessions</p>
                    <p className="text-4xl font-black mt-1">{speakingSessions}</p>
                    <p className="text-orange-100 text-sm mt-2">buổi luyện tập</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4">Doanh thu 7 ngày gần nhất</h3>
                    <div className="h-64 flex items-end gap-2">
                        {dailyRevenue.map((day, i) => {
                            const heightPercent = maxDailyRevenue > 0 ? (day.revenue / maxDailyRevenue * 90) : 0;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center">
                                    <span className="text-xs font-bold text-indigo-600 mb-1">
                                        {day.revenue > 0 ? `${(day.revenue / 1000).toFixed(0)}k` : ''}
                                    </span>
                                    <div
                                        className={`w-full rounded-t-lg transition-all ${day.revenue > 0 ? 'bg-gradient-to-t from-indigo-500 to-indigo-400' : 'bg-slate-200'}`}
                                        style={{ height: `${heightPercent || 5}%`, minHeight: day.revenue > 0 ? '20px' : '4px' }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
                        {dailyRevenue.map((day, i) => (
                            <span key={i}>{day.date}</span>
                        ))}
                    </div>
                </div>

                {/* User Distribution */}
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4">Phân bố người dùng</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Learners</span>
                                <span className="text-sm font-bold">{learnersCount}</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${totalUsers > 0 ? (learnersCount / totalUsers * 100) : 0}%` }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Mentors</span>
                                <span className="text-sm font-bold">{mentorsCount}</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${totalUsers > 0 ? (mentorsCount / totalUsers * 100) : 0}%` }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Admins</span>
                                <span className="text-sm font-bold">{adminsCount}</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${totalUsers > 0 ? (adminsCount / totalUsers * 100) : 0}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Stats */}
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Thống kê nội dung</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                        <p className="text-3xl font-black text-indigo-600">{topicsCount}</p>
                        <p className="text-sm text-slate-500 font-medium">Topics</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                        <p className="text-3xl font-black text-green-600">{scenariosCount}</p>
                        <p className="text-sm text-slate-500 font-medium">Scenarios</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                        <p className="text-3xl font-black text-purple-600">{activeSubs}</p>
                        <p className="text-sm text-slate-500 font-medium">Subscriptions</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                        <p className="text-3xl font-black text-orange-600">{speakingSessions}</p>
                        <p className="text-sm text-slate-500 font-medium">Sessions</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
