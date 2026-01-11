"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { BarChart as BarChartIcon, Calendar, TrendingUp, Clock, CheckCircle, XCircle, Award, Target, Zap, ChevronRight, Activity, MoreHorizontal, Loader2 } from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import Link from 'next/link';

export default function ReportsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                // Format YYYY-MM-DD (for week) or YYYY-MM (for month)
                const dateStr = currentDate.toISOString().split('T')[0];
                const monthStr = dateStr.substring(0, 7);

                let data;
                if (viewMode === 'WEEKLY') {
                    data = await analyticsService.getWeeklyStats(dateStr);
                } else {
                    data = await analyticsService.getMonthlyStats(monthStr);
                }
                setStats(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [currentDate, viewMode]);

    const handlePrev = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'WEEKLY') newDate.setDate(newDate.getDate() - 7);
        else newDate.setMonth(newDate.getMonth() - 1);
        setCurrentDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'WEEKLY') newDate.setDate(newDate.getDate() + 7);
        else newDate.setMonth(newDate.getMonth() + 1);

        if (newDate > new Date()) return;
        setCurrentDate(newDate);
    };

    const getRangeLabel = () => {
        if (viewMode === 'WEEKLY') {
            const start = new Date(currentDate);
            const day = start.getDay();
            const diff = start.getDate() - day + (day === 0 ? -6 : 1);
            start.setDate(diff);
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            return `${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}`;
        } else {
            return `Tháng ${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
        }
    };

    if (loading && !stats) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#007bff]" /></div>;
    if (!stats) return <div className="min-h-screen flex items-center justify-center">Chưa có dữ liệu báo cáo.</div>;

    const maxActivity = Math.max(...(stats.dailyActivity || []), 5);

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="min-h-screen bg-[#F8F9FD] p-4 md:p-8 font-sans">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => setViewMode('WEEKLY')}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'WEEKLY' ? 'bg-[#007bff] text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Theo Tuần
                                </button>
                                <button
                                    onClick={() => setViewMode('MONTHLY')}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'MONTHLY' ? 'bg-[#007bff] text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                >
                                    Theo Tháng
                                </button>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                {viewMode === 'WEEKLY' ? 'Báo cáo tuần' : 'Báo cáo tháng'}
                            </h1>
                            <p className="text-slate-500 font-bold">Thời gian: {getRangeLabel()}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handlePrev} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 transition-all font-bold">{'<'}</button>
                            <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl text-slate-700 font-bold shadow-sm cursor-default text-sm">
                                <Calendar size={16} /> {getRangeLabel()}
                            </button>
                            <button onClick={handleNext} disabled={currentDate >= new Date()} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 transition-all font-bold disabled:opacity-50">{'>'}</button>
                        </div>
                    </div>

                    {/* Hero Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Main XP Card */}
                        <div className="bg-gradient-to-br from-[#2979FF] to-[#1565C0] rounded-[32px] p-8 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                            {/* Decorative Blobs */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full blur-xl -ml-5 -mb-5"></div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl w-fit shadow-inner border border-white/10">
                                    <Zap size={24} fill="currentColor" />
                                </div>
                                <span className="px-3 py-1 bg-green-400 text-green-900 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                                    Live Data
                                </span>
                            </div>

                            <div className="relative z-10 mt-6">
                                <h3 className="text-6xl font-black mb-1 tracking-tighter">{stats?.xpEarned || 0}</h3>
                                <p className="text-blue-100 font-bold text-sm uppercase tracking-widest opacity-80">XP Kiếm được</p>
                            </div>
                        </div>

                        {/* Additional Stats Grid */}
                        <div className="md:col-span-2 grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div className="text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 mb-3">
                                    <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg"><Clock size={14} /></div>
                                    Thời gian học
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">{stats?.totalHours || 0}h</p>
                                    <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[70%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                    </div>
                                    {viewMode === 'MONTHLY' && stats.comparison && (
                                        <p className="text-xs text-slate-400 mt-2 font-bold">So với tháng trước: {stats.comparison.diff > 0 ? '+' : ''}{stats.comparison.diff}h</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div className="text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 mb-3">
                                    <div className="p-1.5 bg-green-50 text-green-500 rounded-lg"><CheckCircle size={14} /></div>
                                    Bài hoàn thành
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">{stats?.scenariosCompleted || 0}</p>
                                    <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                                        <div className="h-full bg-green-500 w-[80%] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div className="text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 mb-3">
                                    <div className="p-1.5 bg-yellow-50 text-yellow-500 rounded-lg"><Award size={14} /></div>
                                    Điểm trung bình
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">{stats?.avgScore || 0}</p>
                                    <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-md">Tốt</span>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div className="text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 mb-3">
                                    <div className="p-1.5 bg-orange-50 text-orange-500 rounded-lg"><TrendingUp size={14} /></div>
                                    Chuỗi ngày
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">{stats?.streak || 0}</p>
                                    <span className="text-orange-500 text-xs font-bold bg-orange-50 px-2 py-0.5 rounded-md">Ngày 🔥</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* CHART REFACTOR */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <div className="p-2 bg-blue-50 text-[#007bff] rounded-xl"><Activity size={20} /></div>
                                    Hoạt động học tập
                                </h3>
                            </div>

                            {/* Chart Container */}
                            <div className="flex-1 relative min-h-[250px] flex items-end justify-between px-4 pb-2 gap-2 border-b border-slate-100 border-dashed overflow-x-auto">
                                {/* Grid Lines (Background) */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 opacity-30 px-4">
                                    <div className="w-full h-px bg-slate-200 border-t border-dashed"></div>
                                    <div className="w-full h-px bg-slate-200 border-t border-dashed"></div>
                                    <div className="w-full h-px bg-slate-200 border-t border-dashed"></div>
                                    <div className="w-full h-px bg-slate-200 border-t border-dashed"></div>
                                    <div className="w-full h-px bg-transparent"></div>
                                </div>

                                {stats?.dailyActivity?.map((hours: number, i: number) => {
                                    const heightPercentage = (hours / maxActivity) * 100;
                                    const label = viewMode === 'WEEKLY' ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i] : `${i + 1}`;

                                    return (
                                        <div key={i} className="flex-1 min-w-[20px] flex flex-col items-center gap-3 group relative z-10 h-full justify-end">
                                            {/* Tooltip */}
                                            <div className="opacity-0 group-hover:opacity-100 transition-all absolute -top-12 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-20 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                                                {hours} giờ
                                                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                                            </div>
                                            {/* Bar */}
                                            <div
                                                className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-out hover:brightness-110 relative overflow-hidden
                                                    ${hours > 0 ? 'bg-gradient-to-t from-[#007bff] to-blue-400 shadow-md' : 'bg-slate-100'} 
                                                `}
                                                style={{ height: hours === 0 ? '4px' : `${heightPercentage}%` }}
                                            />
                                            {/* Label */}
                                            <span className="text-[9px] font-bold text-slate-400">
                                                {label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* AI FEEDBACK (Reuse) */}
                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
                            {/* ... same as before, simplified reuse ... */}
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Target size={20} /></div>
                                AI Coach
                            </h3>
                            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[300px]">
                                {stats?.feedback?.length ? stats.feedback.map((item: any, i: number) => (
                                    <div key={i} className={`p-4 rounded-2xl border transition-all hover:bg-white hover:shadow-md group ${item.type === 'strength' ? 'bg-green-50/50 border-green-100 hover:border-green-200' : 'bg-red-50/50 border-red-100 hover:border-red-200'}`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm ${item.type === 'strength' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                                {item.type === 'strength' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                            </div>
                                            <p className="text-sm font-bold leading-relaxed text-slate-700">{item.text}</p>
                                        </div>
                                    </div>
                                )) : <p className="text-slate-500 font-medium">Chưa có đánh giá.</p>}
                            </div>
                            <Link href="/learner/scenarios" className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1">
                                Luyện tập ngay <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* HEAT MAP CALENDAR (Keep logic similar) */}
                    {stats?.heatMap && (
                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <div className="p-2 bg-green-50 text-green-600 rounded-xl"><Calendar size={20} /></div>
                                Hoạt động 30 ngày qua
                            </h3>
                            <div className="flex gap-1 flex-wrap">
                                {stats.heatMap.map((day: any, i: number) => {
                                    const levelColors = ['bg-slate-100', 'bg-green-200', 'bg-green-400', 'bg-green-500', 'bg-green-600'];
                                    const dateObj = new Date(day.date);
                                    return (
                                        <div key={i} className={`w-8 h-8 rounded-lg ${levelColors[day.level || 0]} cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all relative group`} title={`${dateObj.toLocaleDateString('vi-VN')}`}>
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">{dateObj.toLocaleDateString('vi-VN')}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
