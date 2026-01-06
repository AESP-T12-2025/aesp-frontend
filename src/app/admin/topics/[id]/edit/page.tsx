"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from "@/components/ImageUpload";
import { topicService } from '@/services/topicService';
import toast from 'react-hot-toast';

export default function EditTopicPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: '',
        category_id: 1 // Default for now, or fetch if we had categories
    });

    useEffect(() => {
        const fetchTopic = async () => {
            if (!id) return;
            setIsFetching(true);
            try {
                const data = await topicService.getById(Number(id));
                setFormData({
                    name: data.name,
                    description: data.description || '',
                    image_url: data.image_url || '',
                    category_id: 1 // TODO: Add category_id to Topic response if needed
                });
            } catch (error) {
                console.error("Failed to fetch topic", error);
                toast.error("Không tải được dữ liệu chủ đề");
                router.push('/admin/topics');
            } finally {
                setIsFetching(false);
            }
        };
        fetchTopic();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name) {
            toast.error("Vui lòng nhập tên chủ đề");
            return;
        }

        setIsLoading(true);
        try {
            await topicService.update(Number(id), formData);
            toast.success("Cập nhật chủ đề thành công!");
            router.push('/admin/topics');
        } catch (error) {
            console.error("Update topic error:", error);
            toast.error("Cập nhật thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return <div className="flex h-screen justify-center items-center"><Loader2 className="animate-spin text-[#007bff] w-8 h-8" /></div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/topics" className="p-2 hover:bg-white rounded-full transition text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-3xl font-black text-gray-900">Sửa Chủ Đề #{id}</h1>
            </div>

            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Tên Chủ Đề <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#007bff] font-medium"
                            placeholder="Ví dụ: Daily Conversations..."
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Mô Tả</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#007bff] font-medium resize-none"
                            placeholder="Mô tả ngắn về chủ đề này..."
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <ImageUpload
                            value={formData.image_url}
                            onChange={(url) => setFormData({ ...formData, image_url: url })}
                            label="Ảnh bìa chủ đề"
                        />
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
