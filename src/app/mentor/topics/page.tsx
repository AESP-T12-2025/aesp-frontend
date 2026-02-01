"use client";
import React, { useEffect, useState } from 'react';
import { topicService } from '@/services/topicService';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Loader2, BookOpen, Plus, Share2, X, Users, Check, PlusCircle } from 'lucide-react';

interface Topic {
    topic_id: number;
    name: string;
    description: string;
    difficulty_level?: string;
    industry?: string;
}

interface Learner {
    user_id: number;
    full_name: string;
    email: string;
}

export default function MentorTopicsPage() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
    const [sharing, setSharing] = useState(false);

    // Modal & Learners
    const [showShareModal, setShowShareModal] = useState(false);
    const [learners, setLearners] = useState<Learner[]>([]);
    const [selectedLearners, setSelectedLearners] = useState<number[]>([]);
    const [loadingLearners, setLoadingLearners] = useState(false);

    // Create topic
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newTopic, setNewTopic] = useState({ name: '', description: '', category_id: 1 });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadTopics();
    }, []);

    const loadTopics = async () => {
        try {
            const data = await topicService.getAll();
            setTopics(data as Topic[]);
        } catch (e) {
            toast.error("Lỗi tải chủ đề");
        } finally {
            setLoading(false);
        }
    };

    const loadLearners = async () => {
        setLoadingLearners(true);
        try {
            const res = await api.get('/mentor/my-learners');
            setLearners(res.data);
        } catch (e) {
            toast.error("Lỗi tải danh sách học viên");
        } finally {
            setLoadingLearners(false);
        }
    };

    const toggleTopic = (id: number) => {
        setSelectedTopics(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const toggleLearner = (id: number) => {
        setSelectedLearners(prev =>
            prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
        );
    };

    const openShareModal = () => {
        if (selectedTopics.length === 0) {
            toast.error("Vui lòng chọn ít nhất 1 chủ đề");
            return;
        }
        loadLearners();
        setShowShareModal(true);
    };

    const handleShareTopics = async () => {
        if (selectedLearners.length === 0) {
            toast.error("Vui lòng chọn ít nhất 1 học viên");
            return;
        }
        setSharing(true);
        try {
            const res = await api.post('/mentor/share-topics', {
                topic_ids: selectedTopics,
                learner_ids: selectedLearners
            });
            toast.success(res.data.message);
            setSelectedTopics([]);
            setSelectedLearners([]);
            setShowShareModal(false);
        } catch (e: any) {
            toast.error(e.response?.data?.detail || "Lỗi chia sẻ");
        } finally {
            setSharing(false);
        }
    };

    const handleCreateTopic = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTopic.name.trim()) {
            toast.error("Vui lòng nhập tên chủ đề");
            return;
        }
        setCreating(true);
        try {
            await topicService.create(newTopic);
            toast.success("Tạo chủ đề thành công!");
            setNewTopic({ name: '', description: '', category_id: 1 });
            setShowCreateForm(false);
            loadTopics();
        } catch (e) {
            toast.error("Lỗi tạo chủ đề");
        } finally {
            setCreating(false);
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
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-xl font-bold hover:bg-green-600 transition"
                    >
                        <PlusCircle size={20} />
                        Tạo mới
                    </button>
                    <button
                        onClick={openShareModal}
                        disabled={selectedTopics.length === 0}
                        className="flex items-center gap-2 bg-[#007bff] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50 transition"
                    >
                        <Share2 size={20} />
                        Chia sẻ ({selectedTopics.length})
                    </button>
                </div>
            </div>

            {/* Create Topic Form */}
            {showCreateForm && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Tạo Chủ Đề Mới</h2>
                    <form onSubmit={handleCreateTopic} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tên chủ đề *</label>
                            <input
                                value={newTopic.name}
                                onChange={e => setNewTopic({ ...newTopic, name: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ví dụ: Phỏng vấn xin việc"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả</label>
                            <textarea
                                value={newTopic.description}
                                onChange={e => setNewTopic({ ...newTopic, description: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                rows={2}
                                placeholder="Mô tả ngắn về chủ đề..."
                            />
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" disabled={creating} className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 disabled:opacity-50 transition flex items-center gap-2">
                                {creating ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                                Tạo
                            </button>
                            <button type="button" onClick={() => setShowCreateForm(false)} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition">Hủy</button>
                        </div>
                    </form>
                </div>
            )}

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
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${getDifficultyColor(topic.difficulty_level || 'GENERAL')}`}>
                                                {topic.difficulty_level || 'GENERAL'}
                                            </span>
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

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Chia sẻ với học viên</h2>
                                <p className="text-sm text-gray-500 mt-1">Chọn học viên để nhận thông báo</p>
                            </div>
                            <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[50vh]">
                            {loadingLearners ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="animate-spin text-[#007bff]" size={32} />
                                </div>
                            ) : learners.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <Users size={40} className="mx-auto mb-3 opacity-50" />
                                    <p>Chưa có học viên nào đã đặt lịch</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {learners.map(learner => {
                                        const isSelected = selectedLearners.includes(learner.user_id);
                                        return (
                                            <div
                                                key={learner.user_id}
                                                onClick={() => toggleLearner(learner.user_id)}
                                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-[#007bff] bg-blue-50' : 'border-gray-100 hover:border-gray-200'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-bold text-gray-900">{learner.full_name}</p>
                                                        <p className="text-sm text-gray-500">{learner.email}</p>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-[#007bff] border-[#007bff]' : 'border-gray-300'}`}>
                                                        {isSelected && <Check size={14} className="text-white" />}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={handleShareTopics}
                                disabled={sharing || selectedLearners.length === 0}
                                className="flex-1 bg-[#007bff] text-white py-3 rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
                            >
                                {sharing ? <Loader2 className="animate-spin" size={18} /> : <Share2 size={18} />}
                                Chia sẻ với {selectedLearners.length} học viên
                            </button>
                            <button onClick={() => setShowShareModal(false)} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition">
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
