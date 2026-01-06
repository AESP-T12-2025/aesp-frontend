"use client";

import { useState, useEffect } from "react";
import { Plus, Image as ImageIcon, Loader2, RefreshCw, Trash2, Edit } from "lucide-react";
// Use service instead of direct api call
import { topicService, Topic } from "@/services/topicService";
import Link from "next/link";
import toast from "react-hot-toast";

export default function TopicsPage() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch data
    const fetchTopics = async () => {
        setLoading(true);
        try {
            const data = await topicService.getAll();
            setTopics(data);
        } catch (err) {
            console.error(err);
            toast.error("Không thể tải danh sách chủ đề");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    // Handle Delete
    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc muốn xóa chủ đề này? Hành động này không thể hoàn tác.")) return;

        try {
            await topicService.delete(id);
            toast.success("Đã xóa chủ đề thành công");
            fetchTopics(); // Refresh list
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi xóa chủ đề");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Quản Lý Chủ Đề</h2>
                <div className="flex space-x-2">
                    <button onClick={fetchTopics} className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center shadow-sm transition-all">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Làm mới
                    </button>
                    <Link href="/admin/topics/new">
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center shadow-md transition-all active:scale-95">
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm Chủ Đề
                        </button>
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topics.length === 0 ? (
                        <div className="col-span-full p-12 text-center bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <BookOpen className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Chưa có chủ đề nào</h3>
                            <p className="text-gray-500 mt-1 mb-6">Hãy tạo chủ đề đầu tiên để bắt đầu xây dựng bài học.</p>
                            <Link href="/admin/topics/new">
                                <button className="text-indigo-600 font-bold hover:underline">Tạo chủ đề ngay &rarr;</button>
                            </Link>
                        </div>
                    ) : (
                        topics.map((topic) => (
                            <div key={topic.topic_id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 group">
                                <div className="h-48 bg-gray-100 relative overflow-hidden">
                                    {topic.image_url ? (
                                        <img src={topic.image_url} alt={topic.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                            <ImageIcon className="w-12 h-12 text-gray-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                        ID: {topic.topic_id}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={topic.title}>{topic.title}</h3>
                                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 h-10">{topic.description || "Không có mô tả."}</p>

                                    <div className="mt-5 flex justify-end gap-2 border-t border-gray-50 pt-4">
                                        <button className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors">
                                            <Edit className="w-3.5 h-3.5 mr-1.5" /> Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(topic.topic_id)}
                                            className="flex items-center text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

function BookOpen(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    )
}
