"use client";
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2, BookOpen, Play, Gift, Clock } from 'lucide-react';

interface SharedTopic {
    topic_id: number;
    name: string;
    description: string;
    difficulty_level: string;
    shared_at: string;
    mentor_message: string;
}

export default function LearnerSharedTopicsPage() {
    const router = useRouter();
    const [topics, setTopics] = useState<SharedTopic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSharedTopics();
    }, []);

    const loadSharedTopics = async () => {
        try {
            const res = await api.get('/learner/shared-topics');
            setTopics(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handlePractice = (topicId: number) => {
        router.push(`/learner/topics/${topicId}`);
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
        <div className="max-w-4xl">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-purple-100 rounded-2xl">
                        <Gift className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-[#007bff]">Chủ Đề Từ Mentor</h1>
                        <p className="text-gray-600 font-medium">Các chủ đề được Mentor chia sẻ riêng cho bạn</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-[#007bff]" size={40} />
                </div>
            ) : topics.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                    <Gift size={64} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 font-medium">Chưa có chủ đề nào được chia sẻ</p>
                    <p className="text-sm text-gray-400 mt-2">Mentor sẽ chia sẻ chủ đề sau khi bạn đặt lịch học</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {topics.map(topic => (
                        <div key={topic.topic_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                            <div className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-50 rounded-xl">
                                        <BookOpen className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-gray-900">{topic.name}</h3>
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${getDifficultyColor(topic.difficulty_level)}`}>
                                                {topic.difficulty_level || 'GENERAL'}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3">{topic.description}</p>

                                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                                            <Clock size={14} />
                                            <span>Chia sẻ lúc: {new Date(topic.shared_at).toLocaleString('vi-VN')}</span>
                                        </div>

                                        <button
                                            onClick={() => handlePractice(topic.topic_id)}
                                            className="flex items-center gap-2 bg-[#007bff] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition"
                                        >
                                            <Play size={18} />
                                            Luyện tập ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
