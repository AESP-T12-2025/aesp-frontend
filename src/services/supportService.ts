import api from '@/lib/api';

export interface Ticket {
    ticket_id: number;
    user_id: number;
    title: string;
    description: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    created_at: string;
}

export const supportService = {
    getAll: async (status?: string) => {
        const res = await api.get('/support/', { params: { status } });
        return res.data;
    },
    getById: async (id: number) => {
        const res = await api.get(`/support/${id}`);
        return res.data;
    },
    create: async (data: { title: string, description: string, priority?: string }) => {
        const res = await api.post('/support/', data);
        return res.data;
    },
    update: async (id: number, data: { status?: string, priority?: string }) => {
        const res = await api.patch(`/support/${id}`, data);
        return res.data;
    }
};
