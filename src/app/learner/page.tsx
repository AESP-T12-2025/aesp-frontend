'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Trophy, Map, Crown, Zap, Target, Flame } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { proficiencyService } from '@/services/proficiencyService';
import { useState, useEffect } from 'react';
import type { LearningPath } from '@/types';

export default function LearnerDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    practiceDays: 0,
    xp: 0,
    rank: 'Bronze',
    streak: 0
  });

  const [currentPath, setCurrentPath] = useState<LearningPath | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { userService } = await import('@/services/userService');
      const { proficiencyService } = await import('@/services/proficiencyService');

      const [statsData, pathData] = await Promise.all([
        userService.getStats(),
        proficiencyService.getMyPath()
      ]);

      setCurrentPath(pathData);
      setStats({
        practiceDays: statsData.lessons_completed || 0,
        xp: statsData.xp || 0,
        rank: getRank(statsData.xp || 0),
        streak: statsData.streak || 0
      });
    } catch {
      // Failed to load dashboard data - user may not have completed assessment yet
    }
  };

  const getRank = (xp: number) => {
    if (xp > 1000) return 'Gold';
    if (xp > 500) return 'Silver';
    return 'Bronze';
  }

  const statItems = [
    { label: 'Chuỗi ngày', value: `${stats.streak} 🔥`, icon: <Flame size={24} />, color: 'bg-red-100 text-red-600' },
    { label: 'Điểm XP', value: stats.xp.toLocaleString(), icon: <Target size={24} />, color: 'bg-blue-100 text-blue-600' },
    { label: 'Bài học xong', value: stats.practiceDays.toString(), icon: <Zap size={24} />, color: 'bg-orange-100 text-orange-600' },
    { label: 'Hạng', value: stats.rank, icon: <Trophy size={24} />, color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10">

      {/* 1. WELCOME SECTION */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Chào {user?.full_name?.split(' ').pop()}! 👋</h1>
          <p className="text-gray-500 font-medium">Bạn đã sẵn sàng chinh phục mục tiêu hôm nay chưa?</p>
        </div>
        <Link href="/learner/achievements" className="hidden md:flex items-center gap-2 text-indigo-600 font-bold hover:underline">
          Xem bảng xếp hạng <ArrowRight size={18} />
        </Link>
      </header>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statItems.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">{stat.label}</p>
              <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 3. MAIN ACTION CARDS (The "New Stuff") */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Card 1: Continue Learning */}
        <Link href="/learner/path" className="group bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden col-span-1 lg:col-span-2">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
            <Map size={160} className="text-indigo-600" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Map size={24} />
            </div>
            {currentPath ? (
              <>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Lộ trình học tập</h3>
                <p className="text-gray-500 font-medium mb-8 max-w-sm">
                  Trình độ hiện tại: <span className="text-indigo-600 font-bold">{currentPath.current_level}</span>
                  <br />
                  <span className="text-sm">Tiếp tục bài học tiếp theo trong lộ trình của bạn.</span>
                </p>
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold group-hover:bg-indigo-700 transition-colors">
                  Tiếp tục học {currentPath.current_level} <ArrowRight size={20} />
                </span>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Lộ trình học tập</h3>
                <p className="text-gray-500 font-medium mb-8 max-w-sm">Chưa có lộ trình. Hãy làm bài kiểm tra ngay!</p>
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-gray-400 text-white rounded-xl font-bold">
                  Chưa kích hoạt
                </span>
              </>
            )}
          </div>
        </Link>

        {/* Card 2: Assessment */}
        <Link href="/learner/assessment" className="group bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[32px] p-8 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <Target size={24} />
          </div>
          <h3 className="text-2xl font-black mb-2">Kiểm tra trình độ</h3>
          <p className="text-indigo-100 font-medium mb-8">Làm bài test ngắn để AI tối ưu lộ trình học cho bạn.</p>
          <span className="inline-flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all">
            Làm bài ngay <ArrowRight size={20} />
          </span>
        </Link>

        {/* Card 3: Upgrade */}
        <Link href="/learner/packages" className="group bg-gray-900 rounded-[32px] p-8 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 text-yellow-400">
            <Crown size={24} fill="currentColor" />
          </div>
          <h3 className="text-2xl font-black mb-2 text-yellow-400">Nâng cấp Pro</h3>
          <p className="text-gray-400 font-medium mb-8">Mở khóa Mentor 1-1 và tính năng AI không giới hạn.</p>
          <span className="inline-flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all">
            Xem các gói <ArrowRight size={20} />
          </span>
        </Link>

        {/* Card 4: Scenarios (Existing) */}
        <Link href="/learner/scenarios" className="group bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all lg:col-span-2">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Luyện tập tự do</h3>
              <p className="text-gray-500 font-medium mb-6">Chọn chủ đề bất kỳ và bắt đầu hội thoại với AI ngay lập tức.</p>
              <span className="text-green-600 font-bold group-hover:underline">Khám phá thư viện chủ đề &rarr;</span>
            </div>
            <div className="w-full md:w-48 h-32 bg-green-50 rounded-2xl flex items-center justify-center text-green-200">
              {/* Placeholder image/illustration */}
              <Zap size={64} />
            </div>
          </div>
        </Link>
      </div>

    </div>
  );
}