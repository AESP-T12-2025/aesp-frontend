'use client';
import React from 'react';
import Link from 'next/link';

export default function LearnerDashboard() {
  const stats = [
    { label: 'Bài đã học', value: '12', icon: '📖', color: 'bg-blue-100 text-blue-600' },
    { label: 'Giờ luyện tập', value: '5.5h', icon: '⏱️', color: 'bg-green-100 text-green-600' },
    { label: 'Điểm trung bình', value: '8.5', icon: '⭐', color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Chào mừng bạn quay lại! 👋</h1>
        <p className="text-gray-500 mt-2">Hôm nay bạn muốn rèn luyện kỹ năng nói tiếng Anh về chủ đề gì?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Banner chính - Kêu gọi hành động */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-lg">
        <div className="relative z-10 md:w-2/3">
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng để bứt phá kỹ năng nói?</h2>
          <p className="text-blue-100 mb-8 leading-relaxed">
            Hệ thống AI của chúng tôi sẽ giúp bạn luyện tập phản xạ và sửa lỗi phát âm ngay lập tức qua các kịch bản thực tế.
          </p>
          <Link 
            href="/learner/scenarios" 
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-md active:scale-95"
          >
            Bắt đầu luyện tập ngay →
          </Link>
        </div>
        
        {/* Trang trí hình nền phụ (optional) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 -mr-20 -mt-20 rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white opacity-10 mr-10 mb-10 rounded-full"></div>
      </div>

      {/* Phần gợi ý thêm */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 border border-dashed border-gray-300 rounded-2xl">
          <h3 className="font-bold text-gray-700 mb-2">Gợi ý bài học</h3>
          <p className="text-sm text-gray-500 italic">"Phỏng vấn xin việc" là chủ đề đang được nhiều người luyện tập nhất tuần này.</p>
        </div>
        <div className="p-6 border border-dashed border-gray-300 rounded-2xl">
          <h3 className="font-bold text-gray-700 mb-2">Mẹo nhỏ</h3>
          <p className="text-sm text-gray-500 italic">Hãy đeo tai nghe để AI có thể nhận diện giọng nói của bạn một cách chính xác nhất.</p>
        </div>
      </div>
    </div>
  );
}