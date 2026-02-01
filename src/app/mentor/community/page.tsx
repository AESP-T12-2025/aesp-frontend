"use client";
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { socialService } from '@/services/socialService';
import { Loader2, Send, MessageCircle, Edit3, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MentorCommunityPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const data = await socialService.getFeed();
            setPosts(data);
        } catch (e) {
            console.error("Failed to load feed");
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;

        setIsPosting(true);
        try {
            const newPost = await socialService.createPost(newPostContent);
            setPosts([newPost, ...posts]);
            setNewPostContent('');
            toast.success("Đăng bài thành công!");
        } catch (error) {
            toast.error("Lỗi khi đăng bài");
        } finally {
            setIsPosting(false);
        }
    };

    const handleDeletePost = async (postId: number) => {
        if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;
        try {
            await socialService.deletePost(postId);
            setPosts(posts.filter(p => p.id !== postId && p.post_id !== postId));
            toast.success("Đã xóa bài viết");
        } catch (e) {
            toast.error("Lỗi khi xóa bài viết");
        }
    };

    return (
        <ProtectedRoute allowedRoles={['MENTOR']}>
            <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
                <div className="max-w-3xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <span className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 inline-block">
                            Mentor Community
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                            Chia sẻ với Học viên
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Đăng bài, chia sẻ kiến thức và tương tác với cộng đồng.
                        </p>
                    </div>

                    {/* Create Post Form */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Edit3 size={18} className="text-indigo-600" /> Đăng bài mới
                        </h2>
                        <form onSubmit={handleCreatePost} className="space-y-4">
                            <textarea
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                placeholder="Chia sẻ điều gì đó hữu ích với học viên..."
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:ring-2 focus:ring-indigo-100 outline-none font-medium"
                                rows={4}
                                required
                            />
                            <button
                                type="submit"
                                disabled={isPosting || !newPostContent.trim()}
                                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPosting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                Đăng bài
                            </button>
                        </form>
                    </div>

                    {/* Posts Feed */}
                    <div className="space-y-6">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            <MessageCircle size={18} className="text-indigo-600" /> Bảng tin cộng đồng
                        </h2>

                        {loading ? (
                            <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-indigo-600" /></div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 font-bold bg-white rounded-2xl border border-dashed border-slate-200">
                                Chưa có bài viết nào. Hãy là người đầu tiên!
                            </div>
                        ) : (
                            posts.map(post => (
                                <div key={post.id || post.post_id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-black text-indigo-600">
                                                {(post.mentor_name || post.user_name || 'M').charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{post.mentor_name || post.user_name || 'Mentor'}</h4>
                                                <span className="text-xs text-slate-400">{new Date(post.created_at).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeletePost(post.id || post.post_id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Xóa bài viết"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-line">{post.content}</p>
                                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-4 text-sm text-slate-400 font-bold">
                                        <span>❤️ {post.like_count || post.likes_count || 0}</span>
                                        <span>💬 {post.comment_count || post.comments_count || 0}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </ProtectedRoute>
    );
}
