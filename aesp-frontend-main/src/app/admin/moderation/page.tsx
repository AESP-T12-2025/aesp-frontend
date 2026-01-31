"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { adminService } from '@/services/adminService';
import { CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ModerationPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [filter, setFilter] = useState('ALL'); // ALL, PENDING, APPROVED, REJECTED
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const data = await adminService.getPosts(filter === 'ALL' ? undefined : filter);
            setPosts(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, [filter]);

    const handleModerate = async (id: number, status: string) => {
        try {
            await adminService.moderatePost(id, status);
            toast.success(`Post marked as ${status}`);
            // Optimistic update
            setPosts(posts.map(p => p.id === id ? { ...p, status } : p));
        } catch (e) {
            toast.error("Failed to update status");
        }
    };

    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Content Moderation</h1>
                        <p className="text-gray-500">Review and moderate community content</p>
                    </div>

                    <div className="flex bg-white p-1 rounded-xl border border-gray-200">
                        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === s ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : (
                    <div className="grid gap-4">
                        {posts.length === 0 && <div className="text-center text-gray-400 py-10">No posts found.</div>}
                        {posts.map(post => (
                            <div key={post.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-6">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900">{post.mentor_name}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${post.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                                                post.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                                    'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            {post.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4">{post.content}</p>
                                    <div className="text-xs text-gray-400">
                                        {new Date(post.created_at).toLocaleString()}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 border-l pl-4 border-gray-100 justify-center">
                                    {post.status !== 'APPROVED' && (
                                        <button
                                            onClick={() => handleModerate(post.id, 'APPROVED')}
                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 tooltip"
                                            title="Approve"
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                    )}
                                    {post.status !== 'REJECTED' && (
                                        <button
                                            onClick={() => handleModerate(post.id, 'REJECTED')}
                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 tooltip"
                                            title="Reject"
                                        >
                                            <XCircle size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
