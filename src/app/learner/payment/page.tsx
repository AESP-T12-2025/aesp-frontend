"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockService } from '@/services/mockService'; // We can use mockService here later if needed
import { Shield, CreditCard, CheckCircle, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const pkgId = searchParams?.get('pkg') || 'bx_basic';
    const router = useRouter();

    // Mock package data logic just for display
    const pkgName = pkgId === 'bx_pro' ? 'Pro AI' : pkgId === 'bx_mentor' ? 'Mentor 1-1' : 'Unknown';
    const pkgPrice = pkgId === 'bx_pro' ? 199000 : pkgId === 'bx_mentor' ? 999000 : 0;

    const [paymentMethod, setPaymentMethod] = useState('vnpay');
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            toast.success("Thanh toán thành công!");
            router.push('/learner?success=true');
        }, 2000);
    };

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="max-w-4xl w-full bg-white rounded-[32px] shadow-xl overflow-hidden flex flex-col md:flex-row">

                    {/* Left: Order Summary */}
                    <div className="bg-[#007bff] p-10 text-white md:w-5/12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

                        <h2 className="text-2xl font-black mb-8 relative z-10">Tóm tắt đơn hàng</h2>

                        <div className="space-y-6 relative z-10">
                            <div>
                                <p className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-1">Gói dịch vụ</p>
                                <h3 className="text-3xl font-black">{pkgName} Plan</h3>
                            </div>

                            <div>
                                <p className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-1">Thời hạn</p>
                                <p className="text-xl font-bold">1 Tháng</p>
                            </div>

                            <div className="pt-8 border-t border-white/20">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-blue-100 font-medium">Tạm tính</span>
                                    <span className="font-bold">{pkgPrice.toLocaleString()} đ</span>
                                </div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-blue-100 font-medium">Giảm giá</span>
                                    <span className="font-bold">0 đ</span>
                                </div>
                                <div className="flex justify-between items-center text-3xl font-black">
                                    <span>Tổng cộng</span>
                                    <span>{pkgPrice.toLocaleString()} đ</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex items-center gap-2 text-blue-200 text-xs font-medium">
                            <Shield size={14} /> Bảo mật thanh toán 256-bit SSL
                        </div>
                    </div>

                    {/* Right: Payment Method */}
                    <div className="p-10 md:w-7/12">
                        <h2 className="text-2xl font-black text-gray-900 mb-8">Phương thức thanh toán</h2>

                        <div className="space-y-4 mb-8">
                            <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'vnpay' ? 'border-[#007bff] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <input type="radio" name="payment" value="vnpay" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} className="w-5 h-5 text-[#007bff]" />
                                <div className="flex-1">
                                    <span className="font-bold text-gray-900 block">VNPay QR</span>
                                    <span className="text-xs text-gray-500">Quét mã QR qua app ngân hàng</span>
                                </div>
                                <CreditCard className="text-gray-400" />
                            </label>

                            <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'momo' ? 'border-[#d82d8b] bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <input type="radio" name="payment" value="momo" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} className="w-5 h-5 text-[#d82d8b]" />
                                <div className="flex-1">
                                    <span className="font-bold text-gray-900 block">MoMo</span>
                                    <span className="text-xs text-gray-500">Ví điện tử MoMo</span>
                                </div>
                                <div className="w-8 h-8 rounded bg-[#a50064]"></div>
                            </label>

                            <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-gray-400 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 text-gray-600" />
                                <div className="flex-1">
                                    <span className="font-bold text-gray-900 block">Thẻ Quốc Tế</span>
                                    <span className="text-xs text-gray-500">Visa, Mastercard, JCB</span>
                                </div>
                                <CreditCard className="text-gray-400" />
                            </label>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <>Đang xử lý...</>
                            ) : (
                                <>
                                    <Lock size={18} /> Thanh toán ngay {pkgPrice.toLocaleString()} đ
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
