"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Target, Clock, CheckCircle, Save, Loader2, ArrowLeft } from 'lucide-react';
import { userService } from '@/services/userService';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function GoalsPage() {
    const [goal, setGoal] = useState<number>(15);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await userService.getMyProfile();
            if (data.daily_learning_goal) {
                setGoal(data.daily_learning_goal);
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi tải thông tin cá nhân");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await userService.updateMe({ daily_learning_goal: goal });
            toast.success("Cập nhật mục tiêu thành công!");
        } catch (error) {
            toast.error("Lỗi cập nhật");
        } finally {
            setSaving(false);
        }
    };

    const goals = [
        { value: 15, label: "Nhẹ nhàng", desc: "15 phút / ngày" },
        { value: 30, label: "Tiêu chuẩn", desc: "30 phút / ngày" },
        { value: 45, label: "Nghiêm túc", desc: "45 phút / ngày" },
        { value: 60, label: "Chăm chỉ", desc: "60 phút / ngày" },
    ];

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#007bff]" /></div>;

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="min-h-screen bg-[#F8F9FD] p-4 md:p-8 font-sans">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-6 flex items-center gap-4">
                        <Link href="/learner" className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition text-slate-600">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-2xl font-black text-slate-900">Mục Tiêu Học Tập</h1>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#007bff]">
                                <Target size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Mục tiêu hằng ngày</h2>
                                <p className="text-slate-500 font-medium">Chọn thời gian bạn muốn dành để học mỗi ngày</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {goals.map((item) => (
                                <div
                                    key={item.value}
                                    onClick={() => setGoal(item.value)}
                                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${goal === item.value ? 'border-[#007bff] bg-blue-50/50' : 'border-gray-100 hover:border-blue-100'}`}
                                >
                                    <div>
                                        <h3 className={`font-bold ${goal === item.value ? 'text-[#007bff]' : 'text-slate-700'}`}>{item.label}</h3>
                                        <p className="text-slate-500 text-sm font-medium mt-1 flex items-center gap-1">
                                            <Clock size={14} /> {item.desc}
                                        </p>
                                    </div>
                                    {goal === item.value && (
                                        <div className="w-6 h-6 rounded-full bg-[#007bff] flex items-center justify-center text-white">
                                            <CheckCircle size={14} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-[#007bff] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                        >
                            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
