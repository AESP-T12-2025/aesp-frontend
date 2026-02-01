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
        resource_type: 'document' as Resource['resource_type']
    });
    const [isCreating, setIsCreating] = useState(false);

    // New State for Vocab
    const [activeTab, setActiveTab] = useState<'RESOURCES' | 'VOCAB'>('RESOURCES');

    interface VocabSuggestion {
        id: number;
        vocabulary: string;
        collocations?: string;
        idioms?: string;
        tips?: string;
        topic_id?: number;
        created_at: string;
    }

    const [vocabSuggestions, setVocabSuggestions] = useState<VocabSuggestion[]>([]);
    const [vocabForm, setVocabForm] = useState({
        vocabulary: '',
        collocations: '',
        idioms: '',
        tips: '',
        topic_id: ''
    });

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (activeTab === 'RESOURCES') {
                await loadResources(isMounted);
            } else {
                await loadVocabSuggestions(isMounted);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [activeTab]);

    const loadResources = async (isMounted = true) => {
        setIsLoading(true);
        try {
            const data = await mentorService.getMyResources();
            if (isMounted) setResources(data);
        } catch (error) {
            if (isMounted) toast.error("Lỗi tải tài liệu");
        } finally {
            if (isMounted) setIsLoading(false);
        }
    };

    const loadVocabSuggestions = async (isMounted = true) => {
        setIsLoading(true);
        try {
            const data = await mentorService.getMyVocabSuggestions();
            if (isMounted) setVocabSuggestions(data);
        } catch (error) {
            console.error(error);
            if (isMounted) toast.error("Lỗi tải từ vựng");
        } finally {
            if (isMounted) setIsLoading(false);
        }
    };

    const handleCreateResource = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            await mentorService.createResource(formData);
            toast.success("Tạo tài liệu thành công!");
            setFormData({ title: '', description: '', file_url: '', resource_type: 'document' });
            setShowForm(false);
            loadResources();
        } catch (error) {
            toast.error("Lỗi tạo tài liệu");
        } finally {
            setIsCreating(false);
        }
    };

    const handleCreateVocab = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            await mentorService.createVocabSuggestion({
                ...vocabForm,
                topic_id: vocabForm.topic_id ? parseInt(vocabForm.topic_id) : undefined
            });
            toast.success("Tạo gợi ý từ vựng thành công!");
            setVocabForm({ vocabulary: '', collocations: '', idioms: '', tips: '', topic_id: '' });
            setShowForm(false);
            loadVocabSuggestions();
        } catch (error) {
            toast.error("Lỗi tạo từ vựng");
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
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#007bff]">Resource Library</h1>
                <p className="text-gray-600 mt-2 font-medium">Quản lý tài liệu và từ vựng cho học viên</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('RESOURCES')}
                    className={`pb-4 px-2 font-bold transition-all ${activeTab === 'RESOURCES' ? 'text-[#007bff] border-b-2 border-[#007bff]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Tài liệu học tập
                </button>
                <button
                    onClick={() => setActiveTab('VOCAB')}
                    className={`pb-4 px-2 font-bold transition-all ${activeTab === 'VOCAB' ? 'text-[#007bff] border-b-2 border-[#007bff]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Gợi ý từ vựng
                </button>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    {activeTab === 'RESOURCES' ? 'Danh sách tài liệu' : 'Danh sách từ vựng'}
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-[#007bff] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    {activeTab === 'RESOURCES' ? 'Thêm Tài Liệu' : 'Thêm Từ Vựng'}
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
                    <h2 className="text-xl font-black text-gray-900 mb-6">
                        {activeTab === 'RESOURCES' ? 'Tạo Tài Liệu Mới' : 'Tạo Gợi Ý Từ Vựng'}
                    </h2>

                    {activeTab === 'RESOURCES' ? (
                        <form onSubmit={handleCreateResource} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Tiêu đề <span className="text-red-500">*</span></label>
                                <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff]  font-medium" placeholder="Ví dụ: Bài tập ..." required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Loại tài liệu</label>
                                <select value={formData.resource_type} onChange={(e) => setFormData({ ...formData, resource_type: e.target.value as Resource['resource_type'] })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] font-medium">
                                    <option value="document">Tài liệu</option>
                                    <option value="video">Video</option>
                                    <option value="link">Link</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">URL/Link <span className="text-red-500">*</span></label>
                                <input value={formData.file_url} onChange={(e) => setFormData({ ...formData, file_url: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] font-medium" placeholder="https://..." required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] font-medium" rows={3} />
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button type="submit" disabled={isCreating} className="flex items-center gap-2 bg-[#007bff] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all">{isCreating ? <Loader2 className="animate-spin" /> : <Upload size={20} />} Tạo Tài Liệu</button>
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-gray-700 font-bold hover:bg-gray-100 rounded-xl transition">Hủy</button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleCreateVocab} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Từ vựng <span className="text-red-500">*</span></label>
                                <input value={vocabForm.vocabulary} onChange={(e) => setVocabForm({ ...vocabForm, vocabulary: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] font-medium" placeholder="e.g., Ubiquitous" required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Collocations</label>
                                    <input value={vocabForm.collocations} onChange={(e) => setVocabForm({ ...vocabForm, collocations: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] font-medium" placeholder="e.g., become ubiquitous" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Idioms (Optional)</label>
                                    <input value={vocabForm.idioms} onChange={(e) => setVocabForm({ ...vocabForm, idioms: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#007bff] font-medium" placeholder="Related idioms" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Mẹo ghi nhớ / Ghi chú</label>
                                <textarea value={vocabForm.tips} onChange={(e) => setVocabForm({ ...vocabForm, tips: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" rows={2} placeholder="Tips for learning this word..." />
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button type="submit" disabled={isCreating} className="btn-primary flex items-center gap-2 bg-[#007bff] text-white px-6 py-3 rounded-xl font-bold">{isCreating ? <Loader2 className="animate-spin" /> : <Upload size={20} />} Tạo Từ Vựng</button>
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-gray-700 font-bold hover:bg-gray-100 rounded-xl">Hủy</button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* List */}
            {activeTab === 'RESOURCES' ? (
                // Existing Resource List Code (simplified for brevity in replacement, but I should keep original logic if possible or assume I replace the whole return block)
                // Since I am replacing the whole return block, I must replicate the resource list logic.
                isLoading ? (
                    <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#007bff]" /></div>
                ) : resources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {resources.map(resource => (
                            <div key={resource.resource_id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-3 rounded-2xl ${getResourceColor(resource.resource_type)}`}>{getResourceIcon(resource.resource_type)}</div>
                                        <div className="flex-1">
                                            <h3 className="font-black text-gray-900 mb-1">{resource.title}</h3>
                                            <p className="text-sm text-gray-500 font-medium line-clamp-2">{resource.description || 'Không có mô tả'}</p>
                                            <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">{resource.resource_type}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <a href={resource.file_url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-blue-50 text-[#007bff] px-4 py-2 rounded-xl font-bold hover:bg-blue-100 transition text-sm">Xem</a>
                                    <button onClick={() => handleDeleteResource(resource.resource_id!)} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition text-sm"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-gray-900 mb-2">Chưa có tài liệu nào</h3>
                    </div>
                )
            ) : (
                // Vocabulary List
                isLoading ? (
                    <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#007bff]" /></div>
                ) : vocabSuggestions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vocabSuggestions.map((vocab) => (
                            <div key={vocab.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative group">
                                <h3 className="text-xl font-black text-[#007bff] mb-2">{vocab.vocabulary}</h3>
                                {vocab.collocations && <p className="text-sm text-gray-600 mb-1"><strong>Collocations:</strong> {vocab.collocations}</p>}
                                {vocab.idioms && <p className="text-sm text-gray-600 mb-1"><strong>Idioms:</strong> {vocab.idioms}</p>}
                                {vocab.tips && <div className="mt-3 p-3 bg-yellow-50 rounded-xl text-xs text-yellow-800 font-medium">{vocab.tips}</div>}
                                <div className="absolute top-4 right-4 text-xs text-gray-400 font-bold">
                                    {new Date(vocab.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-gray-900 mb-2">Chưa có gợi ý nào</h3>
                    </div>
                )
            )}
        </div>
    );
}
