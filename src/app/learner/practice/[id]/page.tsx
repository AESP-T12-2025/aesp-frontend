"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { scenarioService, Scenario } from '@/services/scenarioService';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Loader2, ArrowLeft, Mic, MicOff, Send, Volume2,
  BookOpen, MessageCircle, Zap, Clock, RotateCcw
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
  const [vocabulary, setVocabulary] = useState<string[]>([]);

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
        content: response.data.response || response.data.message || "I understand. Please continue practicing!",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
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

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast.success("Đã dừng ghi âm");
    } else {
      setIsRecording(true);
      toast("🎤 Đang ghi âm... (Coming soon)", { icon: '🚧' });
      setTimeout(() => setIsRecording(false), 3000);
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
                  <Clock size={14} /> {getElapsedTime()}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={resetConversation}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition"
          >
            <RotateCcw size={16} /> Reset
          </button>
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
                    <p className="whitespace-pre-wrap">{msg.content}</p>
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
    </div>
  );
}