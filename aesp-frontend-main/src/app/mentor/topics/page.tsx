"use client";
import React, { useEffect, useState } from 'react';
import { topicService } from '@/services/topicService';
import toast from 'react-hot-toast';
import { Loader2, BookOpen, Plus, MessageSquare, Users, Share2 } from 'lucide-react';

interface Topic {
    topic_id: number;
    name: string;
    description: string;
    difficulty_level?: string;
    industry?: string;
}

export default function MentorTopicsPage() {
    const [topics, setTopics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
    const [sharing, setSharing] = useState(false);

    useEffect(() => {
        loadTopics();
    }, []);

    const loadTopics = async () => {
        try {
            const data = await topicService.getAll();
            setTopics(data as any[]);
        } catch (e) {
            toast.error("Lỗi tải chủ đề");
        } finally {
            setLoading(false);
        }
    };

    const toggleTopic = (id: number) => {
        setSelectedTopics(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const handleShareWithLearners = async () => {
        if (selectedTopics.length === 0) {
            toast.error("Vui lòng chọn ít nhất 1 chủ đề");
            return;
        }
        setSharing(true);
        try {
            // In real app, call API to share topics with learners
            await new Promise(r => setTimeout(r, 1000));
            toast.success(`Đã chia sẻ ${selectedTopics.length} chủ đề với học viên!`);
            setSelectedTopics([]);
        } catch (e) {
            toast.error("Lỗi chia sẻ");
        } finally {
            setSharing(false);
        }
    };

    const getDifficultyColor = (level: string) => {
        switch (level?.toUpperCase()) {
            case 'BEGINNER': case 'A1': return 'bg-green-100 text-green-700';
            case 'ELEMENTARY': case 'A2': return 'bg-blue-100 text-blue-700';
            case 'INTERMEDIATE': case 'B1': return 'bg-yellow-100 text-yellow-700';
            case 'UPPER_INTERMEDIATE': case 'B2': return 'bg-orange-100 text-orange-700';
            case 'ADVANCED': case 'C1': case 'C2': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="max-w-6xl">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-black text-[#007bff]">Chủ Đề Luyện Tập</h1>
                    <p className="text-gray-600 mt-2 font-medium">Chọn và chia sẻ chủ đề hội thoại với học viên</p>
                </div>
                <button
                    onClick={handleShareWithLearners}
                    disabled={sharing || selectedTopics.length === 0}
                    className="flex items-center gap-2 bg-[#007bff] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50 transition"
                >
                    {sharing ? <Loader2 className="animate-spin" size={20} /> : <Share2 size={20} />}
                    Chia sẻ ({selectedTopics.length})
                </button>
            </div>

            {/* Selected summary */}
            {selectedTopics.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                    <p className="text-blue-700 font-bold">
                        ✓ Đã chọn {selectedTopics.length} chủ đề để chia sẻ với học viên
                    </p>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#007bff]" size={40} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topics.map(topic => {
                        const isSelected = selectedTopics.includes(topic.topic_id);
                        return (
                            <div
                                key={topic.topic_id}
                                onClick={() => toggleTopic(topic.topic_id)}
                                className={`bg-white rounded-2xl p-5 border-2 cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-[#007bff] ring-2 ring-blue-100' : 'border-gray-100'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-3 rounded-xl ${isSelected ? 'bg-blue-100' : 'bg-gray-50'}`}>
                                        <BookOpen className={isSelected ? 'text-[#007bff]' : 'text-gray-400'} size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900">{topic.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{topic.description}</p>
                                        <div className="flex items-center gap-2 mt-3">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${getDifficultyColor(topic.difficulty_level)}`}>
                                                {topic.difficulty_level}
                                            </span>
                                            {topic.industry && (
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                                                    {topic.industry}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-[#007bff] border-[#007bff]' : 'border-gray-300'
                                        }`}>
                                        {isSelected && <span className="text-white text-xs">✓</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {topics.length === 0 && !loading && (
                <div className="text-center py-20 text-gray-400">
                    <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Chưa có chủ đề nào</p>
                </div>
            )}
        </div>
    );
}
