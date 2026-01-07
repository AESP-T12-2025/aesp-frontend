"use client";
import React from 'react';
import { Check, Lock, Play, Star, Trophy, MapPin, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LearningPathPage() {
    const levels = [
        {
            id: 1,
            title: 'Khởi động',
            description: 'Làm quen với tiếng Anh cơ bản',
            status: 'completed',
            totalStars: 3,
            lessons: [
                { id: 'l1', title: 'Start Here', type: 'video', status: 'completed' },
                { id: 'l2', title: 'Greetings', type: 'practice', status: 'completed' },
            ]
        },
        {
            id: 2,
            title: 'Cơ bản 1',
            description: 'Giao tiếp hàng ngày',
            status: 'current',
            totalStars: 1,
            lessons: [
                { id: 'l3', title: 'Daily Routine', type: 'speaking', status: 'unlocked' },
                { id: 'l4', title: 'Ordering Food', type: 'roleplay', status: 'locked' },
                { id: 'l5', title: 'Family & Friends', type: 'vocab', status: 'locked' },
            ]
        },
        {
            id: 3,
            title: 'Cơ bản 2',
            description: 'Mở rộng vốn từ vựng',
            status: 'locked',
            totalStars: 0,
            lessons: [
                { id: 'l6', title: 'Shopping', type: 'practice', status: 'locked' },
                { id: 'l7', title: 'Directions', type: 'speaking', status: 'locked' },
            ]
        },
        {
            id: 4,
            title: 'Trung cấp 1',
            description: 'Thảo luận chủ đề công việc',
            status: 'locked',
            totalStars: 0,
            lessons: []
        }
    ];

    return (
        <div className="min-h-screen bg-[#F0F4F8] pb-20 overflow-hidden font-sans">
            {/* Header / Hero */}
            <div className="bg-white pt-10 pb-20 px-4 text-center rounded-b-[48px] shadow-sm relative z-10">
                <div className="inline-block p-1 bg-yellow-50 rounded-full mb-4 border border-yellow-100">
                    <div className="px-4 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-sm">
                        <Trophy size={14} /> Level: B1 Intermediate
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">Lộ trình học tập</h1>
                <p className="text-slate-500 font-medium max-w-lg mx-auto">
                    Tiếp tục hành trình chinh phục tiếng Anh của bạn. Hoàn thành các bài học để mở khóa cấp độ mới!
                </p>
            </div>

            {/* Path Container */}
            <div className="max-w-2xl mx-auto px-4 -mt-10 relative z-20">
                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute left-8 top-10 bottom-10 w-1 bg-slate-200 rounded-full z-0 ml-7"></div>

                    {/* Level Nodes */}
                    <div className="space-y-12">
                        {levels.map((level, index) => (
                            <div key={level.id} className="relative z-10 group">
                                <div className="flex items-start gap-6">
                                    {/* Icon / Status Indicator */}
                                    <div className={`
                                        w-20 h-20 rounded-[28px] flex items-center justify-center shrink-0 shadow-lg border-4 transition-all duration-300 relative
                                        ${level.status === 'completed'
                                            ? 'bg-green-500 border-green-200 text-white translate-y-2'
                                            : level.status === 'current'
                                                ? 'bg-[#007bff] border-blue-200 text-white scale-110 shadow-blue-300 animate-pulse-slow'
                                                : 'bg-white border-slate-100 text-slate-300'
                                        }
                                    `}>
                                        {level.status === 'completed' ? <Check size={32} strokeWidth={3} /> :
                                            level.status === 'current' ? <Play size={32} fill="currentColor" className="ml-1" /> :
                                                <Lock size={28} />}

                                        {/* Stars Badge */}
                                        {level.status !== 'locked' && (
                                            <div className="absolute -bottom-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-1 rounded-full shadow-sm flex items-center gap-1 border-2 border-white">
                                                {level.totalStars}/3 <Star size={10} fill="currentColor" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Card */}
                                    <div className={`
                                        flex-1 bg-white p-6 rounded-[32px] shadow-lg border transition-all duration-300
                                        ${level.status === 'current'
                                            ? 'border-blue-100 shadow-xl ring-4 ring-blue-50/50'
                                            : 'border-slate-100 hover:border-slate-200'
                                        }
                                        ${level.status === 'locked' ? 'opacity-60 grayscale' : 'opacity-100'}
                                    `}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className={`text-xl font-black mb-1 ${level.status === 'current' ? 'text-[#007bff]' : 'text-slate-900'}`}>{level.title}</h3>
                                                <p className="text-slate-500 font-medium text-sm">{level.description}</p>
                                            </div>
                                            {level.status === 'current' && (
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-full tracking-wider animate-bounce">
                                                    Current
                                                </span>
                                            )}
                                        </div>

                                        {/* Lessons List (Only show for active/completed levels or if users click expand - keeping it simple for now) */}
                                        {level.lessons.length > 0 && (
                                            <div className="space-y-3 mt-4">
                                                {level.lessons.map((lesson) => (
                                                    <div
                                                        key={lesson.id}
                                                        className={`
                                                            flex items-center justify-between p-3 rounded-2xl border transition-colors
                                                            ${lesson.status === 'unlocked'
                                                                ? 'bg-blue-50 border-blue-100 cursor-pointer hover:bg-blue-100 group/item'
                                                                : 'bg-slate-50 border-slate-100'
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${lesson.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-white text-slate-400'}`}>
                                                                {lesson.status === 'completed' ? <Check size={14} /> : (lesson.type === 'video' ? '📺' : '🗣️')}
                                                            </div>
                                                            <span className={`font-bold text-sm ${lesson.status === 'unlocked' ? 'text-slate-900' : 'text-slate-500'}`}>{lesson.title}</span>
                                                        </div>

                                                        {lesson.status === 'unlocked' && (
                                                            <Link href={`/learner/practice/1`} className="w-8 h-8 bg-[#007bff] text-white rounded-full flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform">
                                                                <Play size={14} fill="currentColor" />
                                                            </Link>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Final Trophy */}
                    <div className="relative z-10 flex items-center gap-6 mt-12 pb-20 opacity-50">
                        <div className="w-20 h-20 rounded-[28px] bg-slate-200 flex items-center justify-center text-slate-400 border-4 border-slate-100 ml-7">
                            <Trophy size={32} />
                        </div>
                        <p className="font-bold text-slate-400 text-lg">Hoàn thành khóa học</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
