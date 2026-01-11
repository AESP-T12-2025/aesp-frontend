"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { topicService, Topic } from '@/services/topicService';
import { imageService } from '@/services/imageService';
import { Search, BookOpen, ArrowRight, Star, Lock, Briefcase, Plane, Heart, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function TopicsPage() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [industryFilter, setIndustryFilter] = useState('ALL');
    const [topicImages, setTopicImages] = useState<{ [key: number]: string }>({});

    const industries = [
        { id: 'ALL', label: 'Tất cả', icon: <BookOpen size={16} /> },
        { id: 'GENERAL', label: 'Tổng quát', icon: <BookOpen size={16} /> },
        { id: 'BUSINESS', label: 'Kinh doanh', icon: <Briefcase size={16} /> },
        { id: 'TECHNOLOGY', label: 'Công nghệ', icon: <Briefcase size={16} /> },
        { id: 'HEALTHCARE', label: 'Y tế', icon: <Heart size={16} /> },
        { id: 'TOURISM', label: 'Du lịch', icon: <Plane size={16} /> },
        { id: 'HOSPITALITY', label: 'Khách sạn', icon: <Heart size={16} /> },
    ];

    // Generate consistent image URL using Lorem Picsum with seed
    const getImageUrl = (name: string, id: number): string => {
        // Use topic id as seed for consistent images
        return `https://picsum.photos/seed/${id}/800/600`;
    };

    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true);
            try {
                // Fetch from backend with industry filter
                const data = await topicService.getAll(industryFilter);
                setTopics(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, [industryFilter]); // Re-fetch when industry changes

    const filteredTopics = topics.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(filter.toLowerCase()) ||
            (t.description?.toLowerCase().includes(filter.toLowerCase()) || false);
        return matchesSearch;
    });

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-[#007bff] rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                                <BookOpen size={14} /> Thư viện
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 mb-2">Chủ đề luyện tập</h1>
                            <p className="text-gray-500 font-medium">Chọn ngành nghề và chủ đề phù hợp với mục tiêu của bạn.</p>
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

                    {/* Industry Filter */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {industries.map(ind => (
                            <button
                                key={ind.id}
                                onClick={() => setIndustryFilter(ind.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${industryFilter === ind.id
                                    ? 'bg-[#007bff] text-white shadow-lg'
                                    : 'bg-white text-gray-600 border border-gray-100 hover:border-blue-200 hover:bg-blue-50'
                                    }`}
                            >
                                {ind.icon} {ind.label}
                            </button>
                        ))}
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
                                    <div className="h-56 relative overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                        <img
                                            src={topic.image_url || getImageUrl(topic.name, topic.topic_id)}
                                            alt={topic.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                                            loading="lazy"
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


                                        <div className="flex items-center justify-end mt-auto">
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
