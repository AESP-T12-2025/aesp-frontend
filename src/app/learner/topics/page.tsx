"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { topicService, Topic } from '@/services/topicService';
import { Search, BookOpen, ArrowRight, Star, Lock } from 'lucide-react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function TopicsPage() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await topicService.getAll();
                setTopics(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, []);

    const filteredTopics = topics.filter(t =>
        t.name.toLowerCase().includes(filter.toLowerCase()) ||
        t.description?.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-[#007bff] rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                                <BookOpen size={14} /> Thư viện
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 mb-2">Chủ đề luyện tập</h1>
                            <p className="text-gray-500 font-medium">Hơn 300+ chủ đề từ cơ bản đến nâng cao đang chờ bạn khám phá.</p>
                        </div>

                        {/* Search Bar */}
                        <div className="bg-white p-2 pl-4 rounded-full border border-gray-100 shadow-sm flex items-center w-full md:w-96 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                            <Search className="text-gray-400" size={20} />
                            <input
                                className="flex-1 px-3 py-2 outline-none text-gray-700 font-medium placeholder-gray-400"
                                placeholder="Tìm kiếm trang chủ đề..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    {isLoading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#007bff]" size={40} /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredTopics.map((topic, index) => (
                                <Link
                                    href={`/learner/topics/${topic.topic_id}`}
                                    key={topic.topic_id}
                                    className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
                                >
                                    {/* Image Area */}
                                    <div className="h-56 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                        <img
                                            src={topic.image_url || `https://ui-avatars.com/api/?name=${topic.name}&background=random&size=400`}
                                            alt={topic.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                                        />
                                        <div className="absolute top-4 right-4 z-20">
                                            {index < 3 ? (
                                                <div className="bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                    <Star size={12} fill="currentColor" /> POPULAR
                                                </div>
                                            ) : (
                                                <div className="bg-black/30 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                                                    Topic {index + 1}
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute bottom-4 left-6 z-20">
                                            <h3 className="text-2xl font-black text-white leading-tight">{topic.name}</h3>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-8 flex-1 flex flex-col">
                                        <p className="text-gray-500 font-medium mb-8 line-clamp-2 flex-1">
                                            {topic.description || "Học từ vựng và mẫu câu thông dụng trong chủ đề này."}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                        U{i}
                                                    </div>
                                                ))}
                                                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                    +50
                                                </div>
                                            </div>

                                            <span className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 group-hover:bg-[#007bff] group-hover:text-white transition-colors">
                                                <ArrowRight size={20} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
