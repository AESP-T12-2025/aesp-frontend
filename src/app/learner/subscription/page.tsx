"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { paymentService, ServicePackage } from '@/services/paymentService';
import toast from 'react-hot-toast';
import { Loader2, Package, Check, Zap, Crown, Star, ArrowUp, X } from 'lucide-react';

export default function SubscriptionPage() {
    const [currentSub, setCurrentSub] = useState<any>(null);
    const [packages, setPackages] = useState<ServicePackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [subData, pkgData] = await Promise.all([
                paymentService.getMySubscription(),
                paymentService.getPackages()
            ]);
            setCurrentSub(subData);
            setPackages(pkgData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async (packageId: number) => {
        if (!confirm('Bạn có chắc muốn nâng cấp lên gói này?')) return;
        setUpgrading(true);
        try {
            await paymentService.upgradeSubscription(packageId);
            toast.success("Nâng cấp thành công!");
            loadData();
        } catch (e) {
            toast.error("Lỗi nâng cấp gói");
        } finally {
            setUpgrading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm('Bạn có chắc muốn hủy subscription? Bạn sẽ mất quyền truy cập các tính năng premium.')) return;
        try {
            await paymentService.cancelSubscription();
            toast.success("Đã hủy subscription");
            loadData();
        } catch (e) {
            toast.error("Lỗi hủy subscription");
        }
    };

    const getPackageIcon = (name: string) => {
        if (name.toLowerCase().includes('premium') || name.toLowerCase().includes('pro')) return <Crown className="text-yellow-500" size={28} />;
        if (name.toLowerCase().includes('plus') || name.toLowerCase().includes('standard')) return <Star className="text-blue-500" size={28} />;
        return <Package className="text-gray-500" size={28} />;
    };

    if (loading) {
        return (
            <ProtectedRoute allowedRoles={['LEARNER']}>
                <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="p-8 max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900">Quản Lý Subscription</h1>
                    <p className="text-slate-500 mt-1">Nâng cấp hoặc thay đổi gói dịch vụ của bạn</p>
                </div>

                {/* Current Subscription */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-indigo-200 text-sm font-bold uppercase tracking-wider">Gói hiện tại</p>
                            <h2 className="text-3xl font-black mt-2">{currentSub?.has_subscription ? currentSub.plan : 'Chưa có gói'}</h2>
                            {currentSub?.has_subscription && (
                                <div className="mt-4 space-y-1">
                                    <p className="text-indigo-100">Trạng thái: <span className="font-bold">{currentSub.status === 'active' ? '✅ Đang hoạt động' : '⏰ Đã hết hạn'}</span></p>
                                    <p className="text-indigo-100">Hết hạn: <span className="font-bold">{new Date(currentSub.end_date).toLocaleDateString('vi-VN')}</span></p>
                                </div>
                            )}
                        </div>
                        <div className="hidden md:block">
                            <Crown size={80} className="text-white/20" />
                        </div>
                    </div>
                    {currentSub?.has_subscription && (
                        <button
                            onClick={handleCancel}
                            className="mt-6 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition flex items-center gap-2"
                        >
                            <X size={16} /> Hủy subscription
                        </button>
                    )}
                </div>

                {/* Available Packages */}
                <h3 className="text-xl font-bold text-slate-900 mb-4">Các gói có sẵn</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {packages.map(pkg => {
                        const isCurrent = currentSub?.package_id === (pkg.package_id || pkg.id);
                        const isHigher = (pkg.price || 0) > (packages.find(p => p.package_id === currentSub?.package_id)?.price || 0);

                        return (
                            <div
                                key={pkg.package_id || pkg.id}
                                className={`bg-white rounded-3xl p-6 border-2 shadow-sm transition-all ${isCurrent ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-100 hover:border-indigo-200'
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-slate-100 rounded-2xl">{getPackageIcon(pkg.name)}</div>
                                    <div>
                                        <h4 className="font-black text-slate-900">{pkg.name}</h4>
                                        {isCurrent && <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">Đang dùng</span>}
                                    </div>
                                </div>

                                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{pkg.description}</p>

                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-3xl font-black text-indigo-600">{(pkg.price || 0).toLocaleString()}</span>
                                    <span className="text-slate-500">đ/{pkg.duration_days || 30} ngày</span>
                                </div>

                                {/* Features */}
                                {pkg.features && Array.isArray(pkg.features) && (
                                    <ul className="space-y-2 mb-6">
                                        {pkg.features.slice(0, 4).map((f, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                                <Check size={16} className="text-green-500" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {isCurrent ? (
                                    <div className="py-3 text-center bg-indigo-50 rounded-xl text-indigo-600 font-bold">
                                        ✓ Gói hiện tại
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleUpgrade(pkg.package_id || pkg.id!)}
                                        disabled={upgrading}
                                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${isHigher
                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        {upgrading ? <Loader2 className="animate-spin" size={18} /> : <ArrowUp size={18} />}
                                        {isHigher ? 'Nâng cấp' : 'Chuyển gói'}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </ProtectedRoute>
    );
}
