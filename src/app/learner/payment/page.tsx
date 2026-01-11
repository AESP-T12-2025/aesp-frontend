"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { paymentService, ServicePackage } from '@/services/paymentService';
import { Shield, CreditCard, CheckCircle, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const pkgIdParam = searchParams?.get('pkg');
    const router = useRouter();

    const [selectedPkg, setSelectedPkg] = useState<ServicePackage | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('vnpay');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        loadPackageDetails();
    }, [pkgIdParam]);

    const loadPackageDetails = async () => {
        if (!pkgIdParam) {
            setLoading(false);
            return;
        }
        try {
            const packages = await paymentService.getPackages();
            const pkg = packages.find(p => p.id === Number(pkgIdParam));
            if (pkg) {
                setSelectedPkg(pkg);
            } else {
                toast.error("Gói dịch vụ không tồn tại");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!selectedPkg) return;
        setIsProcessing(true);
        try {
            const res = await paymentService.createTransaction({
                package_id: selectedPkg.id,
                payment_method: paymentMethod.toUpperCase()
            });
            toast.success("Thanh toán thành công!");
            // Redirect to success page or learner dashboard with param
            router.push('/learner?success=true');
        } catch (error) {
            toast.error("Giao dịch thất bại");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    if (!selectedPkg) return (
        <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center flex-col">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Không tìm thấy gói dịch vụ</h2>
            <button onClick={() => router.push('/learner/packages')} className="text-blue-600 font-bold hover:underline">Quay lại danh sách</button>
        </div>
    );

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
                                <h3 className="text-3xl font-black">{selectedPkg.name}</h3>
                            </div>

                            <div>
                                <p className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-1">Thời hạn</p>
                                <p className="text-xl font-bold">{selectedPkg.duration_days} Ngày</p>
                            </div>

                            <div className="pt-8 border-t border-white/20">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-blue-100 font-medium">Tạm tính</span>
                                    <span className="font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPkg.price)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-blue-100 font-medium">Giảm giá</span>
                                    <span className="font-bold">0 đ</span>
                                </div>
                                <div className="flex justify-between items-center text-3xl font-black">
                                    <span>Tổng cộng</span>
                                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedPkg.price)}</span>
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
                                <><Loader2 className="animate-spin" /> Đang xử lý...</>
                            ) : (
                                <>
                                    <Lock size={18} /> Thanh toán ngay
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
