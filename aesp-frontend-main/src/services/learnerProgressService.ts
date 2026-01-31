import api from '@/lib/api';

// === Interfaces ===

export interface ProgressSummary {
    total_sessions: number;
    total_speaking_time_seconds: number;
    total_words_learned: number;
    current_level: string;
    streak: number;
}

export interface HeatmapDay {
    date: string;
    level: number;
    sessions: number;
}

export interface SpeakingMetrics {
    daily_average_seconds: number;
    weekly_total_seconds: number;
    monthly_total_seconds: number;
}

export interface WeeklySummary {
    sessions_this_week: number;
    speaking_time_seconds: number;
    words_learned: number;
    improvement_percent: number;
}

export interface WeeklyGoals {
    speaking_goal_minutes: number;
    speaking_actual_minutes: number;
    sessions_goal: number;
    sessions_actual: number;
    words_goal: number;
    words_actual: number;
}

export interface ImprovementTrend {
    date: string;
    grammar_score: number;
    pronunciation_score: number;
    fluency_score: number;
}

export interface Report {
    id: number;
    type: 'weekly' | 'monthly';
    period: string;
    generated_at: string;
    summary: {
        total_hours: number;
        scenarios_completed: number;
        avg_score: number;
        streak: number;
        xp_earned: number;
    };
}

export interface Purchase {
    id: number;
    package_name: string;
    amount: number;
    status: string;
    created_at: string;
    expires_at?: string;
}

export const learnerProgressService = {
    // === Issue #35: Progress Analytics & Heat Maps ===

    getProgress: async (): Promise<ProgressSummary> => {
        const res = await api.get('/learner/progress');
        return res.data;
    },

    getActivityHeatmap: async (startDate?: string, endDate?: string): Promise<HeatmapDay[]> => {
        const res = await api.get('/learner/heatmap', {
            params: { start_date: startDate, end_date: endDate }
        });
        return res.data;
    },

    getSpeakingTimeMetrics: async (): Promise<SpeakingMetrics> => {
        const res = await api.get('/learner/speaking-time');
        return res.data;
    },

    getCompletedScenarios: async (): Promise<{ count: number }> => {
        const res = await api.get('/learner/completed-scenarios');
        return res.data;
    },

    getStreak: async (): Promise<{ streak: number }> => {
        const res = await api.get('/learner/streak');
        return res.data;
    },

    getWeeklySummary: async (): Promise<WeeklySummary> => {
        const res = await api.get('/learner/weekly-summary');
        return res.data;
    },

    getWeeklyGoals: async (): Promise<WeeklyGoals> => {
        const res = await api.get('/learner/weekly-goals');
        return res.data;
    },

    getImprovementTrends: async (): Promise<ImprovementTrend[]> => {
        const res = await api.get('/learner/improvement-trends');
        return res.data;
    },

    getPronunciationProgress: async (): Promise<{ dates: string[]; scores: number[] }> => {
        const res = await api.get('/learner/pronunciation-progress');
        return res.data;
    },

    // === Issue #39: Weekly/Monthly Reports ===

    listReports: async (type?: 'weekly' | 'monthly'): Promise<Report[]> => {
        const res = await api.get('/learner/reports', {
            params: { type }
        });
        return res.data;
    },

    getWeeklyReport: async (week?: number, year?: number) => {
        const res = await api.get('/learner/reports/weekly', {
            params: { week, year }
        });
        return res.data;
    },

    getMonthlyReport: async (month?: number, year?: number) => {
        const res = await api.get('/learner/reports/monthly', {
            params: { month, year }
        });
        return res.data;
    },

    exportWeeklyReport: async (format: 'pdf' | 'json' = 'pdf') => {
        const res = await api.get('/learner/reports/weekly/export', {
            params: { format },
            responseType: format === 'pdf' ? 'blob' : 'json'
        });
        return res.data;
    },

    exportMonthlyReport: async (format: 'pdf' | 'json' = 'pdf') => {
        const res = await api.get('/learner/reports/monthly/export', {
            params: { format },
            responseType: format === 'pdf' ? 'blob' : 'json'
        });
        return res.data;
    },

    updateReportSettings: async (settings: { weekly_email?: boolean; monthly_email?: boolean }) => {
        const res = await api.patch('/learner/report-settings', settings);
        return res.data;
    },

    // === Issue #38: Purchase History ===

    getPurchases: async (): Promise<Purchase[]> => {
        const res = await api.get('/learner/purchases');
        return res.data;
    }
};
