import Link from "next/link";
import { ArrowRight, BookOpen, Mic } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-white text-center px-4">
      <div className="max-w-4xl space-y-8">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Cải thiện kỹ năng <span className="text-aesp-blue">nói Tiếng Anh</span> với AI
        </h1>

        <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-600">
          Luyện tập mọi lúc, mọi nơi với các tình huống giao tiếp thực tế.
          Phản hồi tức thì giúp bạn tự tin hơn mỗi ngày.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/register">
            <button className="px-8 py-3 rounded-xl bg-aesp-blue text-white font-bold text-lg hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20">
              Bắt đầu ngay <ArrowRight size={20} />
            </button>
          </Link>
          <Link href="/about">
            <button className="px-8 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-lg hover:bg-gray-50 transition-all flex items-center gap-2">
              Tìm hiểu thêm
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 text-left">
          <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center mb-4 text-aesp-blue shadow-sm">
              <Mic size={24} />
            </div>
            <h3 className="font-bold text-xl mb-2 text-gray-900">Luyện nói AI</h3>
            <p className="text-gray-600">Thực hành hội thoại với gia sư AI thông minh, sửa lỗi phát âm và ngữ pháp tức thì.</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center mb-4 text-aesp-gray shadow-sm">
              <BookOpen size={24} />
            </div>
            <h3 className="font-bold text-xl mb-2 text-gray-900">Tình huống thực tế</h3>
            <p className="text-gray-600">Hàng trăm kịch bản giao tiếp từ công việc, du lịch đến đời sống hàng ngày.</p>
          </div>
          <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center mb-4 text-aesp-blue shadow-sm">
              <span className="font-bold text-xl">24/7</span>
            </div>
            <h3 className="font-bold text-xl mb-2 text-gray-900">Học mọi lúc</h3>
            <p className="text-gray-600">Không giới hạn thời gian và không gian. Học bất cứ khi nào bạn rảnh rỗi.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
