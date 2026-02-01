"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, Shield, CreditCard, Loader2 } from 'lucide-react';

interface Policy {
    id: number;
    type: string;
    title: string;
    content: string;
    last_updated: string;
}

export default function PolicyPage() {
    const params = useParams();
    const policyType = (params.type as string)?.toUpperCase();
    const [policy, setPolicy] = useState<Policy | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadPolicy();
    }, [policyType]);

    const loadPolicy = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/policies/${policyType}`);
            if (!response.ok) throw new Error('Policy not found');
            const data = await response.json();
            setPolicy(data);
        } catch (e) {
            setError('Không tìm thấy chính sách này.');
        } finally {
            setLoading(false);
        }
    };

    const getIcon = () => {
        switch (policyType) {
            case 'TERMS': return <FileText size={32} />;
            case 'PRIVACY': return <Shield size={32} />;
            case 'REFUND': return <CreditCard size={32} />;
            default: return <FileText size={32} />;
        }
    };

    const getColor = () => {
        switch (policyType) {
            case 'TERMS': return 'bg-blue-50 text-blue-600';
            case 'PRIVACY': return 'bg-purple-50 text-purple-600';
            case 'REFUND': return 'bg-orange-50 text-orange-600';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    if (error || !policy) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">{error}</p>
                    <Link href="/" className="text-blue-600 font-bold hover:underline">
                        ← Về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium mb-6">
                        <ArrowLeft size={18} /> Về trang chủ
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getColor()}`}>
                            {getIcon()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">{policy.title}</h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Cập nhật lần cuối: {new Date(policy.last_updated).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12">
                    <div className="prose prose-lg max-w-none">
                        {policy.content.split('\n').map((paragraph, i) => (
                            <p key={i} className="text-gray-600 leading-relaxed mb-4 whitespace-pre-wrap">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Footer links */}
                <div className="mt-8 flex justify-center gap-6">
                    <Link href="/policies/terms" className={`px-4 py-2 rounded-xl font-bold text-sm ${policyType === 'TERMS' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        Điều khoản
                    </Link>
                    <Link href="/policies/privacy" className={`px-4 py-2 rounded-xl font-bold text-sm ${policyType === 'PRIVACY' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        Bảo mật
                    </Link>
                    <Link href="/policies/refund" className={`px-4 py-2 rounded-xl font-bold text-sm ${policyType === 'REFUND' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        Hoàn tiền
                    </Link>
                </div>
            </div>
        </div>
    );
}
