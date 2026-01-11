"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Users, Mic, MessageCircle, Wifi, UserPlus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PeerPracticePage() {
    const [status, setStatus] = useState<'idle' | 'searching' | 'connected'>('idle');
    const [searchTime, setSearchTime] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'searching') {
            interval = setInterval(() => {
                setSearchTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status]);

    const startMatching = () => {
        setStatus('searching');
        setSearchTime(0);
        toast.loading("Đang tìm bạn luyện tập...");

        // Simulate search - in real app this would use WebSocket
        setTimeout(() => {
            toast.dismiss();
            toast("Tính năng Peer Practice đang được phát triển!", { icon: '🚧' });
            setStatus('idle');
        }, 5000);
    };

    const cancelSearch = () => {
        setStatus('idle');
        toast.dismiss();
    };

    return (
        <ProtectedRoute allowedRoles={['LEARNER']}>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                            <Users size={14} /> Coming Soon
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mb-4">Luyện tập cùng bạn học</h1>
                        <p className="text-gray-600 text-lg max-w-xl mx-auto">
                            Kết nối với những người học khác để thực hành hội thoại tiếng Anh với sự hỗ trợ của AI.
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-[40px] p-12 shadow-xl border border-gray-100 text-center">
                        {status === 'idle' ? (
                            <>
                                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto mb-8 flex items-center justify-center text-white shadow-2xl">
                                    <Users size={56} />
                                </div>

                                <h2 className="text-2xl font-black text-gray-900 mb-4">Sẵn sàng ghép đôi?</h2>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    Chúng tôi sẽ tìm một bạn học phù hợp với trình độ của bạn để luyện tập hội thoại.
                                </p>

                                <button
                                    onClick={startMatching}
                                    className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto"
                                >
                                    <UserPlus size={20} /> Tìm bạn luyện tập
                                </button>

                                {/* Features */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                                    <div className="p-6 bg-gray-50 rounded-2xl">
                                        <Mic className="text-purple-600 mb-4 mx-auto" size={32} />
                                        <h3 className="font-bold text-gray-900 mb-2">Voice Chat</h3>
                                        <p className="text-sm text-gray-500">Nói chuyện trực tiếp qua voice</p>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-2xl">
                                        <MessageCircle className="text-blue-600 mb-4 mx-auto" size={32} />
                                        <h3 className="font-bold text-gray-900 mb-2">AI Gợi ý</h3>
                                        <p className="text-sm text-gray-500">AI đưa ra chủ đề và từ vựng</p>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-2xl">
                                        <Wifi className="text-green-600 mb-4 mx-auto" size={32} />
                                        <h3 className="font-bold text-gray-900 mb-2">Real-time</h3>
                                        <p className="text-sm text-gray-500">Kết nối theo thời gian thực</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto mb-8 flex items-center justify-center text-white shadow-2xl animate-pulse">
                                    <Loader2 size={56} className="animate-spin" />
                                </div>

                                <h2 className="text-2xl font-black text-gray-900 mb-4">Đang tìm kiếm...</h2>
                                <p className="text-gray-500 mb-2">Thời gian: {searchTime}s</p>
                                <p className="text-sm text-gray-400 mb-8">Đang tìm người học có trình độ tương đương</p>

                                <button
                                    onClick={cancelSearch}
                                    className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
                                >
                                    Hủy tìm kiếm
                                </button>
                            </>
                        )}
                    </div>

                    {/* Note */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-400">
                            🚧 Tính năng này đang trong quá trình phát triển. Sẽ sớm ra mắt với WebRTC voice chat!
                        </p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
