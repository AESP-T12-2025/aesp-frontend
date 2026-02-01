"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { gamificationService } from '@/services/gamificationService';
import toast from 'react-hot-toast';
import { Loader2, Trophy, Target, Zap, Flame, Gift, Calendar, Star, Lock } from 'lucide-react';

interface Challenge {
    id: number;
    title: string;
    description: string;
    xp_reward: number;
    type: 'daily' | 'weekly' | 'special';
    progress: number;
    target: number;
    completed: boolean;
    expires_at?: string;
}

export default function ChallengesPage() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalCompleted: 0, totalXP: 0, currentStreak: 0 });

    useEffect(() => {
        loadChallenges();
    }, []);

    const loadChallenges = async () => {
        try {
            // Fetch real challenges from backend
            const [challengesData, progressData] = await Promise.all([
                gamificationService.getChallenges(),
                gamificationService.getMyProgress()
            ]);

            // Map backend data to our Challenge interface
            const mappedChallenges = (challengesData || []).map((c: any) => ({
                id: c.challenge_id || c.id,
                title: c.title || c.name,
                description: c.description,
                xp_reward: c.points_reward || c.xp_reward || 0,
                type: c.challenge_type?.toLowerCase() || c.type || 'daily',
                progress: c.progress || 0,
                target: c.target || 1,
                completed: c.completed || c.status === 'COMPLETED',
                expires_at: c.end_date || c.expires_at
            }));

            setChallenges(mappedChallenges);

            // Set stats from progress data
            setStats({
                totalCompleted: progressData?.challenges_completed || progressData?.total_completed || 0,
                totalXP: progressData?.total_xp || progressData?.xp || 0,
                currentStreak: progressData?.streak || progressData?.current_streak || 0
            });
        } catch (e) {
            console.error("Error loading challenges:", e);
            toast.error("Lỗi tải thử thách");
        } finally {
            setLoading(false);
        }
    };

    const getChallengeColor = (type: string) => {
        switch (type) {
            case 'daily': return 'from-blue-500 to-cyan-500';
            case 'weekly': return 'from-purple-500 to-pink-500';
            case 'special': return 'from-orange-500 to-red-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getChallengeIcon = (type: string) => {
        switch (type) {
            case 'daily': return <Calendar size={20} />;
            case 'weekly': return <Target size={20} />;
            case 'special': return <Star size={20} />;
            default: return <Gift size={20} />;
        }
    };

    if (loading) {
        return (
            <ProtectedRoute allowedRoles={['LEARNER']}>
                <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="p-8 max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Trophy className="text-yellow-500" /> Thử Thách & Phần Thưởng
                    </h1>
                    <p className="text-slate-500 mt-1">Hoàn thành thử thách để nhận XP và mở khóa thành tựu</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-3xl text-white">
                        <Trophy className="mb-2" size={28} />
                        <p className="text-green-100 text-sm font-bold">Đã hoàn thành</p>
                        <p className="text-4xl font-black">{stats.totalCompleted}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-3xl text-white">
                        <Zap className="mb-2" size={28} />
                        <p className="text-purple-100 text-sm font-bold">Tổng XP kiếm</p>
                        <p className="text-4xl font-black">{stats.totalXP.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-3xl text-white">
                        <Flame className="mb-2" size={28} />
                        <p className="text-orange-100 text-sm font-bold">Streak hiện tại</p>
                        <p className="text-4xl font-black">{stats.currentStreak} 🔥</p>
                    </div>
                </div>

                {/* Challenges */}
                <div className="space-y-4">
                    {/* Daily */}
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Calendar className="text-blue-500" /> Thử thách hàng ngày</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {challenges.filter(c => c.type === 'daily').map(c => (
                            <ChallengeCard key={c.id} challenge={c} color={getChallengeColor(c.type)} />
                        ))}
                    </div>

                    {/* Weekly */}
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Target className="text-purple-500" /> Thử thách hàng tuần</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {challenges.filter(c => c.type === 'weekly').map(c => (
                            <ChallengeCard key={c.id} challenge={c} color={getChallengeColor(c.type)} />
                        ))}
                    </div>

                    {/* Special */}
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Star className="text-orange-500" /> Thử thách đặc biệt</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {challenges.filter(c => c.type === 'special').map(c => (
                            <ChallengeCard key={c.id} challenge={c} color={getChallengeColor(c.type)} />
                        ))}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

function ChallengeCard({ challenge, color }: { challenge: Challenge; color: string }) {
    const progressPercent = (challenge.progress / challenge.target) * 100;

    return (
        <div className={`bg-white rounded-2xl border shadow-sm p-5 ${challenge.completed ? 'opacity-60' : ''}`}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-bold text-slate-900">{challenge.title}</h4>
                    <p className="text-sm text-slate-500">{challenge.description}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${color} text-white`}>
                    +{challenge.xp_reward} XP
                </div>
            </div>

            <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-600">Tiến độ</span>
                    <span className="font-bold">{challenge.progress}/{challenge.target}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                </div>
            </div>

            {challenge.completed && (
                <div className="mt-3 flex items-center gap-2 text-green-600 font-bold text-sm">
                    <Trophy size={16} /> Đã hoàn thành!
                </div>
            )}
        </div>
    );
}
