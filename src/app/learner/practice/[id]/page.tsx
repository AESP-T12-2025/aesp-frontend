"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { scenarioService, Scenario } from '@/services/scenarioService';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Loader2, ArrowLeft, Mic, MicOff, Send, Volume2,
  BookOpen, MessageCircle, Zap, Clock, RotateCcw, CheckCircle
} from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function PracticePage() {
  const params = useParams();
  const router = useRouter();
  const scenarioId = params.id as string;

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionStartTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState('0:00');
  const [vocabulary, setVocabulary] = useState<string[]>([]);

  // Session management states
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<{
    session_id: number;
    score: number;
    duration_minutes: number;
    messages_count: number;
    xp_earned: number;
  } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadScenario();
  }, [scenarioId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadScenario = async () => {
    try {
      const data = await scenarioService.getById(scenarioId);
      setScenario(data);

      // Load vocabulary
      try {
        const vocabData = await scenarioService.getVocab(scenarioId);
        setVocabulary(vocabData.vocabulary || []);
      } catch {
        // Vocab might not exist
      }

      // Start a new practice session
      try {
        const sessionRes = await api.post('/ai/session/start', {
          scenario_id: parseInt(scenarioId)
        });
        setSessionId(sessionRes.data.session_id);
        console.log('Started session:', sessionRes.data.session_id);
      } catch (err) {
        console.error('Failed to start session:', err);
        // Continue anyway, but session won't be tracked
      }

      // Add initial AI greeting
      setMessages([{
        id: 1,
        role: 'ai',
        content: `Xin chào! Tôi là AI assistant. Chúng ta sẽ luyện tập chủ đề "${data.title}". Bạn có thể bắt đầu cuộc hội thoại bằng tiếng Anh. Tôi sẽ phản hồi và giúp bạn cải thiện kỹ năng nói. Let's begin! 🎯`,
        timestamp: new Date()
      }]);
    } catch (e) {
      toast.error("Không thể tải tình huống");
      router.push('/learner/scenarios');
    } finally {
      setLoading(false);
    }
  };

  // Live timer - update every second
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000);
      const mins = Math.floor(diff / 60);
      const secs = diff % 60;
      setElapsedTime(`${mins}:${secs.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStartTime]);

  const sendMessage = async () => {
    if (!inputText.trim() || sending) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSending(true);

    try {
      // Call AI conversation API
      const response = await api.post('/ai/conversation', {
        message: userMessage.content,
        scenario_id: parseInt(scenarioId),
        context: messages.slice(-6).map(m => ({ role: m.role, content: m.content }))
      });

      const aiMessage: Message = {
        id: messages.length + 2,
        role: 'ai',
        content: response.data.response || "I understand. Please continue practicing!",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      playMessage(aiMessage.content);
    } catch (e: any) {
      // Fallback response if API fails
      const fallbackMessage: Message = {
        id: messages.length + 2,
        role: 'ai',
        content: "Great job practicing! Keep going with your English conversation. What else would you like to discuss about this topic?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [mimeType, setMimeType] = useState('');

  // Web Speech API for real-time speech recognition
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        // Update input with final + interim results
        if (finalTranscript) {
          setInputText(prev => prev + finalTranscript);
        }
        // Show interim results in real-time (optional: you can show in a separate state)
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          toast.error('Vui lòng cấp quyền microphone');
        } else if (event.error !== 'aborted') {
          toast.error('Lỗi nhận diện giọng nói: ' + event.error);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        if (isRecording) {
          // Restart if still recording (handles continuous recognition)
          try {
            recognition.start();
          } catch (e) {
            setIsRecording(false);
          }
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    // Check if Speech Recognition is supported
    if (!recognitionRef.current) {
      toast.error('Trình duyệt không hỗ trợ nhận diện giọng nói');
      return;
    }

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });

      recognitionRef.current.start();
      setIsRecording(true);
      toast.success("🎤 Đang nghe... Hãy nói tiếng Anh!");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast.success("✅ Đã dừng ghi âm");
    }
  };

  const handleAudioUpload = async (blob: Blob, type: string) => {
    // This function is kept for backward compatibility but no longer used
    // with Web Speech API
    setSending(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];

        // Extract extension from mime type (e.g., 'audio/webm' -> 'webm')
        const extension = type.split('/')[1]?.split(';')[0] || 'webm';

        const response = await api.post('/ai/stt', {
          audio_data: base64Audio,
          format: extension,
          sample_rate: 16000
        });

        if (response.data.text) {
          setInputText(prev => prev + (prev ? ' ' : '') + response.data.text);
          toast.success("Đã nhận diện giọng nói");
        } else {
          toast.error("Không nghe rõ, vui lòng thử lại");
        }
      };
    } catch (err) {
      console.error("STT Error:", err);
      toast.error("Không thể nhận diện giọng nói");
    } finally {
      setSending(false);
    }
  };

  const playMessage = async (text: string) => {
    try {
      const response = await api.post('/ai/tts', { text });
      const audioUrl = response.data.audio_url;
      if (audioUrl) {
        // Handle path if it's relative
        const fullUrl = audioUrl.startsWith('http')
          ? audioUrl
          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${audioUrl}`;

        const audio = new Audio(fullUrl);
        audio.play();
      }
    } catch (err) {
      console.error("TTS Error:", err);
      toast.error("Không thể phát âm thanh");
    }
  };

  const resetConversation = () => {
    if (scenario) {
      setMessages([{
        id: 1,
        role: 'ai',
        content: `Cuộc hội thoại đã được reset. Hãy bắt đầu lại với chủ đề "${scenario.title}". I'm ready when you are! 🎯`,
        timestamp: new Date()
      }]);
      toast.success("Đã reset cuộc hội thoại");
    }
  };

  const getElapsedTime = () => {
    const diff = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completeSession = async () => {
    if (!sessionId) {
      toast.error("Không tìm thấy session");
      router.push('/learner/scenarios');
      return;
    }

    try {
      const userMessages = messages.filter(m => m.role === 'user').length;
      const res = await api.post('/ai/session/complete', {
        session_id: sessionId,
        messages_count: userMessages
      });

      setSessionSummary(res.data);
      setShowSummary(true);
      setShowConfirmDialog(false);
      toast.success("🎉 Đã hoàn thành bài học!");
    } catch (err: any) {
      console.error('Complete session error:', err);
      toast.error(err.response?.data?.detail || "Không thể hoàn thành bài học");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Không tìm thấy tình huống</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/learner/scenarios')}
              className="p-2 hover:bg-gray-100 rounded-xl transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-bold text-gray-900">{scenario.title}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold
                                    ${scenario.difficulty_level === 'BEGINNER' ? 'bg-green-100 text-green-700' :
                    scenario.difficulty_level === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'}`}>
                  {scenario.difficulty_level}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {elapsedTime}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition"
            >
              <CheckCircle size={16} /> Kết thúc
            </button>
            <button
              onClick={resetConversation}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex max-w-6xl mx-auto w-full">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col p-4">
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                    ? 'bg-green-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="whitespace-pre-wrap flex-1">{msg.content}</p>
                      {msg.role === 'ai' && (
                        <button
                          onClick={() => playMessage(msg.content)}
                          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                          title="Phát âm"
                        >
                          <Volume2 size={16} />
                        </button>
                      )}
                    </div>
                    <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-green-200' : 'text-gray-400'}`}>
                      {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-md">
                    <Loader2 className="animate-spin text-gray-400" size={20} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleRecording}
                  className={`p-3 rounded-xl transition ${isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message in English..."
                  className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={sending}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputText.trim() || sending}
                  className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Vocabulary */}
        <div className="w-80 p-4 hidden lg:block">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-green-600" size={20} />
              <h3 className="font-bold text-gray-900">Từ vựng gợi ý</h3>
            </div>

            {vocabulary.length > 0 ? (
              <div className="space-y-2">
                {vocabulary.map((word, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-green-50 rounded-xl text-sm text-green-800 cursor-pointer hover:bg-green-100 transition"
                    onClick={() => setInputText(prev => prev + ' ' + word)}
                  >
                    {word}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Chưa có từ vựng gợi ý</p>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="text-yellow-500" size={18} />
                <h4 className="font-bold text-gray-900 text-sm">Mẹo luyện tập</h4>
              </div>
              <ul className="text-xs text-gray-500 space-y-2">
                <li>• Trả lời bằng câu hoàn chỉnh</li>
                <li>• Sử dụng từ vựng gợi ý</li>
                <li>• Đặt câu hỏi để tiếp tục hội thoại</li>
                <li>• Thử nhấn vào từ vựng để thêm vào tin nhắn</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Kết thúc bài học?</h3>
            <p className="text-gray-600 text-sm mb-6">
              Bạn đã gửi {messages.filter(m => m.role === 'user').length} tin nhắn trong phiên luyện tập này.
              Kết quả sẽ được lưu vào lịch sử học tập của bạn.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
              >
                Tiếp tục học
              </button>
              <button
                onClick={completeSession}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Hoàn thành
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {showSummary && sessionSummary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-xl text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="font-bold text-2xl text-gray-900 mb-2">Hoàn thành bài học!</h2>
            <p className="text-gray-500 mb-6">Chúc mừng bạn đã hoàn thành phiên luyện tập</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-green-600">{sessionSummary.score}</p>
                <p className="text-sm text-gray-600">Điểm số</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-blue-600">+{sessionSummary.xp_earned}</p>
                <p className="text-sm text-gray-600">XP nhận được</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-purple-600">{sessionSummary.duration_minutes}</p>
                <p className="text-sm text-gray-600">Phút luyện tập</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-orange-600">{sessionSummary.messages_count}</p>
                <p className="text-sm text-gray-600">Tin nhắn</p>
              </div>
            </div>

            <button
              onClick={() => router.push('/learner/scenarios')}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      )}
    </div>
  );
}