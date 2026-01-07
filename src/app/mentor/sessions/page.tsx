"use client";
import React, { useEffect, useState } from 'react';
import { mentorService, Session } from '@/services/mentorService';
import toast from 'react-hot-toast';
import { Loader2, Play, Square, FileText, Calendar, User, Clock } from 'lucide-react';

export default function MentorSessionsPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            const data = await mentorService.getMySessions();
            setSessions(data);
        } catch (error) {
            toast.error("Lỗi tải danh sách sessions");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartSession = async (bookingId: number) => {
        try {
            await mentorService.startSession(bookingId);
            toast.success("Bắt đầu session thành công!");
            loadSessions();
        } catch (error) {
            toast.error("Lỗi bắt đầu session");
        }
    };

    const handleEndSession = async (sessionId: number) => {
        try {
            await mentorService.endSession(sessionId, notes);
            toast.success("Kết thúc session thành công!");
            setSelectedSession(null);
            setNotes('');
            loadSessions();
        } catch (error) {
            toast.error("Lỗi kết thúc session");
        }
    };

    const handleSaveNotes = async () => {
        if (!selectedSession) return;
        setIsSaving(true);
        try {
            await mentorService.updateSessionNotes(selectedSession.session_id!, notes);
            toast.success("Lưu ghi chú thành công!");
        } catch (error) {
            toast.error("Lỗi lưu ghi chú");
        } finally {
            setIsSaving(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SCHEDULED': return 'bg-blue-100 text-blue-700';
            case 'IN_PROGRESS': return 'bg-green-100 text-green-700';
            case 'COMPLETED': return 'bg-gray-100 text-gray-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#007bff]">Session Management</h1>
                <p className="text-gray-600 mt-2 font-medium">Quản lý các buổi học với học viên</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#007bff]" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sessions List */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-black text-gray-900">Danh Sách Sessions</h2>
                        {sessions.length > 0 ? sessions.map(session => (
                            <div key={session.session_id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-3 bg-blue-50 rounded-2xl">
                                            <Calendar className="w-5 h-5 text-[#007bff]" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-900">Session #{session.session_id}</h3>
                                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 font-medium">
                                                <User className="w-4 h-4" />
                                                <span>Learner ID: {session.learner_id}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 font-medium">
                                                <Clock className="w-4 h-4" />
                                                <span>{new Date(session.start_time).toLocaleString('vi-VN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(session.status)}`}>
                                        {session.status}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    {session.status === 'SCHEDULED' && (
                                        <button
                                            onClick={() => handleStartSession(session.booking_id)}
                                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition text-sm"
                                        >
                                            <Play className="w-4 h-4" />
                                            Bắt đầu
                                        </button>
                                    )}
                                    {session.status === 'IN_PROGRESS' && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setSelectedSession(session);
                                                    setNotes(session.notes || '');
                                                }}
                                                className="flex items-center gap-2 bg-[#007bff] text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-600 transition text-sm"
                                            >
                                                <FileText className="w-4 h-4" />
                                                Ghi chú
                                            </button>
                                            <button
                                                onClick={() => handleEndSession(session.session_id!)}
                                                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-700 transition text-sm"
                                            >
                                                <Square className="w-4 h-4" />
                                                Kết thúc
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-black text-gray-900 mb-2">Chưa có session nào</h3>
                                <p className="text-gray-500 font-medium">Sessions sẽ hiển thị khi có booking được xác nhận</p>
                            </div>
                        )}
                    </div>

                    {/* Notes Panel */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-8 h-fit">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-purple-50 rounded-2xl">
                                <FileText className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Ghi Chú Session</h2>
                                <p className="text-sm text-gray-500 font-medium">
                                    {selectedSession ? `Session #${selectedSession.session_id}` : 'Chọn session để ghi chú'}
                                </p>
                            </div>
                        </div>

                        {selectedSession ? (
                            <div className="space-y-4">
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007bff] focus:border-transparent outline-none transition resize-none font-medium"
                                    rows={12}
                                    placeholder="Ghi chú về buổi học: điểm mạnh, điểm cần cải thiện, lỗi phát âm, ngữ pháp..."
                                />
                                <button
                                    onClick={handleSaveNotes}
                                    disabled={isSaving}
                                    className="w-full flex items-center justify-center gap-2 bg-[#007bff] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50 transition-all shadow-md"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                                    {isSaving ? 'Đang lưu...' : 'Lưu Ghi Chú'}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400 font-medium">
                                Chọn một session để bắt đầu ghi chú
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
