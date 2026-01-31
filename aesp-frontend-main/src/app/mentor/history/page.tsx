"use client";
import React, { useEffect, useState } from 'react';
import { mentorService, Session, Assessment } from '@/services/mentorService';
import toast from 'react-hot-toast';
import { Loader2, Calendar, User, FileText, Award, TrendingUp, MessageSquare } from 'lucide-react';

export default function MentorHistoryPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [showAssessmentForm, setShowAssessmentForm] = useState(false);
    const [assessmentForm, setAssessmentForm] = useState({
        pronunciation_score: 0,
        grammar_score: 0,
        fluency_score: 0,
        vocabulary_score: 0,
        feedback: '',
        strengths: '',
        areas_for_improvement: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            const data = await mentorService.getMySessions();
            // Filter only completed sessions
            setSessions(data.filter(s => s.status === 'COMPLETED'));
        } catch (error) {
            toast.error("Lỗi tải lịch sử");
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewAssessment = async (session: Session) => {
        setSelectedSession(session);
        try {
            const data = await mentorService.getSessionAssessment(session.session_id!);
            setAssessment(data);
            setShowAssessmentForm(false);
        } catch (error) {
            // No assessment yet
            setAssessment(null);
            setShowAssessmentForm(true);
        }
    };

    const handleSubmitAssessment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSession) return;

        setIsSubmitting(true);
        try {
            const overall_score = (
                assessmentForm.pronunciation_score +
                assessmentForm.grammar_score +
                assessmentForm.fluency_score +
                assessmentForm.vocabulary_score
            ) / 4;

            await mentorService.createSessionAssessment({
                session_id: selectedSession.session_id!,
                ...assessmentForm,
                overall_score
            });

            toast.success("Tạo đánh giá thành công!");
            setShowAssessmentForm(false);
            handleViewAssessment(selectedSession);
        } catch (error) {
            toast.error("Lỗi tạo đánh giá");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#007bff]">Session History</h1>
                <p className="text-gray-600 mt-2 font-medium">Lịch sử buổi học và đánh giá học viên</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#007bff]" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sessions List */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-black text-gray-900">Buổi Học Đã Hoàn Thành</h2>
                        {sessions.length > 0 ? sessions.map(session => (
                            <div
                                key={session.session_id}
                                onClick={() => handleViewAssessment(session)}
                                className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer ${selectedSession?.session_id === session.session_id ? 'ring-2 ring-[#007bff]' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-3 bg-green-50 rounded-2xl">
                                        <Calendar className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black text-gray-900">Session #{session.session_id}</h3>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 font-medium">
                                            <User className="w-4 h-4" />
                                            <span>Learner ID: {session.learner_id}</span>
                                        </div>
                                        <div className="text-sm text-gray-500 font-medium mt-1">
                                            {new Date(session.start_time).toLocaleDateString('vi-VN')}
                                        </div>
                                        {session.notes && (
                                            <div className="mt-2 text-sm text-gray-600 font-medium line-clamp-2">
                                                <MessageSquare className="w-4 h-4 inline mr-1" />
                                                {session.notes}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-black text-gray-900 mb-2">Chưa có lịch sử</h3>
                                <p className="text-gray-500 font-medium">Hoàn thành buổi học đầu tiên để xem lịch sử</p>
                            </div>
                        )}
                    </div>

                    {/* Assessment Panel */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-8 h-fit">
                        {selectedSession ? (
                            <>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-yellow-50 rounded-2xl">
                                        <Award className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900">Đánh Giá</h2>
                                        <p className="text-sm text-gray-500 font-medium">Session #{selectedSession.session_id}</p>
                                    </div>
                                </div>

                                {assessment ? (
                                    <div className="space-y-4">
                                        {/* Scores */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-blue-50 rounded-2xl p-4">
                                                <p className="text-xs font-bold text-blue-600 uppercase mb-1">Phát âm</p>
                                                <p className="text-2xl font-black text-blue-700">{assessment.pronunciation_score}/10</p>
                                            </div>
                                            <div className="bg-green-50 rounded-2xl p-4">
                                                <p className="text-xs font-bold text-green-600 uppercase mb-1">Ngữ pháp</p>
                                                <p className="text-2xl font-black text-green-700">{assessment.grammar_score}/10</p>
                                            </div>
                                            <div className="bg-purple-50 rounded-2xl p-4">
                                                <p className="text-xs font-bold text-purple-600 uppercase mb-1">Lưu loát</p>
                                                <p className="text-2xl font-black text-purple-700">{assessment.fluency_score}/10</p>
                                            </div>
                                            <div className="bg-orange-50 rounded-2xl p-4">
                                                <p className="text-xs font-bold text-orange-600 uppercase mb-1">Từ vựng</p>
                                                <p className="text-2xl font-black text-orange-700">{assessment.vocabulary_score}/10</p>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-[#007bff] to-blue-600 rounded-2xl p-6 text-white">
                                            <p className="text-sm font-bold uppercase mb-2">Điểm Tổng Quát</p>
                                            <p className="text-4xl font-black">{assessment.overall_score?.toFixed(1)}/10</p>
                                        </div>

                                        {/* Feedback */}
                                        <div className="space-y-3">
                                            {assessment.strengths && (
                                                <div className="bg-green-50 rounded-2xl p-4">
                                                    <p className="text-sm font-bold text-green-700 mb-2">✅ Điểm Mạnh</p>
                                                    <p className="text-sm text-green-800 font-medium">{assessment.strengths}</p>
                                                </div>
                                            )}
                                            {assessment.areas_for_improvement && (
                                                <div className="bg-orange-50 rounded-2xl p-4">
                                                    <p className="text-sm font-bold text-orange-700 mb-2">📈 Cần Cải Thiện</p>
                                                    <p className="text-sm text-orange-800 font-medium">{assessment.areas_for_improvement}</p>
                                                </div>
                                            )}
                                            <div className="bg-blue-50 rounded-2xl p-4">
                                                <p className="text-sm font-bold text-blue-700 mb-2">💬 Nhận Xét</p>
                                                <p className="text-sm text-blue-800 font-medium">{assessment.feedback}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : showAssessmentForm ? (
                                    <form onSubmit={handleSubmitAssessment} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            {['pronunciation', 'grammar', 'fluency', 'vocabulary'].map((field) => (
                                                <div key={field}>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2 capitalize">
                                                        {field === 'pronunciation' ? 'Phát âm' :
                                                            field === 'grammar' ? 'Ngữ pháp' :
                                                                field === 'fluency' ? 'Lưu loát' : 'Từ vựng'} (0-10)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="10"
                                                        step="0.5"
                                                        value={assessmentForm[`${field}_score` as keyof typeof assessmentForm] as number}
                                                        onChange={(e) => setAssessmentForm({
                                                            ...assessmentForm,
                                                            [`${field}_score`]: parseFloat(e.target.value)
                                                        })}
                                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007bff] outline-none font-bold text-center text-lg"
                                                        required
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Điểm mạnh</label>
                                            <textarea
                                                value={assessmentForm.strengths}
                                                onChange={(e) => setAssessmentForm({ ...assessmentForm, strengths: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007bff] outline-none resize-none font-medium"
                                                rows={2}
                                                placeholder="Học viên làm tốt ở điểm nào..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Cần cải thiện</label>
                                            <textarea
                                                value={assessmentForm.areas_for_improvement}
                                                onChange={(e) => setAssessmentForm({ ...assessmentForm, areas_for_improvement: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007bff] outline-none resize-none font-medium"
                                                rows={2}
                                                placeholder="Những điểm cần luyện tập thêm..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Nhận xét chung *</label>
                                            <textarea
                                                value={assessmentForm.feedback}
                                                onChange={(e) => setAssessmentForm({ ...assessmentForm, feedback: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007bff] outline-none resize-none font-medium"
                                                rows={4}
                                                placeholder="Nhận xét tổng quan về buổi học..."
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full flex items-center justify-center gap-2 bg-[#007bff] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50 transition-all shadow-md"
                                        >
                                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Award className="w-5 h-5" />}
                                            {isSubmitting ? 'Đang lưu...' : 'Lưu Đánh Giá'}
                                        </button>
                                    </form>
                                ) : null}
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-400 font-medium">
                                Chọn một session để xem đánh giá
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
