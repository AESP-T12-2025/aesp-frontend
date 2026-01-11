"use client";
import React, { useEffect, useState } from 'react';
import { socialService } from '@/services/socialService';
import toast from 'react-hot-toast';
import { Loader2, Lightbulb, Plus, Heart, MessageCircle, Trash2, Send } from 'lucide-react';

interface Tip {
    id: number;
    content: string;
    created_at: string;
    like_count: number;
    comment_count: number;
    mentor_name?: string;
}

export default function MentorTipsPage() {
    const [tips, setTips] = useState<Tip[]>([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        loadTips();
    }, []);

    const loadTips = async () => {
        try {
            const data = await socialService.getFeed();
            // Filter tips (posts that start with "[TIP]" or contain experience keywords)
            const filteredTips = data.filter((p: any) =>
                p.content?.toLowerCase().includes('[tip]') ||
                p.content?.toLowerCase().includes('kinh nghiệm') ||
                p.content?.toLowerCase().includes('tips') ||
                p.content?.toLowerCase().includes('mẹo')
            );
            setTips(filteredTips);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handlePostTip = async () => {
        if (!content.trim()) {
            toast.error("Vui lòng nhập nội dung");
            return;
        }

        setPosting(true);
        try {
            await socialService.createPost(`[TIP] ${content}`);
            toast.success("Đăng tip thành công!");
            setContent('');
            loadTips();
        } catch (e) {
            toast.error("Lỗi đăng bài");
        } finally {
            setPosting(false);
        }
    };

    const sampleTips = [
        "Luyện phát âm /th/ bằng cách đặt lưỡi giữa hai hàm răng",
        "Đọc báo tiếng Anh mỗi sáng 15 phút giúp cải thiện vocabulary",
        "Nghe podcast BBC Learning English khi đi làm",
        "Ghi âm giọng nói và so sánh với native speakers"
    ];

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#007bff] flex items-center gap-3">
                    <Lightbulb className="text-yellow-500" /> Tips & Kinh nghiệm
                </h1>
                <p className="text-gray-600 mt-2 font-medium">
                    Chia sẻ mẹo học tiếng Anh và kinh nghiệm giao tiếp với native speakers
                </p>
            </div>

            {/* Post New Tip */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-8">
                <h2 className="font-bold text-gray-900 mb-4">Chia sẻ tip mới</h2>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none resize-none font-medium"
                    rows={3}
                    placeholder="Chia sẻ mẹo học tiếng Anh, kinh nghiệm giao tiếp..."
                />
                <div className="flex justify-between items-center mt-4">
                    <div className="text-xs text-gray-400">
                        💡 Tip: Bắt đầu với [TIP] để đánh dấu bài chia sẻ kinh nghiệm
                    </div>
                    <button
                        onClick={handlePostTip}
                        disabled={posting}
                        className="flex items-center gap-2 bg-[#007bff] text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-600 transition-all"
                    >
                        {posting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                        Đăng
                    </button>
                </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-6 mb-8 border border-yellow-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="text-yellow-500" size={20} /> Gợi ý tips phổ biến
                </h3>
                <div className="flex flex-wrap gap-2">
                    {sampleTips.map((tip, i) => (
                        <button
                            key={i}
                            onClick={() => setContent(tip)}
                            className="px-3 py-1.5 bg-white/70 text-gray-700 rounded-full text-sm font-medium hover:bg-white transition-all"
                        >
                            {tip.slice(0, 40)}...
                        </button>
                    ))}
                </div>
            </div>

            {/* Tips List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-[#007bff]" size={40} />
                </div>
            ) : tips.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                    <Lightbulb className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Chưa có tips nào</h3>
                    <p className="text-gray-500">Hãy là người đầu tiên chia sẻ kinh nghiệm!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tips.map(tip => (
                        <div key={tip.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white">
                                    <Lightbulb size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-900 font-medium mb-3 leading-relaxed">
                                        {tip.content}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Heart size={16} /> {tip.like_count}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle size={16} /> {tip.comment_count}
                                        </span>
                                        <span>
                                            {new Date(tip.created_at).toLocaleDateString('vi-VN')}
                                        </span>
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
