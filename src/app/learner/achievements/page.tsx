"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockService, Achievement } from '@/services/mockService';
import { Trophy, Flame, Target, Lock, Zap } from 'lucide-react';

export default function AchievementsPage() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await mockService.getAchievements();
            setAchievements(data);
            setLoading(false);
        };
        load();
    }, []);

    // Mock Leaderboard Data
    const leaderboard = [
        { rank: 1, name: "Minh Anh", xp: 12500, avatar: "MA" },
        { rank: 2, name: "Your Name", xp: 11200, avatar: "YN", isMe: true },
        { rank: 3, name: "Tuan Kiet", xp: 10800, avatar: "TK" },
        { rank: 4, name: "Sarah Le", xp: 9500, avatar: "SL" },
        { rank: 5, name: "David Ng", xp: 9200, avatar: "DN" },
    ];

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-[24px] shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                                <Flame size={24} fill="currentColor" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">12</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase">Day Streak</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[24px] shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500">
                                <Trophy size={24} fill="currentColor" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">Silver</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase">Current League</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[24px] shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                                <Zap size={24} fill="currentColor" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">11.2k</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase">Total XP</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT: Achievements Grid */}
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                <Target className="text-[#007bff]" /> Thành tựu
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {achievements.map(ach => (
                                    <div key={ach.id} className={`bg-white p-6 rounded-[24px] border border-gray-100 flex gap-4 ${!ach.unlocked ? 'opacity-60 grayscale' : ''}`}>
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${ach.unlocked ? 'bg-blue-50' : 'bg-gray-100'}`}>
                                            {ach.unlocked ? ach.icon : <Lock size={24} className="text-gray-400" />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 mb-1">{ach.title}</h3>
                                            <p className="text-sm text-gray-500 mb-3">{ach.description}</p>

                                            {/* Progress Bar */}
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${ach.unlocked ? 'bg-green-500' : 'bg-gray-400'}`}
                                                    style={{ width: `${ach.progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-right text-xs font-bold text-gray-400 mt-1">{ach.progress}%</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Leaderboard */}
                        <div className="bg-white rounded-[32px] p-6 shadow-lg border border-gray-100 h-fit">
                            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                <Trophy className="text-yellow-500" /> Bảng xếp hạng tuần
                            </h2>

                            <div className="space-y-4">
                                {leaderboard.map((user, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center gap-4 p-3 rounded-xl transition-all ${user.isMe ? 'bg-blue-50 border border-blue-200 shadow-sm transform scale-105' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center font-black text-sm
                                            ${idx === 0 ? 'bg-yellow-100 text-yellow-600' :
                                                idx === 1 ? 'bg-gray-200 text-gray-600' :
                                                    idx === 2 ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}
                                        `}>
                                            {user.rank}
                                        </div>

                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">
                                            {user.avatar}
                                        </div>

                                        <div className="flex-1">
                                            <h4 className={`font-bold text-sm ${user.isMe ? 'text-[#007bff]' : 'text-gray-900'}`}>
                                                {user.name} {user.isMe && '(Bạn)'}
                                            </h4>
                                            <p className="text-xs text-gray-400">{user.xp} XP</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 text-center">
                                <button className="text-[#007bff] font-bold text-sm hover:underline">Xem tất cả</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
