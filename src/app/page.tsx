"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  BookOpen,
  Star,
  Zap,
  CheckCircle,
  Users,
  MessageCircle,
  Globe,
  Award,
  Play,
  Minus
} from 'lucide-react';
import { topicService, Topic } from '@/services/topicService';
import { useAuth } from '@/context/AuthContext';
import { mentorService, MentorProfile } from '@/services/mentorService';

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [mentors, setMentors] = useState<MentorProfile[]>([]); // New: Fetch top mentors
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicsData, mentorsData] = await Promise.all([
          topicService.getAll(),
          mentorService.getAllMentors()
        ]);
        setTopics(topicsData.slice(0, 6)); // Show top 6 topics
        setMentors(mentorsData.slice(0, 4)); // Show top 4 mentors
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-blue-50/50 -skew-y-3 origin-top-left z-0 scale-110"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-[#007bff] px-4 py-2 rounded-full font-bold text-sm mb-8 animate-fade-in-up">
              <Star size={16} className="fill-current" />
              <span>Nền tảng luyện nói tiếng Anh số 1 Việt Nam</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
              Tự tin giao tiếp tiếng Anh <br className="hidden md:block" />
              với <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007bff] to-blue-500">AI & Mentor</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
              Phá bỏ rào cản tâm lý, luyện tập 1-1 không giới hạn và nhận phản hồi tức thì để cải thiện phát âm mỗi ngày.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!user ? (
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-5 bg-[#007bff] text-white rounded-2xl font-bold text-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:bg-blue-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  Bắt đầu học ngay <ArrowRight size={24} />
                </Link>
              ) : (
                <Link
                  href={user.role === 'ADMIN' ? '/admin' : '/learner'}
                  className="w-full sm:w-auto px-8 py-5 bg-[#007bff] text-white rounded-2xl font-bold text-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:bg-blue-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  Vào Dashboard <ArrowRight size={24} />
                </Link>
              )}

              <a
                href="#demo"
                className="w-full sm:w-auto px-8 py-5 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold text-xl hover:border-[#007bff] hover:text-[#007bff] transition-all flex items-center justify-center gap-3"
              >
                <Play size={24} className="fill-current" /> Xem Demo
              </a>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-gray-400 font-bold text-sm uppercase tracking-widest">
              <span>Trusted by</span>
              <div className="flex gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {['Google', 'Microsoft', 'Duolingo', 'Coursera'].map(brand => (
                  <span key={brand} className="hover:text-gray-600 cursor-default">{brand}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & FEATURES */}
      <section className="py-12 bg-white relative z-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-500/10 border border-gray-100 p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="px-4 py-4">
              <div className="inline-flex p-4 bg-orange-50 text-orange-500 rounded-2xl mb-4">
                <Zap size={32} />
              </div>
              <h3 className="text-4xl font-black text-gray-900 mb-2">300+</h3>
              <p className="text-gray-500 font-bold">Chủ đề luyện tập</p>
            </div>
            <div className="px-4 py-4">
              <div className="inline-flex p-4 bg-purple-50 text-purple-500 rounded-2xl mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-4xl font-black text-gray-900 mb-2">50k+</h3>
              <p className="text-gray-500 font-bold">Học viên đang hoạt động</p>
            </div>
            <div className="px-4 py-4">
              <div className="inline-flex p-4 bg-green-50 text-green-500 rounded-2xl mb-4">
                <Award size={32} />
              </div>
              <h3 className="text-4xl font-black text-gray-900 mb-2">4.9/5</h3>
              <p className="text-gray-500 font-bold">Đánh giá trung bình</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VALUE PROPOSITION */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Tại sao chọn AESP?</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">Chúng tôi kết hợp sức mạnh của AI và trải nghiệm thực tế để giúp bạn nói tiếng Anh lưu loát.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <MessageCircle size={32} />,
                bgColor: "bg-blue-50",
                textColor: "text-blue-500",
                title: "AI Chat & Feedback",
                desc: "Trò chuyện với AI 24/7, nhận phản hồi chi tiết về từng lỗi ngữ pháp và phát âm ngay lập tức."
              },
              {
                icon: <Globe size={32} />,
                bgColor: "bg-indigo-50",
                textColor: "text-indigo-500",
                title: "Môi trường thoải mái",
                desc: "Không còn nỗi sợ sai. Luyện tập trong không gian an toàn cho đến khi bạn sẵn sàng giao tiếp thực tế."
              },
              {
                icon: <BookOpen size={32} />,
                bgColor: "bg-pink-50",
                textColor: "text-pink-500",
                title: "Lộ trình cá nhân hóa",
                desc: "AI phân tích trình độ và tạo ra lộ trình học tập riêng biệt phù hợp với mục tiêu của bạn."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[32px] border border-gray-100 hover:shadow-xl transition-all hover:translate-y-[-5px]">
                <div className={`w-16 h-16 rounded-2xl ${item.bgColor} ${item.textColor} flex items-center justify-center mb-8`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. POPULAR TOPICS */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Chủ Đề Hot</h2>
              <p className="text-xl text-gray-500 font-medium">Bắt đầu luyện tập với các chủ đề thông dụng nhất</p>
            </div>
            <Link href="/learner/topics" className="hidden md:flex items-center text-[#007bff] font-bold text-lg hover:underline">
              Xem tất cả <ArrowRight className="ml-2" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-96 bg-gray-100 rounded-[32px] animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topics.map((topic) => (
                <Link
                  href={user ? `/learner/topics/${topic.topic_id}` : '/login'}
                  key={topic.topic_id}
                  className="group relative h-96 rounded-[32px] overflow-hidden cursor-pointer"
                >
                  <Image
                    src={topic.image_url || `https://ui-avatars.com/api/?name=${topic.name}&background=random&size=400`}
                    alt={topic.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <span className="inline-block px-3 py-1 bg-[#007bff] text-white text-xs font-bold rounded-full mb-4">
                      POPULAR
                    </span>
                    <h3 className="text-3xl font-black text-white mb-2">{topic.name}</h3>
                    <p className="text-white/80 font-medium line-clamp-2 mb-6 text-sm">{topic.description}</p>
                    <div className="flex items-center text-white font-bold group-hover:gap-2 transition-all">
                      Luyện tập ngay <ArrowRight size={20} className="ml-2" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. TOP MENTORS */}
      <section className="py-24 bg-[#007bff]/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Gặp gỡ Mentor ưu tú</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">Đội ngũ giảng viên, chuyên gia hàng đầu sẵn sàng đồng hành cùng bạn.</p>
          </div>

          {/* Simple list needed here if mentors loaded */}
          {isLoading ? (
            <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007bff]"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mentors.map(mentor => (
                <div key={mentor.mentor_id} className="bg-white p-6 rounded-[32px] border border-gray-100 text-center hover:shadow-xl transition-all group">
                  <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-[#007bff] text-2xl font-black mb-6 group-hover:scale-110 transition-transform">
                    {mentor.full_name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{mentor.full_name}</h3>
                  <p className="text-blue-500 font-bold text-sm mb-4">{mentor.skills?.split(',')[0]} Expert</p>

                  <Link href="/learner/mentors" className="inline-block w-full py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-[#007bff] hover:text-white transition-colors">
                    Xem hồ sơ
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/learner/mentors" className="inline-flex items-center px-8 py-4 bg-white border-2 border-[#007bff] text-[#007bff] rounded-2xl font-bold hover:bg-[#007bff] hover:text-white transition-all">
              Tìm Mentor phù hợp <ArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. PRICING PACKAGES (NEW Requirement) */}
      <section className="py-24 bg-gray-50" id="pricing">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Chọn lộ trình phù hợp</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
              Bạn có thể chọn gói tự học với AI hoặc có Mentor đồng hành.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Package */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <div className="inline-block px-4 py-1 bg-gray-100 text-gray-600 font-bold rounded-full text-sm mb-6">BASIC</div>
              <h3 className="text-3xl font-black text-gray-900 mb-2">Miễn phí</h3>
              <p className="text-gray-500 font-medium mb-6">Dành cho người mới bắt đầu</p>
              <div className="text-4xl font-black text-[#007bff] mb-8">0đ<span className="text-lg text-gray-400 font-medium">/tháng</span></div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-600 font-medium"><CheckCircle size={20} className="text-green-500" /> 3 Topic cơ bản</li>
                <li className="flex items-center gap-3 text-gray-600 font-medium"><CheckCircle size={20} className="text-green-500" /> AI Chat cơ bản</li>
                <li className="flex items-center gap-3 text-gray-400 font-medium"><Minus size={20} /> Không có Mentor</li>
              </ul>
              <Link href="/register" className="block w-full py-4 border-2 border-[#007bff] text-[#007bff] text-center font-bold rounded-xl hover:bg-[#007bff] hover:text-white transition-all">Đăng ký ngay</Link>
            </div>

            {/* Standard Package */}
            <div className="bg-[#007bff] p-8 rounded-[32px] shadow-2xl shadow-blue-200 transform md:-translate-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
              <div className="inline-block px-4 py-1 bg-white/20 text-white font-bold rounded-full text-sm mb-6">STANDARD</div>
              <h3 className="text-3xl font-black text-white mb-2">Pro AI</h3>
              <p className="text-blue-100 font-medium mb-6">Luyện tập không giới hạn</p>
              <div className="text-4xl font-black text-white mb-8">199k<span className="text-lg text-blue-200 font-medium">/tháng</span></div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-white font-medium"><CheckCircle size={20} className="text-yellow-400" /> Mở khóa toàn bộ Topic</li>
                <li className="flex items-center gap-3 text-white font-medium"><CheckCircle size={20} className="text-yellow-400" /> AI Feedback chi tiết</li>
                <li className="flex items-center gap-3 text-white font-medium"><CheckCircle size={20} className="text-yellow-400" /> Lộ trình cá nhân hóa</li>
                <li className="flex items-center gap-3 text-blue-200 font-medium"><Minus size={20} /> Không có Mentor</li>
              </ul>
              <Link href="/register" className="block w-full py-4 bg-white text-[#007bff] text-center font-bold rounded-xl hover:shadow-lg transition-all">Dùng thử miễn phí</Link>
            </div>

            {/* Premium Package */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <div className="inline-block px-4 py-1 bg-purple-100 text-purple-600 font-bold rounded-full text-sm mb-6">PREMIUM</div>
              <h3 className="text-3xl font-black text-gray-900 mb-2">Mentor 1-1</h3>
              <p className="text-gray-500 font-medium mb-6">Kèm cặp chuyên sâu</p>
              <div className="text-4xl font-black text-gray-900 mb-8">999k<span className="text-lg text-gray-400 font-medium">/tháng</span></div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-600 font-medium"><CheckCircle size={20} className="text-purple-500" /> Tất cả tính năng Pro AI</li>
                <li className="flex items-center gap-3 text-gray-600 font-medium"><CheckCircle size={20} className="text-purple-500" /> 4 buổi Mentor 1-1/tháng</li>
                <li className="flex items-center gap-3 text-gray-600 font-medium"><CheckCircle size={20} className="text-purple-500" /> Chấm điểm chi tiết</li>
              </ul>
              <Link href="/register" className="block w-full py-4 border-2 border-purple-500 text-purple-600 text-center font-bold rounded-xl hover:bg-purple-500 hover:text-white transition-all">Liên hệ tư vấn</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION (Renumbered) */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-[#007bff] rounded-[48px] p-12 md:p-24 text-center text-white relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

            <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10">Sẵn sàng chinh phục tiếng Anh?</h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto font-medium relative z-10">
              Tham gia cộng đồng 50,000+ học viên và bắt đầu hành trình của bạn ngay hôm nay.
            </p>
            <Link
              href="/register"
              className="inline-block px-10 py-5 bg-white text-[#007bff] rounded-2xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all relative z-10"
            >
              Đăng ký miễn phí
            </Link>
            <p className="mt-6 text-blue-200 text-sm font-bold relative z-10">Không cần thẻ tín dụng • Hủy bất cứ lúc nào</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-50 border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-black text-[#007bff] mb-6">AESP</h3>
            <p className="text-gray-500 font-medium">Nền tảng luyện nói tiếng Anh thông minh hàng đầu dành cho người Việt.</p>
          </div>
          {[
            {
              header: "Học tập", links: [
                { label: "Chủ đề", href: "/learner/topics" },
                { label: "Kịch bản", href: "/learner/topics" },
                { label: "Mentor", href: "/learner/mentors" },
                { label: "Cộng đồng", href: "/learner/community" }
              ]
            },
            {
              header: "Về chúng tôi", links: [
                { label: "Giới thiệu", href: "#" },
                { label: "Liên hệ", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Đăng nhập", href: "/login" }
              ]
            },
            {
              header: "Điều khoản", links: [
                { label: "Điều khoản sử dụng", href: "/policies/terms" },
                { label: "Chính sách bảo mật", href: "/policies/privacy" },
                { label: "Chính sách hoàn tiền", href: "/policies/refund" }
              ]
            },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="font-bold text-gray-900 mb-6">{col.header}</h4>
              <ul className="space-y-4">
                {col.links.map(link => (
                  <li key={link.label}><Link href={link.href} className="text-gray-500 hover:text-[#007bff] font-medium transition">{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center text-gray-400 font-bold text-sm">
          © 2026 AESP Learning Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
