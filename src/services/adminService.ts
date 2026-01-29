import api from '@/lib/api';

export interface SupportTicket {
    ticket_id: number;
    user_id: number;
    title: string;
    description: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    created_at: string;
}

export interface Policy {
    id: number;
    title: string;
    content: string;
    type: string;
    last_updated: string;
}

export interface AdminStats {
    users: { total: number; learners: number; mentors: number; new_7d: number };
    revenue: { total: number; last_7d: number };
    subscriptions: { active: number };
    content: { topics: number; scenarios: number; sessions_total: number; sessions_7d: number };
    mentors: { verified: number; total_bookings: number };
    social: { posts: number; comments: number };
}

export const adminService = {
    // Dashboard Stats
    getStats: async (): Promise<AdminStats> => {
        const res = await api.get('/admin/stats');
        return res.data;
    },

    // Support Tickets - Issue #33 (FIXED URLs)
    getAllTickets: async (status?: string, priority?: string): Promise<SupportTicket[]> => {
        const res = await api.get('/admin/support/tickets', {
            params: { status, priority }
        });
        return res.data;
    },

    getTicketById: async (ticketId: number): Promise<SupportTicket> => {
        const res = await api.get(`/admin/support/tickets/${ticketId}`);
        return res.data;
    },

    updateTicket: async (ticketId: number, data: { status?: string; priority?: string }) => {
        const res = await api.patch(`/admin/support/tickets/${ticketId}`, data);
        return res.data;
    },

    // Policies
    getAllPolicies: async (): Promise<Policy[]> => {
        const res = await api.get('/policies/');
        return res.data;
    },

    createPolicy: async (data: { title: string; content: string; type: string }) => {
        const res = await api.post('/policies/', data);
        return res.data;
    },

    updatePolicy: async (id: number, data: { title?: string; content?: string; type?: string }) => {
        const res = await api.put(`/policies/${id}`, data);
        return res.data;
    },

    deletePolicy: async (id: number) => {
        const res = await api.delete(`/policies/${id}`);
        return res.data;
    },

    // Moderation
    getAllPosts: async () => {
        const res = await api.get('/social/posts');
        return res.data;
    },

    deletePost: async (postId: number) => {
        const res = await api.delete(`/social/posts/${postId}`);
        return res.data;
    },

    getPosts: async (status?: string) => {
        const res = await api.get(`/admin/posts${status ? `?status=${status}` : ''}`);
        return res.data;
    },

    moderatePost: async (postId: number, status: string) => {
        const res = await api.put(`/admin/posts/${postId}/moderate?status=${status}`, {});
        return res.data;
    },

    // Transactions
    getAllTransactions: async () => {
        const res = await api.get('/admin/transactions');
        return res.data;
    }
};
