"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CheckCircle, Zap, Star, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { paymentService, ServicePackage } from '@/services/paymentService';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function PackagesPage() {
    const [packages, setPackages] = useState<ServicePackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;
        loadPackages(isMounted);
        return () => { isMounted = false; };
    }, [filter]);

    const loadPackages = async (isMounted = true) => {
        if (isMounted) setLoading(true); // Show loading when switching
        try {
            const data = await paymentService.getPackages(filter === null ? undefined : filter);
            if (isMounted) setPackages(data);
        } catch (error) {
            console.error("Failed to load packages", error);
            // Fallback for demo if DB is empty
            if (isMounted) setPackages([]);
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    const handleBuy = async (pkgId: number) => {
        try {
            await paymentService.createTransaction({
                package_id: pkgId,
                payment_method: 'MOCK_BANKING'
            });
            toast.success("Đăng ký thành công!");
            router.push('/learner');
        } catch (error) {
            toast.error("Lỗi thanh toán");
            console.error(error);
        }
    };

    // Helper to map DB packages to UI styles (since DB lacks these fields)
    const getPackageStyle = (pkg: ServicePackage) => {
        const lowerName = pkg.name.toLowerCase();
        if (lowerName.includes('pro') || lowerName.includes('ai')) {
            return { color: 'blue', isPopular: true };
        }
        if (lowerName.includes('mentor')) {
            return { color: 'purple', isPopular: false };
        }
        return { color: 'gray', isPopular: false };
    };

    const getColorClass = (color: string) => {
        switch (color) {
            case 'blue': return 'bg-[#007bff] text-white border-[#007bff]';
            case 'purple': return 'bg-purple-600 text-white border-purple-600';
            default: return 'bg-white text-gray-900 border-gray-100';
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-black text-gray-900 mb-4">Nâng cấp tài khoản</h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
                            Mở khóa toàn bộ tính năng AI và Mentor để tăng tốc độ học gấp 3 lần.
                        </p>

                        {/* Filter Tabs */}
                        <div className="inline-flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                            {[
                                { label: 'Tất cả', value: null },
                                { label: 'Tự học (AI)', value: false },
                                { label: 'Có Mentor', value: true },
                            ].map((tab) => (
                                <button
                                    key={String(tab.value)}
                                    onClick={() => setFilter(tab.value)}
                                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${filter === tab.value
                                        ? 'bg-[#007bff] text-white shadow-md shadow-blue-200'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin text-blue-600" /></div>
                    ) : packages.length === 0 ? (
                        <div className="text-center text-gray-500">Hiện chưa có gói cước nào phù hợp.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                            {packages.map(pkg => {
                                const { color, isPopular } = getPackageStyle(pkg);
                                // Parse features if needed (assuming backend sends list or dict)
                                const featuresList = Array.isArray(pkg.features) ? pkg.features :
                                    (typeof pkg.features === 'string' ? JSON.parse(pkg.features) :
                                        (typeof pkg.features === 'object' ? Object.keys(pkg.features || {}) : []));

                                return (
                                    <div
                                        key={pkg.id}
                                        className={`rounded-[32px] p-8 transition-all duration-300 relative ${isPopular
                                            ? 'shadow-2xl scale-105 z-10 ' + getColorClass(color)
                                            : 'bg-white shadow-lg border border-gray-100 hover:shadow-xl'
                                            }`}
                                    >
                                        {isPopular && (
                                            <div className="absolute top-0 center w-full -mt-4 text-center">
                                                <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                                                    Most Popular
                                                </span>
                                            </div>
                                        )}

                                        <h3 className={`text-2xl font-black mb-2 ${isPopular ? 'text-white' : 'text-gray-900'}`}>{pkg.name}</h3>
                                        <div className="flex items-baseline mb-8">
                                            <span className={`text-4xl font-black ${isPopular ? 'text-white' : 'text-[#007bff]'}`}>
                                                {pkg.price === 0 ? 'Free' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pkg.price)}
                                            </span>
                                            <span className={`ml-2 text-sm font-bold ${isPopular ? 'text-white/80' : 'text-gray-400'}`}>/tháng</span>
                                        </div>

                                        <ul className="space-y-4 mb-8">
                                            {featuresList.map((feat: any, i: number) => (
                                                <li key={i} className={`flex items-start gap-3 text-sm font-bold ${isPopular ? 'text-white' : 'text-gray-600'}`}>
                                                    <CheckCircle size={20} className={isPopular ? 'text-yellow-400' : 'text-green-500'} />
                                                    {String(feat)}
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            onClick={() => handleBuy(pkg.id!)}
                                            className={`w-full py-4 rounded-xl font-black text-center block transition-all ${isPopular
                                                ? 'bg-white text-[#007bff] hover:bg-gray-100'
                                                : 'bg-[#007bff] text-white hover:bg-blue-600'
                                                }`}
                                        >
                                            {pkg.price === 0 ? 'Đang sử dụng' : 'Chọn gói này'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Comparison Table (Static for now as it describes fixed tiers) */}
                    <div className="mt-20">
                        <h2 className="text-3xl font-black text-center text-gray-900 mb-12">So sánh chi tiết quyền lợi</h2>
                        <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="p-6 text-gray-500 font-bold uppercase text-xs tracking-wider w-1/3">Tính năng</th>
                                            <th className="p-6 text-center text-gray-900 font-black text-lg w-1/5">Basic</th>
                                            <th className="p-6 text-center text-[#007bff] font-black text-lg w-1/5">Pro AI</th>
                                            <th className="p-6 text-center text-purple-600 font-black text-lg w-1/5">Mentor 1-1</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {[
                                            { name: "Luyện tập với AI", basic: "Giới hạn (10/ngày)", pro: "Không giới hạn", mentor: "Không giới hạn" },
                                            { name: "Chấm điểm phát âm chi tiết", basic: false, pro: true, mentor: true },
                                            { name: "Lộ trình học cá nhân hóa", basic: true, pro: true, mentor: true },
                                            { name: "Buổi học 1-1 với Mentor", basic: false, pro: false, mentor: "4 buổi/tháng" },
                                            { name: "Chứng chỉ hoàn thành", basic: false, pro: true, mentor: true },
                                        ].map((row, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-6 font-medium text-gray-700">{row.name}</td>
                                                <td className="p-6 text-center">
                                                    {row.basic === true ? <CheckCircle size={20} className="mx-auto text-green-500" /> :
                                                        row.basic === false ? <span className="text-gray-300">-</span> :
                                                            <span className="text-gray-600 font-bold text-sm">{row.basic}</span>}
                                                </td>
                                                <td className="p-6 text-center bg-blue-50/30">
                                                    {row.pro === true ? <CheckCircle size={20} className="mx-auto text-[#007bff]" /> :
                                                        row.pro === false ? <span className="text-gray-300">-</span> :
                                                            <span className="text-[#007bff] font-bold text-sm">{row.pro}</span>}
                                                </td>
                                                <td className="p-6 text-center bg-purple-50/30">
                                                    {row.mentor === true ? <CheckCircle size={20} className="mx-auto text-purple-600" /> :
                                                        row.mentor === false ? <span className="text-gray-300">-</span> :
                                                            <span className="text-purple-600 font-bold text-sm">{row.mentor}</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
