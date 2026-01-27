/**
 * Shared TypeScript interfaces for AESP Frontend
 * Use these instead of 'any' types
 */

// ========== USER & AUTH ==========
export interface User {
    user_id: number;
    email: string;
    full_name: string;
    role: 'ADMIN' | 'LEARNER' | 'MENTOR';
    is_active: boolean;
    google_id?: string;
    created_at?: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

// ========== LEARNER DASHBOARD ==========
export interface LearnerDashboardStats {
    xp: number;
    level: number;
    rank: number;
    streak: number;
    total_xp: number;
    weekly_xp: number;
}

export interface LearningPath {
    current_level: string;
    target_level: string;
    roadmap: string[];
}

// ========== CONTENT ==========
export interface Topic {
    topic_id: number;
    name: string;
    description?: string;
    image_url?: string;
    category_id: number;
    industry?: string;
}

export interface Scenario {
    scenario_id: number;
    title: string;
    description?: string;
    difficulty_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    topic_id: number;
    context?: string;
    suggested_phrases?: string[];
    key_phrases?: Record<string, string>;
}

export interface Category {
    category_id: number;
    name: string;
    description?: string;
}

// ========== SPEAKING & PRACTICE ==========
export interface SpeakingSession {
    session_id: number;
    user_id: number;
    scenario_id: number;
    start_time: string;
    end_time?: string;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface AIFeedback {
    grammar_score: number;
    pronunciation_score: number;
    fluency_score: number;
    better_version: string;
    detailed_feedback?: string;
    phonetic_analysis?: {
        mispronounced_words: Array<{
            word: string;
            expected: string;
            suggestion: string;
        }>;
    };
}

// ========== ASSESSMENT ==========
export interface AssessmentQuestion {
    id: number;
    type: 'grammar' | 'vocabulary' | 'pronunciation';
    text: string;
    options?: string[];
}

export interface AssessmentAnswers {
    [questionId: string]: string;
}

export interface AssessmentResult {
    level: string;
    score: number;
    message: string;
    feedback?: string;
}

// ========== GAMIFICATION ==========
export interface Challenge {
    challenge_id: number;
    title: string;
    description: string;
    challenge_type: 'DAILY' | 'WEEKLY' | 'SPECIAL';
    xp_reward: number;
    target_value: number;
}

export interface UserChallenge {
    challenge_id: number;
    current_progress: number;
    is_completed: boolean;
    claimed_reward: boolean;
}

export interface LeaderboardEntry {
    user_id: number;
    full_name: string;
    words_learned: number;
    rank?: number;
}

export interface Achievement {
    achievement_id: number;
    title: string;
    description: string;
    icon_url?: string;
    earned_at?: string;
}

// ========== REPORTS & ANALYTICS ==========
export interface WeeklyStats {
    xp_earned: number;
    study_time_minutes: number;
    scenarios_completed: number;
    average_score: number;
    streak: number;
    daily_activity: DailyActivity[];
    feedback?: string[];
    heatMap?: HeatMapDay[];
}

export interface DailyActivity {
    date: string;
    xp: number;
    minutes: number;
}

export interface HeatMapDay {
    date: string;
    level: number; // 0-4 intensity
}

// ========== MENTOR ==========
export interface MentorProfile {
    mentor_id: number;
    user_id: number;
    full_name: string;
    skills?: string;
    bio?: string;
    is_verified: boolean;
    average_rating?: number;
    total_sessions?: number;
}

export interface Booking {
    booking_id: number;
    mentorId: number;
    learnerId: number;
    slot_id?: number;
    scheduled_time: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

export interface MentorReview {
    review_id: number;
    booking_id: number;
    mentor_id: number;
    learner_id: number;
    grammar_score: number;
    pronunciation_score: number;
    fluency_score: number;
    feedback?: string;
    created_at: string;
}

export interface VocabSuggestion {
    suggestion_id: number;
    mentor_id: number;
    topic_id?: number;
    word: string;
    meaning: string;
    example?: string;
}

// ========== COMMUNITY ==========
export interface MentorPost {
    post_id: number;
    mentor_id: number;
    mentor_name?: string;
    title: string;
    content: string;
    like_count: number;
    comment_count?: number;
    created_at: string;
    is_hidden?: boolean;
}

export interface Comment {
    comment_id: number;
    post_id: number;
    user_id: number;
    user_name?: string;
    content: string;
    created_at: string;
}

// ========== PAYMENT & SUBSCRIPTION ==========
export interface ServicePackage {
    package_id: number;
    name: string;
    description?: string;
    price: number;
    duration_days: number;
    features?: string[];
    is_active: boolean;
}

export interface UserSubscription {
    subscription_id: number;
    user_id: number;
    package_id: number;
    package_name?: string;
    start_date: string;
    end_date: string;
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}

export interface Transaction {
    transaction_id: number;
    user_id: number;
    package_id: number;
    amount: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    created_at: string;
}

// ========== SUPPORT ==========
export interface SupportTicket {
    ticket_id: number;
    user_id: number;
    subject: string;
    message: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    created_at: string;
    updated_at?: string;
}

// ========== NOTIFICATIONS ==========
export interface Notification {
    notification_id: number;
    user_id: number;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

// ========== ADMIN ==========
export interface AdminDashboardStats {
    total_users: number;
    active_learners: number;
    total_mentors: number;
    verified_mentors: number;
    total_revenue: number;
    monthly_revenue: number;
    total_topics: number;
    total_scenarios: number;
    total_sessions: number;
    active_subscriptions: number;
    open_tickets: number;
    pending_posts: number;
}

// ========== API RESPONSES ==========
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}
