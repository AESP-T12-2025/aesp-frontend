import api from '@/lib/api';

export const analyticsService = {
    getWeeklyStats: async (date?: string) => {
        const res = await api.get('/analytics/weekly', { params: { date } });
        return res.data;
    },
    getMonthlyStats: async (date?: string) => {
        const res = await api.get('/analytics/monthly', { params: { date } });
        return res.data;
    }
};
