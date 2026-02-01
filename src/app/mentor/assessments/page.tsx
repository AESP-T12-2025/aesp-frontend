"use client";
import React, { useEffect, useState } from 'react';
import { mentorService } from '@/services/mentorService';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Loader2, ClipboardCheck, Star, User, CheckCircle, AlertCircle, Mic, BookOpen, MessageSquare, Zap, FileText, Link as LinkIcon } from 'lucide-react';

interface Resource {
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
}

interface Booking {
    booking_id: number;
    slot_id: number;
    learner_id: number;
    status: string;
    created_at: string;
    slot?: { start_time: string; end_time: string };
    learner?: { full_name: string; email: string };
    assessment?: Assessment | null;
}

interface FormData {
    score: number;
    level_assigned: string;
    pronunciation_score: number;
    grammar_score: number;
    vocabulary_score: number;
    fluency_score: number;
    feedback: string;
    pronunciation_notes: string;
    grammar_notes: string;
    vocabulary_tips: string;
    communication_tips: string;
}

const defaultFormData: FormData = {
    score: 5,
    level_assigned: '',
    pronunciation_score: 5,
    grammar_score: 5,
    vocabulary_score: 5,
    fluency_score: 5,
    feedback: '',
    pronunciation_notes: '',
    grammar_notes: '',
    vocabulary_tips: '',
    communication_tips: ''
};

