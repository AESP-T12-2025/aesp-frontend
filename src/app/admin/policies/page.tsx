"use client";
import React, { useEffect, useState } from 'react';
import { adminService, Policy } from '@/services/adminService';
import { FileText, Plus, Edit2, Trash2, Loader2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPoliciesPage() {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showNew, setShowNew] = useState(false);

    const [form, setForm] = useState({ title: '', content: '', type: 'TERMS' });

    useEffect(() => {
        loadPolicies();
    }, []);

    const loadPolicies = async () => {
        try {
            const data = await adminService.getAllPolicies();
            setPolicies(data);
        } catch (e) {
            toast.error("Không thể tải policies");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!form.title.trim() || !form.content.trim()) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        try {
            await adminService.createPolicy(form);
            toast.success("Đã tạo policy!");
            setShowNew(false);
            setForm({ title: '', content: '', type: 'TERMS' });
            loadPolicies();
        } catch (e) {
            toast.error("Lỗi tạo policy");
        }
    };

    const handleUpdate = async (id: number) => {
        try {
            await adminService.updatePolicy(id, form);
            toast.success("Đã cập nhật!");
            setEditingId(null);
            loadPolicies();
        } catch (e) {
            toast.error("Lỗi cập nhật");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Xác nhận xóa policy này?")) return;
        try {
            await adminService.deletePolicy(id);
            toast.success("Đã xóa!");
            loadPolicies();
        } catch (e) {
            toast.error("Lỗi xóa");
        }
    };

    const startEdit = (policy: Policy) => {
        setEditingId(policy.id);
        setForm({ title: policy.title, content: policy.content, type: policy.type });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Quản lý chính sách</h1>
                    <p className="text-gray-500">Tạo và quản lý các chính sách hệ thống (Điều khoản, Bảo mật, Hoàn tiền...)</p>
                </div>
                <button
                    onClick={() => { setShowNew(true); setForm({ title: '', content: '', type: 'TERMS' }); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={18} /> Thêm mới
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
            ) : (
                <div className="space-y-4">
                    {/* New Policy Form */}
                    {showNew && (
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                            <h3 className="font-bold text-blue-900 mb-4">Tạo Policy mới</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <input
                                    className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200"
                                    placeholder="Tiêu đề"
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                />
                                <select
                                    className="px-4 py-2 rounded-lg border border-gray-200"
                                    value={form.type}
                                    onChange={e => setForm({ ...form, type: e.target.value })}
                                >
                                    <option value="TERMS">TERMS (Điều khoản)</option>
                                    <option value="PRIVACY">PRIVACY (Bảo mật)</option>
                                    <option value="REFUND">REFUND (Hoàn tiền)</option>
                                </select>
                                <div className="flex gap-2">
                                    <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold flex items-center gap-1">
                                        <Save size={16} /> Lưu
                                    </button>
                                    <button onClick={() => setShowNew(false)} className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-bold flex items-center gap-1">
                                        <X size={16} /> Hủy
                                    </button>
                                </div>
                            </div>
                            <textarea
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 min-h-[150px]"
                                placeholder="Nội dung policy..."
                                value={form.content}
                                onChange={e => setForm({ ...form, content: e.target.value })}
                            />
                        </div>
                    )}

                    {/* Existing Policies */}
                    {policies.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                            <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                            <p className="text-gray-500 font-medium">Chưa có policy nào. Hãy tạo mới!</p>
                        </div>
                    ) : (
                        policies.map(policy => (
                            <div key={policy.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                {editingId === policy.id ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <input
                                                className="px-4 py-2 rounded-lg border border-gray-200"
                                                value={form.title}
                                                onChange={e => setForm({ ...form, title: e.target.value })}
                                            />
                                            <select
                                                className="px-4 py-2 rounded-lg border border-gray-200"
                                                value={form.type}
                                                onChange={e => setForm({ ...form, type: e.target.value })}
                                            >
                                                <option value="TERMS">TERMS</option>
                                                <option value="PRIVACY">PRIVACY</option>
                                                <option value="REFUND">REFUND</option>
                                            </select>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleUpdate(policy.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold flex items-center gap-1">
                                                    <Save size={16} /> Lưu
                                                </button>
                                                <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-bold">
                                                    Hủy
                                                </button>
                                            </div>
                                        </div>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 min-h-[150px]"
                                            value={form.content}
                                            onChange={e => setForm({ ...form, content: e.target.value })}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${policy.type === 'TERMS' ? 'bg-blue-100 text-blue-700' :
                                                        policy.type === 'PRIVACY' ? 'bg-purple-100 text-purple-700' :
                                                            'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {policy.type}
                                                </span>
                                                <h3 className="text-xl font-bold text-gray-900 mt-2">{policy.title}</h3>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Cập nhật: {new Date(policy.last_updated).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => startEdit(policy)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(policy.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed line-clamp-3">{policy.content}</p>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
