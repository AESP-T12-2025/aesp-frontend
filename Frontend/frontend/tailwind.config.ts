import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Định nghĩa rõ ràng mã màu xanh từ ảnh code của bạn
        'aesp-blue': '#007bff', 
        'aesp-gray': '#6c757d',
      },
    },
  },
  plugins: [],
};
export default config;