"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { gamificationService } from '@/services/gamificationService';
import { learnerService } from '@/services/learnerService';
import toast from 'react-hot-toast';
import { Loader2, Trophy, Target, Zap, Flame, Gift, Calendar, Star, Lock, Users, Medal } from 'lucide-react';

interface Challenge {
    id: number;
    title: string;
    description: string;
    points_reward: number;
    challenge_type?: string;
    progress?: number;
    target_value?: number;
    unlocked?: boolean;
    claimed?: boolean;
    joined?: boolean;
}

interface LeaderboardEntry {
    user_name: string;
    total_xp: number;
}

export default function ChallengesPage() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [myProgress, setMyProgress] = useState<any[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalCompleted: 0, totalXP: 0, currentStreak: 0 });
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Load challenges
            const challengesData = await gamificationService.getChallenges();
            setChallenges(challengesData);
            
            // Load my progress
            const progressData = await gamificationService.getMyProgress();
            setMyProgress(progressData);
            
            // Calculate stats from progress
            const completed = progressData.filter((p: any) => p.unlocked).length;
            const totalXP = progressData.reduce((sum: number, p: any) => {
                return sum + (p.unlocked && p.claimed ? p.points : 0);
            }, 0);
            
            // Load streak
            try {
                const streakData = await learnerService.getStreak();
                setStats({
                    totalCompleted: completed,
                    totalXP: totalXP,
                    currentStreak: streakData.current_streak || 0
                });
            } catch (e) {
                setStats({ totalCompleted: completed, totalXP: totalXP, currentStreak: 0 });
            }
            
            // Load leaderboard
            try {
                const leaderboardData = await gamificationService.getLeaderboard();
                setLeaderboard(leaderboardData);
            } catch (e) {
                console.error("Error loading leaderboard:", e);
            }
        } catch (e) {
            console.error(e);
            toast.error("Lỗi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinChallenge = async (challengeId: number) => {
        try {
            await gamificationService.joinChallenge(challengeId);
            toast.success("Đã tham gia thử thách!");
            loadData();
        } catch (e: any) {
            if (e.response?.status === 400 && e.response?.data?.message?.includes("Already")) {
                toast.success("Bạn đã tham gia thử thách này rồi!");
            } else {
                toast.error("Lỗi tham gia thử thách");
            }
        }
    };

    const handleClaimReward = async (challengeId: number) => {
        try {
            const result = await gamificationService.claimReward(challengeId);
            toast.success(`Đã nhận ${result.points} XP!`);
            loadData();
        } catch (e: any) {
            toast.error(e.response?.data?.detail || "Lỗi nhận phần thưởng");
        }
    };

    const getChallengeColor = (challengeType?: string) => {
        switch (challengeType) {
            case 'SPEAKING_TIME': return 'from-blue-500 to-cyan-500';
            case 'VOCAB_COUNT': return 'from-purple-500 to-pink-500';
            case 'STREAK': return 'from-orange-500 to-red-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getChallengeTypeLabel = (challengeType?: string) => {
        switch (challengeType) {
            case 'SPEAKING_TIME': return 'Luyện nói';
            case 'VOCAB_COUNT': return 'Từ vựng';
            case 'STREAK': return 'Streak';
            default: return 'Thử thách';
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

                {/* Leaderboard Toggle */}
                <div className="mb-6 flex justify-end">
                    <button
                        onClick={() => setShowLeaderboard(!showLeaderboard)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                        <Users size={20} />
                        {showLeaderboard ? 'Ẩn' : 'Hiện'} Bảng Xếp Hạng
                    </button>
                </div>

                {/* Leaderboard */}
                {showLeaderboard && (
                    <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">
                        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                            <Medal className="text-yellow-500" /> Bảng Xếp Hạng
                        </h3>
                        <div className="space-y-2">
                            {leaderboard.length > 0 ? (
                                leaderboard.map((entry, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-white ${
                                                index === 0 ? 'bg-yellow-500' : 
                                                index === 1 ? 'bg-gray-400' : 
                                                index === 2 ? 'bg-orange-500' : 
                                                'bg-gray-300'
                                            }`}>
                                                {index + 1}
                                            </div>
                                            <span className="font-bold text-slate-900">{entry.user_name}</span>
                                        </div>
                                        <span className="font-black text-purple-600">{entry.total_xp.toLocaleString()} XP</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-center py-4">Chưa có dữ liệu bảng xếp hạng</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Challenges */}
                <div className="space-y-4">
                    {myProgress.length > 0 ? (
                        myProgress.map((progress: any) => {
                            const challenge = challenges.find(c => c.id === progress.id);
                            if (!challenge) return null;
                            
                            return (
                                <ChallengeCard
                                    key={progress.id}
                                    challenge={challenge}
                                    progress={progress}
                                    onJoin={() => handleJoinChallenge(progress.id)}
                                    onClaim={() => handleClaimReward(progress.id)}
                                    color={getChallengeColor(challenge.challenge_type)}
                                />
                            );
                        })
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            <p>Chưa có thử thách nào</p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}

function ChallengeCard({ 
    challenge, 
    progress, 
    color, 
    onJoin, 
    onClaim 
}: { 
    challenge: Challenge; 
    progress?: any;
    color: string;
    onJoin?: () => void;
    onClaim?: () => void;
}) {
    const progressPercent = progress ? progress.progress : 0;
    const target = challenge.target_value || progress?.target_value || 100;
    const isCompleted = progress?.unlocked || false;
    const isClaimed = progress?.claimed || false;
    const isJoined = progress?.joined || false;

    return (
        <div className={`bg-white rounded-2xl border shadow-sm p-5 ${isCompleted && isClaimed ? 'opacity-60' : ''}`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900">{challenge.title}</h4>
                        {challenge.challenge_type && (
                            <span className="px-2 py-1 text-xs font-bold bg-gray-100 text-gray-600 rounded-full">
                                {challenge.challenge_type === 'SPEAKING_TIME' ? '⏱️' : 
                                 challenge.challenge_type === 'VOCAB_COUNT' ? '📚' : 
                                 challenge.challenge_type === 'STREAK' ? '🔥' : ''}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-500">{challenge.description}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${color} text-white`}>
                    +{challenge.points_reward || 0} XP
                </div>
            </div>

            {isJoined ? (
                <>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-slate-600">Tiến độ</span>
                            <span className="font-bold">{progressPercent}%</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
                                style={{ width: `${Math.min(progressPercent, 100)}%` }}
                            />
                        </div>
                    </div>

                    {isCompleted && !isClaimed && (
                        <button
                            onClick={onClaim}
                            className="mt-4 w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                        >
                            <Gift size={16} className="inline mr-2" />
                            Nhận Phần Thưởng
                        </button>
                    )}

                    {isCompleted && isClaimed && (
                        <div className="mt-3 flex items-center gap-2 text-green-600 font-bold text-sm">
                            <Trophy size={16} /> Đã hoàn thành và nhận thưởng!
                        </div>
                    )}
                </>
            ) : (
                <button
                    onClick={onJoin}
                    className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                    Tham Gia Thử Thách
                </button>
            )}
        </div>
    );
}
