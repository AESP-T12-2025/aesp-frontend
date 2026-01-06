"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, Clock, BarChart } from 'lucide-react';
import Link from 'next/link';
import { scenarioService, Scenario } from '@/services/scenarioService';
import { topicService, Topic } from '@/services/topicService';
import toast from 'react-hot-toast';

export default function TopicDetailPage() {
    const params = useParams();
    const router = useRouter();
    const topicId = params.id as string;

    const [topic, setTopic] = useState<Topic | null>(null);
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!topicId) return;
            try {
                // Fetch Topic Info & Scenarios in parallel
                const [topicData, scenariosData] = await Promise.all([
                    topicService.getById(topicId),
                    scenarioService.getByTopicId(topicId)
                ]);
                setTopic(topicData);
                setScenarios(scenariosData);
            } catch (error) {
                console.error("Failed to load data", error);
                toast.error("Không thể tải nội dung bài học");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [topicId]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007bff]"></div>
            </div>
        );
    }

    if (!topic) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Topic not found</h2>
                <Link href="/" className="text-[#007bff] hover:underline">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Banner */}
            <div className="bg-[#007bff] text-white pt-10 pb-24 px-4 relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <Link href="/" className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition">
                        <ArrowLeft size={20} className="mr-2" /> Quay lại trang chủ
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">{topic.name}</h1>
                    <p className="text-blue-100 text-lg max-w-2xl font-medium">
                        {topic.description || "Danh sách các bài học hội thoại theo chủ đề này."}
                    </p>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>
            </div>

            {/* Content List */}
            <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-20">
                <div className="space-y-4">
                    {scenarios.map((scenario, index) => (
                        <div key={scenario.scenario_id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 text-[#007bff] w-12 h-12 flex items-center justify-center rounded-xl font-black text-xl shrink-0 group-hover:bg-[#007bff] group-hover:text-white transition-colors">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#007bff] transition-colors">{scenario.title}</h3>
                                        <p className="text-gray-500 mt-1 line-clamp-1">{scenario.description || "Bài luyện tập hội thoại tương tác."}</p>

                                        <div className="flex items-center gap-4 mt-3 text-sm font-medium text-gray-500">
                                            <span className={`px-2 py-0.5 rounded ${scenario.difficulty_level === 'Basic' ? 'bg-green-100 text-green-700' :
                                                scenario.difficulty_level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {scenario.difficulty_level}
                                            </span>
                                            <span className="flex items-center"><Clock size={14} className="mr-1" /> 5-10 phút</span>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href={`/learner/practice/${scenario.scenario_id}`}
                                    className="bg-gray-100 text-gray-700 hover:bg-[#007bff] hover:text-white px-6 py-3 rounded-xl font-bold transition flex items-center justify-center shrink-0 whitespace-nowrap"
                                >
                                    <Play size={18} className="mr-2" /> Luyện tập
                                </Link>
                            </div>
                        </div>
                    ))}

                    {scenarios.length === 0 && (
                        <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-dashed border-gray-300">
                            <p className="text-gray-400 font-medium text-lg">Chưa có bài học nào trong chủ đề này.</p>
                            <p className="text-sm text-gray-400 mt-2">Vui lòng quay lại sau.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
