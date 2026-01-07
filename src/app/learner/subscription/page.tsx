"use client";
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CreditCard, CheckCircle, AlertTriangle, Calendar, Star } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionPage() {
    // Mock current subscription state
    const [subscription, setSubscription] = useState({
        plan: "Pro AI",
        status: "active",
        nextBilling: "2026-02-07",
        amount: 199000,
        method: "VNPay •••• 1234"
    });

    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-black text-gray-900 mb-8">Quản lý gói dịch vụ</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* CURRENT PLAN CARD */}
                        <div className="bg-white rounded-[32px] p-8 shadow-lg border border-gray-100">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-gray-500 font-bold uppercase text-xs mb-1">Gói hiện tại</p>
                                    <h2 className="text-3xl font-black text-[#007bff] flex items-center gap-2">
                                        {subscription.plan} <Star size={24} fill="currentColor" className="text-yellow-400" />
                                    </h2>
                                </div>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    {subscription.status}
                                </span>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                    <span className="text-gray-600 font-medium flex items-center gap-2">
                                        <Calendar size={18} className="text-gray-400" /> Gia hạn tiếp theo
                                    </span>
                                    <span className="font-bold text-gray-900">{subscription.nextBilling}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                    <span className="text-gray-600 font-medium flex items-center gap-2">
                                        <CreditCard size={18} className="text-gray-400" /> Phương thức
                                    </span>
                                    <span className="font-bold text-gray-900">{subscription.method}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                    <span className="text-gray-600 font-medium">Giá cước</span>
                                    <span className="font-bold text-gray-900">{subscription.amount.toLocaleString()} đ/tháng</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Link
                                    href="/learner/packages"
                                    className="flex-1 py-3 bg-[#007bff] text-white rounded-xl font-bold text-center hover:bg-blue-600 transition-all"
                                >
                                    Nâng cấp gói
                                </Link>
                                <button
                                    onClick={() => setShowCancelConfirm(true)}
                                    className="px-6 py-3 border-2 border-red-100 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-all"
                                >
                                    Hủy gói
                                </button>
                            </div>
                        </div>

                        {/* UPGRADE TEASER */}
                        <div className="bg-gradient-to-br from-[#007bff] to-purple-600 rounded-[32px] p-8 text-white relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>

                            <h3 className="text-2xl font-black mb-4">Bạn muốn học với Mentor 1-1?</h3>
                            <p className="text-blue-100 font-medium mb-6">
                                Nâng cấp lên gói Premium để được kèm cặp trực tiếp bởi các chuyên gia hàng đầu.
                            </p>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 font-medium">
                                    <CheckCircle size={20} className="text-yellow-400" /> 4 buổi 1-1 mỗi tháng
                                </li>
                                <li className="flex items-center gap-2 font-medium">
                                    <CheckCircle size={20} className="text-yellow-400" /> Chấm điểm chi tiết
                                </li>
                                <li className="flex items-center gap-2 font-medium">
                                    <CheckCircle size={20} className="text-yellow-400" /> Hỗ trợ 24/7
                                </li>
                            </ul>

                            <Link
                                href="/learner/payment?pkg=bx_mentor"
                                className="inline-block px-6 py-3 bg-white text-[#007bff] rounded-xl font-bold hover:shadow-lg transition-all"
                            >
                                Xem gói Premium
                            </Link>
                        </div>
                    </div>

                    {/* CANCEL MODAL */}
                    {showCancelConfirm && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-[24px] p-8 max-w-sm w-full text-center animate-fade-in-up">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                    <AlertTriangle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Bạn có chắc chắn không?</h3>
                                <p className="text-gray-500 mb-6">
                                    Bạn sẽ mất quyền truy cập các tính năng AI nâng cao sau khi kỳ hạn hiện tại kết thúc.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowCancelConfirm(false)}
                                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"
                                    >
                                        Giữ lại gói
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSubscription({ ...subscription, status: 'cancelled' });
                                            setShowCancelConfirm(false);
                                        }}
                                        className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600"
                                    >
                                        Xác nhận hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </ProtectedRoute>
    );
}
