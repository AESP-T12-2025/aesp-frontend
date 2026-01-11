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
    getAll: async () => {
        const res = await api.get('/notifications/');
        return res.data;
    },
    markRead: async (id: number) => {
        const res = await api.put(`/notifications/${id}/read`);
        return res.data;
    }
};
