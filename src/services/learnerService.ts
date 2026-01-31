import api from '@/lib/api';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface LearnerProgress {
    total_sessions: number;
    total_speaking_time_minutes: number;
    average_score: number;
    current_level: string;
    xp_earned: number;
    streak_days: number;
}

export interface ActivityHeatmap {
    date: string;
    count: number;
}

export interface SpeakingTimeMetrics {
    total_minutes: number;
    weekly_minutes: number;
    daily_goal: number;
    duration: string;
}

export interface CompletedScenarios {
    completed: number;
    total: number;
    completion_rate: number;
}

export interface StreakData {
    current_streak: number;
    longest_streak: number;
    days: number;
}

export interface WeeklySummary {
    week_start: string;
    week_end: string;
    sessions_completed: number;
    total_practice_time_minutes: number;
    average_score: number;
    daily_goal_completion_rate: number;
}

export interface WeeklyGoals {
    daily_goal_minutes: number;
    weekly_goal_minutes: number;
    weekly_achieved_minutes: number;
    completion_percentage: number;
    on_track: boolean;
}

export interface ImprovementTrends {
    trend_data: Array<{
        week: number;
        average_score: number;
        sessions: number;
    }>;
    overall_improvement: string;
}

export interface PronunciationProgress {
    recent_scores: Array<{
        date: string;
        score: number;
    }>;
    average_pronunciation: number;
    trend: string;
}

export interface Report {
    id: string;
    type: 'weekly' | 'monthly';
    period_start: string;
    period_end: string;
    generated_at: string;
}

export interface WeeklyReport {
    period: {
        start: string;
        end: string;
        type: string;
    };
    metrics: {
        sessions_completed: number;
        total_practice_time_minutes: number;
        average_score: number;
        vocabulary_learned: number;
        scenarios_completed: number;
    };
    highlights: any[];
    areas_for_improvement: any[];
}

export interface MonthlyReport {
    period: {
        start: string;
        end: string;
        type: string;
    };
    summary: {
        total_sessions: number;
        total_practice_hours: number;
        average_daily_time_minutes: number;
        best_day: string | null;
        improvement_rate: number;
    };
    metrics: {
        average_score: number;
        vocabulary_mastered: number;
        scenarios_completed: number;
    };
    monthly_goal_completion: number;
}

export interface Purchase {
    id: number;
    amount: number;
    status: string;
    package_name: string | null;
    created_at: string | null;
}

export interface ReportSettings {
    weekly_email?: boolean;
    monthly_email?: boolean;
}

// ============================================================================
// LEARNER SERVICE
// ============================================================================

export const learnerService = {
    // ========================================================================
    // PROGRESS & ANALYTICS
    // ========================================================================

    /**
     * Get overall learner progress summary
     */
    getProgress: async (): Promise<LearnerProgress> => {
        const res = await api.get('/learner/progress');
        return res.data;
    },

    /**
     * Get GitHub-style activity heatmap data
     */
    getActivityHeatmap: async (startDate?: string, endDate?: string): Promise<ActivityHeatmap[]> => {
        const params: any = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        const res = await api.get('/learner/heatmap', { params });
        return res.data;
    },

    /**
     * Get speaking time metrics
     */
    getSpeakingTimeMetrics: async (): Promise<SpeakingTimeMetrics> => {
        const res = await api.get('/learner/metrics/speaking-time');
        return res.data;
    },

    /**
     * Get completed scenarios count
     */
    getCompletedScenarios: async (): Promise<CompletedScenarios> => {
        const res = await api.get('/learner/metrics/scenarios');
        return res.data;
    },

    /**
     * Get current learning streak
     */
    getStreak: async (): Promise<StreakData> => {
        const res = await api.get('/learner/metrics/streak');
        return res.data;
    },

    /**
     * Get weekly progress summary
     */
    getWeeklySummary: async (): Promise<WeeklySummary> => {
        const res = await api.get('/learner/progress/weekly');
        return res.data;
    },

    /**
     * Get weekly goals and completion status
     */
    getWeeklyGoals: async (): Promise<WeeklyGoals> => {
        const res = await api.get('/learner/goals/weekly');
        return res.data;
    },

    /**
     * Get improvement trends over time
     */
    getImprovementTrends: async (): Promise<ImprovementTrends> => {
        const res = await api.get('/learner/analytics/trends');
        return res.data;
    },

    /**
     * Get pronunciation improvement over time
     */
    getPronunciationProgress: async (): Promise<PronunciationProgress> => {
        const res = await api.get('/learner/analytics/pronunciation');
        return res.data;
    },

    // ========================================================================
    // REPORTS
    // ========================================================================

    /**
     * List all available reports for the learner
     */
    listReports: async (type?: 'weekly' | 'monthly'): Promise<Report[]> => {
        const params = type ? { type } : {};
        const res = await api.get('/learner/reports', { params });
        return res.data;
    },

    /**
     * Get weekly progress report
     */
    getWeeklyReport: async (week?: number, year?: number): Promise<WeeklyReport> => {
        const params: any = {};
        if (week) params.week = week;
        if (year) params.year = year;

        const res = await api.get('/learner/reports/weekly', { params });
        return res.data;
    },

    /**
     * Export weekly report as PDF
     */
    exportWeeklyReport: async (format: 'pdf' | 'csv' = 'pdf'): Promise<any> => {
        const res = await api.get('/learner/reports/weekly/export', {
            params: { format },
            responseType: 'blob'
        });
        return res.data;
    },

    /**
     * Get monthly progress report
     */
    getMonthlyReport: async (month?: number, year?: number): Promise<MonthlyReport> => {
        const params: any = {};
        if (month) params.month = month;
        if (year) params.year = year;

        const res = await api.get('/learner/reports/monthly', { params });
        return res.data;
    },

    /**
     * Export monthly report as PDF
     */
    exportMonthlyReport: async (format: 'pdf' | 'csv' = 'pdf'): Promise<any> => {
        const res = await api.get('/learner/reports/monthly/export', {
            params: { format },
            responseType: 'blob'
        });
        return res.data;
    },

    /**
     * Update report notification settings
     */
    updateReportSettings: async (settings: ReportSettings): Promise<{ message: string; settings: ReportSettings }> => {
        const res = await api.put('/learner/settings/reports', settings);
        return res.data;
    },

    // ========================================================================
    // PURCHASES
    // ========================================================================

    /**
     * Get learner's purchase history
     */
    getMyPurchases: async (): Promise<Purchase[]> => {
        const res = await api.get('/learner/purchases');
        return res.data;
    },

    // ========================================================================
    // HELPER FUNCTIONS
    // ========================================================================

    /**
     * Download report blob as file
     */
    downloadReport: (blob: Blob, filename: string) => {
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
