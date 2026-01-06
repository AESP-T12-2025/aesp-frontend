"use client";

import { useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    disabled?: boolean;
}

export default function ImageUpload({ value, onChange, label = "Ảnh đại diện", disabled }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng chọn file ảnh");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            toast.error("File ảnh quá lớn (Max 5MB)");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post("/upload/image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const imageUrl = response.data.url;
            onChange(imageUrl);
            toast.success("Tải ảnh lên thành công");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Lỗi khi tải ảnh lên server");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        onChange("");
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">{label}</label>

            {value ? (
                <div className="relative w-full h-48 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 group">
                    <img src={value} alt="Uploaded" className="w-full h-full object-cover" />

                    {!disabled && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                            title="Xóa ảnh"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            ) : (
                <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:bg-gray-50 transition-colors">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={disabled || isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="flex flex-col items-center justify-center text-gray-500 gap-2">
                        {isUploading ? (
                            <>
                                <Loader2 className="animate-spin text-[#007bff]" size={32} />
                                <span className="font-medium text-sm text-[#007bff]">Đang tải lên...</span>
                            </>
                        ) : (
                            <>
                                <div className="p-3 bg-blue-50 text-[#007bff] rounded-full mb-1">
                                    <Upload size={24} />
                                </div>
                                <span className="font-medium text-sm">Bấm để chọn ảnh hoặc kéo thả</span>
                                <span className="text-xs text-gray-400">PNG, JPG, WEBP (Max 5MB)</span>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
