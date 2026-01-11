import api from '@/lib/api';

export const proficiencyService = {
    submitTest: async (testId: number, answers: any, speakingText?: string) => {
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
    getMyPath: async () => {
        const res = await api.get('/proficiency/my-path');
        return res.data;
    }
};
