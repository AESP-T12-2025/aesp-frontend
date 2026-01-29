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

export const proficiencyService = {
    submitTest: async (testId: number, answers: Record<number, string>, speakingText?: string) => {
        const res = await api.post('/proficiency/submit', {
            test_id: testId,
            answers,
            speaking_text: speakingText
        });
        return res.data;
    },

    getAssessmentTest: async () => {
        const res = await api.get('/proficiency/test');
        return res.data;
    },

    // Issue #27: Personalized Learning Path (FIXED URL)
    getPersonalizedPath: async (): Promise<LearningPath> => {
        const res = await api.get('/proficiency/path');
        return res.data;
    },

    // Alias for backward compatibility
    getMyPath: async (): Promise<LearningPath> => {
        const res = await api.get('/proficiency/path');
        return res.data;
    }
};
