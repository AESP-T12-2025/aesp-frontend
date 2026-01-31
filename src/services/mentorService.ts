import api from '@/lib/api';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Resource {
    resource_id?: number;
    title: string;
    description?: string;
    file_url: string;
    resource_type: 'DOCUMENT' | 'VIDEO' | 'LINK' | 'AUDIO' | 'document' | 'video' | 'link';
    is_public?: boolean;
    file_size?: number;
    created_at?: string;
}

export interface Session {
    session_id?: number;
    booking_id: number;
    learner_id: number;
    mentor_id?: number;
    start_time: string;
    end_time?: string;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    notes?: string;
}

export interface Assessment {
    assessment_id?: number;
    session_id?: number;
    booking_id?: number;
    pronunciation_score?: number;
    grammar_score?: number;
    fluency_score?: number;
    vocabulary_score?: number;
    overall_score?: number;
    score?: number;
    feedback: string;
    strengths?: string;
    areas_for_improvement?: string;
    level_assigned?: string;
}

export interface MentorProfile {
    mentor_id?: number;
    full_name: string;
    bio: string;
    skills: string;
    verification_status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface AvailabilitySlotInput {
    day: string;
    start_time: string;
    end_time: string;
}

export interface AvailabilitySlot {
    slot_id: number;
    mentor_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
}

export interface Booking {
    booking_id: number;
    mentor_id: number;
    learner_id: number;
    date: string;
    time: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    mentor_name?: string;
    learner_name?: string;
}

export interface ReviewSubmit {
    mentor_id: number;
    booking_id: number;
    rating: number;
    comment?: string;
}

export interface VocabSuggestionCreate {
    topic_id?: number;
    vocabulary: string;
    collocations?: string;
    idioms?: string;
    tips?: string;
}

// ============================================================================
// MENTOR SERVICE
// ============================================================================

export const mentorService = {
    // ========================================================================
    // MENTOR PROFILE & LIST
    // ========================================================================

    /**
     * Get all mentors (public list)
     */
    getAllMentors: async () => {
        const res = await api.get('/mentors');
        return res.data;
    },

    /**
     * Create or update mentor profile
     */
    createOrUpdateProfile: async (data: MentorProfile) => {
        const res = await api.post('/mentors/profile', data);
        return res.data;
    },

    // ========================================================================
    // AVAILABILITY SYSTEM (Issue #30)
    // ========================================================================

    /**
     * Set mentor availability slots
     */
    setAvailability: async (slots: AvailabilitySlotInput[]): Promise<AvailabilitySlot[]> => {
        const res = await api.post('/mentors/availability', { slots });
        return res.data;
    },

    /**
     * Get mentor's own availability
     */
    getMyAvailability: async (): Promise<AvailabilitySlot[]> => {
        const res = await api.get('/mentors/availability');
        return res.data;
    },

    /**
     * Get specific mentor's slots by ID
     */
    getSlotsByMentor: async (mentorId: number) => {
        const res = await api.get(`/mentors/${mentorId}/slots`);
        return res.data;
    },

    /**
     * Create new availability slot
     */
    createSlot: async (data: { start_time: string; end_time: string }) => {
        const res = await api.post('/mentors/slots', data);
        return res.data;
    },

    // ========================================================================
    // BOOKING MANAGEMENT - MENTOR SIDE (Issue #30)
    // ========================================================================

    /**
     * Get all my bookings as mentor
     */
    getMyBookings: async (): Promise<Booking[]> => {
        const res = await api.get('/mentors/me/bookings');
        return res.data;
    },

    /**
     * Get mentor bookings (admin/mentor view)
     */
    getMentorBookings: async (): Promise<Booking[]> => {
        const res = await api.get('/mentors/bookings');
        return res.data;
    },

    /**
     * Accept a booking request
     */
    acceptBooking: async (bookingId: number) => {
        const res = await api.post(`/mentors/bookings/${bookingId}/accept`);
        return res.data;
    },

    /**
     * Reject a booking request
     */
    rejectBooking: async (bookingId: number, reason?: string) => {
        const res = await api.post(`/mentors/bookings/${bookingId}/reject`, { reason });
        return res.data;
    },

    // ========================================================================
    // BOOKING MANAGEMENT - LEARNER SIDE
    // ========================================================================

    /**
     * Book a specific mentor
     */
    bookMentor: async (mentorId: number, date: string, time: string) => {
        const res = await api.post(`/mentors/${mentorId}/book`, { date, time });
        return res.data;
    },

    /**
     * Create booking (alternative method)
     */
    createBooking: async (slotId: number) => {
        const res = await api.post('/bookings/create', { slot_id: slotId });
        return res.data;
    },

    /**
     * Create booking (primary method)
     */
    requestBooking: async (data: { mentor_id: number; date: string; time: string }) => {
        const res = await api.post('/bookings', data);
        return res.data;
    },

    /**
     * Get my bookings as learner
     */
    getLearnerBookings: async (): Promise<Booking[]> => {
        const res = await api.get('/learners/bookings');
        return res.data;
    },

    /**
     * Cancel learner booking
     */
    cancelLearnerBooking: async (bookingId: number) => {
        const res = await api.post(`/learners/bookings/${bookingId}/cancel`);
        return res.data;
    },

    // ========================================================================
    // SESSIONS & FEEDBACK
    // ========================================================================

    /**
     * Get mentor's sessions
     */
    getMentorSessions: async (): Promise<Session[]> => {
        const res = await api.get('/mentor-sessions');
        return res.data;
    },

    /**
     * Get my sessions (legacy - kept for compatibility)
     */
    getMySessions: async (): Promise<Session[]> => {
        const res = await api.get('/mentor-review/sessions');
        return res.data;
    },

    /**
     * Start a session
     */
    startSession: async (bookingId: number) => {
        const res = await api.post('/mentor-review/sessions/start', { booking_id: bookingId });
        return res.data;
    },

    /**
     * End a session
     */
    endSession: async (sessionId: number, notes?: string) => {
        const res = await api.post(`/mentor-review/sessions/${sessionId}/end`, { notes });
        return res.data;
    },

    /**
     * Submit session feedback
     */
    submitSessionFeedback: async (sessionId: number, feedback: any) => {
        const res = await api.post(`/sessions/${sessionId}/feedback`, feedback);
        return res.data;
    },

    /**
     * Update session notes
     */
    updateSessionNotes: async (sessionId: number, notes: string) => {
        const res = await api.put(`/mentor-review/sessions/${sessionId}/notes`, { notes });
        return res.data;
    },

    // ========================================================================
    // ASSESSMENTS (Issue #29)
    // ========================================================================

    /**
     * Create assessment for booking
     */
    createAssessment: async (data: { booking_id: number; score: number; feedback: string; level_assigned?: string }) => {
        const res = await api.post('/mentor/assessments', data);
        return res.data;
    },

    /**
     * Schedule assessment
     */
    scheduleAssessment: async (data: { learner_id: number; scheduled_date: string }) => {
        const res = await api.post('/mentor/assessments/schedule', data);
        return res.data;
    },

    /**
     * Get my assessments as mentor
     */
    getMyAssessments: async () => {
        const res = await api.get('/mentor/assessments');
        return res.data;
    },

    /**
     * Get session assessment
     */
    getSessionAssessment: async (sessionId: number): Promise<Assessment> => {
        const res = await api.get(`/mentor-review/sessions/${sessionId}/assessment`);
        return res.data;
    },

    /**
     * Create session assessment (legacy)
     */
    createSessionAssessment: async (data: Omit<Assessment, 'assessment_id'>): Promise<Assessment> => {
        const res = await api.post('/mentor-review/assessments', data);
        return res.data;
    },

    // ========================================================================
    // RESOURCES (Issue #36)
    // ========================================================================

    /**
     * Get my resources as mentor
     */
    getMyResources: async (): Promise<Resource[]> => {
        const res = await api.get('/mentor/resources');
        return res.data;
    },

    /**
     * Get specific resource by ID
     */
    getResourceById: async (id: number): Promise<Resource> => {
        const res = await api.get(`/mentor/resources/${id}`);
        return res.data;
    },

    /**
     * Create new resource
     */
    createResource: async (data: Omit<Resource, 'resource_id'>) => {
        const res = await api.post('/mentor/resources', data);
        return res.data;
    },

    /**
     * Update resource
     */
    updateResource: async (id: number, data: Partial<Resource>) => {
        const res = await api.put(`/mentor/resources/${id}`, data);
        return res.data;
    },

    /**
     * Delete resource
     */
    deleteResource: async (id: number) => {
        const res = await api.delete(`/mentor/resources/${id}`);
        return res.data;
    },

    /**
     * Get all public resources
     */
    getPublicResources: async (resourceType?: string): Promise<Resource[]> => {
        const res = await api.get('/resources/public', {
            params: { resource_type: resourceType }
        });
        return res.data;
    },

    /**
     * Get resources (learner view)
     */
    getResources: async (resourceType?: string): Promise<Resource[]> => {
        const res = await api.get('/resources', {
            params: { resource_type: resourceType }
        });
        return res.data;
    },

    // ========================================================================
    // VOCABULARY SUGGESTIONS (Issue #36)
    // ========================================================================

    /**
     * Create vocabulary suggestion
     */
    createVocabSuggestion: async (data: VocabSuggestionCreate) => {
        const res = await api.post('/mentor/vocab-suggestions', data);
        return res.data;
    },

    /**
     * Get my vocabulary suggestions
     */
    getMyVocabSuggestions: async () => {
        const res = await api.get('/mentor/vocab-suggestions');
        return res.data;
    },

    /**
     * Get topic vocabulary suggestions
     */
    getTopicVocabSuggestions: async (topicId: number) => {
        const res = await api.get(`/topics/${topicId}/vocab-suggestions`);
        return res.data;
    },

    /**
     * Suggest vocabulary to learner
     */
    suggestVocabularyToLearner: async (data: { learner_id: number; vocabulary_data: any }) => {
        const res = await api.post('/mentor/vocabulary/suggest', data);
        return res.data;
    },

    // ========================================================================
    // REVIEWS
    // ========================================================================

    /**
     * Get my reviews as mentor
     */
    getMyReviews: async () => {
        const res = await api.get('/reviews/me');
        return res.data;
    },

    /**
     * Submit review for mentor
     */
    submitReview: async (data: ReviewSubmit) => {
        const res = await api.post('/reviews/submit', data);
        return res.data;
    },

    // ========================================================================
    // ADMIN HELPERS
    // ========================================================================

    /**
     * Verify mentor (admin only)
     */
    verifyMentor: async (id: number, status: string = 'VERIFIED') => {
        const res = await api.put(`/admin/mentors/${id}/verify`, null, { params: { status } });
        return res.data;
    }
};
