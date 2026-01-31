"use client";
import React from 'react';
import { Check, Lock, Play, Star, Trophy, MapPin, ChevronRight, Zap, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function LearningPathPage() {
    const [path, setPath] = React.useState<any>(null);
    const [personalized, setPersonalized] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        loadPath();
    }, []);

    const loadPath = async () => {
        try {
            const { proficiencyService } = await import('@/services/proficiencyService');
            // Fetch both standard path (roadmap list) and personalized suggestions
            const [pathData, personalizedData] = await Promise.all([
                proficiencyService.getMyPath(),
                proficiencyService.getPersonalizedPath().catch(() => null)
            ]);
            
            setPath(pathData);
            setPersonalized(personalizedData);
        } catch (e) {
            console.error("Failed to load path");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Zap className="animate-spin text-blue-600 mr-2" /> Đang tải lộ trình...</div>;
    if (!path) return <div className="min-h-screen flex items-center justify-center">Chưa có lộ trình. Hãy làm bài kiểm tra trước!</div>;

    const roadmapItems = Array.isArray(path.roadmap) ? path.roadmap : [];
    const recommendedTopics = personalized?.recommended_topics || [];

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
            {/* Header / Hero */}
            <div className="bg-white pt-10 pb-16 px-4 text-center border-b border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                
                <div className="inline-block p-1 bg-blue-50 rounded-full mb-6 mt-4">
                    <div className="px-5 py-1.5 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-200">
                        <Trophy size={14} /> Level: {path.current_level}
                    </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Lộ trình học tập</h1>
                
                <div className="flex justify-center items-center gap-2 text-gray-500 font-medium">
                    <span>Current: <b className="text-gray-900">{path.current_level}</b></span>
                    <ChevronRight size={16} />
                    <span>Next Milestone: <b className="text-green-600">{personalized?.next_milestone || 'Next Level'}</b></span>
                    <ChevronRight size={16} />
                    <span>Goal: <b className="text-purple-600">{path.target_level}</b></span>
                </div>
                
                <div className="mt-8 w-full max-w-lg mx-auto bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-1/3 rounded-full relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md"></div>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-wide">35% to next level</p>
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10 space-y-8">
                
                {/* 1. Personalized Recommendations (Adaptive) */}
                <div className="bg-white rounded-[32px] p-8 shadow-xl border border-blue-50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900">Đề xuất cho bạn (Adaptive)</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendedTopics.map((topic: any, idx: number) => (
                            <Link 
                                href={`/learner/topics/${topic.id}`}
                                key={idx}
                                className="group p-5 rounded-[24px] border border-gray-100 bg-gray-50 hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 shadow-sm flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{topic.name}</h4>
                                    <span className="text-xs font-bold text-gray-400 uppercase">{topic.difficulty}</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white text-gray-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <ChevronRight size={16} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 2. Standard Roadmap */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                     <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center">
                            <MapPin size={20} />
                        </div>
                        <h2 className="text-xl font-black text-gray-900">Lộ trình chi tiết</h2>
                    </div>

                    <div className="space-y-0 relative pl-4">
                        {/* Vertical Line */}
                        <div className="absolute left-[34px] top-4 bottom-4 w-1 bg-gray-100 rounded-full"></div>

                        {roadmapItems.map((item: string, index: number) => (
                            <div key={index} className="relative z-10 py-6 pl-12 group">
                                {/* Node dot */}
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-4 border-white bg-gray-200 shadow-sm flex items-center justify-center group-hover:bg-blue-500 group-hover:scale-110 transition-all z-20">
                                    {index === 0 ? <Play size={14} className="text-gray-500 group-hover:text-white ml-0.5" fill="currentColor" /> : 
                                     <Lock size={14} className="text-gray-400 group-hover:text-white" />}
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-[24px] border border-transparent bg-transparent hover:bg-gray-50 hover:border-gray-100 transition-all cursor-pointer">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg mb-1">{item}</h3>
                                        <p className="text-sm text-gray-400 font-medium">Lesson {index + 1}</p>
                                    </div>
                                    <Link href="/learner/scenarios" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-black hover:text-white hover:border-black transition-all text-sm whitespace-nowrap text-center shadow-sm">
                                        Bắt đầu
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
