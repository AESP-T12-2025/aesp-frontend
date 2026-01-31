"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, Clock, BarChart, ChevronRight, Lock } from 'lucide-react';
import Link from 'next/link';
import { scenarioService, Scenario } from '@/services/scenarioService';
import { topicService, Topic } from '@/services/topicService';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function TopicDetailPage() {
    const params = useParams();
    const topicId = params.id as string;
    const [topic, setTopic] = useState<Topic | null>(null);
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!topicId) return;
            try {
                const [topicData, scenariosData] = await Promise.all([
                    topicService.getById(topicId),
                    scenarioService.getByTopicId(topicId)
                ]);
                setTopic(topicData);
                setScenarios(scenariosData);
            } catch (error) {
                toast.error("Không thể tải nội dung bài học");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [topicId]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#007bff]" size={40} /></div>;
    if (!topic) return <div className="p-8 text-center text-gray-500">Topic not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* HERRO BANNER */}
            <div className="relative bg-[#007bff] text-white pt-12 pb-32 px-4 overflow-hidden rounded-b-[48px] shadow-2xl shadow-blue-200">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <Link href="/learner/topics" className="inline-flex items-center text-blue-100 hover:text-white mb-8 transition-colors font-bold group">
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Quay lại thư viện
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <img
                            src={topic.image_url || `https://ui-avatars.com/api/?name=${topic.name}&background=random&size=200`}
                            alt={topic.name}
                            className="w-32 h-32 rounded-3xl object-cover shadow-2xl border-4 border-white/20"
                        />
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">Topic</span>
                                <span className="px-3 py-1 bg-green-400/20 text-green-100 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {scenarios.length} Bài học
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{topic.name}</h1>
                            <p className="text-blue-100 text-lg max-w-2xl font-medium leading-relaxed">
                                {topic.description || "Khám phá các tình huống hội thoại thực tế và luyện tập kỹ năng nói cùng AI."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SCENARIO LIST */}
            <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-20 space-y-6">
                {scenarios.map((scenario, index) => (
                    <div
                        key={scenario.scenario_id}
                        className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-6">
                                <div className="relative">
                                    <div className={`
                                        w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner
                                        ${index === 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'}
                                    `}>
                                        {index + 1}
                                    </div>
                                    {index === 0 && (
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#007bff] transition-colors mb-2">
                                        {scenario.title}
                                    </h3>
                                    <p className="text-gray-500 font-medium mb-4 line-clamp-2">
                                        {scenario.description || "Luyện tập hội thoại tương tác về chủ đề này."}
                                    </p>

                                    <div className="flex flex-wrap gap-3">
                                        <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1
                                            ${scenario.difficulty_level === 'Basic' ? 'bg-green-100 text-green-700' :
                                                scenario.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'}
                                        `}>
                                            <BarChart size={12} /> {scenario.difficulty_level}
                                        </div>
                                        <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Clock size={12} /> 10 Mins
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={`/learner/practice/${scenario.scenario_id}`}
                                className="md:w-auto w-full px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-[#007bff] transition-all flex items-center justify-center gap-3 shadow-lg group-hover:shadow-blue-200"
                            >
                                <Play size={20} fill="currentColor" /> Bắt đầu
                            </Link>
                        </div>
                    </div>
                ))}

                {scenarios.length === 0 && (
                    <div className="bg-white p-16 rounded-[40px] shadow-sm text-center border-2 border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <Lock size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Nội dung đang cập nhật</h3>
                        <p className="text-gray-500">Các bài học cho chủ đề này đang được biên soạn.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
