import api from '@/lib/api';

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'alert' | 'success' | 'warning';
    created_at: string;
    is_read: boolean;
}

export const notificationService = {
    getAll: async (): Promise<Notification[]> => {
        const res = await api.get('/notifications/');
        return res.data;
    },

    getUnreadCount: async (): Promise<{ count: number }> => {
        const res = await api.get('/notifications/unread-count');
        return res.data;
    },

    markRead: async (id: number) => {
        const res = await api.post(`/notifications/${id}/read`);
        return res.data;
    },

    markAllAsRead: async () => {
        const res = await api.post('/notifications/mark-all-read');
        return res.data;
    },

    deleteNotification: async (id: number) => {
        const res = await api.delete(`/notifications/${id}`);
        return res.data;
    },

    // Notification preferences
    getPreferences: async () => {
        const res = await api.get('/notifications/preferences');
        return res.data;
    },

    updatePreferences: async (prefs: { email_notifications?: boolean; push_notifications?: boolean }) => {
        const res = await api.put('/notifications/preferences', prefs);
        return res.data;
    }
};
