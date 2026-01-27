import api from '@/lib/api';

export interface Resource {
    resource_id?: number;
    title: string;
    description?: string;
    file_url: string;
    resource_type: 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'LINK';
}

export interface Session {
    session_id?: number;
    booking_id: number;
    learner_id: number;
    start_time: string;
    end_time?: string;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    notes?: string;
}

export interface Assessment {
    assessment_id?: number;
    session_id: number;
    pronunciation_score: number;
    grammar_score: number;
    fluency_score: number;
    vocabulary_score: number;
    overall_score?: number;
    feedback: string;
    strengths?: string;
    areas_for_improvement?: string;
}

export interface MentorProfile {
    mentor_id?: number;
    full_name: string;
    bio: string;
    skills: string;
    verification_status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface AvailabilitySlot {
    slot_id: number;
    mentor_id: number;
    start_time: string;
    end_time: string;
    is_booked: boolean;
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

export const mentorService = {
    // Profile
    createOrUpdateProfile: async (data: MentorProfile) => {
        const res = await api.post('/mentors/profile', data);
        return res.data;
    },

    // Mentors
    getAllMentors: async () => {
        const res = await api.get('/mentors');
        return res.data;
    },
    getSlotsByMentor: async (mentorId: number) => {
        const res = await api.get(`/mentors/${mentorId}/slots`);
        return res.data;
    },
    createSlot: async (data: { start_time: string, end_time: string }) => {
        const res = await api.post('/mentors/slots', data);
        return res.data;
    },

    // Bookings
    createBooking: async (slotId: number) => {
        const res = await api.post('/bookings/create', { slot_id: slotId });
        return res.data;
    },
    getMyBookings: async () => {
        const res = await api.get('/mentors/me/bookings');
        return res.data;
    },

    // Sessions
    getMySessions: async (): Promise<Session[]> => {
        const res = await api.get('/mentor-review/sessions');
        return res.data;
    },
    startSession: async (bookingId: number) => {
        const res = await api.post(`/mentor-review/sessions/start`, { booking_id: bookingId });
        return res.data;
    },
    endSession: async (sessionId: number, notes?: string) => {
        const res = await api.post(`/mentor-review/sessions/${sessionId}/end`, { notes });
        return res.data;
    },
    updateSessionNotes: async (sessionId: number, notes: string) => {
        const res = await api.put(`/mentor-review/sessions/${sessionId}/notes`, { notes });
        return res.data;
    },

    // Session Assessments (from History page)
    getSessionAssessment: async (sessionId: number): Promise<Assessment> => {
        const res = await api.get(`/mentor-review/sessions/${sessionId}/assessment`);
        return res.data;
    },
    createSessionAssessment: async (data: Omit<Assessment, 'assessment_id'>): Promise<Assessment> => {
        const res = await api.post(`/mentor-review/assessments`, data);
        return res.data;
    },

    // Reviews
    getMyReviews: async () => {
        const res = await api.get('/reviews/me');
        return res.data;
    },
    submitReview: async (data: ReviewSubmit) => {
        const res = await api.post('/reviews/submit', data);
        return res.data;
    },

    // Resources
    getMyResources: async () => {
        const res = await api.get('/mentor-review/resources');
        return res.data;
    },
    createResource: async (data: Omit<Resource, 'resource_id'>) => {
        const res = await api.post('/mentor-review/resources', data);
        return res.data;
    },
    deleteResource: async (id: number) => {
        const res = await api.delete(`/mentor/resources/${id}`);
        return res.data;
    },

    // Vocab Suggestions
    createVocabSuggestion: async (data: VocabSuggestionCreate) => {
        const res = await api.post('/mentor/vocab-suggestions', data);
        return res.data;
    },
    getMyVocabSuggestions: async () => {
        const res = await api.get('/mentor/vocab-suggestions');
        return res.data;
    },

    // Simple Assessments (from Assessments page - after booking)
    createAssessment: async (data: { booking_id: number; score: number; feedback: string; level_assigned?: string }) => {
        const res = await api.post('/mentor/assessments', data);
        return res.data;
    },
    getMyAssessments: async () => {
        const res = await api.get('/mentor/assessments');
        return res.data;
    },

    // Admin Helpers
    verifyMentor: async (id: number, status: string = 'VERIFIED') => {
        const res = await api.put(`/admin/mentors/${id}/verify`, null, { params: { status } });
        return res.data;
    }
};
