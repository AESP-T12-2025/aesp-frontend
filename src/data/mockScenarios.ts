import type { Scenario } from '../types/scenario';

export const mockScenarios: Scenario[] = [
  {
    id: 1,
    title: "Gọi món tại quán cà phê",
    description: "Luyện tập cách order đồ uống và thanh toán tại quán cà phê.",
    imageUrl: "",
    difficulty: "Dễ",
    tags: ["Daily English"],
    vocabulary: [
      { word: "Order", meaning: "Đặt món" },
      { word: "Bill", meaning: "Hóa đơn" },
      { word: "Decaf", meaning: "Cà phê không caffeine" }
    ],
    suggestions: [
      "I would like to have a latte, please.",
      "Could I have the bill?",
      "Do you have any sugar-free options?"
    ]
  },
  {
    id: 2,
    title: "Phỏng vấn xin việc",
    description: "Luyện tập trả lời các câu hỏi phổ biến về kinh nghiệm làm việc.",
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
    difficulty: "Khó",
    tags: ["Professional"],
    vocabulary: [
      { word: "Strengths", meaning: "Điểm mạnh" },
      { word: "Weaknesses", meaning: "Điểm yếu" },
      { word: "Experience", meaning: "Kinh nghiệm" }
    ],
    suggestions: [
      "My greatest strength is my ability to work under pressure.",
      "I have three years of experience in marketing.",
      "Why should we hire you?"
    ]
  },
  {
    id: 3,
    title: "Thảo luận nhóm tại công ty",
    description: "Luyện tập cách đưa ra ý kiến và phản biện trong cuộc họp.",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    difficulty: "Trung bình",
    tags: ["Professional"],
    vocabulary: [
      { word: "Opinion", meaning: "Ý kiến" },
      { word: "Agree", meaning: "Đồng ý" },
      { word: "Suggest", meaning: "Đề xuất" }
    ],
    suggestions: [
      "In my opinion, we should focus on social media.",
      "I totally agree with your point.",
      "Can I suggest another solution?"
    ]
  },
  {
    id: 4,
    title: "Chào hỏi người bạn mới",
    description: "Luyện tập cách tự giới thiệu bản thân và phá vỡ sự ngại ngùng.",
    imageUrl: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8",
    difficulty: "Dễ",
    tags: ["Daily English"],
    vocabulary: [
      { word: "Hobby", meaning: "Sở thích" },
      { word: "Major", meaning: "Chuyên ngành" },
      { word: "Acquaintance", meaning: "Người quen" }
    ],
    suggestions: [
      "Nice to meet you! My name is...",
      "What do you do for a living?",
      "How long have you been living here?"
    ]
  },
  {
    id: 5,
    title: "Thuyết trình về tiến độ dự án",
    description: "Sử dụng các cụm từ chuyên môn để báo cáo công việc.",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
    difficulty: "Khó",
    tags: ["Professional"],
    vocabulary: [
      { word: "Deadline", meaning: "Hạn chót" },
      { word: "Progress", meaning: "Tiến độ" },
      { word: "Update", meaning: "Cập nhật" }
    ],
    suggestions: [
      "Today, I'd like to update you on our project.",
      "We are on track to meet the deadline.",
      "Are there any questions so far?"
    ]
  },
  {
    id: 6,
    title: "Hỏi đường khi đi du lịch",
    description: "Tình huống giao tiếp thực tế khi bạn bị lạc ở nước ngoài.",
    imageUrl: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b",
    difficulty: "Trung bình",
    tags: ["Daily English"],
    vocabulary: [
      { word: "Direction", meaning: "Phương hướng" },
      { word: "Intersection", meaning: "Ngã tư" },
      { word: "Straight", meaning: "Đi thẳng" }
    ],
    suggestions: [
      "Excuse me, could you tell me how to get to the museum?",
      "Is it far from here?",
      "Go straight and turn left at the next corner."
    ]
  }
];