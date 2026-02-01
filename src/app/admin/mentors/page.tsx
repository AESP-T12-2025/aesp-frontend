"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mentorService, MentorProfile } from '@/services/mentorService';
import { adminService } from '@/services/adminService'; // Import adminService
import toast from 'react-hot-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AdminMentorsPage() {
    const [mentors, setMentors] = useState<any[]>([]); // Use any[] or shared Mentor type
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadMentors();
    }, []);

    const loadMentors = async () => {
        try {
            // Use adminService to get ALL mentors (including PENDING)
            const data = await adminService.listMentors();
            setMentors(data);
        } catch (error) {
            toast.error("Lỗi tải danh sách Mentor");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (id: number) => {
        try {
            await mentorService.verifyMentor(id);
            toast.success("Đã duyệt Mentor thành công!");
            loadMentors(); // Reload to update status
        } catch (error) {
            toast.error("Lỗi khi duyệt Mentor");
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
                                                {mentor.verification_status !== 'VERIFIED' && (
                                                    <button
                                                        onClick={() => handleVerify(mentor.mentor_id!)}
                                                        className="flex items-center gap-1 bg-[#007bff] text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-600"
                                                    >
                                                        <CheckCircle size={16} /> Duyệt
                                                    </button>
                                                )}
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
