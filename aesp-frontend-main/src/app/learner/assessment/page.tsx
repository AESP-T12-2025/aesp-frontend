"use client";
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { proficiencyService, Question, AssessmentResult } from '@/services/proficiencyService';
import { Play, Mic, CheckCircle, ArrowRight, Award, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AssessmentPage() {
    const router = useRouter();
    const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [result, setResult] = useState<AssessmentResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [recording, setRecording] = useState(false);

    useEffect(() => {
        let isMounted = true;
        loadQuestions(isMounted);
        return () => { isMounted = false; };
    }, []);

    const [testId, setTestId] = useState<number | null>(null);

    const loadQuestions = async (isMounted = true) => {
        try {
            const data = await proficiencyService.getAssessmentTest();
            if (isMounted) {
                setQuestions(data.questions);
                setTestId(data.id);
            }
        } catch (error) {
            if (isMounted) toast.error("Lỗi tải bài kiểm tra");
        }
    };

    const handleStart = () => setStep('test');

    const handleOptionSelect = (option: string) => {
        setAnswers({ ...answers, [currentQIndex]: option });
    };

    const handleRecordToggle = () => {
        if (!('webkitSpeechRecognition' in window)) {
            toast.error("Trình duyệt không hỗ trợ Web Speech API");
            return;
        }

        if (recording) {
            // STOP
            setRecording(false);
            // Logic handled in onend or manual stop
            window.speechRecognitionInstance?.stop();
        } else {
            // START
            const SpeechRecognition = window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.continuous = false; // Short answer
            recognition.interimResults = false;

            window.speechRecognitionInstance = recognition;

            recognition.onstart = () => {
                setRecording(true);
                toast("Đang lắng nghe...", { icon: '🎙️' });
            };

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                const text = event.results[0][0].transcript;
                setAnswers({ ...answers, [currentQIndex]: text });
                toast.success(`Đã thu âm: "${text}"`);
            };

            recognition.onerror = (event: any) => {
                console.error(event.error);
                setRecording(false);
                toast.error("Lỗi thu âm");
            };

            recognition.onend = () => {
                setRecording(false);
            };

            recognition.start();
        }
    };

    const handleNext = async () => {
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
        } else {
            // Submit
            setLoading(true);
            try {
                // Find speaking text if any
                // Assuming last question is speaking or type='pronunciation'
                const speakingQIndex = questions.findIndex(q => q.type === 'pronunciation');
                const speakingText = speakingQIndex >= 0 ? answers[speakingQIndex] : undefined;

                const res = await proficiencyService.submitTest(testId!, answers, speakingText);
                setResult(res);
                setStep('result');
                toast.success("Đã có kết quả!");
            } catch (error) {
                toast.error("Lỗi nộp bài");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

                {/* INTRO STEP */}
                {step === 'intro' && (
                    <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-xl max-w-2xl w-full text-center">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-[#007bff] mx-auto mb-6">
                            <Award size={40} />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-4">Kiểm tra trình độ</h1>
                        <p className="text-gray-500 mb-8 text-lg">
                            Bài test ngắn giúp AI xác định trình độ hiện tại của bạn để thiết kế lộ trình học cá nhân hóa phù hợp nhất.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="font-bold text-gray-900 block mb-1">👂 Nghe & Nói</span>
                                <span className="text-sm text-gray-500">Kiểm tra phát âm</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="font-bold text-gray-900 block mb-1">📚 Ngữ pháp</span>
                                <span className="text-sm text-gray-500">Cấu trúc câu</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="font-bold text-gray-900 block mb-1">💡 Từ vựng</span>
                                <span className="text-sm text-gray-500">Vốn từ thông dụng</span>
                            </div>
                        </div>
                        <button
                            onClick={handleStart}
                            className="w-full py-4 bg-[#007bff] text-white rounded-2xl font-bold text-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl"
                        >
                            Bắt đầu ngay
                        </button>
                    </div>
                )}

                {/* TEST STEP */}
                {step === 'test' && questions.length > 0 && (
                    <div className="w-full max-w-2xl">
                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between text-sm font-bold text-gray-500 mb-2">
                                <span>Câu hỏi {currentQIndex + 1}/{questions.length}</span>
                                <span>{Math.round(((currentQIndex + 1) / questions.length) * 100)}%</span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#007bff] transition-all duration-500 rounded-full"
                                    style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[32px] shadow-lg border border-gray-100 min-h-[400px] flex flex-col">
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 font-bold rounded-lg text-xs mb-4 w-fit uppercase">
                                {questions[currentQIndex].type} Part
                            </span>

                            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex-1">
                                {questions[currentQIndex].text}
                            </h2>

                            {/* Answer Area */}
                            <div className="mb-8">
                                {questions[currentQIndex].type === 'grammar' || questions[currentQIndex].type === 'vocabulary' ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {questions[currentQIndex].options?.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleOptionSelect(opt)}
                                                className={`p-4 rounded-xl border-2 text-left font-medium transition-all ${answers[currentQIndex] === opt
                                                    ? 'border-[#007bff] bg-blue-50 text-[#007bff]'
                                                    : 'border-gray-100 hover:border-blue-200'
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <button
                                            onClick={handleRecordToggle}
                                            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${recording
                                                ? 'bg-red-500 animate-pulse ring-4 ring-red-200'
                                                : answers[currentQIndex]
                                                    ? 'bg-green-500 ring-4 ring-green-200'
                                                    : 'bg-[#007bff] hover:scale-105'
                                                }`}
                                        >
                                            {recording ? <div className="w-8 h-8 bg-white rounded-md" /> : <Mic size={32} className="text-white" />}
                                        </button>
                                        <p className="mt-4 text-gray-500 font-medium">
                                            {recording ? "Đang thu âm..." : answers[currentQIndex] ? `Đã trả lời: "${answers[currentQIndex]}"` : "Chạm để nói"}
                                        </p>
                                        {answers[currentQIndex] && (
                                            <button onClick={() => setAnswers({ ...answers, [currentQIndex]: "" })} className="mt-2 text-xs text-red-500 font-bold hover:underline">
                                                Thu âm lại
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!answers[currentQIndex]}
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        {currentQIndex === questions.length - 1 ? "Hoàn thành" : "Tiếp theo"}
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* RESULT STEP */}
                {step === 'result' && result && (
                    <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-xl max-w-2xl w-full text-center animation-fade-in-up">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kết quả đánh giá</h2>
                        <div className="my-8 relative inline-block">
                            <svg className="w-48 h-48 transform -rotate-90">
                                <circle cx="96" cy="96" r="88" stroke="#f3f4f6" strokeWidth="16" fill="transparent" />
                                <circle cx="96" cy="96" r="88" stroke="#007bff" strokeWidth="16" fill="transparent"
                                    strokeDasharray={2 * Math.PI * 88}
                                    strokeDashoffset={2 * Math.PI * 88 * (1 - result.score / 100)}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black text-[#007bff]">{result.level}</span>
                                <span className="text-gray-400 font-bold text-sm">LEVEL</span>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-2xl mb-8 text-left border border-blue-100">
                            <h3 className="font-bold text-[#007bff] mb-2 flex items-center gap-2">
                                <CheckCircle size={18} /> Nhận xét từ AI
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {result.feedback}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => router.push('/learner/path')}
                                className="flex-1 py-4 bg-[#007bff] text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg"
                            >
                                Xem lộ trình học
                            </button>
                            <button
                                onClick={() => router.push('/learner')}
                                className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                            >
                                Về Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
