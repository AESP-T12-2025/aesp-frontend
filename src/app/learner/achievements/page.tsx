"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { gamificationService } from '@/services/gamificationService';
import { userService, UserStats } from '@/services/userService';
import { useAuth } from '@/context/AuthContext'; // Import Auth
import { Trophy, Flame, Target, Lock, Zap } from 'lucide-react';

export default function AchievementsPage() {
    const { user } = useAuth();
    const [achievements, setAchievements] = useState<any[]>([]);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const [achData, lbData, statsData] = await Promise.all([
                gamificationService.getMyProgress(),
                gamificationService.getLeaderboard(),
                userService.getStats()
            ]);
            setAchievements(achData);
            setLeaderboard(lbData);
            setUserStats(statsData);
        } catch (e) {
            console.error("Failed to load gamification data");
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async (id: number) => {
        try {
            await gamificationService.claimReward(id);
            // Reload to update UI
            load();
            // Better: Optimistic update or toast
            // import toast from 'react-hot-toast';
            // toast.success("Claimed successfully!");
        } catch (e) {
            console.error("Failed to claim");
        }
    }

    // Helper to get initials
    const getInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'UK';

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
                                <h3 className="text-2xl font-black text-gray-900">{userStats?.streak || 0}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase">Day Streak</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[24px] shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500">
                                <Trophy size={24} fill="currentColor" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">{userStats?.level || 'Beginner'}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase">Current Level</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[24px] shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                                <Zap size={24} fill="currentColor" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">{userStats?.xp || 0}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase">Total XP</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[24px] shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-500">
                                <Target size={24} fill="currentColor" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">{userStats?.lessons_completed || 0}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase">Completed</p>
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
                                            {ach.unlocked ? '🏆' : <Lock size={24} className="text-gray-400" />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 mb-1">{ach.title}</h3>
                                            <p className="text-sm text-gray-500 mb-3">{ach.description}</p>

                                            {/* Progress Bar */}
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                                                <div
                                                    className={`h-full rounded-full ${ach.unlocked ? 'bg-green-500' : 'bg-gray-400'}`}
                                                    style={{ width: `${ach.progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-xs font-bold text-gray-400">{ach.progress}%</div>
                                                {ach.unlocked && !ach.claimed && (
                                                    <button
                                                        onClick={() => handleClaim(ach.id)}
                                                        className="px-3 py-1 bg-yellow-400 text-white text-xs font-bold rounded-full hover:bg-yellow-500 shadow-sm animate-bounce"
                                                    >
                                                        Nhận {ach.points} XP
                                                    </button>
                                                )}
                                                {ach.claimed && (
                                                    <span className="text-xs font-bold text-green-500">Đã nhận ✔</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {achievements.length === 0 && <div className="col-span-2 text-center text-gray-500">Chưa có thành tựu nào.</div>}
                            </div>
                        </div>

                        {/* RIGHT: Leaderboard */}
                        <div className="bg-white rounded-[32px] p-6 shadow-lg border border-gray-100 h-fit">
                            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                <Trophy className="text-yellow-500" /> Bảng xếp hạng
                            </h2>

                            <div className="space-y-4">
                                {leaderboard.map((u, idx) => {
                                    const isMe = u.user_name === user?.full_name;
                                    return (
                                        <div
                                            key={idx}
                                            className={`flex items-center gap-4 p-3 rounded-xl transition-all ${isMe ? 'bg-blue-50 border border-blue-200 shadow-sm transform scale-105' : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center font-black text-sm
                                            ${idx === 0 ? 'bg-yellow-100 text-yellow-600' :
                                                    idx === 1 ? 'bg-gray-200 text-gray-600' :
                                                        idx === 2 ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}
                                        `}>
                                                {idx + 1}
                                            </div>

                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">
                                                {getInitials(u.user_name)}
                                            </div>

                                            <div className="flex-1">
                                                <h4 className={`font-bold text-sm ${isMe ? 'text-[#007bff]' : 'text-gray-900'}`}>
                                                    {u.user_name} {isMe && '(Bạn)'}
                                                </h4>
                                                <p className="text-xs text-gray-400">{u.total_xp} XP</p>
                                            </div>
                                        </div>
                                    )
                                })}
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
