"use client";
import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import toast from 'react-hot-toast';
import { Loader2, BarChart3, TrendingUp, Users, DollarSign, Calendar, Download } from 'lucide-react';

export default function AdminReportsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30'); // days

    useEffect(() => {
        loadStats();
    }, [dateRange]);

    const loadStats = async () => {
        try {
            const data = await adminService.getStats();
            setStats(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Báo cáo & Thống kê</h1>
                    <p className="text-slate-500 mt-1">Phân tích chi tiết hoạt động hệ thống</p>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={dateRange}
                        onChange={e => setDateRange(e.target.value)}
                        className="px-4 py-2 border rounded-xl font-medium"
                    >
                        <option value="7">7 ngày qua</option>
                        <option value="30">30 ngày qua</option>
                        <option value="90">90 ngày qua</option>
                    </select>
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700">
                        <Download size={18} /> Xuất báo cáo
                    </button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
                    <Users className="mb-3" size={28} />
                    <p className="text-blue-100 text-sm font-bold">Tổng người dùng</p>
                    <p className="text-4xl font-black mt-1">{stats?.total_users || 0}</p>
                    <p className="text-blue-100 text-sm mt-2">+{stats?.new_users_this_month || 0} tháng này</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white">
                    <DollarSign className="mb-3" size={28} />
                    <p className="text-green-100 text-sm font-bold">Doanh thu</p>
                    <p className="text-4xl font-black mt-1">{(stats?.total_revenue || 0).toLocaleString()}đ</p>
                    <p className="text-green-100 text-sm mt-2">{stats?.transactions_count || 0} giao dịch</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white">
                    <BarChart3 className="mb-3" size={28} />
                    <p className="text-purple-100 text-sm font-bold">Learners Active</p>
                    <p className="text-4xl font-black mt-1">{stats?.learners_count || 0}</p>
                    <p className="text-purple-100 text-sm mt-2">{stats?.mentors_count || 0} mentors</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white">
                    <TrendingUp className="mb-3" size={28} />
                    <p className="text-orange-100 text-sm font-bold">Sessions</p>
                    <p className="text-4xl font-black mt-1">{stats?.speaking_sessions || 0}</p>
                    <p className="text-orange-100 text-sm mt-2">buổi luyện tập</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4">Doanh thu theo thời gian</h3>
                    <div className="h-64 flex items-end gap-2">
                        {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                            <div key={i} className="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
                        <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
                    </div>
                </div>

                {/* User Distribution */}
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4">Phân bố người dùng</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Learners</span>
                                <span className="text-sm font-bold">{stats?.learners_count || 0}</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Mentors</span>
                                <span className="text-sm font-bold">{stats?.mentors_count || 0}</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full" style={{ width: '20%' }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Admins</span>
                                <span className="text-sm font-bold">{stats?.admins_count || 0}</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: '10%' }} />
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
                        <p className="text-3xl font-black text-indigo-600">{stats?.topics_count || 0}</p>
                        <p className="text-sm text-slate-500 font-medium">Topics</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                        <p className="text-3xl font-black text-green-600">{stats?.scenarios_count || 0}</p>
                        <p className="text-sm text-slate-500 font-medium">Scenarios</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                        <p className="text-3xl font-black text-purple-600">{stats?.packages_count || 0}</p>
                        <p className="text-sm text-slate-500 font-medium">Packages</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                        <p className="text-3xl font-black text-orange-600">{stats?.resources_count || 0}</p>
                        <p className="text-sm text-slate-500 font-medium">Resources</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
