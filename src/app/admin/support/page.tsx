"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { adminService, SupportTicket } from '@/services/adminService';
import { Loader2, CheckCircle, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSupportPage() {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterPriority, setFilterPriority] = useState<string>('');

    useEffect(() => {
        loadTickets();
    }, [filterStatus, filterPriority]);

    const loadTickets = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAllTickets(
                filterStatus || undefined,
                filterPriority || undefined
            );
            setTickets(data);
        } catch (error) {
            toast.error("Lỗi tải danh sách yêu cầu");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        if (!confirm('Bạn có chắc muốn cập nhật trạng thái?')) return;
        try {
            await adminService.updateTicket(id, { status });
            toast.success("Cập nhật thành công");
            loadTickets();
        } catch (error) {
            toast.error("Lỗi cập nhật");
        }
    };

    const handleUpdatePriority = async (id: number, priority: string) => {
        try {
            await adminService.updateTicket(id, { priority });
            toast.success("Cập nhật priority thành công");
            loadTickets();
        } catch (error) {
            toast.error("Lỗi cập nhật priority");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-green-100 text-green-700 border-green-200';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'RESOLVED': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'CLOSED': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'bg-red-50 text-red-600';
            case 'MEDIUM': return 'bg-yellow-50 text-yellow-600';
            case 'LOW': return 'bg-gray-50 text-gray-500';
            default: return 'bg-gray-50 text-gray-500';
        }
    };

    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <div className="min-h-screen bg-[#F8F9FD] p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Support Tickets</h1>
                            <p className="text-slate-500 font-bold mt-2">Quản lý yêu cầu hỗ trợ từ người dùng</p>
                        </div>
                        <div className="flex gap-3">
                            <select
                                className="px-4 py-2 border border-gray-200 rounded-xl bg-white font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#007bff]"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                            <select
                                className="px-4 py-2 border border-gray-200 rounded-xl bg-white font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#007bff]"
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                            >
                                <option value="">Tất cả priority</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin text-[#007bff]" /></div>
                    ) : (
                        <div className="space-y-4">
                            {tickets.length > 0 ? tickets.map(ticket => (
                                <div key={ticket.ticket_id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority} Priority
                                            </span>
                                            <span className="text-xs text-slate-400 font-bold ml-auto md:ml-0">
                                                {new Date(ticket.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{ticket.title}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">{ticket.description}</p>
                                        <div className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-400">
                                            <MessageSquare size={14} /> Ticket #{ticket.ticket_id} • User ID: {ticket.user_id}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-4">
                                        <select
                                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:border-[#007bff]"
                                            value={ticket.status}
                                            onChange={(e) => handleUpdateStatus(ticket.ticket_id, e.target.value)}
                                        >
                                            <option value="OPEN">Open</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="RESOLVED">Resolved</option>
                                            <option value="CLOSED">Closed</option>
                                        </select>
                                        <select
                                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:border-[#007bff]"
                                            value={ticket.priority}
                                            onChange={(e) => handleUpdatePriority(ticket.ticket_id, e.target.value)}
                                        >
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                        </select>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 border-dashed">
                                    <CheckCircle className="w-12 h-12 text-green-200 mx-auto mb-3" />
                                    <h3 className="text-lg font-bold text-slate-900">Không có yêu cầu nào</h3>
                                    <p className="text-slate-500">Tuyệt vời! Hệ thống đang hoạt động ổn định.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
