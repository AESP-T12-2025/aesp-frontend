"use client";
import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import toast from 'react-hot-toast';
import { Loader2, Receipt, User, Package, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';

interface Transaction {
    transaction_id: number;
    user_id: number;
    package_id: number;
    amount: number;
    status: string;
    created_at: string;
    user?: { full_name: string; email: string };
    package?: { name: string };
}

export default function AdminPurchasesPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const data = await adminService.getAllTransactions();
            // Handle paginated response: { items: [...], total, page, ... }
            const items = Array.isArray(data) ? data : (data?.items || data?.transactions || []);
            setTransactions(items);
        } catch (e) {
            console.error(e);
            toast.error("Lỗi tải lịch sử giao dịch");
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'ALL') return true;
        return t.status === filter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-700';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            case 'FAILED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const totalRevenue = transactions.filter(t => t.status === 'COMPLETED').reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900">Lịch sử Mua Gói</h1>
                <p className="text-slate-500 mt-1">Xem tất cả giao dịch mua gói của học viên</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl border shadow-sm">
                    <p className="text-sm text-slate-500 font-bold">Tổng giao dịch</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{transactions.length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border shadow-sm">
                    <p className="text-sm text-slate-500 font-bold">Thành công</p>
                    <p className="text-3xl font-black text-green-600 mt-1">{transactions.filter(t => t.status === 'COMPLETED').length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border shadow-sm">
                    <p className="text-sm text-slate-500 font-bold">Đang xử lý</p>
                    <p className="text-3xl font-black text-yellow-600 mt-1">{transactions.filter(t => t.status === 'PENDING').length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border shadow-sm">
                    <p className="text-sm text-slate-500 font-bold">Tổng doanh thu</p>
                    <p className="text-2xl font-black text-indigo-600 mt-1">{totalRevenue.toLocaleString()}đ</p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-6">
                {['ALL', 'COMPLETED', 'PENDING', 'FAILED'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm transition ${filter === status ? 'bg-indigo-600 text-white' : 'bg-white border hover:bg-gray-50'
                            }`}
                    >
                        {status === 'ALL' ? 'Tất cả' : status}
                    </button>
                ))}
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
            ) : (
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="text-left px-6 py-4 font-bold text-slate-700">ID</th>
                                <th className="text-left px-6 py-4 font-bold text-slate-700">Người mua</th>
                                <th className="text-left px-6 py-4 font-bold text-slate-700">Gói</th>
                                <th className="text-left px-6 py-4 font-bold text-slate-700">Số tiền</th>
                                <th className="text-left px-6 py-4 font-bold text-slate-700">Trạng thái</th>
                                <th className="text-left px-6 py-4 font-bold text-slate-700">Ngày</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map(t => (
                                <tr key={t.transaction_id} className="border-t hover:bg-slate-50">
                                    <td className="px-6 py-4 font-mono text-sm">#{t.transaction_id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-slate-400" />
                                            <span className="font-medium">{t.user?.full_name || `User #${t.user_id}`}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Package size={16} className="text-indigo-500" />
                                            <span>{t.package?.name || `Package #${t.package_id}`}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-indigo-600">{t.amount?.toLocaleString()}đ</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(t.status)}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {new Date(t.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredTransactions.length === 0 && (
                        <div className="text-center py-12 text-slate-400">
                            <Receipt size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Không có giao dịch nào</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
