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

export interface User {
    user_id: number;
    email: string;
    full_name: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

export interface Mentor {
    mentor_id: number;
    user_id: number;
    full_name: string;
    skills?: string[];
    verification_status: string;
    bio?: string;
}

export interface Transaction {
    id: number;
    user_id: number;
    user_email?: string;
    user_name?: string;
    package_id?: number;
    package_name?: string;
    amount: number;
    status: string;
    created_at: string | null;
}

export const adminService = {
    // ========================================================================
    // DASHBOARD STATS
    // ========================================================================

    getStats: async (): Promise<AdminStats> => {
        const res = await api.get('/admin/stats');
        return res.data;
    },

    getDashboardStats: async (): Promise<AdminStats> => {
        const res = await api.get('/admin/dashboard/stats');
        return res.data;
    },

    // ========================================================================
    // USER STATS & MANAGEMENT
    // ========================================================================

    getUserStats: async (startDate?: string, endDate?: string) => {
        const params: any = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        const res = await api.get('/admin/stats/users', { params });
        return res.data;
    },

    getUsersByRole: async () => {
        const res = await api.get('/admin/stats/users/by-role');
        return res.data;
    },

    getActiveUsers: async () => {
        const res = await api.get('/admin/stats/users/active');
        return res.data;
    },

    updateUserStatus: async (userId: number, isActive: boolean) => {
        const res = await api.put(`/admin/users/${userId}/status`, null, {
            params: { is_active: isActive }
        });
        return res.data;
    },

    toggleUserStatus: async (userId: number) => {
        const res = await api.put(`/admin/users/${userId}/toggle-status`);
        return res.data;
    },

    changeUserRole: async (userId: number, newRole: string) => {
        const res = await api.put(`/admin/users/${userId}/role`, null, {
            params: { new_role: newRole }
        });
        return res.data;
    },

    // ========================================================================
    // SUBSCRIPTION STATS
    // ========================================================================

    getSubscriptionStats: async () => {
        const res = await api.get('/admin/stats/subscriptions');
        return res.data;
    },

    // ========================================================================
    // REVENUE STATS
    // ========================================================================

    getRevenueStats: async () => {
        const res = await api.get('/admin/stats/revenue');
        return res.data;
    },

    // ========================================================================
    // CONTENT STATS
    // ========================================================================

    getPopularContent: async (limit: number = 10) => {
        const res = await api.get('/admin/stats/content/popular', {
            params: { limit }
        });
        return res.data;
    },

    getScenarioCompletionRates: async () => {
        const res = await api.get('/admin/stats/scenarios/completion');
        return res.data;
    },

    // ========================================================================
    // MONTHLY STATS
    // ========================================================================

    getMonthlyStats: async () => {
        const res = await api.get('/admin/stats/monthly');
        return res.data;
    },

    // ========================================================================
    // MENTOR MANAGEMENT
    // ========================================================================

    listMentors: async (status?: string, skip: number = 0, limit: number = 50): Promise<Mentor[]> => {
        const params: any = { skip, limit };
        if (status) params.status = status;

        const res = await api.get('/admin/mentors', { params });
        return res.data;
    },

    getMentorDetails: async (mentorId: number) => {
        const res = await api.get(`/admin/mentors/${mentorId}`);
        return res.data;
    },

    verifyMentor: async (mentorId: number) => {
        const res = await api.put(`/admin/mentors/${mentorId}/verify`);
        return res.data;
    },

    unverifyMentor: async (mentorId: number) => {
        const res = await api.put(`/admin/mentors/${mentorId}/unverify`);
        return res.data;
    },

    // ========================================================================
    // PACKAGE MANAGEMENT
    // ========================================================================

    createPackage: async (data: {
        name: string;
        price: number;
        duration_days: number;
        features: string[];
    }) => {
        const res = await api.post('/admin/packages', null, {
            params: data
        });
        return res.data;
    },

    updatePackage: async (packageId: number, data: {
        price?: number;
        is_active?: boolean;
    }) => {
        const res = await api.put(`/admin/packages/${packageId}`, null, {
            params: data
        });
        return res.data;
    },

    // ========================================================================
    // SUPPORT TICKETS
    // ========================================================================

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

    // ========================================================================
    // POLICIES
    // ========================================================================

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

    // ========================================================================
    // MODERATION
    // ========================================================================

    getAllPosts: async () => {
        const res = await api.get('/social/posts');
        return res.data;
    },

    deletePost: async (postId: number) => {
        const res = await api.delete(`/social/posts/${postId}`);
        return res.data;
    },

    getPosts: async (status?: string) => {
        const res = await api.get(`/social/admin/posts${status ? `?status=${status}` : ''}`);
        return res.data;
    },

    moderatePost: async (postId: number, status: string) => {
        const res = await api.put(`/social/admin/posts/${postId}/moderate?new_status=${status}`, {});
        return res.data;
    },

    deleteComment: async (commentId: number) => {
        const res = await api.delete(`/social/admin/comments/${commentId}`);
        return res.data;
    },

    // ========================================================================
    // PURCHASES & TRANSACTIONS
    // ========================================================================

    getAllTransactions: async (skip: number = 0, limit: number = 50) => {
        const res = await api.get('/admin/transactions', {
            params: { skip, limit }
        });
        return res.data;
    },

    getPurchases: async (params?: {
        start_date?: string;
        end_date?: string;
        package_id?: number;
        skip?: number;
        limit?: number;
    }): Promise<Transaction[]> => {
        const res = await api.get('/admin/purchases', { params });
        return res.data;
    },

    // ========================================================================
    // EXPORT FUNCTIONALITY
    // ========================================================================

    exportPurchases: async (format: 'csv' | 'json' | 'xlsx' | 'excel' = 'xlsx', startDate?: string, endDate?: string) => {
        const params: any = { format };
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        const res = await api.get('/admin/purchases/export', {
            params,
            responseType: format === 'json' ? 'json' : 'blob'
        });
        return res.data;
    },

    exportAnalytics: async (format: string = 'excel', startDate?: string, endDate?: string) => {
        const params: any = { format };
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        const res = await api.get('/admin/analytics/export', {
            params,
            responseType: 'blob'
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

