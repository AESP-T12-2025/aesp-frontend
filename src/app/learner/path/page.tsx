"use client";
import React from 'react';
import { Check, Lock, Play, Star, Trophy, MapPin, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LearningPathPage() {
    const [path, setPath] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        loadPath();
    }, []);

    const loadPath = async () => {
        try {
            const { proficiencyService } = await import('@/services/proficiencyService');
            const data = await proficiencyService.getMyPath();
            setPath(data);
        } catch (e) {
            console.error("Failed to load path:", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải lộ trình...</div>;
    if (!path) return <div className="min-h-screen flex items-center justify-center">Chưa có lộ trình. Hãy làm bài kiểm tra trước!</div>;

    // Parse roadmap if simple strings, or use real objects if available
    // Backend returns list of strings like "Scenario: Title"
    const roadmapItems = Array.isArray(path.roadmap) ? path.roadmap : [];

    return (
        <div className="min-h-screen bg-[#F0F4F8] pb-20 overflow-hidden font-sans">
            {/* Header / Hero */}
            <div className="bg-white pt-10 pb-20 px-4 text-center rounded-b-[48px] shadow-sm relative z-10">
                <div className="inline-block p-1 bg-yellow-50 rounded-full mb-4 border border-yellow-100">
                    <div className="px-4 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-sm">
                        <Trophy size={14} /> Level: {path.current_level}
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">Lộ trình học tập</h1>
                <p className="text-slate-500 font-medium max-w-lg mx-auto">
                    Mục tiêu: {path.target_level}. Hoàn thành các bài học để nâng cấp trình độ!
                </p>
            </div>

            {/* Path Container */}
            <div className="max-w-2xl mx-auto px-4 -mt-10 relative z-20">
                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute left-8 top-10 bottom-10 w-1 bg-slate-200 rounded-full z-0 ml-7"></div>

                    {/* Dynamic Nodes */}
                    <div className="space-y-12">
                        {roadmapItems.map((item: string, index: number) => (
                            <div key={index} className="relative z-10 group">
                                <div className="flex items-start gap-6">
                                    <div className="w-20 h-20 rounded-[28px] bg-[#007bff] border-4 border-blue-200 text-white flex items-center justify-center shadow-lg">
                                        <Play size={32} fill="currentColor" />
                                    </div>
                                    <div className="flex-1 bg-white p-6 rounded-[32px] shadow-lg border border-blue-100">
                                        <h3 className="text-xl font-black text-slate-900 mb-2">{item}</h3>
                                        <Link href={`/learner/scenarios`} className="text-blue-600 font-bold hover:underline">
                                            Bắt đầu học &rarr;
                                        </Link>
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
