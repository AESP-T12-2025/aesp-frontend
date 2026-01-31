import api from '@/lib/api';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Category {
    category_id: number;
    name: string;
    description?: string;
}

export interface Topic {
    topic_id: number;
    category_id: number;
    name: string;
    description?: string;
    industry?: string;
    image_url?: string;
    created_at?: string;
}

export interface Scenario {
    scenario_id: number;
    topic_id: number;
    title: string;
    difficulty_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    dialog_content?: any;
    key_phrases?: any;
    created_at?: string;
}

export interface SpeakingSession {
    session_id: number;
    user_id: number;
    scenario_id: number;
    start_time: string;
    end_time?: string;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    audio_url?: string;
    transcription?: string;
    feedback?: any;
}

export interface TopicCreate {
    category_id: number;
    name: string;
    description?: string;
    industry?: string;
    image_url?: string;
}

export interface ScenarioCreate {
    topic_id: number;
    title: string;
    difficulty_level: string;
    dialog_content?: any;
    key_phrases?: any;
}

export interface SpeakingSessionCreate {
    scenario_id: number;
    start_time?: string;
}

// ============================================================================
// CONTENT SERVICE
// ============================================================================

export const contentService = {
    // ========================================================================
    // CATEGORIES
    // ========================================================================

    /**
     * List all categories
     * @param skip - Offset for pagination
     * @param limit - Limit results
     */
    getCategories: async (skip: number = 0, limit: number = 100): Promise<Category[]> => {
        const res = await api.get('/categories', {
            params: { skip, limit }
        });
        return res.data;
    },

    // ========================================================================
    // TOPICS MANAGEMENT
    // ========================================================================

    /**
     * List topics with optional filters
     * @param categoryId - Filter by category
     * @param industry - Filter by industry
     * @param skip - Offset for pagination
     * @param limit - Limit results
     */
    getTopics: async (
        categoryId?: number,
        industry?: string,
        skip: number = 0,
        limit: number = 100
    ): Promise<Topic[]> => {
        const res = await api.get('/topics', {
            params: {
                category_id: categoryId,
                industry,
                skip,
                limit
            }
        });
        return res.data;
    },

    /**
     * Get topic details by ID
     */
    getTopicById: async (id: number): Promise<Topic> => {
        const res = await api.get(`/topics/${id}`);
        return res.data;
    },

    /**
     * Create new topic (Admin only)
     */
    createTopic: async (topicData: TopicCreate): Promise<Topic> => {
        const res = await api.post('/topics', topicData);
        return res.data;
    },

    /**
     * Update topic (Admin only)
     */
    updateTopic: async (id: number, topicData: TopicCreate): Promise<Topic> => {
        const res = await api.put(`/topics/${id}`, topicData);
        return res.data;
    },

    /**
     * Delete topic (Admin only)
     */
    deleteTopic: async (id: number): Promise<{ message: string }> => {
        const res = await api.delete(`/topics/${id}`);
        return res.data;
    },

    // ========================================================================
    // SCENARIOS MANAGEMENT
    // ========================================================================

    /**
     * List scenarios with optional topic filter
     * @param topicId - Filter by topic
     * @param skip - Offset for pagination
     * @param limit - Limit results
     */
    getScenarios: async (
        topicId?: number,
        skip: number = 0,
        limit: number = 100
    ): Promise<Scenario[]> => {
        const res = await api.get('/scenarios', {
            params: {
                topic_id: topicId,
                skip,
                limit
            }
        });
        return res.data;
    },

    /**
     * Get scenario details by ID
     */
    getScenarioById: async (id: number): Promise<Scenario> => {
        const res = await api.get(`/scenarios/${id}`);
        return res.data;
    },

    /**
     * Get scenario vocabulary (key phrases)
     */
    getScenarioVocab: async (id: number): Promise<{ scenario_id: number; vocabulary: any }> => {
        const res = await api.get(`/scenarios/${id}/vocab`);
        return res.data;
    },

    /**
     * Create new scenario (Admin only)
     */
    createScenario: async (scenarioData: ScenarioCreate): Promise<Scenario> => {
        const res = await api.post('/scenarios', scenarioData);
        return res.data;
    },

    /**
     * Update scenario (Admin only)
     */
    updateScenario: async (id: number, scenarioData: ScenarioCreate): Promise<Scenario> => {
        const res = await api.put(`/scenarios/${id}`, scenarioData);
        return res.data;
    },

    /**
     * Delete scenario (Admin only)
     */
    deleteScenario: async (id: number): Promise<{ message: string }> => {
        const res = await api.delete(`/scenarios/${id}`);
        return res.data;
    },

    // ========================================================================
    // SPEAKING SESSIONS (Practice)
    // ========================================================================

    /**
     * Start a new speaking session
     * Session status will be IN_PROGRESS
     */
    startSession: async (sessionData: SpeakingSessionCreate): Promise<{ session_id: number }> => {
        const res = await api.post('/speaking-sessions', sessionData);
        return res.data;
    },

    /**
     * Complete a speaking session
     * Updates status to COMPLETED and sets end_time
     */
    completeSession: async (
        sessionId: number,
        data: {
            audio_url?: string;
            transcription?: string;
            feedback?: any;
        }
    ): Promise<SpeakingSession> => {
        const res = await api.put(`/speaking-sessions/${sessionId}/complete`, data);
        return res.data;
    },

    /**
     * Get session details
     */
    getSession: async (sessionId: number): Promise<SpeakingSession> => {
        const res = await api.get(`/speaking-sessions/${sessionId}`);
        return res.data;
    },

    /**
     * Get AI feedback for a session
     * Returns analysis and suggestions
     */
    getSessionFeedback: async (sessionId: number): Promise<any> => {
        const res = await api.get(`/speaking-sessions/${sessionId}/feedback`);
        return res.data;
    },

    /**
     * Delete a speaking session
     * Permanently removes session record
     */
    deleteSession: async (sessionId: number): Promise<{ message: string }> => {
        const res = await api.delete(`/speaking-sessions/${sessionId}`);
        return res.data;
    }
};
