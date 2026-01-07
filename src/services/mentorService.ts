import api from '@/lib/api';

export interface MentorProfile {
    user_id?: number;
    mentor_id?: number;
    full_name: string;
    bio?: string;
    skills?: string;
    verification_status?: string;
}

export interface AvailabilitySlot {
    slot_id?: number;
    mentor_id?: number;
    start_time: string;
    end_time: string;
    status: 'AVAILABLE' | 'BOOKED' | 'COMPLETED' | 'CANCELLED';
}

export interface Session {
    session_id?: number;
    booking_id: number;
    learner_id: number;
    mentor_id: number;
    start_time: string;
    end_time?: string;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    notes?: string;
}

export interface Assessment {
    assessment_id?: number;
    session_id: number;
    pronunciation_score?: number;
    grammar_score?: number;
    fluency_score?: number;
    vocabulary_score?: number;
    overall_score?: number;
    feedback: string;
    strengths?: string;
    areas_for_improvement?: string;
    created_at?: string;
}

export interface Resource {
    resource_id?: number;
    mentor_id?: number;
    title: string;
    description?: string;
    file_url?: string;
    resource_type: 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'LINK';
    created_at?: string;
}

export const mentorService = {
    // 1. Profile Management
    createOrUpdateProfile: async (data: { full_name: string; bio?: string; skills?: string }) => {
        const response = await api.post<MentorProfile>('/mentors/profile', data);
        return response.data;
    },

    getAllMentors: async () => {
        const response = await api.get<MentorProfile[]>('/mentors');
        return response.data;
    },

    // 2. Slot Management
    createSlot: async (data: { start_time: string; end_time: string }) => {
        const response = await api.post('/mentors/slots', data);
        return response.data;
    },

    getSlotsByMentor: async (mentorId: number) => {
        const response = await api.get<AvailabilitySlot[]>(`/mentors/${mentorId}/slots`);
        return response.data;
    },

    getMyBookings: async () => {
        const response = await api.get('/mentors/my-bookings');
        return response.data;
    },

    // 3. Session Management
    getMySessions: async () => {
        const response = await api.get<Session[]>('/mentors/sessions');
        return response.data;
    },

    startSession: async (bookingId: number) => {
        const response = await api.post('/mentors/sessions/start', { booking_id: bookingId });
        return response.data;
    },

    endSession: async (sessionId: number, notes?: string) => {
        const response = await api.post(`/mentors/sessions/${sessionId}/end`, { notes });
        return response.data;
    },

    updateSessionNotes: async (sessionId: number, notes: string) => {
        const response = await api.put(`/mentors/sessions/${sessionId}/notes`, { notes });
        return response.data;
    },

    // 4. Assessment & Feedback
    createAssessment: async (data: Omit<Assessment, 'assessment_id' | 'created_at'>) => {
        const response = await api.post('/mentors/assessments', data);
        return response.data;
    },

    getSessionAssessment: async (sessionId: number) => {
        const response = await api.get<Assessment>(`/mentors/sessions/${sessionId}/assessment`);
        return response.data;
    },

    // 5. Resource Library
    getMyResources: async () => {
        const response = await api.get<Resource[]>('/mentors/resources');
        return response.data;
    },

    createResource: async (data: Omit<Resource, 'resource_id' | 'mentor_id' | 'created_at'>) => {
        const response = await api.post('/mentors/resources', data);
        return response.data;
    },

    deleteResource: async (resourceId: number) => {
        const response = await api.delete(`/mentors/resources/${resourceId}`);
        return response.data;
    },

    // 6. Booking (Learner)
    createBooking: async (slot_id: number) => {
        const response = await api.post('/bookings/create', { slot_id });
        return response.data;
    },

    // 7. Admin Verification
    verifyMentor: async (mentor_id: number) => {
        const response = await api.put(`/mentors/${mentor_id}/verify`);
        return response.data;
    },

    // 8. Reviews
    createReview: async (data: { booking_id: number; score: number; feedback?: string }) => {
        const response = await api.post('/mentors/reviews', data);
        return response.data;
    }
};
