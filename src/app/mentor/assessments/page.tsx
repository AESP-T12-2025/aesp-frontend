"use client";
import React, { useEffect, useState } from 'react';
import { mentorService } from '@/services/mentorService';
import toast from 'react-hot-toast';
import { Loader2, ClipboardCheck, Star, User, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface Booking {
    booking_id: number;
    slot_id: number;
    learner_id: number;
    status: string;
    created_at: string;
    slot?: { start_time: string; end_time: string };
    learner?: { full_name: string; email: string };
}

export default function MentorAssessmentsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [formData, setFormData] = useState({
        score: 5,
        feedback: '',
        level_assigned: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const data = await mentorService.getMyBookings();
            setBookings(data as unknown as Booking[]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAssessment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBooking) return;

        setSubmitting(true);
        try {
            await mentorService.createAssessment({
                booking_id: selectedBooking.booking_id,
                score: formData.score,
                feedback: formData.feedback,
                level_assigned: formData.level_assigned || undefined
            });
            toast.success("Đánh giá thành công!");
            setSelectedBooking(null);
            setFormData({ score: 5, feedback: '', level_assigned: '' });
            loadBookings();
        } catch (e) {
            toast.error("Lỗi tạo đánh giá");
        } finally {
            setSubmitting(false);
        }
    };

    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    return (
        <div className="max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#007bff]">Đánh giá học viên</h1>
                <p className="text-gray-600 mt-2 font-medium">Tạo đánh giá và xếp trình độ cho học viên sau mỗi buổi học</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-[#007bff]" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bookings List */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Calendar size={20} /> Các buổi học
                        </h2>
                        {bookings.length === 0 ? (
                            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                                <ClipboardCheck className="mx-auto text-gray-300 mb-4" size={48} />
                                <p className="text-gray-500">Chưa có buổi học nào</p>
                            </div>
                        ) : (
                            bookings.map(booking => (
                                <div
                                    key={booking.booking_id}
                                    onClick={() => setSelectedBooking(booking)}
                                    className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all ${selectedBooking?.booking_id === booking.booking_id
                                        ? 'border-blue-400 ring-2 ring-blue-100'
                                        : 'border-gray-100 hover:border-blue-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#007bff]">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">
                                                    Booking #{booking.booking_id}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(booking.created_at).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${booking.status === 'COMPLETED'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Assessment Form */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <Star size={20} /> Tạo đánh giá
                        </h2>

                        {selectedBooking ? (
                            <form onSubmit={handleSubmitAssessment} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-5">
                                <div className="bg-blue-50 p-4 rounded-xl">
                                    <p className="text-sm font-bold text-blue-700">
                                        Đánh giá cho Booking #{selectedBooking.booking_id}
                                    </p>
                                </div>

                                {/* Score */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Điểm số (1-10)
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={formData.score}
                                        onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                                        <span>1</span>
                                        <span className="font-bold text-2xl text-[#007bff]">{formData.score}</span>
                                        <span>10</span>
                                    </div>
                                </div>

                                {/* Level */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Xếp trình độ (tùy chọn)
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {levels.map(level => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, level_assigned: formData.level_assigned === level ? '' : level })}
                                                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${formData.level_assigned === level
                                                    ? 'bg-[#007bff] text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Feedback */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Nhận xét chi tiết
                                    </label>
                                    <textarea
                                        value={formData.feedback}
                                        onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                                        rows={4}
                                        placeholder="Nhận xét về phát âm, ngữ pháp, từ vựng, sự tự tin..."
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 bg-[#007bff] text-white rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                    {submitting ? 'Đang lưu...' : 'Lưu đánh giá'}
                                </button>
                            </form>
                        ) : (
                            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
                                <AlertCircle className="mx-auto text-gray-300 mb-4" size={40} />
                                <p className="text-gray-500 font-medium">Chọn một buổi học để tạo đánh giá</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
