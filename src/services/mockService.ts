import { Topic } from './topicService';

// --- Types ---

export interface Question {
    id: number;
    type: 'pronunciation' | 'grammar' | 'vocabulary';
    text: string;
    options?: string[]; // For MCQs
    audioUrl?: string;
}

export interface AssessmentResult {
    level: string; // A1, A2, B1, B2, C1, C2
    score: number;
    feedback: string;
    recommendedPathId: string;
}

export interface Package {
    id: string;
    name: string;
    price: number;
    period: 'monthly' | 'yearly';
    features: string[];
    isPopular?: boolean;
    color: string;
}

export interface LearningNode {
    id: string;
    title: string;
    status: 'locked' | 'unlocked' | 'completed';
    position: { x: number, y: number }; // For visual mapping
    topicId?: number;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress: number; // 0-100
}

// --- Mock Data & Methods ---

export const mockService = {
    // 1. Assessment
    getAssessmentQuestions: async (): Promise<Question[]> => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        return [
            { id: 1, type: 'pronunciation', text: "Hello, nice to meet you." },
            { id: 2, type: 'grammar', text: "She _____ (go) to school everyday.", options: ["go", "goes", "going", "went"] },
            { id: 3, type: 'pronunciation', text: "I would like to order a coffee." },
            { id: 4, type: 'vocabulary', text: "Which word is a synonym of 'Happy'?", options: ["Sad", "Joyful", "Angry", "Tired"] },
            { id: 5, type: 'pronunciation', text: "The quick brown fox jumps over the lazy dog." }
        ];
    },

    submitAssessment: async (answers: any): Promise<AssessmentResult> => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Randomize result for demo
        return {
            level: "B1 Intermediate",
            score: 75,
            feedback: "Phát âm của bạn khá tốt, nhưng cần chú ý ngữ điệu. Vốn từ vựng ở mức trung bình khá.",
            recommendedPathId: "path-b1"
        };
    },

    // 2. Learning Path
    getLearningPath: async (): Promise<LearningNode[]> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return [
            { id: '1', title: 'Start Here', status: 'completed', position: { x: 50, y: 10 }, topicId: 1 },
            { id: '2', title: 'Greetings', status: 'completed', position: { x: 50, y: 30 }, topicId: 2 },
            { id: '3', title: 'Daily Routine', status: 'unlocked', position: { x: 30, y: 50 }, topicId: 3 },
            { id: '4', title: 'Ordering Food', status: 'locked', position: { x: 70, y: 50 }, topicId: 4 },
            { id: '5', title: 'Travel Basic', status: 'locked', position: { x: 50, y: 70 }, topicId: 5 },
            { id: '6', title: 'Job Interview', status: 'locked', position: { x: 50, y: 90 }, topicId: 6 },
        ];
    },

    // 3. Packages
    getPackages: async (): Promise<Package[]> => {
        return [
            {
                id: 'bx_basic', name: 'Basic', price: 0, period: 'monthly', color: 'gray',
                features: ['3 Topic cơ bản', 'AI Chat cơ bản', 'Không có Mentor']
            },
            {
                id: 'bx_pro', name: 'Pro AI', price: 199000, period: 'monthly', isPopular: true, color: 'blue',
                features: ['Mở khóa toàn bộ Topic', 'AI Feedback chi tiết', 'Lộ trình cá nhân hóa', 'Không có Mentor']
            },
            {
                id: 'bx_mentor', name: 'Mentor 1-1', price: 999000, period: 'monthly', color: 'purple',
                features: ['Tất cả tính năng Pro AI', '4 buổi Mentor 1-1/tháng', 'Chấm điểm chi tiết']
            }
        ];
    },

    // 4. Gamification
    getAchievements: async (): Promise<Achievement[]> => {
        return [
            { id: '1', title: 'First Steps', description: 'Hoàn thành bài học đầu tiên', icon: '🎯', unlocked: true, progress: 100 },
            { id: '2', title: 'On Fire', description: 'Duy trì chuỗi 7 ngày', icon: '🔥', unlocked: true, progress: 100 },
            { id: '3', title: 'Social Butterfly', description: 'Tham gia 5 buổi Mentor', icon: '🦋', unlocked: false, progress: 40 },
            { id: '4', title: 'Grammar Guru', description: 'Đạt điểm tuyệt đối ngữ pháp', icon: '📚', unlocked: false, progress: 20 },
        ];
    }
};
