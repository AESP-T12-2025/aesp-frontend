"use client";
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Users, Play, Loader2, Video, Mic } from 'lucide-react';
import { peerService } from '@/services/peerService';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CommunityPage() {
    const router = useRouter();
    const [isSearching, setIsSearching] = useState(false);
    const [status, setStatus] = useState<string>('IDLE'); // IDLE, SEARCHING, MATCHED
    const [sessionId, setSessionId] = useState<number | null>(null);

    const handleFindPartner = async () => {
        try {
            setIsSearching(true);
            setStatus('SEARCHING');
            // Join queue
            const res = await peerService.joinQueue(); // topicId optional
            setSessionId(res.session_id);

            if (res.status === 'MATCHED') {
                setStatus('MATCHED');
                // Redirect to room (future) or show success
                // router.push(`/learner/peer/${res.session_id}`);
            }
        } catch (error) {
            console.error("Failed to join queue", error);
            setIsSearching(false);
            setStatus('ERROR');
        }
    };

    // Poll for status if searching
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'SEARCHING' && sessionId) {
            interval = setInterval(async () => {
                try {
                    const res = await peerService.checkStatus(sessionId);
                    if (res.status === 'MATCHED') {
                        setStatus('MATCHED');
                        clearInterval(interval);
                    }
                } catch (e) {
                    console.error("Polling error", e);
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [status, sessionId]);

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
                <div className="max-w-4xl mx-auto space-y-8 text-center">

                    <div className="mb-10">
                        <span className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 inline-block">
                            Social Learning
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                            Tìm bạn luyện nói 1-1
                        </h1>
                        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
                            Hệ thống sẽ tự động ghép đôi bạn với một học viên khác có cùng trình độ để luyện tập hội thoại.
                        </p>
                    </div>

                    <div className="bg-white rounded-[32px] p-12 shadow-xl border border-slate-100 max-w-2xl mx-auto relative overflow-hidden">

                        {status === 'IDLE' && (
                            <div className="space-y-8">
                                <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600 mb-6">
                                    <Users size={64} />
                                </div>
                                <button
                                    onClick={handleFindPartner}
                                    className="w-full md:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 hover:scale-105 transition-all shadow-lg hover:shadow-indigo-200 flex items-center justify-center gap-3 mx-auto"
                                >
                                    <Play fill="currentColor" /> Bắt đầu tìm kiếm
                                </button>
                                <p className="text-sm text-slate-400 font-bold">Estimated wait time: ~30s</p>
                            </div>
                        )}

                        {status === 'SEARCHING' && (
                            <div className="space-y-8 py-4">
                                <div className="relative">
                                    <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600 animate-pulse">
                                        <Loader2 size={64} className="animate-spin" />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-40 h-40 border-4 border-indigo-100 rounded-full animate-ping opacity-20"></div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Đang tìm bạn học...</h3>
                                    <p className="text-slate-500">Vui lòng chờ trong giây lát</p>
                                </div>
                                <button onClick={() => setStatus('IDLE')} className="text-red-500 font-bold hover:underline text-sm">Hủy tìm kiếm</button>
                            </div>
                        )}

                        {status === 'MATCHED' && (
                            <div className="space-y-8 py-4">
                                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                                    <Video size={64} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Đã tìm thấy!</h3>
                                    <p className="text-slate-500">Đang kết nối vào phòng học...</p>
                                </div>
                                <button className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors">
                                    Vào phòng ngay
                                </button>
                            </div>
                        )}

                        {status === 'ERROR' && (
                            <div className="space-y-4">
                                <p className="text-red-500 font-bold">Có lỗi xảy ra. Vui lòng thử lại.</p>
                                <button onClick={() => setStatus('IDLE')} className="text-indigo-600 font-bold underline">Thử lại</button>
                            </div>
                        )}

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mt-12">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><Mic size={20} /></div>
                            <h4 className="font-bold text-slate-900 mb-2">Luyện nói 1-1</h4>
                            <p className="text-sm text-slate-500">Thực hành giao tiếp trực tiếp với người học khác.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4"><Users size={20} /></div>
                            <h4 className="font-bold text-slate-900 mb-2">Cùng trình độ</h4>
                            <p className="text-sm text-slate-500">AI tự động ghép đôi bạn với người có level tương đương.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4"><Video size={20} /></div>
                            <h4 className="font-bold text-slate-900 mb-2">Video/Audio</h4>
                            <p className="text-sm text-slate-500">Hỗ trợ gọi video hoặc chỉ âm thanh tùy thích.</p>
                        </div>
                    </div>

                </div>

                {/* SOCIAL FEED SECTION */}
                <div className="max-w-4xl mx-auto mt-20 text-left">
                    <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                        <span className="text-indigo-600">📰</span> Bảng tin cộng đồng
                    </h2>

                    <SocialFeed />
                </div>
            </div>
        </ProtectedRoute >
    );
}

function SocialFeed() {
    const [posts, setPosts] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        loadFeed();
    }, []);

    const loadFeed = async () => {
        try {
            const { socialService } = await import('@/services/socialService');
            const data = await socialService.getFeed();
            setPosts(data);
        } catch (e) {
            console.error("Failed to load feed");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId: number) => {
        try {
            const { socialService } = await import('@/services/socialService');
            await socialService.toggleLike(postId);
            // Optimistic update
            setPosts(prev => prev.map(p => {
                if (p.id === postId) {
                    // Toggle logic helper (backend handles real toggle, frontend just increments/decrements locally for speed)
                    // Since we don't know "is_liked" from backend list yet (simplified model), we just +1 for feedback
                    return { ...p, like_count: p.like_count + 1 };
                }
                return p;
            }));
            toast.success("Đã thả tim! ❤️");
        } catch (e) {
            toast.error("Lỗi tương tác");
        }
    };

    if (loading) return <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-indigo-600" /></div>;
    if (posts.length === 0) return <div className="text-center py-10 text-slate-400 font-bold">Chưa có bài viết nào từ Mentor.</div>;

    return (
        <div className="space-y-6">
            {posts.map(post => (
                <div key={post.id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-black text-indigo-600">
                            {post.mentor_name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">{post.mentor_name}</h4>
                            <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">MENTOR</span>
                        </div>
                    </div>
                    {post.image_url && (
                        <div className="mb-4 rounded-xl overflow-hidden">
                            <img src={post.image_url} alt="Post" className="w-full object-cover max-h-96" />
                        </div>
                    )}
                    <p className="text-slate-700 font-medium leading-relaxed mb-4 whitespace-pre-line">{post.content}</p>

                    <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                        <button
                            onClick={() => handleLike(post.id)}
                            className="flex items-center gap-2 text-slate-500 hover:text-red-500 font-bold text-sm transition-colors"
                        >
                            <span>❤️</span> {post.like_count}
                        </button>
                        <button
                            onClick={() => toast("Tính năng bình luận đang bảo trì", { icon: '🚧' })}
                            className="flex items-center gap-2 text-slate-500 hover:text-indigo-500 font-bold text-sm transition-colors"
                        >
                            <span>💬</span> {post.comment_count} Bình luận
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
