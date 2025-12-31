
export interface Topic {
  id: number;
  name: string;
  image: string;
}

export interface Category {
  id: number;
  title: string;
  topics: Topic[];
}


export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    title: "Giao tiếp hàng ngày (Daily English)",
    topics: [
      { id: 101, name: "Chào hỏi & Làm quen", image: "👋" },
      { id: 102, name: "Tại nhà hàng", image: "🍔" },
      { id: 103, name: "Đi du lịch", image: "✈️" }
    ]
  },
  {
    id: 2,
    title: "Tiếng Anh chuyên ngành (Professional)",
    topics: [
      { id: 201, name: "Phỏng vấn xin việc", image: "💼" },
      { id: 202, name: "Thuyết trình dự án", image: "📊" },
      { id: 203, name: "Họp nhóm", image: "👥" }
    ]
  }
];