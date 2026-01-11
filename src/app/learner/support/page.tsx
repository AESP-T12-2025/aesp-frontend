"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { supportService, Ticket } from '@/services/supportService';
import { Loader2, Plus, MessageCircle, Clock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LearnerSupportPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', priority: 'MEDIUM' });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        setLoading(true);
        try {
            const data = await supportService.getAll();
            setTickets(data);
        } catch (error) {
            toast.error("Lỗi tải danh sách hỗ trợ");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            await supportService.create(formData);
            toast.success("Gửi yêu cầu thành công!");
            setFormData({ title: '', description: '', priority: 'MEDIUM' });
            setShowForm(false);
            loadTickets();
        } catch (error) {
            toast.error("Lỗi gửi yêu cầu");
        } finally {
            setCreating(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'IN_PROGRESS': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'RESOLVED': return 'bg-green-50 text-green-700 border-green-100';
            case 'CLOSED': return 'bg-gray-100 text-gray-500 border-gray-200';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    return (
        <ProtectedRoute allowedRoles={['LEARNER', 'MENTOR']}>
            <div className="min-h-screen bg-[#F8F9FD] p-4 md:p-8 font-sans">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6 flex items-center gap-4">
                        <Link href="/learner" className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition text-slate-600">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900">Trung tâm hỗ trợ</h1>
                            <p className="text-slate-500 font-medium">Gửi yêu cầu hỗ trợ kỹ thuật hoặc báo lỗi</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* List */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="font-bold text-lg text-slate-800">Lịch sử yêu cầu</h2>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="md:hidden flex items-center gap-2 bg-[#007bff] text-white px-4 py-2 rounded-xl text-sm font-bold"
                                >
                                    <Plus size={16} /> Gửi yêu cầu
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#007bff]" /></div>
                            ) : tickets.length > 0 ? tickets.map(ticket => (
                                <div key={ticket.ticket_id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-900">{ticket.title}</h3>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${getStatusColor(ticket.status)}`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">{ticket.description}</p>
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(ticket.created_at).toLocaleDateString()}</span>
                                        <span>#{ticket.ticket_id}</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                                    <div className="w-12 h-12 bg-blue-50 text-[#007bff] rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <MessageCircle size={24} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-1">Chưa có yêu cầu nào</h3>
                                    <p className="text-slate-500 text-sm">Nếu bạn gặp vấn đề, hãy gửi yêu cầu hỗ trợ ngay.</p>
                                </div>
                            )}
                        </div>

                        {/* Form (Sidebar on Desktop, Modal on Mobile if implemented, but simplistic here) */}
                        <div className={`
                            md:block 
                            ${showForm ? 'fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4' : 'hidden'}
                        `}>
                            <div className={`bg-white p-6 rounded-3xl shadow-lg border border-gray-100 md:w-full max-w-md w-full ${showForm ? 'relative' : ''}`}>
                                {showForm && (
                                    <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 md:hidden font-bold">Close</button>
                                )}
                                <h2 className="font-black text-xl text-[#007bff] mb-6">Gửi yêu cầu mới</h2>
                                <form onSubmit={handleCreate} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Tiêu đề</label>
                                        <input
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-[#007bff]"
                                            placeholder="Vắn tắt vấn đề..." required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Chi tiết</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-[#007bff] resize-none"
                                            rows={4}
                                            placeholder="Mô tả kỹ vấn đề bạn gặp phải..." required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Độ ưu tiên</label>
                                        <div className="flex bg-gray-50 p-1 rounded-xl">
                                            {['LOW', 'MEDIUM', 'HIGH'].map(p => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, priority: p })}
                                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.priority === p ? 'bg-white shadow-sm text-[#007bff]' : 'text-gray-400 hover:text-gray-600'}`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="w-full bg-[#007bff] text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        {creating ? <Loader2 className="animate-spin" /> : <MessageCircle size={18} />} Gửi Yêu Cầu
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
