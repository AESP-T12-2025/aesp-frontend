import api from '@/lib/api';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PeerSession {
    session_id: number;
    status: 'WAITING' | 'MATCHED' | 'COMPLETED';
    level?: string;
    partner?: {
        id: number;
        full_name: string;
        avatar_url?: string;
        role?: string;
    };
}

export interface MatchResponse {
    session_id: number;
    status: 'WAITING' | 'MATCHED';
    partner?: {
        id: number;
        full_name: string;
        avatar_url?: string;
    };
}

// ============================================================================
// PEER PRACTICE SERVICE
// ============================================================================

export const peerService = {
    /**
     * Find a peer practice partner
     * Matches learners by proficiency level
     * Returns MATCHED if partner found, WAITING if still searching
     */
    findPartner: async (): Promise<MatchResponse> => {
        const res = await api.post('/peer/find-partner');
        return res.data;
    },

    /**
     * Join queue for peer matching
     * Alias for findPartner - kept for compatibility
     */
    joinQueue: async (topicId?: number): Promise<MatchResponse> => {
        const res = await api.post('/peer/find-partner', { topic_id: topicId });
        return res.data;
    },

    /**
     * Get peer session details
     * Includes session status and partner information
     */
    getSession: async (sessionId: number): Promise<PeerSession> => {
        const res = await api.get(`/peer/sessions/${sessionId}`);
        return res.data;
    },

    /**
     * End a peer practice session
     * Sets status to COMPLETED
     */
    endSession: async (sessionId: number): Promise<{ message: string }> => {
        const res = await api.post(`/peer/sessions/${sessionId}/end`);
        return res.data;
    }
};
