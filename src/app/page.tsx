"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Star, Zap } from 'lucide-react';
import { topicService, Topic } from '@/services/topicService';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await topicService.getAll();
        setTopics(data);
      } catch (error) {
        console.error("Failed to fetch topics", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Hero Section */}
      <header className="bg-white border-b border-gray-100 pb-16 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Master English with <span className="text-[#007bff]">AI Power</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-medium mb-10">
            Trải nghiệm học tiếng Anh giao tiếp thông minh, phản hồi tức thì và lộ trình cá nhân hóa.
          </p>
          <div className="flex justify-center gap-4">
            {!user ? (
              <Link href="/register" className="bg-[#007bff] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition shadow-lg shadow-blue-200">
                Bắt đầu ngay hôm nay
              </Link>
            ) : (
              <Link href={user.role === 'ADMIN' ? '/admin' : '/learner'} className="bg-[#007bff] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition shadow-lg shadow-blue-200">
                Vào Dashboard
              </Link>
            )}

            <a href="#topics" className="bg-white text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg border-2 border-gray-200 hover:border-[#007bff] hover:text-[#007bff] transition">
              Khám phá bài học
            </a>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 mb-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 justify-center">
            <div className="bg-blue-100 p-3 rounded-xl text-[#007bff]">
              <Zap size={32} />
            </div>
            <div className="text-left">
              <div className="text-2xl font-black text-gray-900">AI Scoring</div>
              <div className="text-gray-500 font-medium">Chấm điểm phát âm</div>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:border-l md:border-r border-gray-100">
            <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
              <BookOpen size={32} />
            </div>
            <div className="text-left">
              <div className="text-2xl font-black text-gray-900">Real Scenarios</div>
              <div className="text-gray-500 font-medium">Hội thoại thực tế</div>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center">
            <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
              <Star size={32} />
            </div>
            <div className="text-left">
              <div className="text-2xl font-black text-gray-900">Tracking</div>
              <div className="text-gray-500 font-medium">Theo dõi tiến độ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <section id="topics" className="max-w-7xl mx-auto px-4 pb-24">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Chủ Đề Phổ Biến</h2>
            <p className="text-gray-500 font-medium">Lựa chọn chủ đề yêu thích và bắt đầu luyện tập</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-white rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topics.map((topic) => (
              <Link
                href={user ? `/learner/topics/${topic.topic_id}` : '/login'}
                key={topic.topic_id}
                className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                  <img
                    src={topic.image_url || `https://ui-avatars.com/api/?name=${topic.name}&background=random&size=400`}
                    alt={topic.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute bottom-4 left-6 z-20">
                    <span className="bg-[#007bff] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Topic</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-[#007bff] transition">
                    {topic.name}
                  </h3>
                  <p className="text-gray-500 font-medium mb-6 line-clamp-2">
                    {topic.description || "Khám phá các đoạn hội thoại thú vị trong chủ đề này."}
                  </p>
                  <div className="flex items-center text-[#007bff] font-bold group-hover:gap-2 transition-all">
                    Bắt đầu học <ArrowRight size={20} className="ml-2" />
                  </div>
                </div>
              </Link>
            ))}

            {topics.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-300">
                <p className="text-xl text-gray-400 font-bold">Chưa có chủ đề nào được thêm vào.</p>
                <div className="mt-4">
                  {user?.role === 'ADMIN' && (
                    <Link href="/admin/topics/new" className="text-[#007bff] font-bold hover:underline">
                      + Thêm chủ đề đầu tiên
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 text-center text-gray-400 font-medium">
        <p>© 2026 AESP Learning Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
