"use client";
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { BarChart as BarChartIcon, Calendar, TrendingUp, Clock, CheckCircle, XCircle, Award, Target, Zap, ChevronRight, Activity, MoreHorizontal } from 'lucide-react';

export default function ReportsPage() {
    // Mock Data for Weekly Report
    const weeklyStats = {
        totalHours: 12.5,
        scenariosCompleted: 8,
        avgScore: 8.5,
        streak: 5,
        xpEarned: 1250,
        dailyActivity: [2, 4.5, 1.5, 3, 5, 4, 2] // Mon-Sun
    };

    const maxActivity = Math.max(...weeklyStats.dailyActivity, 5); // Ensure scale covers max

    const feedback = [
        { type: 'strength', text: 'Phát âm Ending Sounds (S, ED) rất tốt.' },
        { type: 'strength', text: 'Tốc độ nói trôi chảy, tự nhiên.' },
        { type: 'weakness', text: 'Cần chú ý ngữ điệu (Intonation) khi đặt câu hỏi.' },
        { type: 'weakness', text: 'Hạn chế dùng từ lặp lại (very, good) quá nhiều.' }
    ];

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="min-h-screen bg-[#F8F9FD] p-4 md:p-8 font-sans">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-blue-100 text-[#007bff] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Weekly Report</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Tổng quan tuần này</h1>
                            <p className="text-slate-500 font-bold">Tuần 1 (01/01 - 07/01/2026)</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl text-slate-700 font-bold shadow-sm hover:bg-slate-50 transition-all text-sm">
                                <Calendar size={16} /> Chọn tuần
                            </button>
                            <button className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2.5 rounded-2xl text-slate-700 font-bold shadow-sm hover:bg-slate-50 transition-all text-sm">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Hero Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Main XP Card - High Fidelity Gradient */}
                        <div className="bg-gradient-to-br from-[#2979FF] to-[#1565C0] rounded-[32px] p-8 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                            {/* Decorative Blobs */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full blur-xl -ml-5 -mb-5"></div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl w-fit shadow-inner border border-white/10">
                                    <Zap size={24} fill="currentColor" />
                                </div>
                                <span className="px-3 py-1 bg-green-400 text-green-900 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                                    +15% Growth
                                </span>
                            </div>

                            <div className="relative z-10 mt-6">
                                <h3 className="text-6xl font-black mb-1 tracking-tighter">{weeklyStats.xpEarned}</h3>
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
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">{weeklyStats.totalHours}h</p>
                                    <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[70%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div className="text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 mb-3">
                                    <div className="p-1.5 bg-green-50 text-green-500 rounded-lg"><CheckCircle size={14} /></div>
                                    Bài hoàn thành
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">{weeklyStats.scenariosCompleted}</p>
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
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">{weeklyStats.avgScore}</p>
                                    <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-md">Xuất sắc</span>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div className="text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 mb-3">
                                    <div className="p-1.5 bg-orange-50 text-orange-500 rounded-lg"><TrendingUp size={14} /></div>
                                    Chuỗi ngày
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">{weeklyStats.streak}</p>
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
                                <select className="bg-slate-50 border-none text-xs font-bold text-slate-500 rounded-lg py-1 px-2 outline-none cursor-pointer">
                                    <option>Tuần này</option>
                                    <option>Tháng này</option>
                                </select>
                            </div>

                            {/* Chart Container */}
                            <div className="flex-1 relative min-h-[250px] flex items-end justify-between px-4 pb-2 gap-4 border-b border-slate-100 border-dashed">
                                {/* Grid Lines (Background) */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 opacity-30 px-4">
                                    <div className="w-full h-px bg-slate-200 border-t border-dashed"></div>
                                    <div className="w-full h-px bg-slate-200 border-t border-dashed"></div>
                                    <div className="w-full h-px bg-slate-200 border-t border-dashed"></div>
                                    <div className="w-full h-px bg-slate-200 border-t border-dashed"></div>
                                    <div className="w-full h-px bg-transparent"></div>
                                </div>

                                {weeklyStats.dailyActivity.map((hours, i) => {
                                    const heightPercentage = (hours / maxActivity) * 100;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative z-10 h-full justify-end">
                                            {/* Tooltip */}
                                            <div className="opacity-0 group-hover:opacity-100 transition-all absolute -top-12 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-20 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                                                {hours} giờ
                                                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                                            </div>

                                            {/* Bar */}
                                            <div
                                                className={`w-full max-w-[40px] rounded-t-xl transition-all duration-500 ease-out hover:brightness-110 relative overflow-hidden
                                                    ${hours > 0
                                                        ? i === 6 ? 'bg-gradient-to-t from-[#007bff] to-blue-400 shadow-[0_10px_20px_rgba(0,123,255,0.3)]'
                                                            : 'bg-gradient-to-t from-slate-200 to-slate-300'
                                                        : 'bg-slate-100'
                                                    } 
                                                `}
                                                style={{ height: hours === 0 ? '4px' : `${heightPercentage}%` }}
                                            >
                                            </div>

                                            {/* Label */}
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${i === 6 ? 'text-[#007bff]' : 'text-slate-400'}`}>
                                                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* AI FEEDBACK */}
                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Target size={20} /></div>
                                AI Coach
                            </h3>
                            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[300px]">
                                {feedback.map((item, i) => (
                                    <div key={i} className={`p-4 rounded-2xl border transition-all hover:bg-white hover:shadow-md group ${item.type === 'strength' ? 'bg-green-50/50 border-green-100 hover:border-green-200' : 'bg-red-50/50 border-red-100 hover:border-red-200'}`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm ${item.type === 'strength' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                                {item.type === 'strength' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                            </div>
                                            <p className={`text-sm font-bold leading-relaxed ${item.type === 'strength' ? 'text-slate-700' : 'text-slate-700'}`}>
                                                {item.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1">
                                Luyện tập ngay <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
