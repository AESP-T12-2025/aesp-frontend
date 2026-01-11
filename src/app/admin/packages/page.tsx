"use client";
import React, { useEffect, useState } from 'react';
import { paymentService, ServicePackage } from '@/services/paymentService';
import toast from 'react-hot-toast';
import { Loader2, Plus, Package, Edit, Trash2, DollarSign, Check, X } from 'lucide-react';

export default function AdminPackagesPage() {
    const [packages, setPackages] = useState<ServicePackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        duration_days: 30,
        features: '',
        is_active: true
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadPackages();
    }, []);

    const loadPackages = async () => {
        try {
            const data = await paymentService.getPackages();
            setPackages(data);
        } catch (e) {
            toast.error("Lỗi tải danh sách gói");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...formData,
                features: formData.features.split(',').map(f => f.trim()).filter(Boolean)
            };

            if (editingId) {
                await paymentService.updatePackage(editingId, payload);
                toast.success("Cập nhật gói thành công!");
            } else {
                await paymentService.createPackage(payload);
                toast.success("Tạo gói mới thành công!");
            }
            setShowForm(false);
            setEditingId(null);
            resetForm();
            loadPackages();
        } catch (e) {
            toast.error("Lỗi lưu gói dịch vụ");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (pkg: ServicePackage) => {
        setFormData({
            name: pkg.name,
            description: pkg.description || '',
            price: pkg.price,
            duration_days: pkg.duration_days || 30,
            features: Array.isArray(pkg.features) ? pkg.features.join(', ') : '',
            is_active: pkg.is_active !== false
        });
        setEditingId(pkg.package_id!);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc muốn xóa gói này?')) return;
        try {
            await paymentService.deletePackage(id);
            toast.success("Xóa gói thành công!");
            loadPackages();
        } catch (e) {
            toast.error("Lỗi xóa gói");
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', price: 0, duration_days: 30, features: '', is_active: true });
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Quản lý Gói Dịch Vụ</h1>
                    <p className="text-slate-500 mt-1">Tạo và quản lý các gói subscription</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setEditingId(null); resetForm(); }}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
                >
                    <Plus size={20} /> Thêm Gói Mới
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-2xl p-6 border mb-8 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">{editingId ? 'Chỉnh sửa gói' : 'Tạo gói mới'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">Tên gói *</label>
                            <input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Giá (VNĐ) *</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-xl"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Thời hạn (ngày)</label>
                            <input
                                type="number"
                                value={formData.duration_days}
                                onChange={e => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Trạng thái</label>
                            <select
                                value={formData.is_active ? 'true' : 'false'}
                                onChange={e => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                                className="w-full px-4 py-2 border rounded-xl"
                            >
                                <option value="true">Đang hoạt động</option>
                                <option value="false">Tạm dừng</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold mb-1">Mô tả</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                                rows={2}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold mb-1">Tính năng (phân cách bằng dấu phẩy)</label>
                            <input
                                value={formData.features}
                                onChange={e => setFormData({ ...formData, features: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                                placeholder="AI Practice, Mentor Support, Unlimited Topics"
                            />
                        </div>
                        <div className="md:col-span-2 flex gap-3">
                            <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50">
                                {saving ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Tạo mới')}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 rounded-xl font-bold border hover:bg-gray-50">
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Package List */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map(pkg => (
                        <div key={pkg.package_id} className={`bg-white rounded-2xl p-6 border shadow-sm ${!pkg.is_active ? 'opacity-60' : ''}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 rounded-xl">
                                    <Package className="text-indigo-600" size={24} />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(pkg)} className="p-2 hover:bg-gray-100 rounded-lg">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(pkg.package_id!)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-slate-900">{pkg.name}</h3>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{pkg.description}</p>
                            <div className="flex items-baseline gap-1 mt-4">
                                <span className="text-3xl font-black text-indigo-600">{pkg.price?.toLocaleString()}</span>
                                <span className="text-slate-500">VNĐ/{pkg.duration_days} ngày</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                {pkg.is_active ? (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                                        <Check size={12} /> Active
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full flex items-center gap-1">
                                        <X size={12} /> Inactive
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
