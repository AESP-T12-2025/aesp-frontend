"use client";
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Users, Search, MessageCircle, Play, Mic, Video, Globe, Zap } from 'lucide-react';

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' or 'partners'

    // Mock Data
    const activeRooms = [
        { id: 1, topic: 'Daily Routine Discussion', level: 'Basic', participants: 3, max: 4, lang: 'English' },
        { id: 2, topic: 'Job Interview Prep', level: 'Intermediate', participants: 2, max: 2, lang: 'English' },
        { id: 3, topic: 'Travel & Culture', level: 'Any', participants: 5, max: 6, lang: 'English' },
    ];

    const onlineLearners = [
        { id: 1, name: 'Sarah Nguyen', level: 'B1', avatar: 'https://ui-avatars.com/api/?name=Sarah+Nguyen&background=random' },
        { id: 2, name: 'David Tran', level: 'A2', avatar: 'https://ui-avatars.com/api/?name=David+Tran&background=random' },
        { id: 3, name: 'Mike Chen', level: 'C1', avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=random' },
        { id: 4, name: 'Jenny Pham', level: 'B2', avatar: 'https://ui-avatars.com/api/?name=Jenny+Pham&background=random' },
    ];

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Social Learning</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Cộng đồng học tập</h1>
                            <p className="text-slate-500 font-medium">Luyện tập cùng bạn bè và nhận hỗ trợ từ AI.</p>
                        </div>
                        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex">
                            <button
                                onClick={() => setActiveTab('rooms')}
                                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'rooms' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Phòng luyện nói
                            </button>
                            <button
                                onClick={() => setActiveTab('partners')}
                                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'partners' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Tìm bạn học
                            </button>
                        </div>
                    </div>

                    {/* CONTENT AREA */}
                    {activeTab === 'rooms' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Create Room Card */}
                            <div className="bg-indigo-600 rounded-[32px] p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-200 group cursor-pointer hover:bg-indigo-700 transition-colors">
                                <div>
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                        <Zap size={24} fill="currentColor" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-2">Tạo phòng nhanh</h3>
                                    <p className="text-indigo-100 text-sm font-medium">Bạn chọn chủ đề, AI sẽ điều phối cuộc trò chuyện.</p>
                                </div>
                                <div className="mt-8 flex items-center gap-2 font-bold">
                                    Bắt đầu ngay <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center"><Play size={14} fill="currentColor" /></div>
                                </div>
                            </div>

                            {activeRooms.map(room => (
                                <div key={room.id} className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${room.level === 'Basic' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {room.level}
                                            </span>
                                            <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                                                <Users size={14} /> {room.participants}/{room.max}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{room.topic}</h3>
                                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
                                            <Globe size={12} /> {room.lang}
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {[...Array(room.participants)].map((_, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                    U{i + 1}
                                                </div>
                                            ))}
                                        </div>
                                        <button className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors">
                                            Tham gia
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-4 mb-8 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                <Search className="text-slate-400 ml-2" />
                                <input
                                    className="bg-transparent outline-none flex-1 font-medium text-slate-700"
                                    placeholder="Tìm học viên theo tên hoặc trình độ..."
                                />
                            </div>

                            <div className="space-y-4">
                                {onlineLearners.map(user => (
                                    <div key={user.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-xl" />
                                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{user.name}</h4>
                                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{user.level}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                                                <MessageCircle size={20} />
                                            </button>
                                            <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2">
                                                <Video size={14} /> Mời gọi
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
