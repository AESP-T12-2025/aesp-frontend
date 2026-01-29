import api from '@/lib/api';

export interface AdvancedAnalytics {
    timeOfDay: {
        distribution: number[];
        peakHours: { hour: number; sessions: number }[];
        preference: 'morning' | 'afternoon' | 'evening' | 'night';
    };
    retention: {
        thisWeek: number;
        lastWeek: number;
        ratePercent: number;
        trend: 'improving' | 'declining' | 'stable';
    };
    weeklyTrend: { week: string; sessions: number; minutes: number }[];
}

export interface DailyStats {
    date: string;
    speakingMinutes: number;
    wordsLearned: number;
    sessionsCount: number;
    scores: {
        grammar: number;
        pronunciation: number;
        fluency: number;
    };
}

export interface SystemStats {
    users: {
        total: number;
        active7d: number;
    };
    sessions: {
        last7d: number;
        last30d: number;
        avgDurationMinutes: number;
    };
}

export const analyticsService = {
    getWeeklyStats: async (date?: string) => {
        const res = await api.get('/analytics/weekly', { params: { date } });
        return res.data;
    },

    getMonthlyStats: async (date?: string) => {
        const res = await api.get('/analytics/monthly', { params: { date } });
        return res.data;
    },

    // Issue #40: Advanced Analytics
    getAdvancedAnalytics: async (): Promise<AdvancedAnalytics> => {
        const res = await api.get('/analytics/advanced');
        return res.data;
    },

    getDailyStats: async (date?: string): Promise<DailyStats> => {
        const res = await api.get('/analytics/daily-stats', { params: { date } });
        return res.data;
    },

    // Admin only
    getSystemStats: async (): Promise<SystemStats> => {
        const res = await api.get('/analytics/system-stats');
        return res.data;
    }
};
