import api from '@/lib/api';
import type { LearningPath } from '@/types';

export interface Question {
    id: number;
    text: string;
    type: 'grammar' | 'vocabulary' | 'pronunciation';
    options?: string[];
}

export interface AssessmentResult {
    score: number;
    level: string;
    feedback: string;
}

export interface TestHistory {
    id: number;
    test_id: number;
    score: number;
    assessed_level: string;
    created_at: string;
}

export const proficiencyService = {
    /**
     * Submit proficiency test answers
     */
    submitTest: async (testId: number, answers: Record<number, string>, speakingText?: string) => {
        const res = await api.post('/proficiency/submit', {
            test_id: testId,
            answers,
            speaking_text: speakingText
        });
        return res.data;
    },

    /**
     * Get proficiency assessment test questions
     */
    getAssessmentTest: async () => {
        const res = await api.get('/proficiency/test');
        return res.data;
    },

    /**
     * Get personalized learning path (Issue #27)
     */
    getPersonalizedPath: async (): Promise<LearningPath> => {
        const res = await api.get('/proficiency/path');
        return res.data;
    },

    /**
     * Get user's current learning path
     */
    getMyPath: async (): Promise<LearningPath> => {
        const res = await api.get('/proficiency/my-path');
        return res.data;
    },

    /**
     * Get proficiency test history
     */
    getProficiencyHistory: async (): Promise<TestHistory[]> => {
        const res = await api.get('/proficiency/history');
        return res.data;
    }
};
