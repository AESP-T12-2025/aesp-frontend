"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { adminService } from '@/services/adminService';
import toast from 'react-hot-toast';
import { Loader2, CheckCircle, XCircle, UserX } from 'lucide-react';

interface MentorData {
    mentor_id: number;
    user_id: number;
    full_name: string;
    bio?: string;
    skills?: string;
    verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    total_bookings?: number;
    rating?: number;
}

export default function AdminMentorsPage() {
    const [mentors, setMentors] = useState<MentorData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        loadMentors();
    }, []);

    const loadMentors = async () => {
        try {
            const data = await adminService.listMentors();
            setMentors(Array.isArray(data) ? data : data.mentors || []);
        } catch (error) {
            toast.error("Lỗi tải danh sách Mentor");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (id: number) => {
        setProcessingId(id);
        try {
            await adminService.verifyMentor(id);
            toast.success("Đã duyệt Mentor thành công!");
            loadMentors();
        } catch (error) {
            toast.error("Lỗi khi duyệt Mentor");
        } finally {
            setProcessingId(null);
        }
    };

    const handleUnverify = async (id: number) => {
        setProcessingId(id);
        try {
            await adminService.unverifyMentor(id);
            toast.success("Đã hủy xác thực Mentor");
            loadMentors();
        } catch (error) {
            toast.error("Lỗi khi hủy xác thực");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-black text-[#007bff] mb-8">Quản Lý Mentor</h1>

                    {isLoading ? (
                        <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
                    ) : (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="p-4 font-bold">ID</th>
                                        <th className="p-4 font-bold">Họ tên</th>
                                        <th className="p-4 font-bold">Kỹ năng</th>
                                        <th className="p-4 font-bold">Trạng thái</th>
                                        <th className="p-4 font-bold">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mentors.map((mentor) => (
                                        <tr key={mentor.mentor_id} className="border-b hover:bg-gray-50">
                                            <td className="p-4">{mentor.mentor_id}</td>
                                            <td className="p-4 font-medium">{mentor.full_name}</td>
                                            <td className="p-4 text-gray-500">{mentor.skills}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${mentor.verification_status === 'VERIFIED'
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-yellow-100 text-yellow-600'
                                                    }`}>
                                                    {mentor.verification_status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    {mentor.verification_status !== 'VERIFIED' ? (
                                                        <button
                                                            onClick={() => handleVerify(mentor.mentor_id)}
                                                            disabled={processingId === mentor.mentor_id}
                                                            className="flex items-center gap-1 bg-[#007bff] text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-600 disabled:opacity-50"
                                                        >
                                                            {processingId === mentor.mentor_id ? (
                                                                <Loader2 size={16} className="animate-spin" />
                                                            ) : (
                                                                <CheckCircle size={16} />
                                                            )}
                                                            Duyệt
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUnverify(mentor.mentor_id)}
                                                            disabled={processingId === mentor.mentor_id}
                                                            className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-red-100 disabled:opacity-50"
                                                        >
                                                            {processingId === mentor.mentor_id ? (
                                                                <Loader2 size={16} className="animate-spin" />
                                                            ) : (
                                                                <UserX size={16} />
                                                            )}
                                                            Hủy duyệt
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {mentors.length === 0 && (
                                <p className="text-center p-8 text-gray-500">Chưa có Mentor nào đăng ký.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
