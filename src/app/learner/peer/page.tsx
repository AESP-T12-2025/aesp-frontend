"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Users, Mic, MicOff, MessageCircle, Send, UserPlus, Loader2, X, LogOut, Phone, PhoneOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
    type: string;
    from_user_id?: number;
    content?: string;
    timestamp?: string;
}

interface Partner {
    user_id: number;
    full_name: string;
}

export default function PeerPracticePage() {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'searching' | 'connected'>('idle');
    const [searchTime, setSearchTime] = useState(0);
    const [partner, setPartner] = useState<Partner | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [sessionId, setSessionId] = useState<string | null>(null);

    // Topic selection
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [sessionTopic, setSessionTopic] = useState<string>('General');

    const TOPICS = [
        { id: 'travel', name: 'Travel', emoji: '✈️', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100', description: 'Du lịch, đặt phòng, hỏi đường' },
        { id: 'business', name: 'Business', emoji: '💼', color: 'bg-amber-50 border-amber-200 hover:bg-amber-100', description: 'Công việc, họp, trình bày' },
        { id: 'daily', name: 'Daily Life', emoji: '🏠', color: 'bg-green-50 border-green-200 hover:bg-green-100', description: 'Cuộc sống, mua sắm, gia đình' },
        { id: 'food', name: 'Food & Dining', emoji: '🍕', color: 'bg-orange-50 border-orange-200 hover:bg-orange-100', description: 'Nhà hàng, nấu ăn, đặt món' },
        { id: 'hobbies', name: 'Hobbies', emoji: '🎮', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100', description: 'Sở thích, thể thao, giải trí' },
        { id: 'education', name: 'Education', emoji: '📚', color: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100', description: 'Học tập, trường lớp, khóa học' },
    ];

    // Voice chat state
    const [voiceStatus, setVoiceStatus] = useState<'idle' | 'requesting' | 'incoming' | 'connecting' | 'active'>('idle');
    const [isMuted, setIsMuted] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // WebRTC refs
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'searching') {
            interval = setInterval(() => {
                setSearchTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        return () => {
            cleanupVoice();
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const cleanupVoice = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        setVoiceStatus('idle');
        setIsMuted(false);
    };

    const getToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    };

    const sendWsMessage = (msg: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(msg));
        }
    };

    const startMatching = useCallback(() => {
        const token = getToken();
        if (!token) {
            toast.error("Vui lòng đăng nhập");
            return;
        }

        setStatus('connecting');
        setSearchTime(0);

        const wsUrl = `ws://localhost:8000/peer/ws/${token}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            setStatus('searching');
            toast.loading("Đang tìm bạn luyện tập...", { id: 'peer-search' });
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                handleWebSocketMessage(data);
            } catch (e) {
                console.error("WS message parse error:", e);
            }
        };

        ws.onclose = () => {
            toast.dismiss('peer-search');
            if (status !== 'idle') {
                cleanupVoice();
                setStatus('idle');
                setPartner(null);
                setSessionId(null);
            }
        };

        ws.onerror = () => {
            toast.error("Lỗi kết nối");
            setStatus('idle');
        };
    }, [status]);

    const handleWebSocketMessage = async (data: any) => {
        switch (data.type) {
            case 'connected':
                break;

            case 'searching':
                setStatus('searching');
                break;

            case 'matched':
                toast.dismiss('peer-search');
                toast.success(data.message || "Đã tìm thấy bạn học!");
                setStatus('connected');
                setPartner(data.partner);
                setSessionId(data.session_id);
                setSessionTopic(data.topic || selectedTopic || 'General');
                const topicName = TOPICS.find(t => t.id === (data.topic || selectedTopic))?.name || data.topic || 'General';
                setMessages([{
                    type: 'system',
                    content: `🎉 Đã ghép đôi với ${data.partner?.full_name}!\n📌 Chủ đề: ${topicName}\nHãy bắt đầu hội thoại bằng tiếng Anh!`
                }]);
                break;

            case 'chat':
                setMessages(prev => [...prev, {
                    type: 'chat',
                    from_user_id: data.from_user_id,
                    content: data.content,
                    timestamp: data.timestamp
                }]);
                break;

            case 'partner_left':
                toast(data.message || "Đối tác đã rời phiên", { icon: '👋' });
                cleanupVoice();
                setStatus('idle');
                setPartner(null);
                setSessionId(null);
                setMessages([]);
                break;

            // Voice chat signaling
            case 'voice_request':
                setVoiceStatus('incoming');
                toast("📞 Đối tác muốn voice chat!", { id: 'voice-request' });
                break;

            case 'voice_accept':
                toast.dismiss('voice-request');
                toast.success("Đã chấp nhận voice chat!");
                await startWebRTC(true);
                break;

            case 'voice_reject':
                toast.dismiss('voice-request');
                toast("Đối tác từ chối voice chat", { icon: '❌' });
                setVoiceStatus('idle');
                break;

            case 'voice_end':
                toast("Voice chat đã kết thúc", { icon: '📴' });
                cleanupVoice();
                break;

            case 'offer':
                await handleOffer(data.data);
                break;

            case 'answer':
                await handleAnswer(data.data);
                break;

            case 'ice-candidate':
                await handleIceCandidate(data.data);
                break;

            case 'error':
                toast.error(data.message);
                break;
        }
    };

    // =========================================================================
    // WEBRTC VOICE CHAT
    // =========================================================================

    const createPeerConnection = () => {
        const config: RTCConfiguration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };

        const pc = new RTCPeerConnection(config);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendWsMessage({
                    type: 'ice-candidate',
                    data: event.candidate.toJSON()
                });
            }
        };

        pc.ontrack = (event) => {
            if (remoteAudioRef.current && event.streams[0]) {
                remoteAudioRef.current.srcObject = event.streams[0];
            }
        };

        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'connected') {
                setVoiceStatus('active');
                toast.success("🎙️ Voice chat đã kết nối!");
            } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                cleanupVoice();
            }
        };

        return pc;
    };

    const startWebRTC = async (isInitiator: boolean) => {
        try {
            setVoiceStatus('connecting');

            // Get microphone
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            localStreamRef.current = stream;

            // Create peer connection
            const pc = createPeerConnection();
            peerConnectionRef.current = pc;

            // Add local tracks
            stream.getTracks().forEach(track => {
                pc.addTrack(track, stream);
            });

            if (isInitiator) {
                // Create and send offer
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                sendWsMessage({
                    type: 'offer',
                    data: offer
                });
            }
        } catch (err) {
            console.error("WebRTC error:", err);
            toast.error("Không thể truy cập microphone");
            cleanupVoice();
        }
    };

    const handleOffer = async (offer: RTCSessionDescriptionInit) => {
        try {
            if (!peerConnectionRef.current) {
                setVoiceStatus('connecting');
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                localStreamRef.current = stream;

                const pc = createPeerConnection();
                peerConnectionRef.current = pc;

                stream.getTracks().forEach(track => {
                    pc.addTrack(track, stream);
                });
            }

            const pc = peerConnectionRef.current!;
            await pc.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            sendWsMessage({
                type: 'answer',
                data: answer
            });
        } catch (err) {
            console.error("Handle offer error:", err);
            cleanupVoice();
        }
    };

    const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
        try {
            const pc = peerConnectionRef.current;
            if (pc) {
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
            }
        } catch (err) {
            console.error("Handle answer error:", err);
        }
    };

    const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
        try {
            const pc = peerConnectionRef.current;
            if (pc) {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
        } catch (err) {
            console.error("Handle ICE candidate error:", err);
        }
    };

    const requestVoiceChat = () => {
        setVoiceStatus('requesting');
        sendWsMessage({ type: 'voice_request' });
        toast.loading("Đang chờ đối tác chấp nhận...", { id: 'voice-request' });
    };

    const acceptVoiceChat = async () => {
        toast.dismiss('voice-request');
        sendWsMessage({ type: 'voice_accept' });
        await startWebRTC(false);
    };

    const rejectVoiceChat = () => {
        toast.dismiss('voice-request');
        sendWsMessage({ type: 'voice_reject' });
        setVoiceStatus('idle');
    };

    const endVoiceChat = () => {
        sendWsMessage({ type: 'voice_end' });
        cleanupVoice();
    };

    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    // =========================================================================
    // TEXT CHAT
    // =========================================================================

    const sendMessage = () => {
        if (!inputText.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        sendWsMessage({ type: 'chat', content: inputText.trim() });

        setMessages(prev => [...prev, {
            type: 'chat',
            from_user_id: 0,
            content: inputText.trim(),
            timestamp: new Date().toISOString()
        }]);

        setInputText('');
        inputRef.current?.focus();
    };

    const cancelSearch = () => {
        toast.dismiss('peer-search');
        wsRef.current?.close();
        setStatus('idle');
    };

    const leaveSession = () => {
        cleanupVoice();
        wsRef.current?.close();
        setStatus('idle');
        setPartner(null);
        setSessionId(null);
        setMessages([]);
        toast.success("Đã rời phiên học");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // IDLE STATE
    if (status === 'idle') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                            <Users size={14} /> Peer Practice
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mb-4">Luyện tập cùng bạn học</h1>
                        <p className="text-gray-600 text-lg max-w-xl mx-auto">
                            Chọn chủ đề bạn muốn luyện tập và kết nối với người học khác.
                        </p>
                    </div>

                    {/* Topic Selection */}
                    <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">📌 Chọn chủ đề hội thoại</h2>
                        <p className="text-gray-500 text-sm mb-6 text-center">Chủ đề sẽ giúp định hướng cuộc trò chuyện của bạn</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {TOPICS.map(topic => (
                                <button
                                    key={topic.id}
                                    onClick={() => setSelectedTopic(topic.id)}
                                    className={`p-4 rounded-2xl border-2 transition-all text-left ${selectedTopic === topic.id
                                            ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                                            : `${topic.color} border-transparent`
                                        }`}
                                >
                                    <div className="text-3xl mb-2">{topic.emoji}</div>
                                    <h3 className="font-bold text-gray-900">{topic.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{topic.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Start Button */}
                    <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 text-center">
                        <div className="flex items-center justify-center gap-6 mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MessageCircle size={20} className="text-purple-600" />
                                <span>Text Chat</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Mic size={20} className="text-green-600" />
                                <span>Voice Chat</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Users size={20} className="text-blue-600" />
                                <span>Random Match</span>
                            </div>
                        </div>

                        {selectedTopic ? (
                            <button
                                onClick={startMatching}
                                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto"
                            >
                                <UserPlus size={20} /> Tìm bạn luyện tập {TOPICS.find(t => t.id === selectedTopic)?.name}
                            </button>
                        ) : (
                            <button
                                disabled
                                className="px-10 py-4 bg-gray-200 text-gray-500 font-bold rounded-2xl cursor-not-allowed flex items-center gap-3 mx-auto"
                            >
                                <UserPlus size={20} /> Vui lòng chọn chủ đề trước
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // SEARCHING STATE
    if (status === 'connecting' || status === 'searching') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-[40px] p-12 shadow-xl border border-gray-100 text-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto mb-8 flex items-center justify-center text-white shadow-2xl animate-pulse">
                            <Loader2 size={56} className="animate-spin" />
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 mb-4">
                            {status === 'connecting' ? 'Đang kết nối...' : 'Đang tìm kiếm...'}
                        </h2>
                        <p className="text-gray-500 mb-2">Thời gian: {searchTime}s</p>
                        <p className="text-sm text-gray-400 mb-8">Đang tìm người học khác đang online</p>

                        <button
                            onClick={cancelSearch}
                            className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all flex items-center gap-2 mx-auto"
                        >
                            <X size={18} /> Hủy tìm kiếm
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // CONNECTED STATE - Chat UI
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
            {/* Hidden audio element for remote stream */}
            <audio ref={remoteAudioRef} autoPlay playsInline />

            {/* Incoming call modal */}
            {voiceStatus === 'incoming' && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 text-center shadow-2xl">
                        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                            <Phone className="text-green-600" size={40} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Cuộc gọi đến</h3>
                        <p className="text-gray-500 mb-6">{partner?.full_name} muốn voice chat</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={rejectVoiceChat}
                                className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                                <PhoneOff size={24} />
                            </button>
                            <button
                                onClick={acceptVoiceChat}
                                className="p-4 bg-green-500 text-white rounded-full hover:bg-green-600"
                            >
                                <Phone size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {partner?.full_name?.charAt(0) || 'P'}
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900">{partner?.full_name || 'Partner'}</h2>
                            <p className="text-sm text-green-600 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                {voiceStatus === 'active' ? '🎙️ Voice active' : 'Online'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Voice controls */}
                        {voiceStatus === 'idle' && (
                            <button
                                onClick={requestVoiceChat}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
                            >
                                <Phone size={18} /> Voice
                            </button>
                        )}

                        {voiceStatus === 'requesting' && (
                            <button disabled className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-xl opacity-75">
                                <Loader2 size={18} className="animate-spin" /> Đang gọi...
                            </button>
                        )}

                        {voiceStatus === 'connecting' && (
                            <button disabled className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl opacity-75">
                                <Loader2 size={18} className="animate-spin" /> Đang kết nối...
                            </button>
                        )}

                        {voiceStatus === 'active' && (
                            <>
                                <button
                                    onClick={toggleMute}
                                    className={`p-2 rounded-xl transition ${isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                                </button>
                                <button
                                    onClick={endVoiceChat}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                                >
                                    <PhoneOff size={18} /> Kết thúc
                                </button>
                            </>
                        )}

                        <button
                            onClick={leaveSession}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition"
                        >
                            <LogOut size={18} /> Rời
                        </button>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 max-w-4xl mx-auto w-full p-4">
                <div className="h-full bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col" style={{ minHeight: '500px' }}>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((msg, idx) => {
                            if (msg.type === 'system') {
                                return (
                                    <div key={idx} className="text-center">
                                        <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm">
                                            {msg.content}
                                        </span>
                                    </div>
                                );
                            }

                            const isOwn = msg.from_user_id === 0;
                            return (
                                <div key={idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-4 rounded-2xl ${isOwn
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-md'
                                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                                        }`}>
                                        <p>{msg.content}</p>
                                        {msg.timestamp && (
                                            <p className={`text-xs mt-1 ${isOwn ? 'text-purple-200' : 'text-gray-400'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type your message in English..."
                                className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputText.trim()}
                                className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
