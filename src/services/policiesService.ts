import api from '@/lib/api';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Policy {
    id: number;
    title: string;
    content: string;
    type: string;
    created_at: string | null;
    updated_at: string | null;
}

export interface PolicyCreate {
    title: string;
    content: string;
    type: string;
}

// ============================================================================
// POLICIES SERVICE
// ============================================================================

export const policiesService = {
    /**
     * Get all policies
     * Returns list of all system policies
     */
    getAllPolicies: async (): Promise<Policy[]> => {
        const res = await api.get('/policies/');
        return res.data;
    },

    /**
     * Get specific policy by ID
     */
    getPolicyById: async (id: number): Promise<Policy> => {
        const res = await api.get(`/policies/${id}`);
        return res.data;
    },

    /**
     * Get policies by type
     * Filter policies by type (e.g., 'privacy', 'terms', 'community')
     */
    getPoliciesByType: async (type: string): Promise<Policy[]> => {
        const res = await api.get(`/policies/by-type/${type}`);
        return res.data;
    },

    /**
     * Create new policy (Admin only)
     */
    createPolicy: async (data: PolicyCreate): Promise<Policy> => {
        const res = await api.post('/policies/', data);
        return res.data;
    },

    /**
     * Update policy (Admin only)
     */
    updatePolicy: async (id: number, data: Partial<PolicyCreate>): Promise<Policy> => {
        const res = await api.put(`/policies/${id}`, data);
        return res.data;
    },

    /**
     * Delete policy (Admin only)
     */
    deletePolicy: async (id: number): Promise<{ message: string }> => {
        const res = await api.delete(`/policies/${id}`);
        return res.data;
    }
};
