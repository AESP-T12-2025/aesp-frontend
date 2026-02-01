"use client";
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Loader2, Calendar, Video, CheckCircle, Clock, Star, MessageSquare, User, ExternalLink, FileText } from 'lucide-react';

interface SharedResource {
    resource_id: number;
    title: string;
    description?: string;
    resource_type: string;
    file_url: string;
}

interface Assessment {
    assessment_id: number;
    score: number;
    feedback: string;
    pronunciation_score?: number;
    grammar_score?: number;
    vocabulary_score?: number;
    fluency_score?: number;
    level_assigned?: string;
    pronunciation_notes?: string;
    grammar_notes?: string;
    vocabulary_tips?: string;
    communication_tips?: string;
    shared_resources?: SharedResource[];
}

interface Booking {
    booking_id: number;
    slot_id: number;
    learner_id: number;
    status: string;
    meeting_link?: string | null;
    created_at: string;
    slot?: { start_time: string; end_time: string };
    mentor?: { full_name: string; email: string };
    assessment?: Assessment | null;
}

export default function LearnerMyBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const res = await api.get('/learner/my-bookings');
            setBookings(res.data);
        } catch (error) {
            toast.error("Lỗi tải danh sách booking");
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (isoString: string | undefined) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Chờ xác nhận
                </span>;
            case 'CONFIRMED':
                return <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Đã xác nhận
                </span>;
            case 'COMPLETED':
                return <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Hoàn thành
                </span>;
            default:
                return <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">{status}</span>;
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#007bff]">Lịch Học Của Tôi</h1>
                <p className="text-gray-600 mt-2 font-medium">Xem lịch học với Mentor và nhận feedback sau buổi học</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#007bff]" />
                </div>
            ) : bookings.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-gray-900 mb-2">Chưa có lịch học nào</h3>
                    <p className="text-gray-500 font-medium mb-4">Hãy đặt lịch với Mentor để bắt đầu</p>
                    <a href="/learner/mentors" className="inline-block px-6 py-3 bg-[#007bff] text-white rounded-xl font-bold hover:bg-blue-600 transition">
                        Tìm Mentor
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking.booking_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Header */}
                            <div className="p-5 border-b border-gray-50">
                                <div className="flex items-start justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">
                                                Buổi học #{booking.booking_id}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                <Calendar className="w-4 h-4" />
                                                {formatDateTime(booking.slot?.start_time)}
                                            </div>
                                        </div>
                                    </div>
                                    {getStatusBadge(booking.status)}
                                </div>
                            </div>

                            {/* Content based on status */}
                            <div className="p-5 bg-gray-50/50 space-y-4">
                                {/* Meeting Link for CONFIRMED bookings */}
                                {booking.status === 'CONFIRMED' && booking.meeting_link && (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <p className="text-sm font-bold text-green-700 mb-2 flex items-center gap-2">
                                            <Video className="w-4 h-4" /> Link Meeting
                                        </p>
                                        <a
                                            href={booking.meeting_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:underline font-medium"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            {booking.meeting_link}
                                        </a>
                                        <p className="text-xs text-green-600 mt-2">
                                            * Click vào link để tham gia buổi học với Mentor
                                        </p>
                                    </div>
                                )}

                                {/* PENDING status message */}
                                {booking.status === 'PENDING' && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                        <p className="text-sm text-yellow-700">
                                            ⏳ Mentor đang xác nhận lịch học. Bạn sẽ nhận được link meeting khi Mentor xác nhận.
                                        </p>
                                    </div>
                                )}

                                {/* Assessment for COMPLETED bookings */}
                                {booking.status === 'COMPLETED' && booking.assessment && (
                                    <div className="space-y-4">
                                        {/* Score Summary */}
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="font-bold text-blue-700 flex items-center gap-2">
                                                    <Star className="w-5 h-5" /> Đánh giá từ Mentor
                                                </p>
                                                {booking.assessment.level_assigned && (
                                                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-bold">
                                                        Level: {booking.assessment.level_assigned}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Score Grid */}
                                            <div className="grid grid-cols-4 gap-2 mb-4">
                                                <div className="bg-white rounded-lg p-2 text-center">
                                                    <p className="text-xs text-gray-500">Phát âm</p>
                                                    <p className="text-xl font-black text-red-500">{booking.assessment.pronunciation_score || '-'}</p>
                                                </div>
                                                <div className="bg-white rounded-lg p-2 text-center">
                                                    <p className="text-xs text-gray-500">Ngữ pháp</p>
                                                    <p className="text-xl font-black text-green-500">{booking.assessment.grammar_score || '-'}</p>
                                                </div>
                                                <div className="bg-white rounded-lg p-2 text-center">
                                                    <p className="text-xs text-gray-500">Từ vựng</p>
                                                    <p className="text-xl font-black text-purple-500">{booking.assessment.vocabulary_score || '-'}</p>
                                                </div>
                                                <div className="bg-white rounded-lg p-2 text-center">
                                                    <p className="text-xs text-gray-500">Lưu loát</p>
                                                    <p className="text-xl font-black text-orange-500">{booking.assessment.fluency_score || '-'}</p>
                                                </div>
                                            </div>

                                            {/* Overall */}
                                            <div className="bg-white rounded-lg p-3 text-center">
                                                <p className="text-sm text-gray-500">Điểm tổng</p>
                                                <p className="text-3xl font-black text-blue-600">{booking.assessment.score}/10</p>
                                            </div>
                                        </div>

                                        {/* Detailed Feedback */}
                                        <button
                                            onClick={() => setSelectedAssessment(selectedAssessment?.assessment_id === booking.assessment?.assessment_id ? null : booking.assessment ?? null)}
                                            className="w-full py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            {selectedAssessment?.assessment_id === booking.assessment?.assessment_id ? 'Ẩn chi tiết' : 'Xem nhận xét chi tiết'}
                                        </button>

                                        {selectedAssessment?.assessment_id === booking.assessment?.assessment_id && (
                                            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
                                                {booking.assessment.feedback && (
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-700 mb-1">📝 Nhận xét chung</p>
                                                        <p className="text-gray-600">{booking.assessment.feedback}</p>
                                                    </div>
                                                )}
                                                {booking.assessment.pronunciation_notes && (
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-700 mb-1">🎤 Lỗi phát âm & Cách sửa</p>
                                                        <p className="text-gray-600">{booking.assessment.pronunciation_notes}</p>
                                                    </div>
                                                )}
                                                {booking.assessment.grammar_notes && (
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-700 mb-1">📖 Lỗi ngữ pháp</p>
                                                        <p className="text-gray-600">{booking.assessment.grammar_notes}</p>
                                                    </div>
                                                )}
                                                {booking.assessment.vocabulary_tips && (
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-700 mb-1">💬 Gợi ý từ vựng, idioms</p>
                                                        <p className="text-gray-600">{booking.assessment.vocabulary_tips}</p>
                                                    </div>
                                                )}
                                                {booking.assessment.communication_tips && (
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-700 mb-1">🗣️ Cách diễn đạt rõ ràng hơn</p>
                                                        <p className="text-gray-600">{booking.assessment.communication_tips}</p>
                                                    </div>
                                                )}
                                                {booking.assessment.shared_resources && booking.assessment.shared_resources.length > 0 && (
                                                    <div className="pt-3 border-t border-gray-200">
                                                        <p className="text-sm font-bold text-gray-700 mb-2">📚 Tài liệu từ Mentor</p>
                                                        <div className="space-y-2">
                                                            {booking.assessment.shared_resources.map(resource => (
                                                                <a
                                                                    key={resource.resource_id}
                                                                    href={resource.file_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition"
                                                                >
                                                                    <FileText className="w-5 h-5 text-blue-600" />
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-bold text-sm text-blue-700">{resource.title}</p>
                                                                        {resource.description && (
                                                                            <p className="text-xs text-blue-500 truncate">{resource.description}</p>
                                                                        )}
                                                                    </div>
                                                                    <ExternalLink className="w-4 h-4 text-blue-400" />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* COMPLETED but no assessment yet */}
                                {booking.status === 'COMPLETED' && !booking.assessment && (
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                        <p className="text-sm text-gray-500">
                                            ⏳ Mentor chưa gửi đánh giá. Vui lòng chờ...
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
