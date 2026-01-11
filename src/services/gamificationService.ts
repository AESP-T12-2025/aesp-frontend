import api from '@/lib/api';

export const gamificationService = {
    getChallenges: async () => {
        const res = await api.get('/gamification/challenges');
        return res.data;
    },
    joinChallenge: async (challengeId: number) => {
        const res = await api.post(`/gamification/challenges/${challengeId}/join`);
        return res.data;
    },
    getMyProgress: async () => {
        const res = await api.get('/gamification/my-progress');
        return res.data;
    },
    getLeaderboard: async () => {
        const res = await api.get('/gamification/leaderboard');
        return res.data;
    },
    claimReward: async (challengeId: number) => {
        const res = await api.post(`/gamification/challenges/${challengeId}/claim`, {});
        return res.data;
    }
};
