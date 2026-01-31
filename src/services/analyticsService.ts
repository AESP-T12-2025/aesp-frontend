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

export interface LearningHeatmap {
    days: number;
    data: Array<{
        date: string;
        count: number;
        level: number;
    }>;
    total_sessions: number;
}

export interface SkillsRadar {
    grammar: number;
    fluency: number;
    pronunciation: number;
    overall: number;
}

export interface PronunciationTrends {
    recent_scores: Array<{
        date: string;
        score: number;
    }>;
    average_pronunciation: number;
    trend: string;
}

export interface TopicPerformance {
    topic_id: number;
    title: string;
    sessions: number;
    avg_score: number;
    completion_rate: number;
}

export const analyticsService = {
    // ========================================================================
    // BASIC ANALYTICS
    // ========================================================================

    getWeeklyStats: async (date?: string) => {
        const res = await api.get('/analytics/weekly', { params: { date } });
        return res.data;
    },

    getMonthlyStats: async (date?: string) => {
        const res = await api.get('/analytics/monthly', { params: { date } });
        return res.data;
    },

    // ========================================================================
    // ADVANCED ANALYTICS (Issue #40)
    // ========================================================================

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
    },

    // ========================================================================
    // LEARNER ANALYTICS (Issue #35)
    // ========================================================================

    getLearningHeatmap: async (days: number = 365): Promise<LearningHeatmap> => {
        const res = await api.get('/analytics/learner/heatmap', {
            params: { days }
        });
        return res.data;
    },

    getSkillsRadar: async (): Promise<SkillsRadar> => {
        const res = await api.get('/analytics/learner/skills-radar');
        return res.data;
    },

    // ========================================================================
    // NEW: MISSING ENDPOINTS
    // ========================================================================

    /**
     * Get pronunciation improvement trends over time
     */
    getPronunciationTrends: async (): Promise<PronunciationTrends> => {
        const res = await api.get('/analytics/pronunciation-trends');
        return res.data;
    },

    /**
     * Get performance breakdown by topic
     */
    getTopicPerformance: async (): Promise<TopicPerformance[]> => {
        const res = await api.get('/analytics/topic-performance');
        return res.data;
    },

    /**
     * Get peer practice statistics
     */
    getPeerPracticeStats: async () => {
        const res = await api.get('/analytics/peer-practice-stats');
        return res.data;
    },

    /**
     * Get mentor session analytics
     */
    getMentorSessionStats: async () => {
        const res = await api.get('/analytics/mentor-session-stats');
        return res.data;
    },

    /**
     * Get vocabulary growth over time
     */
    getVocabularyGrowth: async () => {
        const res = await api.get('/analytics/vocabulary-growth');
        return res.data;
    },

    /**
     * Get fluency measurements and trends
     */
    getFluencyMetrics: async () => {
        const res = await api.get('/analytics/fluency-metrics');
        return res.data;
    },

    /**
     * Get challenge completion rates
     */
    getChallengesCompletion: async () => {
        const res = await api.get('/analytics/challenges-completion');
        return res.data;
    },

    /**
     * Export analytics data
     */
    exportAnalytics: async (format: 'csv' | 'json' | 'xlsx' = 'xlsx', startDate?: string, endDate?: string) => {
        const params: any = { format };
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        const res = await api.get('/analytics/export', {
            params,
            responseType: format === 'json' ? 'json' : 'blob'
        });
        return res.data;
    },

    /**
     * Get user activity heatmap by user ID (admin only)
     */
    getUserHeatmap: async (userId: number) => {
        const res = await api.get(`/analytics/heatmap/${userId}`);
        return res.data;
    },

    /**
     * Generate custom analytics report
     */
    generateCustomReport: async (reportConfig: {
        metrics: string[];
        start_date?: string;
        end_date?: string;
        group_by?: 'day' | 'week' | 'month';
    }) => {
        const res = await api.post('/analytics/custom-report', reportConfig);
        return res.data;
    },

    // ========================================================================
    // REPORTS (Issue #39)
    // ========================================================================

    /**
     * Generate learner report
     */
    generateLearnerReport: async (period: 'weekly' | 'monthly' = 'weekly') => {
        const res = await api.get('/analytics/reports/generate', {
            params: { period }
        });
        return res.data;
    },

    /**
     * Request report via email
     */
    requestReportEmail: async (period: 'weekly' | 'monthly' = 'weekly') => {
        const res = await api.post('/analytics/reports/send-email', null, {
            params: { period }
        });
        return res.data;
    },

    // ========================================================================
    // HELPER FUNCTIONS
    // ========================================================================

    downloadFile: (blob: Blob, filename: string) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
};