export default function MentorAssessmentsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'scores' | 'feedback' | 'resources'>('scores');
    const [resources, setResources] = useState<Resource[]>([]);
    const [selectedResourceIds, setSelectedResourceIds] = useState<number[]>([]);

    useEffect(() => {
        loadBookings();
        loadResources();
    }, []);

    const loadResources = async () => {
        try {
            const res = await api.get('/mentor/resources');
            setResources(res.data || []);
        } catch (e) {
            console.error('Error loading resources:', e);
        }
    };

    const toggleResource = (id: number) => {
        setSelectedResourceIds(prev =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    };

    const loadBookings = async () => {
        try {
            const data = await mentorService.getMyBookings();
            // Filter only COMPLETED bookings for assessment
            const completed = (data as unknown as Booking[]).filter(b => b.status === 'COMPLETED');
            setBookings(completed);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectBooking = (booking: Booking) => {
        setSelectedBooking(booking);
        if (booking.assessment) {
            setFormData({
                score: booking.assessment.score || 5,
                level_assigned: booking.assessment.level_assigned || '',
                pronunciation_score: booking.assessment.pronunciation_score || 5,
                grammar_score: booking.assessment.grammar_score || 5,
                vocabulary_score: booking.assessment.vocabulary_score || 5,
                fluency_score: booking.assessment.fluency_score || 5,
                feedback: booking.assessment.feedback || '',
                pronunciation_notes: '',
                grammar_notes: '',
                vocabulary_tips: '',
                communication_tips: ''
            });
        } else {
            setFormData(defaultFormData);
        }
    };

    const handleSubmitAssessment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBooking) return;

        // Calculate overall score from component scores
        const avgScore = Math.round(
            (formData.pronunciation_score + formData.grammar_score + formData.vocabulary_score + formData.fluency_score) / 4
        );

        setSubmitting(true);
        try {
            await mentorService.createAssessment({
                booking_id: selectedBooking.booking_id,
                score: avgScore,
                feedback: formData.feedback,
                level_assigned: formData.level_assigned || undefined,
                pronunciation_score: formData.pronunciation_score,
                grammar_score: formData.grammar_score,
                vocabulary_score: formData.vocabulary_score,
                fluency_score: formData.fluency_score,
                pronunciation_notes: formData.pronunciation_notes || undefined,
                grammar_notes: formData.grammar_notes || undefined,
                vocabulary_tips: formData.vocabulary_tips || undefined,
                communication_tips: formData.communication_tips || undefined,
                shared_resource_ids: selectedResourceIds.length > 0 ? selectedResourceIds.join(',') : undefined
            });
            toast.success("Đánh giá thành công!");
            setSelectedBooking(null);
            setFormData(defaultFormData);
            loadBookings();
        } catch (e) {
            toast.error("Lỗi tạo đánh giá");
        } finally {
            setSubmitting(false);
        }
    };

    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    const ScoreSlider = ({ label, icon: Icon, value, field, color }: { label: string; icon: any; value: number; field: keyof FormData; color: string }) => (
        <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <span className="font-bold text-gray-700">{label}</span>
                </div>
                <span className={`text-2xl font-black ${color}`}>{value}</span>
            </div>
            <input
                type="range"
                min="1"
                max="10"
                value={value}
                onChange={(e) => setFormData({ ...formData, [field]: parseInt(e.target.value) })}
                className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Yếu</span>
                <span>Xuất sắc</span>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#007bff]">Đánh Giá Sau Buổi Học</h1>
                <p className="text-gray-600 mt-2 font-medium">Tạo đánh giá toàn diện cho học viên: điểm số, nhận xét, gợi ý cải thiện</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-[#007bff]" size={40} />
                </div>
            ) : (
                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Booking List - Left side */}
                    <div className="lg:col-span-2 space-y-3">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <ClipboardCheck size={20} /> Buổi học đã hoàn thành ({bookings.length})
                        </h2>
                        {bookings.length === 0 ? (
                            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                                <ClipboardCheck className="mx-auto text-gray-300 mb-4" size={48} />
                                <p className="text-gray-500">Chưa có buổi học nào hoàn thành</p>
                                <p className="text-sm text-gray-400 mt-2">Đánh dấu "Hoàn thành" ở trang Bookings trước</p>
                            </div>
                        ) : (
                            bookings.map(booking => (
                                <div
                                    key={booking.booking_id}
                                    onClick={() => handleSelectBooking(booking)}
                                    className={`bg-white rounded-xl p-4 border cursor-pointer transition-all ${selectedBooking?.booking_id === booking.booking_id
                                        ? 'border-blue-400 ring-2 ring-blue-100'
                                        : booking.assessment
                                            ? 'border-green-200 bg-green-50/30'
                                            : 'border-gray-100 hover:border-blue-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${booking.assessment ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-[#007bff]'}`}>
                                                {booking.assessment ? <CheckCircle size={20} /> : <User size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">
                                                    {booking.learner?.full_name || `Learner #${booking.learner_id}`}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(booking.created_at).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                        {booking.assessment ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                {booking.assessment.score}/10
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                                                Chưa đánh giá
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Assessment Form - Right side */}
                    <div className="lg:col-span-3">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <Star size={20} /> Tạo đánh giá
                        </h2>

                        {selectedBooking ? (
                            <form onSubmit={handleSubmitAssessment} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                                    <p className="font-bold text-lg">
                                        {selectedBooking.learner?.full_name || `Learner #${selectedBooking.learner_id}`}
                                    </p>
                                    <p className="text-blue-100 text-sm">{selectedBooking.learner?.email}</p>
                                </div>

                                {/* Tabs */}
                                <div className="flex border-b">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('scores')}
                                        className={`flex-1 py-3 font-bold text-sm transition ${activeTab === 'scores' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                    >
                                        📊 Điểm Số & Trình Độ
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('feedback')}
                                        className={`flex-1 py-3 font-bold text-sm transition ${activeTab === 'feedback' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                    >
                                        ✍️ Nhận Xét
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('resources')}
                                        className={`flex-1 py-3 font-bold text-sm transition ${activeTab === 'resources' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                    >
                                        📚 Tài Liệu ({selectedResourceIds.length})
                                    </button>
                                </div>

                                <div className="p-5 space-y-5">
                                    {activeTab === 'scores' && (
                                        <>
                                            {/* Detailed Scores */}
                                            <div className="grid sm:grid-cols-2 gap-3">
                                                <ScoreSlider label="Phát âm" icon={Mic} value={formData.pronunciation_score} field="pronunciation_score" color="text-red-500" />
                                                <ScoreSlider label="Ngữ pháp" icon={BookOpen} value={formData.grammar_score} field="grammar_score" color="text-green-500" />
                                                <ScoreSlider label="Từ vựng" icon={MessageSquare} value={formData.vocabulary_score} field="vocabulary_score" color="text-purple-500" />
                                                <ScoreSlider label="Lưu loát" icon={Zap} value={formData.fluency_score} field="fluency_score" color="text-orange-500" />
                                            </div>

                                            {/* Overall Score Display */}
                                            <div className="bg-blue-50 rounded-xl p-4 text-center">
                                                <p className="text-sm text-blue-600 font-medium mb-1">Điểm trung bình</p>
                                                <p className="text-4xl font-black text-blue-600">
                                                    {Math.round((formData.pronunciation_score + formData.grammar_score + formData.vocabulary_score + formData.fluency_score) / 4)}/10
                                                </p>
                                            </div>

                                            {/* Level Assignment */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-3">
                                                    Xếp trình độ CEFR
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {levels.map(level => (
                                                        <button
                                                            key={level}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, level_assigned: formData.level_assigned === level ? '' : level })}
                                                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${formData.level_assigned === level
                                                                ? 'bg-[#007bff] text-white shadow-lg shadow-blue-200'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                }`}
                                                        >
                                                            {level}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'feedback' && (
                                        <div className="space-y-4">
                                            {/* General Feedback */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    📝 Nhận xét tổng quát *
                                                </label>
                                                <textarea
                                                    value={formData.feedback}
                                                    onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                                                    rows={3}
                                                    placeholder="Đánh giá chung về buổi học, điểm mạnh và điểm cần cải thiện..."
                                                    required
                                                />
                                            </div>

                                            {/* Pronunciation Notes */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    🎤 Lỗi phát âm & Cách sửa
                                                </label>
                                                <textarea
                                                    value={formData.pronunciation_notes}
                                                    onChange={(e) => setFormData({ ...formData, pronunciation_notes: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                                                    rows={2}
                                                    placeholder="VD: Từ 'think' phát âm /θ/ không phải /s/..."
                                                />
                                            </div>

                                            {/* Grammar Notes */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    📖 Lỗi ngữ pháp & Sửa lỗi
                                                </label>
                                                <textarea
                                                    value={formData.grammar_notes}
                                                    onChange={(e) => setFormData({ ...formData, grammar_notes: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                                                    rows={2}
                                                    placeholder="VD: Sử dụng sai thì quá khứ, nên dùng 'went' thay vì 'go'..."
                                                />
                                            </div>

                                            {/* Vocabulary Tips */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    💬 Gợi ý từ vựng, collocations, idioms
                                                </label>
                                                <textarea
                                                    value={formData.vocabulary_tips}
                                                    onChange={(e) => setFormData({ ...formData, vocabulary_tips: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                                                    rows={2}
                                                    placeholder="VD: Thay vì 'very good', có thể dùng 'excellent', 'outstanding'..."
                                                />
                                            </div>

                                            {/* Communication Tips */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    🗣️ Cách diễn đạt rõ ràng & tự tin hơn
                                                </label>
                                                <textarea
                                                    value={formData.communication_tips}
                                                    onChange={(e) => setFormData({ ...formData, communication_tips: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                                                    rows={2}
                                                    placeholder="VD: Nói chậm hơn, sử dụng linking words như 'however', 'therefore'..."
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'resources' && (
                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-600 font-medium">
                                                Chọn tài liệu để gửi cho học viên. Họ sẽ nhận được link sau khi bạn lưu đánh giá.
                                            </p>

                                            {resources.length === 0 ? (
                                                <div className="bg-gray-50 rounded-xl p-6 text-center border border-dashed border-gray-200">
                                                    <FileText className="mx-auto text-gray-300 mb-2" size={32} />
                                                    <p className="text-gray-500 text-sm">Chưa có tài liệu nào</p>
                                                    <a
                                                        href="/mentor/resources"
                                                        className="text-blue-600 text-sm font-bold hover:underline mt-2 inline-block"
                                                    >
                                                        + Thêm tài liệu
                                                    </a>
                                                </div>
                                            ) : (
                                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                                    {resources.map(resource => (
                                                        <div
                                                            key={resource.resource_id}
                                                            onClick={() => toggleResource(resource.resource_id)}
                                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedResourceIds.includes(resource.resource_id)
                                                                    ? 'border-blue-400 bg-blue-50'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                        >
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedResourceIds.includes(resource.resource_id)
                                                                    ? 'bg-blue-500 text-white'
                                                                    : 'bg-gray-100 text-gray-500'
                                                                }`}>
                                                                {resource.resource_type === 'link' ? <LinkIcon size={16} /> : <FileText size={16} />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-bold text-sm text-gray-900 truncate">{resource.title}</p>
                                                                {resource.description && (
                                                                    <p className="text-xs text-gray-500 truncate">{resource.description}</p>
                                                                )}
                                                            </div>
                                                            {selectedResourceIds.includes(resource.resource_id) && (
                                                                <CheckCircle className="text-blue-500" size={20} />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {selectedResourceIds.length > 0 && (
                                                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                                                    <p className="text-sm text-green-700">
                                                        ✅ Đã chọn {selectedResourceIds.length} tài liệu để gửi cho học viên
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                        {submitting ? 'Đang lưu...' : 'Lưu đánh giá'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-gray-50 rounded-2xl p-12 text-center border border-dashed border-gray-200">
                                <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
                                <p className="text-gray-500 font-medium">Chọn một buổi học đã hoàn thành để tạo đánh giá</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
