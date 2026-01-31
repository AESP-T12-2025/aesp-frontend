"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { scenarioService, ScenarioCreate } from '@/services/scenarioService';
import { topicService, Topic } from '@/services/topicService';
import toast from 'react-hot-toast';

export default function EditScenarioPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [topics, setTopics] = useState<Topic[]>([]);

    const [formData, setFormData] = useState<ScenarioCreate>({
        title: '',
        topic_id: 0,
        difficulty_level: 'BEGINNER',
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setIsFetching(true);
            try {
                // Fetch topics and scenario detail in parallel
                const [topicsData, scenarioData] = await Promise.all([
                    topicService.getAll(),
                    scenarioService.getById(Number(id))
                ]);

                setTopics(topicsData);

                // Prefill form
                setFormData({
                    title: scenarioData.title,
                    topic_id: scenarioData.topic_id,
                    difficulty_level: scenarioData.difficulty_level,
                });

            } catch (error) {
                console.error("Failed to fetch data", error);
                toast.error("Không tải được dữ liệu kịch bản");
                router.push('/admin/scenarios');
            } finally {
                setIsFetching(false);
            }
        };
        fetchData();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'topic_id' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title) {
            toast.error("Vui lòng nhập tên kịch bản");
            return;
        }

        setIsLoading(true);
        try {
            await scenarioService.update(Number(id), formData);
            toast.success("Cập nhật kịch bản thành công!");
            router.push('/admin/scenarios');
        } catch (error: any) {
            console.error("Update scenario error:", error);
            toast.error("Cập nhật thất bại: " + (error.response?.data?.detail || "Lỗi server"));
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return <div className="flex h-screen justify-center items-center"><Loader2 className="animate-spin text-[#007bff] w-8 h-8" /></div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/scenarios" className="p-2 hover:bg-white rounded-full transition text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-3xl font-black text-gray-900">Sửa Kịch Bản #{id}</h1>
            </div>

            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Tên Kịch Bản <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Ví dụ: Order Coffee, Job Interview..."
                            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#007bff] font-medium"
                            required
                        />
                    </div>

                    {/* Topic Select */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Thuộc Chủ Đề (Topic)</label>
                        <select
                            name="topic_id"
                            value={formData.topic_id}
                            onChange={handleChange}
                            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#007bff] font-medium appearance-none"
                        >
                            {topics.map(topic => (
                                <option key={topic.topic_id} value={topic.topic_id}>{topic.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Difficulty Select */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Độ Khó</label>
                        <select
                            name="difficulty_level"
                            value={formData.difficulty_level}
                            onChange={handleChange}
                            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#007bff] font-medium appearance-none"
                        >
                            <option value="BEGINNER">Cơ bản (Beginner)</option>
                            <option value="INTERMEDIATE">Trung bình (Intermediate)</option>
                            <option value="ADVANCED">Nâng cao (Advanced)</option>
                        </select>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#007bff] text-white font-black py-4 rounded-2xl hover:bg-blue-600 flex justify-center items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:bg-blue-300"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> LƯU THAY ĐỔI</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
