"use client";
import React, { useEffect, useState } from 'react';
import { mentorService, Resource } from '@/services/mentorService';
import toast from 'react-hot-toast';
import { Loader2, Plus, FileText, Video, Music, Link as LinkIcon, Trash2, Upload } from 'lucide-react';

export default function MentorResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        file_url: '',
        resource_type: 'DOCUMENT' as Resource['resource_type']
    });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = async () => {
        try {
            const data = await mentorService.getMyResources();
            setResources(data);
        } catch (error) {
            toast.error("Lỗi tải tài liệu");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateResource = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            await mentorService.createResource(formData);
            toast.success("Tạo tài liệu thành công!");
            setFormData({ title: '', description: '', file_url: '', resource_type: 'DOCUMENT' });
            setShowForm(false);
            loadResources();
        } catch (error) {
            toast.error("Lỗi tạo tài liệu");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteResource = async (resourceId: number) => {
        if (!confirm('Bạn có chắc muốn xóa tài liệu này?')) return;
        try {
            await mentorService.deleteResource(resourceId);
            toast.success("Xóa tài liệu thành công!");
            loadResources();
        } catch (error) {
            toast.error("Lỗi xóa tài liệu");
        }
    };

    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'VIDEO': return <Video className="w-6 h-6" />;
            case 'AUDIO': return <Music className="w-6 h-6" />;
            case 'LINK': return <LinkIcon className="w-6 h-6" />;
            default: return <FileText className="w-6 h-6" />;
        }
    };

    const getResourceColor = (type: string) => {
        switch (type) {
            case 'VIDEO': return 'bg-purple-50 text-purple-600';
            case 'AUDIO': return 'bg-pink-50 text-pink-600';
            case 'LINK': return 'bg-blue-50 text-blue-600';
            default: return 'bg-green-50 text-green-600';
        }
    };

    return (
        <div className="max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-[#007bff]">Resource Library</h1>
                    <p className="text-gray-600 mt-2 font-medium">Quản lý tài liệu học tập cho học viên</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-[#007bff] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    Thêm Tài Liệu
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
                    <h2 className="text-xl font-black text-gray-900 mb-6">Tạo Tài Liệu Mới</h2>
                    <form onSubmit={handleCreateResource} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Tiêu đề <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007bff] focus:border-transparent outline-none transition font-medium"
                                placeholder="Ví dụ: Bài tập phát âm /th/"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Loại tài liệu
                            </label>
                            <select
                                value={formData.resource_type}
                                onChange={(e) => setFormData({ ...formData, resource_type: e.target.value as Resource['resource_type'] })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007bff] focus:border-transparent outline-none transition font-medium"
                            >
                                <option value="DOCUMENT">Tài liệu</option>
                                <option value="VIDEO">Video</option>
                                <option value="AUDIO">Audio</option>
                                <option value="LINK">Link</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                URL/Link <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={formData.file_url}
                                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007bff] focus:border-transparent outline-none transition font-medium"
                                placeholder="https://..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Mô tả
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007bff] focus:border-transparent outline-none transition resize-none font-medium"
                                rows={3}
                                placeholder="Mô tả ngắn về tài liệu..."
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="flex items-center gap-2 bg-[#007bff] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50 transition-all shadow-md"
                            >
                                {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                                {isCreating ? 'Đang tạo...' : 'Tạo Tài Liệu'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-3 text-gray-700 font-bold hover:bg-gray-100 rounded-xl transition"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Resources List */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#007bff]" />
                </div>
            ) : resources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resources.map(resource => (
                        <div key={resource.resource_id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-3">
                                    <div className={`p-3 rounded-2xl ${getResourceColor(resource.resource_type)}`}>
                                        {getResourceIcon(resource.resource_type)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black text-gray-900 mb-1">{resource.title}</h3>
                                        <p className="text-sm text-gray-500 font-medium line-clamp-2">
                                            {resource.description || 'Không có mô tả'}
                                        </p>
                                        <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                                            {resource.resource_type}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <a
                                    href={resource.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center bg-blue-50 text-[#007bff] px-4 py-2 rounded-xl font-bold hover:bg-blue-100 transition text-sm"
                                >
                                    Xem
                                </a>
                                <button
                                    onClick={() => handleDeleteResource(resource.resource_id!)}
                                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition text-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-gray-900 mb-2">Chưa có tài liệu nào</h3>
                    <p className="text-gray-500 font-medium mb-4">Tạo tài liệu đầu tiên để chia sẻ với học viên</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 bg-[#007bff] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm Tài Liệu
                    </button>
                </div>
            )}
        </div>
    );
}
